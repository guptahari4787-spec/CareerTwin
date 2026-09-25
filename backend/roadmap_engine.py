from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import Skill

DEPENDENCY_GRAPH = {
    "aws": ["cloud-computing", "networking"],
    "azure": ["cloud-computing", "networking"],
    "terraform": ["aws", "linux"],
    "kubernetes": ["docker", "linux"],
    "docker": ["linux"],
    "cicd": ["git", "docker"],
    "system-design": ["sql", "rest-apis"],
    "distributed-systems": ["system-design", "networking"],
    "deep-learning": ["machine-learning", "python"],
    "nlp": ["deep-learning", "python"],
    "pytorch": ["python", "machine-learning"]
}

def generate_personalized_roadmap(
    db: Session,
    user_skills: List[Dict[str, Any]],
    career_id: str,
    skill_gaps: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Constructs a structured, dependency-aware multi-phase learning roadmap
    focused on clearing the student's highest priority skill gaps.
    """
    user_skill_ids = set(us["skill_id"] for us in user_skills)
    missing_gaps = [g for g in skill_gaps if g["status"] in ["Missing", "Developing"]]

    if not missing_gaps:
        return [
            {
                "order": 1,
                "phase_title": "Capstone & Interview Readiness",
                "skill_id": "system-design",
                "skill_name": "System Architecture & Mock Interviews",
                "why_it_matters": "All core technical competencies satisfied! Focus on architectural mock interviews.",
                "prerequisites": [],
                "estimated_duration": "2 Weeks",
                "recommended_course": "Grokking the System Design Interview",
                "recommended_cert": None,
                "suggested_project": "Enterprise Multi-Region Production Deployment",
                "status": "in_progress"
            }
        ]

    # Sort gaps topologically respecting prerequisites
    ordered_skills = []
    visited = set()

    def visit(skill_id):
        if skill_id in visited:
            return
        prereqs = DEPENDENCY_GRAPH.get(skill_id, [])
        for p in prereqs:
            if p not in user_skill_ids and p in [g["skill_id"] for g in missing_gaps]:
                visit(p)
        visited.add(skill_id)
        ordered_skills.append(skill_id)

    for g in missing_gaps:
        visit(g["skill_id"])

    roadmap_steps = []
    step_num = 1
    
    # Map of custom courses & certs per skill
    skill_course_map = {
        "aws": ("AWS Cloud Practitioner Essentials", "AWS Certified Solutions Architect (SAA-C03)", "Serverless Microservice API"),
        "linux": ("Linux Administration Bootcamp", None, "Custom Bash Automation Pipeline"),
        "networking": ("Computer Networking: A Top-Down Approach", "CompTIA Network+", "VPC Subnet Simulator"),
        "terraform": ("Terraform for AWS - Infrastructure as Code", "HashiCorp Certified: Terraform Associate", "Automated VPC Infrastructure"),
        "docker": ("Docker and Kubernetes: The Complete Guide", None, "Multi-Service Containerized App"),
        "kubernetes": ("Docker and Kubernetes: The Complete Guide", "Certified Kubernetes Administrator (CKA)", "Multi-Tier Cluster Deployment"),
        "cicd": ("GitHub Actions: The Complete Guide", None, "Automated GitHub Actions CI/CD"),
        "machine-learning": ("Machine Learning Specialization (Andrew Ng)", None, "Predictive Churn Classifier"),
        "deep-learning": ("Deep Learning with PyTorch", "TensorFlow Developer Certificate", "Convolutional Neural Network"),
        "pytorch": ("Deep Learning with PyTorch: Zero to GANs", None, "RAG Contextual Embedding Search"),
        "system-design": ("Grokking the System Design Interview", None, "High-Throughput Rate Limiter")
    }

    for idx, sid in enumerate(ordered_skills[:5]):
        skill_obj = db.query(Skill).filter(Skill.id == sid).first()
        sname = skill_obj.name if skill_obj else sid.replace('-', ' ').title()
        
        course_info, cert_info, proj_info = skill_course_map.get(sid, (
            f"Mastering {sname} Fundamentals",
            None,
            f"End-to-End {sname} Implementation Project"
        ))

        prereqs = DEPENDENCY_GRAPH.get(sid, [])
        unmet_prereqs = [p.replace('-', ' ').title() for p in prereqs if p not in user_skill_ids]

        status = "in_progress" if idx == 0 else "upcoming"

        roadmap_steps.append({
            "order": step_num,
            "phase_title": f"Phase {step_num}: {sname} Mastery",
            "skill_id": sid,
            "skill_name": sname,
            "why_it_matters": f"Essential required competence for {career_id.replace('-', ' ').title()} roles.",
            "prerequisites": unmet_prereqs if unmet_prereqs else ["None (Ready to Start)"],
            "estimated_duration": "2-3 Weeks",
            "recommended_course": course_info,
            "recommended_cert": cert_info,
            "suggested_project": proj_info,
            "status": status
        })
        step_num += 1

    return roadmap_steps
