import re
import json
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from models import Skill, Certification, Career, CareerSkill, Course
from matching_engine import calculate_career_match
from recommendation_engine import get_recommendations_for_gaps
from roadmap_engine import generate_personalized_roadmap

# Canonical aliases map
SKILL_ALIASES = {
    "aws": "aws",
    "amazon web services": "aws",
    "azure": "azure",
    "microsoft azure": "azure",
    "gcp": "gcp",
    "google cloud": "gcp",
    "docker": "docker",
    "containers": "docker",
    "containerization": "docker",
    "kubernetes": "kubernetes",
    "k8s": "kubernetes",
    "terraform": "terraform",
    "iac": "terraform",
    "linux": "linux",
    "networking": "networking",
    "computer networking": "networking",
    "tcp/ip": "networking",
    "cicd": "cicd",
    "ci/cd": "cicd",
    "github actions": "github-actions",
    "python": "python",
    "java": "java",
    "cpp": "cpp",
    "c++": "cpp",
    "javascript": "javascript",
    "js": "javascript",
    "typescript": "typescript",
    "react": "react",
    "nextjs": "nextjs",
    "tailwind": "tailwind",
    "nodejs": "nodejs",
    "fastapi": "fastapi",
    "sql": "sql",
    "postgresql": "postgresql",
    "postgres": "postgresql",
    "redis": "redis",
    "system design": "system-design",
    "microservices": "microservices",
    "ai": "machine-learning",
    "artificial intelligence": "machine-learning",
    "ml": "machine-learning",
    "machine learning": "machine-learning",
    "deep learning": "deep-learning",
    "pytorch": "pytorch",
    "nlp": "nlp",
    "data analysis": "data-analysis",
    "pandas": "pandas",
    "tableau": "tableau",
    "cybersecurity": "cybersecurity"
}

CAREER_ALIASES = {
    "cloud engineer": "cloud-engineer",
    "cloud": "cloud-engineer",
    "devops": "devops-engineer",
    "devops engineer": "devops-engineer",
    "software engineer": "software-engineer",
    "swe": "software-engineer",
    "full stack": "fullstack-developer",
    "fullstack": "fullstack-developer",
    "full stack developer": "fullstack-developer",
    "frontend": "frontend-developer",
    "frontend developer": "frontend-developer",
    "backend": "backend-developer",
    "backend developer": "backend-developer",
    "ai engineer": "ai-ml-engineer",
    "ai": "ai-ml-engineer",
    "ml engineer": "ai-ml-engineer",
    "data analyst": "data-analyst",
    "data scientist": "data-scientist",
    "cybersecurity": "cybersecurity-analyst",
    "security analyst": "cybersecurity-analyst"
}

CERT_ALIASES = {
    "cloud practitioner": "cert-aws-cloud-practitioner",
    "aws cloud practitioner": "cert-aws-cloud-practitioner",
    "clf": "cert-aws-cloud-practitioner",
    "solutions architect": "cert-aws-solutions-architect",
    "aws solutions architect": "cert-aws-solutions-architect",
    "saa": "cert-aws-solutions-architect",
    "azure fundamentals": "cert-azure-fundamentals",
    "az-900": "cert-azure-fundamentals",
    "az 900": "cert-azure-fundamentals",
    "cka": "cert-cka-kubernetes",
    "certified kubernetes administrator": "cert-cka-kubernetes",
    "terraform associate": "cert-terraform-associate",
    "hashicorp terraform": "cert-terraform-associate",
    "security+": "cert-comptia-security",
    "comptia security": "cert-comptia-security",
    "gcp cloud engineer": "cert-gcp-cloud-engineer",
    "meta front-end": "cert-meta-frontend",
    "ibm data analyst": "cert-ibm-data-analyst",
    "tensorflow developer": "cert-tensorflow-developer"
}


