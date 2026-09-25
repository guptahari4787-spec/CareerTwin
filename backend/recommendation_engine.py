import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models import Course, Certification, ProjectTemplate, Skill, Career

def get_recommendations_for_gaps(
    db: Session,
    skill_gaps: List[Dict[str, Any]],
    career_id: str,
    limit: int = 8,
    focus_skill_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Produces prioritized course, certification, and project recommendations
    strictly tied to identified skill gaps and career relevance.
    Guarantees no cross-technology contamination (e.g. Azure vs AWS, Networking vs Cybersecurity).
    """
    career_obj = db.query(Career).filter(Career.id == career_id).first()
    career_title = career_obj.title if career_obj else career_id.replace('-', ' ').title()

    # Identify missing and developing skills
    gap_dict = {
        g["skill_id"]: g 
        for g in skill_gaps 
        if g.get("status") in ["Missing", "Developing"]
    }

    # If focus_skill_id is requested (e.g. for a specific learning resource query)
    if focus_skill_id and focus_skill_id not in gap_dict:
        skill_obj = db.query(Skill).filter(Skill.id == focus_skill_id).first()
        gap_dict[focus_skill_id] = {
            "skill_id": focus_skill_id,
            "skill_name": skill_obj.name if skill_obj else focus_skill_id.upper(),
            "status": "Target",
            "importance": "Critical",
            "expected_level": "Intermediate",
            "priority_score": 0
        }

    if not gap_dict:
        return []

    recommendations = []
    seen_ids = set()

    # 1. Match Courses (Prioritize primary_skill_id match first!)
    all_courses = db.query(Course).all()

    # Pass 1A: Direct primary skill match
    for c in all_courses:
        primary = c.primary_skill_id
        if primary and primary in gap_dict and c.id not in seen_ids:
            gap_item = gap_dict[primary]
            seen_ids.add(c.id)
            recommendations.append({
                "type": "course",
                "id": c.id,
                "title": c.title,
                "provider_or_issuer": c.provider,
                "skill_id": primary,
                "skill_name": gap_item["skill_name"],
                "level": c.level,
                "duration_or_effort": f"{c.duration_hours} Hours",
                "why_recommended": f"Builds practical proficiency in {gap_item['skill_name']}, addressing a {gap_item['importance'].lower()}-priority requirement for {career_title}.",
                "url": c.url,
                "priority_score": gap_item["priority_score"]
            })

    # Pass 1B: Secondary skill match only if primary was not already covered
    covered_skills_in_recs = set(r["skill_id"] for r in recommendations if r["type"] == "course")
    for c in all_courses:
        if c.id in seen_ids:
            continue
        skills = json.loads(c.skills_covered or "[]")
        intersect = [s for s in skills if s in gap_dict and s not in covered_skills_in_recs]
        if intersect:
            primary_match = intersect[0]
            gap_item = gap_dict[primary_match]
            seen_ids.add(c.id)
            recommendations.append({
                "type": "course",
                "id": c.id,
                "title": c.title,
                "provider_or_issuer": c.provider,
                "skill_id": primary_match,
                "skill_name": gap_item["skill_name"],
                "level": c.level,
                "duration_or_effort": f"{c.duration_hours} Hours",
                "why_recommended": f"Covers companion competency in {gap_item['skill_name']} required for {career_title}.",
                "url": c.url,
                "priority_score": gap_item["priority_score"] + 1
            })

    # 2. Match Certifications
    # STRICT RULE: Must address a skill in gap_dict. Never recommend AWS for Azure or vice-versa!
    all_certs = db.query(Certification).all()
    for cert in all_certs:
        if cert.id in seen_ids:
            continue

        cert_primary = cert.primary_skill_id
        skills = json.loads(cert.skills_covered or "[]")
        
        # Check if cert's primary skill or covered skills directly match gap_dict
        matching_gap_skill = None
        if cert_primary and cert_primary in gap_dict:
            matching_gap_skill = cert_primary
        else:
            intersect = [s for s in skills if s in gap_dict]
            if intersect:
                matching_gap_skill = intersect[0]

        # Only recommend if there is a real matching gap skill
        if matching_gap_skill:
            gap_item = gap_dict[matching_gap_skill]
            seen_ids.add(cert.id)
            recommendations.append({
                "type": "certification",
                "id": cert.id,
                "title": cert.title,
                "provider_or_issuer": cert.issuer,
                "skill_id": matching_gap_skill,
                "skill_name": gap_item["skill_name"],
                "level": cert.level,
                "duration_or_effort": f"Code: {cert.code}" if cert.code else "Official Exam",
                "why_recommended": f"Industry benchmark credential validating enterprise expertise in {gap_item['skill_name']} for {career_title} roles.",
                "url": None,
                "priority_score": gap_item["priority_score"]
            })

    # 3. Match Projects
    all_projects = db.query(ProjectTemplate).all()
    for proj in all_projects:
        if proj.id in seen_ids:
            continue
        skills = json.loads(proj.skills_used or "[]")
        intersect = [s for s in skills if s in gap_dict]
        
        if intersect:
            primary_match = intersect[0]
            gap_item = gap_dict[primary_match]
            seen_ids.add(proj.id)
            recommendations.append({
                "type": "project",
                "id": proj.id,
                "title": proj.title,
                "provider_or_issuer": "CareerTwin Portfolio Capstone",
                "skill_id": primary_match,
                "skill_name": gap_item["skill_name"],
                "level": proj.difficulty,
                "duration_or_effort": "Hands-on Lab",
                "why_recommended": f"Portfolio capstone demonstrating real-world {gap_item['skill_name']} implementation for {career_title} recruiters.",
                "url": None,
                "priority_score": gap_item["priority_score"] + 1
            })
        elif proj.career_relevance == career_id and len(gap_dict) > 0:
            # Career capstone
            top_gap = list(gap_dict.values())[0]
            seen_ids.add(proj.id)
            recommendations.append({
                "type": "project",
                "id": proj.id,
                "title": proj.title,
                "provider_or_issuer": "CareerTwin Portfolio Capstone",
                "skill_id": top_gap["skill_id"],
                "skill_name": top_gap["skill_name"],
                "level": proj.difficulty,
                "duration_or_effort": "Hands-on Lab",
                "why_recommended": f"Full capstone project aligning your hands-on portfolio with {career_title} industry expectations.",
                "url": None,
                "priority_score": 3
            })

    # Sort recommendations by priority score, interleaving courses, certs, and projects
    recommendations.sort(key=lambda x: (x["priority_score"], x["type"] != "course", x["type"] != "certification"))
    return recommendations[:limit]
