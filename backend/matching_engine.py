from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from models import Career, CareerSkill, UserSkill, Skill

PROFICIENCY_MULTIPLIERS = {
    "Mastered": 1.0,
    "Intermediate": 0.85,
    "Beginner": 0.6
}

IMPORTANCE_WEIGHTS = {
    "Critical": 2.0,
    "High": 1.5,
    "Medium": 1.0,
    "Optional": 0.5
}

def calculate_career_match(db: Session, user_skills: List[Dict[str, Any]], career_id: str) -> Dict[str, Any]:
    """
    Transparent weighted career match model.
    Score = (sum of weighted user proficiency on required skills) / (total required weighted skills) * 100.
    """
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        return {
            "career_id": career_id,
            "career_title": "Unknown Career",
            "match_percentage": 0.0,
            "total_required_skills": 0,
            "matched_skills_count": 0,
            "missing_skills_count": 0,
            "skill_gaps": [],
            "explanation": "Career not found in taxonomy."
        }

    career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == career_id).all()
    user_skill_map = {us["skill_id"]: us.get("proficiency", "Intermediate") for us in user_skills}

    total_max_weight = 0.0
    accumulated_weight = 0.0
    skill_gaps = []
    matched_count = 0
    missing_count = 0

    for cs in career_skills:
        skill = db.query(Skill).filter(Skill.id == cs.skill_id).first()
        skill_name = skill.name if skill else cs.skill_id
        category = skill.category if skill else "General"
        
        weight = cs.weight or IMPORTANCE_WEIGHTS.get(cs.importance, 1.0)
        total_max_weight += weight

        if cs.skill_id in user_skill_map:
            user_prof = user_skill_map[cs.skill_id]
            mult = PROFICIENCY_MULTIPLIERS.get(user_prof, 0.7)
            accumulated_weight += weight * mult
            matched_count += 1

            # Check if Strong or Developing
            if (cs.expected_level == "Mastered" and user_prof != "Mastered") or \
               (cs.expected_level == "Intermediate" and user_prof == "Beginner"):
                status = "Developing"
                p_score = 3 if cs.importance in ["Critical", "High"] else 4
            else:
                status = "Strong"
                p_score = 5 # lowest priority to improve since already strong

            skill_gaps.append({
                "skill_id": cs.skill_id,
                "skill_name": skill_name,
                "category": category,
                "status": status,
                "importance": cs.importance,
                "user_level": user_prof,
                "expected_level": cs.expected_level,
                "priority_score": p_score
            })
        else:
            missing_count += 1
            # Missing skill priority: Critical = 1 (highest), High = 2, Medium = 3, Optional = 4
            if cs.importance == "Critical":
                p_score = 1
            elif cs.importance == "High":
                p_score = 2
            elif cs.importance == "Medium":
                p_score = 3
            else:
                p_score = 4

            skill_gaps.append({
                "skill_id": cs.skill_id,
                "skill_name": skill_name,
                "category": category,
                "status": "Missing",
                "importance": cs.importance,
                "user_level": None,
                "expected_level": cs.expected_level,
                "priority_score": p_score
            })

    # Sort gaps by priority_score ascending (1 is top priority)
    skill_gaps.sort(key=lambda x: (x["priority_score"], x["importance"] != "Critical"))

    match_percentage = round((accumulated_weight / max(total_max_weight, 1.0)) * 100.0, 1)

    # Explanation text
    critical_missing = [g["skill_name"] for g in skill_gaps if g["status"] == "Missing" and g["importance"] == "Critical"]
    if critical_missing:
        explanation = f"You meet {matched_count} of {len(career_skills)} required competencies. Priority gaps in critical areas: {', '.join(critical_missing[:3])}."
    else:
        explanation = f"Strong alignment! You fulfill all critical core requirements for {career.title} with {matched_count} matching skills."

    return {
        "career_id": career.id,
        "career_title": career.title,
        "match_percentage": match_percentage,
        "total_required_skills": len(career_skills),
        "matched_skills_count": matched_count,
        "missing_skills_count": missing_count,
        "skill_gaps": skill_gaps,
        "explanation": explanation
    }