def parse_simulation_query(query: str, current_target_career_id: str = "cloud-engineer") -> Tuple[str, str, str]:
    """
    Parses natural language query into (intent, entity_id, entity_type).
    Supported intents:
    - 'learning_resource': Query asking for courses or tutorials on a topic
    - 'next_skill_recommendation': Query asking what skill to learn next
    - 'skill_gap_query': Query asking what skills are missing for a role
    - 'career_requirements': Query asking what skills are required for a role
    - 'certification_simulation': Simulation of completing a certification
    - 'skill_simulation': Simulation of learning a specific skill
    """
    q = query.lower().strip()

    # 1. Learning Resource Query (e.g. "What course should I take for AWS?", "best course for python")
    if any(k in q for k in ["what course", "best course", "which course", "where to learn", "how to learn", "course for", "courses for"]):
        for alias, canonical in SKILL_ALIASES.items():
            if re.search(rf"\b{re.escape(alias)}\b", q):
                return ("learning_resource", canonical, "resource")
        return ("learning_resource", "aws", "resource")

    # 2. Next Skill Recommendation (e.g. "What should I learn next?", "best skill next")
    if any(k in q for k in ["what should i learn next", "what next", "best skill next", "what to learn next", "recommend next skill", "next best skill"]):
        return ("next_skill_recommendation", current_target_career_id, "recommendation")

    # 3. Skill Gap Query (e.g. "What am I missing for DevOps?", "what are my gaps for cloud engineer?")
    if any(k in q for k in ["missing", "lacking", "gaps for", "gap in", "where do i lack", "what do i lack"]):
        for cname, cid in CAREER_ALIASES.items():
            if cname in q:
                return ("skill_gap_query", cid, "career")
        return ("skill_gap_query", current_target_career_id, "career")

    # 4. Career Requirements Query (e.g. "What skills do I need for Cloud Engineer?", "requirements for devops")
    if any(k in q for k in ["skills do i need", "skills for", "requirements for", "how to become", "what does a", "what skills are needed"]):
        for cname, cid in CAREER_ALIASES.items():
            if cname in q:
                return ("career_requirements", cid, "career")

    # 5. Certification Simulation (e.g. "What if I get Microsoft Certified: Azure Fundamentals?", "What if I pass CKA?")
    for alias, cert_id in CERT_ALIASES.items():
        if alias in q:
            return ("certification_simulation", cert_id, "certification")

    if "certification" in q or "cert" in q or "pass" in q or "complete" in q:
        if "azure" in q:
            return ("certification_simulation", "cert-azure-fundamentals", "certification")
        if "aws" in q or "cloud practitioner" in q:
            return ("certification_simulation", "cert-aws-cloud-practitioner", "certification")
        if "kubernetes" in q or "k8s" in q:
            return ("certification_simulation", "cert-cka-kubernetes", "certification")
        if "terraform" in q:
            return ("certification_simulation", "cert-terraform-associate", "certification")
        if "security" in q:
            return ("certification_simulation", "cert-comptia-security", "certification")

    # 6. Skill Simulation (e.g. "What if I learn AWS?", "What if I learn Docker?", "simulate kubernetes")
    # Search for canonical skill match
    for alias, canonical in sorted(SKILL_ALIASES.items(), key=lambda x: -len(x[0])):
        if re.search(rf"\b{re.escape(alias)}\b", q):
            return ("skill_simulation", canonical, "skill")

    # Default fallback: simulate AWS
    return ("skill_simulation", "aws", "skill")


