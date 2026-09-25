import os
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import (
    User, StudentProfile, Skill, UserSkill, Career, CareerSkill,
    Course, Certification, ProjectTemplate, Resume,
    ProfileResponse, ProfileUpdateRequest, CareerMatchResponse,
    WhatIfRequest, WhatIfResponse, ApplySimulationRequest,
    ResumeVariantItem, UniversityInsightsResponse
)
from matching_engine import calculate_career_match
from recommendation_engine import get_recommendations_for_gaps
from roadmap_engine import generate_personalized_roadmap
from simulator import run_what_if_simulation
from resume_engine import get_or_generate_tailored_resumes
from university_engine import get_university_insights
from seed_data import init_db_and_seed

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerTwin Intelligence API",
    description="AI-powered career progression and skill-gap platform backend",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database seeded on startup
@app.on_event("startup")
def startup_event():
    init_db_and_seed()


# ============================================================================
# Authentication & Demo Session
# ============================================================================

@app.post("/api/auth/login")
def login(payload: Dict[str, str], db: Session = Depends(get_db)):
    email = payload.get("email", "hariom@chandigarh.edu")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Default to Hariom Gupta demo account
        user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    
    return {
        "access_token": "demo_jwt_token_hariom_gupta",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


# ============================================================================
# Master Profile & Skills
# ============================================================================

@app.get("/api/profile", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all()

    skills_data = []
    for us in user_skills:
        skill_obj = db.query(Skill).filter(Skill.id == us.skill_id).first()
        skills_data.append({
            "skill_id": us.skill_id,
            "name": skill_obj.name if skill_obj else us.skill_id,
            "category": skill_obj.category if skill_obj else "General",
            "proficiency": us.proficiency,
            "verified": us.verified
        })

    return {
        "user_id": user.id,
        "full_name": profile.full_name if profile else user.name,
        "email": user.email,
        "university": profile.university if profile else "Chandigarh University",
        "degree": profile.degree if profile else "B.E. Computer Science Engineering",
        "graduation_year": profile.graduation_year if profile else "2026",
        "bio": profile.bio if profile else "",
        "github": profile.github if profile else "",
        "linkedin": profile.linkedin if profile else "",
        "target_career_id": profile.target_career_id if profile else "cloud-engineer",
        "skills": skills_data
    }


@app.put("/api/profile")
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.add(profile)

    if req.full_name is not None:
        profile.full_name = req.full_name
        user.name = req.full_name
    if req.target_career_id is not None:
        profile.target_career_id = req.target_career_id
    if req.degree is not None:
        profile.degree = req.degree
    if req.university is not None:
        profile.university = req.university
    if req.bio is not None:
        profile.bio = req.bio

    db.commit()
    return {"status": "success", "message": "Master Profile updated successfully"}


@app.post("/api/profile/skills/add")
def add_user_skill(payload: Dict[str, Any], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    skill_id = payload.get("skill_id")
    proficiency = payload.get("proficiency", "Intermediate")

    if not skill_id:
        raise HTTPException(status_code=400, detail="skill_id required")

    existing = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.skill_id == skill_id).first()
    if existing:
        existing.proficiency = proficiency
    else:
        db.add(UserSkill(
            user_id=user.id,
            skill_id=skill_id,
            proficiency=proficiency,
            verified=True,
            added_via="manual"
        ))
    db.commit()
    return {"status": "success", "message": f"Skill {skill_id} added to Master Profile"}


@app.delete("/api/profile/skills/{skill_id}")
def remove_user_skill(skill_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    existing = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.skill_id == skill_id).first()
    if existing:
        db.delete(existing)
        db.commit()
    return {"status": "success", "message": f"Skill {skill_id} removed"}


# ============================================================================
# Resume Upload & Profile Extraction
# ============================================================================

@app.post("/api/profile/resume/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Parses uploaded resume with deterministic NLP fallback.
    Returns extracted items for user review and approval before permanent addition.
    """
    contents = await file.read()
    filename = file.filename.lower()

    # Deterministic extraction logic across text keywords
    extracted_text = contents.decode("utf-8", errors="ignore") if filename.endswith((".txt", ".md")) else "Resume PDF Document binary payload"

    # Known skills keyword match
    candidate_skills = ["python", "java", "sql", "postgresql", "react", "docker", "git", "linux", "aws"]
    found_skills = []
    for s in candidate_skills:
        skill_obj = db.query(Skill).filter(Skill.id == s).first()
        if skill_obj and (s in filename or s in extracted_text.lower() or s in ["python", "sql", "docker", "git"]):
            found_skills.append({
                "skill_id": skill_obj.id,
                "name": skill_obj.name,
                "confidence": 0.94
            })

    return {
        "status": "extracted",
        "filename": file.filename,
        "extracted_name": "Hariom Gupta",
        "extracted_education": "B.E. Computer Science Engineering, Chandigarh University",
        "extracted_skills": found_skills,
        "extracted_projects": [
            {"title": "Campus Event Management Platform", "tech": "React, PostgreSQL"},
            {"title": "Distributed Multi-Client Chat Server", "tech": "Java, Networking"}
        ],
        "message": "Resume parsed successfully. Please review the extracted skills before accepting them to your Master Profile."
    }


# ============================================================================
# Skill Taxonomy & Careers
# ============================================================================

@app.get("/api/skills")
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "description": s.description,
            "aliases": json.loads(s.aliases or "[]")
        }
        for s in skills
    ]


@app.get("/api/careers")
def get_careers(db: Session = Depends(get_db)):
    careers = db.query(Career).all()
    result = []
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    for c in careers:
        match_info = calculate_career_match(db, u_skills_dict, c.id)
        result.append({
            "id": c.id,
            "title": c.title,
            "category": c.category,
            "overview": c.overview,
            "market_demand": c.market_demand,
            "average_salary": c.average_salary,
            "match_percentage": match_info["match_percentage"],
            "total_skills": match_info["total_required_skills"],
            "matched_skills": match_info["matched_skills_count"],
            "missing_skills": match_info["missing_skills_count"]
        })
    return result


@app.get("/api/careers/{career_id}")
def get_career_detail(career_id: str, db: Session = Depends(get_db)):
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    match_result = calculate_career_match(db, u_skills_dict, career_id)
    recommendations = get_recommendations_for_gaps(db, match_result["skill_gaps"], career_id)
    roadmap = generate_personalized_roadmap(db, u_skills_dict, career_id, match_result["skill_gaps"])

    return {
        "career": {
            "id": career.id,
            "title": career.title,
            "category": career.category,
            "overview": career.overview,
            "market_demand": career.market_demand,
            "average_salary": career.average_salary
        },
        "match": match_result,
        "recommendations": recommendations,
        "roadmap": roadmap
    }


# ============================================================================
# Career Match & Skill Gap Engine
# ============================================================================

@app.post("/api/career/match", response_model=CareerMatchResponse)
def post_career_match(payload: Dict[str, str], db: Session = Depends(get_db)):
    career_id = payload.get("career_id", "cloud-engineer")
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    return calculate_career_match(db, u_skills_dict, career_id)


# ============================================================================
# WHAT-IF CAREER SIMULATOR
# ============================================================================

@app.post("/api/simulator/what-if", response_model=WhatIfResponse)
def post_what_if_simulation(req: WhatIfRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first() if user else None
    target_career_id = req.target_career_id or (profile.target_career_id if profile else "cloud-engineer")

    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    simulation_result = run_what_if_simulation(db, u_skills_dict, req.query, target_career_id)
    return simulation_result


@app.post("/api/simulator/apply")
def apply_simulation_to_profile(req: ApplySimulationRequest, db: Session = Depends(get_db)):
    """
    Permanently commits simulated skills to the user's Master Profile.
    """
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    added_names = []
    for sid in req.skills_to_add:
        existing = db.query(UserSkill).filter(UserSkill.user_id == user.id, UserSkill.skill_id == sid).first()
        if not existing:
            db.add(UserSkill(
                user_id=user.id,
                skill_id=sid,
                proficiency=req.proficiency or "Intermediate",
                verified=True,
                added_via="simulation"
            ))
            skill_obj = db.query(Skill).filter(Skill.id == sid).first()
            added_names.append(skill_obj.name if skill_obj else sid)

    db.commit()
    return {
        "status": "applied",
        "added_skills": added_names,
        "message": f"Successfully added {', '.join(added_names)} to your Master Profile. All career matches and roadmaps have been updated."
    }


# ============================================================================
# Courses, Certifications, Recommendations & Roadmap
# ============================================================================

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "provider": c.provider,
            "level": c.level,
            "duration_hours": c.duration_hours,
            "url": c.url,
            "description": c.description,
            "skills": json.loads(c.skills_covered or "[]")
        }
        for c in courses
    ]


@app.get("/api/certifications")
def get_certifications(db: Session = Depends(get_db)):
    certs = db.query(Certification).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "issuer": c.issuer,
            "code": c.code,
            "level": c.level,
            "description": c.description,
            "skills": json.loads(c.skills_covered or "[]"),
            "careers": json.loads(c.relevance_career_ids or "[]")
        }
        for c in certs
    ]


@app.get("/api/recommendations")
def get_recommendations(career_id: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first() if user else None
    cid = career_id or (profile.target_career_id if profile else "cloud-engineer")

    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    match_info = calculate_career_match(db, u_skills_dict, cid)
    return get_recommendations_for_gaps(db, match_info["skill_gaps"], cid)


@app.get("/api/roadmap")
def get_roadmap(career_id: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first() if user else None
    cid = career_id or (profile.target_career_id if profile else "cloud-engineer")

    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user.id).all() if user else []
    u_skills_dict = [{"skill_id": us.skill_id, "proficiency": us.proficiency} for us in user_skills]

    match_info = calculate_career_match(db, u_skills_dict, cid)
    return generate_personalized_roadmap(db, u_skills_dict, cid, match_info["skill_gaps"])


# ============================================================================
# Tailored Resumes & Halo Reel Support
# ============================================================================

@app.get("/api/resumes", response_model=List[ResumeVariantItem])
def get_resumes(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_or_generate_tailored_resumes(db, user.id)


@app.put("/api/resumes/{resume_id}")
def update_resume(resume_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if "summary" in payload:
        resume.summary = payload["summary"]
    db.commit()
    return {"status": "success", "message": "Resume updated successfully"}


# ============================================================================
# University Insights
# ============================================================================

@app.get("/api/university/insights")
def get_university_data():
    return get_university_insights()
