import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import Resume, User, StudentProfile, UserSkill, Skill

ROLE_TAILORING_CONFIG = {
    "cloud-engineer": {
        "title": "Cloud Solutions Engineer",
        "focus_skills": ["aws", "docker", "kubernetes", "linux", "networking", "terraform", "python", "sql", "git"],
        "summary": "Engineering student at Chandigarh University with strong foundations in distributed architectures, cloud fundamentals, and automated infrastructure. Seeking Cloud Solutions Engineer roles to build scalable, fault-tolerant backend systems.",
        "project_priority": ["Campus Event Management Platform", "Distributed Multi-Client Chat Server", "Algorithmic Backtesting CLI Tool"]
    },
    "software-engineer": {
        "title": "Software Engineer",
        "focus_skills": ["python", "java", "cpp", "data-structures", "sql", "postgresql", "git", "react", "rest-apis"],
        "summary": "Computer Science student at Chandigarh University targeting Software Engineer positions. Experienced in object-oriented design, algorithmic efficiency, relational schema modeling, and full-stack API integration.",
        "project_priority": ["Distributed Multi-Client Chat Server", "Campus Event Management Platform", "Algorithmic Backtesting CLI Tool"]
    },
    "devops-engineer": {
        "title": "DevOps & Infrastructure Engineer",
        "focus_skills": ["linux", "docker", "kubernetes", "cicd", "bash", "aws", "git", "python", "monitoring"],
        "summary": "Aspiring DevOps Engineer with expertise in containerization, Linux environments, continuous integration workflows, and scalable systems operations.",
        "project_priority": ["Campus Event Management Platform", "Distributed Multi-Client Chat Server", "Algorithmic Backtesting CLI Tool"]
    },
    "ai-ml-engineer": {
        "title": "AI & Machine Learning Engineer",
        "focus_skills": ["python", "machine-learning", "pytorch", "deep-learning", "pandas", "numpy", "data-structures", "sql", "git"],
        "summary": "Engineering student passionate about predictive modeling, statistical learning, and machine learning pipelines. Eager to deploy high-throughput inference models into production environments.",
        "project_priority": ["Algorithmic Backtesting CLI Tool", "Campus Event Management Platform", "Distributed Multi-Client Chat Server"]
    },
    "fullstack-developer": {
        "title": "Full Stack Developer",
        "focus_skills": ["react", "javascript", "typescript", "html", "css", "postgresql", "sql", "git", "python", "docker"],
        "summary": "Full-stack developer student with hands-on experience building end-to-end web applications, reactive component libraries, and robust relational database architectures.",
        "project_priority": ["Campus Event Management Platform", "Distributed Multi-Client Chat Server", "Algorithmic Backtesting CLI Tool"]
    },
    "data-analyst": {
        "title": "Data Analyst",
        "focus_skills": ["sql", "postgresql", "python", "pandas", "numpy", "data-analysis", "tableau", "git"],
        "summary": "Analytical Computer Science student specializing in SQL querying, exploratory data analysis, and data-driven business metrics reporting.",
        "project_priority": ["Algorithmic Backtesting CLI Tool", "Campus Event Management Platform", "Distributed Multi-Client Chat Server"]
    }
}

def get_or_generate_tailored_resumes(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """
    Returns all career-tailored resume variants for the candidate,
    guaranteed to be grounded in the user's master profile skills and projects.
    """
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    user_skill_ids = set(us.skill_id for us in user_skills)

    # Master list of candidate skill display names
    all_skill_objs = db.query(Skill).filter(Skill.id.in_(user_skill_ids)).all()
    skill_name_map = {s.id: s.name for s in all_skill_objs}

    existing_resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    if not existing_resumes:
        # Generate initial variants
        from seed_data import seed_initial_resumes
        seed_initial_resumes(db, user_id)
        existing_resumes = db.query(Resume).filter(Resume.user_id == user_id).all()

    result = []
    for r in existing_resumes:
        role_cfg = ROLE_TAILORING_CONFIG.get(r.role_target, ROLE_TAILORING_CONFIG["software-engineer"])
        
        # Order candidate skills emphasizing those that match this career's focus
        prioritized_skills = []
        other_skills = []
        for sid in role_cfg["focus_skills"]:
            if sid in skill_name_map:
                prioritized_skills.append(skill_name_map[sid])
        for sid, sname in skill_name_map.items():
            if sname not in prioritized_skills:
                other_skills.append(sname)
        
        ordered_skills = prioritized_skills + other_skills

        # Order candidate projects based on relevance
        raw_projects = json.loads(r.projects_json or "[]")
        ordered_projects = sorted(
            raw_projects,
            key=lambda p: role_cfg["project_priority"].index(p["title"]) if p.get("title") in role_cfg["project_priority"] else 99
        )

        result.append({
            "id": r.id,
            "role_target": r.role_target,
            "role_title": r.role_title,
            "match_percentage": r.match_percentage,
            "summary": r.summary or role_cfg["summary"],
            "skills": ordered_skills,
            "projects": ordered_projects,
            "experience": json.loads(r.experience_json or "[]"),
            "education": json.loads(r.education_json or "[]"),
            "updated_at": r.updated_at.strftime("%Y-%m-%d %H:%M") if r.updated_at else "2026-09-24"
        })

    return result