def run_what_if_simulation(
    db: Session,
    user_skills: List[Dict[str, Any]],
    query: str,
    target_career_id: str = "cloud-engineer"
) -> Dict[str, Any]:
    """
    Executes a causal advisor simulation without mutating the user's permanent profile.
    Returns rich 8-step advisor response payload with zero em-dashes.
    """
    intent, entity_id, entity_type = parse_simulation_query(query, target_career_id)

    user_skill_map = {us["skill_id"]: us.get("proficiency", "Intermediate") for us in user_skills}
    user_skill_ids = set(user_skill_map.keys())

    # Baseline match for current target career
    baseline_match = calculate_career_match(db, user_skills, target_career_id)
    original_pct = baseline_match["match_percentage"]
    target_career_obj = db.query(Career).filter(Career.id == target_career_id).first()
    target_career_title = target_career_obj.title if target_career_obj else target_career_id.replace('-', ' ').title()

    simulated_skills_to_add: List[str] = []
    entity_display_name = entity_id

    # Track if user already had the skill and its current proficiency
    already_had_skill = False
    existing_proficiency = None

    # Handle Intent Specific Setups
    if intent == "skill_simulation":
        skill_obj = db.query(Skill).filter(Skill.id == entity_id).first()
        entity_display_name = skill_obj.name if skill_obj else entity_id.upper()
        simulated_skills_to_add = [entity_id]
        if entity_id in user_skill_map:
            already_had_skill = True
            existing_proficiency = user_skill_map[entity_id]

    elif intent == "certification_simulation":
        cert = db.query(Certification).filter(Certification.id == entity_id).first()
        if cert:
            entity_display_name = cert.title
            covered = json.loads(cert.skills_covered or "[]")
            simulated_skills_to_add = covered
        else:
            entity_display_name = "AWS Certified Cloud Practitioner"
            simulated_skills_to_add = ["aws", "cloud-computing"]

    elif intent in ["career_requirements", "skill_gap_query"]:
        target_career_id = entity_id
        target_career_obj = db.query(Career).filter(Career.id == target_career_id).first()
        target_career_title = target_career_obj.title if target_career_obj else target_career_id.replace('-', ' ').title()
        entity_display_name = target_career_title
        # Recompute baseline for this requested career
        baseline_match = calculate_career_match(db, user_skills, target_career_id)
        original_pct = baseline_match["match_percentage"]
        # Find top missing critical skill to simulate prospective progress
        top_missing = [g["skill_id"] for g in baseline_match["skill_gaps"] if g["status"] == "Missing"]
        simulated_skills_to_add = top_missing[:1] if top_missing else []

    elif intent == "next_skill_recommendation":
        # Find the single skill that gives the highest delta for target career
        curr_gaps = baseline_match["skill_gaps"]
        missing_gaps = [g for g in curr_gaps if g["status"] in ["Missing", "Developing"]]
        best_skill = None
        best_delta = -1.0
        
        for g in missing_gaps:
            test_skills = list(user_skills) + [{"skill_id": g["skill_id"], "proficiency": "Intermediate", "verified": True}]
            t_match = calculate_career_match(db, test_skills, target_career_id)
            d = t_match["match_percentage"] - original_pct
            if d > best_delta:
                best_delta = d
                best_skill = g["skill_id"]

        if not best_skill:
            best_skill = "aws"

        skill_obj = db.query(Skill).filter(Skill.id == best_skill).first()
        entity_display_name = skill_obj.name if skill_obj else best_skill.upper()
        simulated_skills_to_add = [best_skill]

    elif intent == "learning_resource":
        skill_obj = db.query(Skill).filter(Skill.id == entity_id).first()
        entity_display_name = skill_obj.name if skill_obj else entity_id.upper()
        simulated_skills_to_add = [entity_id]

    # Create temporary simulated profile
    simulated_profile_skills = []
    # Add existing skills, upgrading proficiency if user already has it
    simulated_set = set(simulated_skills_to_add)
    for us in user_skills:
        if us["skill_id"] in simulated_set:
            # If user already had it, simulate upgrading to Mastered if it was Intermediate/Beginner
            new_prof = "Mastered" if us.get("proficiency") == "Intermediate" else "Intermediate"
            simulated_profile_skills.append({
                "skill_id": us["skill_id"],
                "proficiency": new_prof,
                "verified": True
            })
        else:
            simulated_profile_skills.append(dict(us))

    # Add newly simulated skills that user did not have
    for s_add in simulated_skills_to_add:
        if s_add not in user_skill_ids:
            simulated_profile_skills.append({
                "skill_id": s_add,
                "proficiency": "Intermediate",
                "verified": True
            })

    # Recalculate target career match with simulated profile
    simulated_match = calculate_career_match(db, simulated_profile_skills, target_career_id)
    simulated_pct = simulated_match["match_percentage"]
    delta = round(simulated_pct - original_pct, 1)

    # Multi-career impact projection across top 5 benchmark careers
    key_careers = ["cloud-engineer", "devops-engineer", "software-engineer", "fullstack-developer", "ai-ml-engineer"]
    career_impacts = []
    
    for cid in key_careers:
        c_obj = db.query(Career).filter(Career.id == cid).first()
        if not c_obj:
            continue
        b_m = calculate_career_match(db, user_skills, cid)
        s_m = calculate_career_match(db, simulated_profile_skills, cid)
        c_delta = round(s_m["match_percentage"] - b_m["match_percentage"], 1)

        # Generate career-specific causal reason
        if c_delta > 0:
            if c_delta >= 15.0:
                why_c = f"Major leap: fulfills primary critical requirement in {entity_display_name}."
            else:
                why_c = f"Positive gain: satisfies secondary supporting competency in {entity_display_name}."
        elif already_had_skill and c_delta == 0:
            why_c = f"Unchanged: {entity_display_name} is already verified in your profile."
        elif entity_id in ["azure", "cert-azure-fundamentals"] and cid in ["cloud-engineer", "devops-engineer"]:
            why_c = "Unchanged: Track benchmarks AWS cloud standard rather than Azure."
        elif cid == "software-engineer":
            why_c = "Unchanged: Software Engineer curriculum emphasizes algorithms and backend APIs over cloud providers."
        elif cid == "fullstack-developer":
            why_c = "Unchanged: Full Stack curriculum emphasizes client/server frameworks and databases."
        else:
            why_c = f"Unchanged: {entity_display_name} is not in the benchmark curriculum for {c_obj.title}."

        career_impacts.append({
            "career_id": cid,
            "career_title": c_obj.title,
            "before_percentage": b_m["match_percentage"],
            "after_percentage": s_m["match_percentage"],
            "delta": c_delta,
            "reason": why_c
        })

    # Calculate remaining gaps after simulation
    remaining_gaps = simulated_match["skill_gaps"]
    top_remaining_missing = [g["skill_name"] for g in remaining_gaps if g["status"] == "Missing"]

    # Updated recommendations for the remaining gaps
    # For learning_resource queries, focus recommendations on the requested entity
    focus_skill = entity_id if intent == "learning_resource" else None
    new_recommendations = get_recommendations_for_gaps(db, remaining_gaps, target_career_id, limit=6, focus_skill_id=focus_skill)

    # Updated personalized roadmap
    updated_roadmap = generate_personalized_roadmap(db, simulated_profile_skills, target_career_id, remaining_gaps)

    # Check if this simulation can be applied permanently
    new_skills_to_apply = [s for s in simulated_skills_to_add if s not in user_skill_ids]
    can_apply = len(new_skills_to_apply) > 0 or (already_had_skill and existing_proficiency != "Mastered")

    # -------------------------------------------------------------------------
    # GENERATE 8-STAGE CAUSAL HUMAN ADVISOR CONTENT
    # Zero em-dashes guaranteed!
    # -------------------------------------------------------------------------
    direct_answer = ""
    benefit_summary = ""
    why_it_changes = ""
    what_is_still_missing = ""
    recommended_next_step = ""

    if intent == "skill_simulation":
        if already_had_skill and delta == 0.0:
            direct_answer = (
                f"You already have {entity_display_name} verified at {existing_proficiency} proficiency in your Master Profile. "
                f"Your {target_career_title} readiness remains at {original_pct}% (+0.0% delta)."
            )
            benefit_summary = (
                f"Your verified {entity_display_name} foundation already contributes toward your score. "
                f"Re-simulating it at the same proficiency level provides no additional numerical advantage."
            )
            why_it_changes = (
                f"The matching model already counts {entity_display_name} at your current proficiency multiplier. "
                f"To gain further points from {entity_display_name}, you must master advanced architectural topics, "
                f"or acquire unaddressed critical skills like AWS or Linux."
            )
            what_is_still_missing = (
                f"Your primary unfulfilled competencies for {target_career_title} remain: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'None'}."
            )
            recommended_next_step = (
                f"Focus your study hours on missing critical requirements such as {top_remaining_missing[0] if top_remaining_missing else 'hands-on portfolio projects'}."
            )

        elif delta == 0.0:
            direct_answer = (
                f"Learning {entity_display_name} maintains your {target_career_title} compatibility at {original_pct}% (+0.0% delta) "
                f"because this track benchmarks alternative core technologies."
            )
            benefit_summary = (
                f"{entity_display_name} provides enterprise multi-platform literacy and broadens your versatility, "
                f"which is valuable for hybrid-cloud architectures and multi-stack organizations."
            )
            why_it_changes = (
                f"The {target_career_title} curriculum in this catalog places its critical weights on core stack requirements "
                f"(such as AWS, Linux, and Docker). Because {entity_display_name} is not in the required skill index for this track, "
                f"it produces a +0.0% delta."
            )
            what_is_still_missing = (
                f"To advance in {target_career_title}, your essential missing requirements remain: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'None'}."
            )
            recommended_next_step = (
                f"If your primary goal is {target_career_title}, prioritize learning {top_remaining_missing[0] if top_remaining_missing else 'AWS'} first."
            )

        else:
            direct_answer = (
                f"Learning {entity_display_name} boosts your {target_career_title} readiness from {original_pct}% to {simulated_pct}% (+{delta}% delta), "
                f"representing a significant qualification advancement."
            )
            benefit_summary = (
                f"Acquiring {entity_display_name} resolves a high-priority bottleneck, unlocking the ability to build, deploy, "
                f"and manage modern enterprise systems in production environments."
            )
            why_it_changes = (
                f"{entity_display_name} satisfies a weighted competency requirement in the {target_career_title} curriculum. "
                f"Closing this gap immediately improves your candidate competitiveness across recruiting benchmarks."
            )
            what_is_still_missing = (
                f"Even with {entity_display_name} acquired, full industry readiness still requires: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'Final portfolio polish'}."
            )
            # Look up course specifically for the simulated entity
            entity_course = db.query(Course).filter(Course.primary_skill_id == entity_id).first()
            if not entity_course:
                entity_course = db.query(Course).filter(Course.skills_covered.contains(f'"{entity_id}"')).first()
            c_title = entity_course.title if entity_course else f"{entity_display_name} Fundamentals"

            recommended_next_step = (
                f"Begin with {c_title} and complete hands-on labs "
                f"to establish verified competency in {entity_display_name}."
            )

    elif intent == "certification_simulation":
        if entity_id == "cert-azure-fundamentals" and target_career_id == "cloud-engineer":
            direct_answer = (
                f"Simulating Microsoft Azure Fundamentals maintains your Cloud Engineer match at {original_pct}% (+0.0% delta) "
                f"because your target Cloud Engineer curriculum benchmarks Amazon Web Services (AWS) as the primary cloud provider."
            )
            benefit_summary = (
                "Azure Fundamentals builds foundational multi-cloud conceptual literacy covering virtual networks, blob storage, "
                "IAM security, resource groups, and compliance. It prepares you for enterprise multi-cloud environments "
                "standardized on Microsoft Azure."
            )
            why_it_changes = (
                "The Cloud Engineer track in this catalog explicitly benchmarks Amazon Web Services (AWS) with a 2.0x Critical weight. "
                "Because the evaluation model evaluates provider-specific competencies, Azure does not substitute for the AWS requirement "
                "in this track, yielding a +0.0% delta."
            )
            what_is_still_missing = (
                f"To advance your Cloud Engineer readiness, your core missing infrastructure requirements remain: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'AWS and Linux'}."
            )
            recommended_next_step = (
                "If your primary target is AWS Cloud Engineer, enroll in AWS Cloud Practitioner Essentials. "
                "Pairing Azure conceptual understanding with AWS hands-on practice makes you a strong multi-cloud candidate."
            )

        elif delta == 0.0:
            direct_answer = (
                f"Completing {entity_display_name} results in a +0.0% delta for {target_career_title} ({original_pct}% -> {simulated_pct}%), "
                f"as its covered competencies do not directly map to this track's core requirements."
            )
            benefit_summary = (
                f"{entity_display_name} provides accredited third-party validation that strengthens your overall technical profile "
                f"and resume credibility for specialized roles."
            )
            why_it_changes = (
                f"The competencies validated by {entity_display_name} do not align with the weighted requirements of {target_career_title}. "
                f"Check the Multi-Career Fit panel to see which other roles benefit from this credential."
            )
            what_is_still_missing = (
                f"Your primary unfulfilled competencies for {target_career_title} remain: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'None'}."
            )
            recommended_next_step = (
                f"Prioritize credentials that directly target your highest-weighted gaps, such as credentials in {top_remaining_missing[0] if top_remaining_missing else 'core cloud'}."
            )

        else:
            direct_answer = (
                f"Achieving {entity_display_name} increases your {target_career_title} readiness from {original_pct}% to {simulated_pct}% (+{delta}% delta). "
                f"This certification directly validates critical competencies required by recruiters."
            )
            benefit_summary = (
                f"This credential validates practical and architectural proficiency, providing trusted proof of skills "
                f"that helps your resume pass applicant screening filters."
            )
            why_it_changes = (
                f"{entity_display_name} covers verified competencies that directly satisfy required skills in {target_career_title}, "
                f"lifting your score across all aligned career paths."
            )
            what_is_still_missing = (
                f"Companion skills needed to supplement this certification: "
                f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'Portfolio projects'}."
            )
            recommended_next_step = (
                f"Review the official exam guide for {entity_display_name} and complete hands-on lab exercises to prepare for the test."
            )

    elif intent == "career_requirements":
        total_reqs = baseline_match["total_required_skills"]
        matched_cnt = baseline_match["matched_skills_count"]
        missing_cnt = baseline_match["missing_skills_count"]
        critical_gaps = [g["skill_name"] for g in baseline_match["skill_gaps"] if g["status"] == "Missing" and g["importance"] == "Critical"]

        direct_answer = (
            f"To qualify for {target_career_title}, you need {total_reqs} technical competencies. "
            f"You currently fulfill {matched_cnt} competencies ({original_pct}% readiness), leaving {missing_cnt} competencies to acquire or develop."
        )
        benefit_summary = (
            f"{target_career_title} is in {target_career_obj.market_demand if target_career_obj else 'High'} market demand "
            f"with an average annual compensation of {target_career_obj.average_salary if target_career_obj else '$120,000'}."
        )
        why_it_changes = (
            f"The role heavily weights foundational technical execution. "
            f"The highest-impact competencies in the curriculum are {', '.join(critical_gaps[:3]) if critical_gaps else 'core systems'}."
        )
        what_is_still_missing = (
            f"Your most urgent missing requirements: "
            f"{', '.join(top_remaining_missing[:4]) if top_remaining_missing else 'None: fully qualified!'}."
        )
        recommended_next_step = (
            f"Begin by acquiring {top_remaining_missing[0] if top_remaining_missing else 'advanced architectural skills'}, "
            f"which provides the largest immediate qualification boost."
        )

    elif intent == "skill_gap_query":
        missing_cnt = baseline_match["missing_skills_count"]
        critical_missing = [g["skill_name"] for g in baseline_match["skill_gaps"] if g["status"] == "Missing" and g["importance"] == "Critical"]

        direct_answer = (
            f"For {target_career_title}, your current readiness is {original_pct}%. "
            f"You have {missing_cnt} skill gaps, with {len(critical_missing)} critical competencies requiring immediate attention."
        )
        benefit_summary = (
            f"Closing these specific gaps transforms your profile from developing status into an interview-ready candidate for {target_career_title}."
        )
        why_it_changes = (
            f"The matching model penalizes missing critical requirements heavily. "
            f"Resolving critical gaps in {', '.join(critical_missing[:2]) if critical_missing else 'core areas'} yields the fastest score improvement."
        )
        what_is_still_missing = (
            f"Priority missing competencies: {', '.join(top_remaining_missing[:4]) if top_remaining_missing else 'None'}."
        )
        recommended_next_step = (
            f"Start with {top_remaining_missing[0] if top_remaining_missing else 'core training'} to eliminate your highest-priority barrier."
        )

    elif intent == "next_skill_recommendation":
        direct_answer = (
            f"The single highest-leverage skill you should learn next is {entity_display_name}. "
            f"Acquiring {entity_display_name} increases your {target_career_title} readiness from {original_pct}% to {simulated_pct}% (+{delta}% delta)."
        )
        benefit_summary = (
            f"{entity_display_name} delivers the maximum mathematical and practical qualification gain of any single missing skill, "
            f"immediately expanding your technical capabilities."
        )
        why_it_changes = (
            f"No other unacquired competency carries higher weight for {target_career_title}. "
            f"It directly builds on your existing knowledge and unlocks dependent technologies further down your learning path."
        )
        what_is_still_missing = (
            f"After completing {entity_display_name}, your subsequent priorities will be: "
            f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'Final review'}."
        )
        # Look up course specifically for this recommended next skill
        entity_course = db.query(Course).filter(Course.primary_skill_id == entity_id).first()
        if not entity_course:
            entity_course = db.query(Course).filter(Course.skills_covered.contains(f'"{entity_id}"')).first()
        c_title = entity_course.title if entity_course else f"{entity_display_name} Fundamentals"

        recommended_next_step = (
            f"Enroll in {c_title} "
            f"and build a hands-on project demonstrating {entity_display_name} in action."
        )

    elif intent == "learning_resource":
        top_course = new_recommendations[0]["title"] if new_recommendations else f"{entity_display_name} Fundamentals"
        direct_answer = (
            f"For {entity_display_name}, the top recommended curriculum is {top_course}, "
            f"structured to build production-grade competencies efficiently."
        )
        benefit_summary = (
            f"Structured coursework gives you hands-on lab experience, best practices, and architectural context "
            f"that self-study alone rarely provides."
        )
        why_it_changes = (
            f"Mastering {entity_display_name} addresses a core requirement for {target_career_title}, "
            f"elevating your readiness score by +{delta}% upon completion."
        )
        what_is_still_missing = (
            f"Companion skills to study alongside {entity_display_name}: "
            f"{', '.join(top_remaining_missing[:3]) if top_remaining_missing else 'None'}."
        )
        recommended_next_step = (
            f"Start {top_course} and set a target completion timeframe of 2 to 3 weeks."
        )

    # Legacy natural explanation string for backward compatibility
    explanation = f"{direct_answer} {benefit_summary}"

    return {
        "intent": intent,
        "query": query,
        "entity_name": entity_display_name,
        "entity_type": entity_type,
        "direct_answer": direct_answer,
        "benefit_summary": benefit_summary,
        "why_it_changes": why_it_changes,
        "what_is_still_missing": what_is_still_missing,
        "recommended_next_step": recommended_next_step,
        "original_match_percentage": original_pct,
        "simulated_match_percentage": simulated_pct,
        "percentage_delta": delta,
        "current_skills": [us["skill_id"] for us in user_skills],
        "simulated_addition": simulated_skills_to_add,
        "career_impacts": career_impacts,
        "remaining_gaps": remaining_gaps,
        "recommendations": new_recommendations,
        "updated_roadmap": updated_roadmap,
        "explanation": explanation,
        "can_apply": can_apply
    }
