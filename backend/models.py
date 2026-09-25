import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from database import Base

# ============================================================================
# SQLAlchemy ORM Models
# ============================================================================

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), default="demo_hash")
    role = Column(String(50), default="student") # student, university_admin
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    skills = relationship("UserSkill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String(255), default="Hariom Gupta")
    university = Column(String(255), default="Chandigarh University")
    degree = Column(String(255), default="B.E. Computer Science Engineering")
    graduation_year = Column(String(50), default="2026")
    bio = Column(Text, default="Aspiring software and cloud engineer passionate about distributed systems and full-stack development.")
    github = Column(String(255), default="https://github.com/hariomgupta")
    linkedin = Column(String(255), default="https://linkedin.com/in/hariomgupta")
    target_career_id = Column(String(100), default="cloud-engineer")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(String(100), primary_key=True) # canonical slug e.g. "aws", "docker"
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="General") # Cloud, Backend, Frontend, DevOps, Data, AI
    description = Column(Text, default="")
    aliases = Column(Text, default="[]") # JSON list of string aliases


class UserSkill(Base):
    __tablename__ = "user_skills"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id"), nullable=False)
    proficiency = Column(String(50), default="Intermediate") # Beginner, Intermediate, Mastered
    verified = Column(Boolean, default=True)
    added_via = Column(String(100), default="profile") # profile, simulation, resume_upload

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")


class Career(Base):
    __tablename__ = "careers"
    id = Column(String(100), primary_key=True) # slug e.g. "cloud-engineer"
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Engineering")
    overview = Column(Text, default="")
    market_demand = Column(String(100), default="High")
    average_salary = Column(String(100), default="$125,000")
    
    career_skills = relationship("CareerSkill", back_populates="career")


class CareerSkill(Base):
    __tablename__ = "career_skills"
    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(String(100), ForeignKey("careers.id"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id"), nullable=False)
    importance = Column(String(50), default="Critical") # Critical, High, Medium, Optional
    expected_level = Column(String(50), default="Intermediate")
    weight = Column(Float, default=1.0)

    career = relationship("Career", back_populates="career_skills")
    skill = relationship("Skill")


class Course(Base):
    __tablename__ = "courses"
    id = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    provider = Column(String(255), default="Coursera")
    level = Column(String(50), default="Intermediate")
    duration_hours = Column(Integer, default=20)
    url = Column(String(500), default="")
    description = Column(Text, default="")
    primary_skill_id = Column(String(100), nullable=True)
    skills_covered = Column(Text, default="[]") # JSON list of skill IDs


class Certification(Base):
    __tablename__ = "certifications"
    id = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    issuer = Column(String(255), default="Amazon Web Services")
    code = Column(String(100), default="")
    level = Column(String(50), default="Associate")
    description = Column(Text, default="")
    primary_skill_id = Column(String(100), nullable=True)
    skills_covered = Column(Text, default="[]") # JSON list of skill IDs
    relevance_career_ids = Column(Text, default="[]") # JSON list


class ProjectTemplate(Base):
    __tablename__ = "projects"
    id = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    domain = Column(String(100), default="Cloud")
    description = Column(Text, default="")
    difficulty = Column(String(50), default="Intermediate")
    skills_used = Column(Text, default="[]") # JSON list of skill IDs
    career_relevance = Column(String(100), default="cloud-engineer")


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_target = Column(String(100), nullable=False) # e.g. "cloud-engineer", "ai-ml-engineer", "software-engineer"
    role_title = Column(String(255), nullable=False)
    summary = Column(Text, default="")
    skills_json = Column(Text, default="[]")
    projects_json = Column(Text, default="[]")
    experience_json = Column(Text, default="[]")
    education_json = Column(Text, default="[]")
    is_master = Column(Boolean, default=False)
    match_percentage = Column(Float, default=85.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")


# ============================================================================
# Pydantic Schemas
# ============================================================================

class UserSkillSchema(BaseModel):
    skill_id: str
    name: str
    category: str
    proficiency: str
    verified: bool

class ProfileResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    university: str
    degree: str
    graduation_year: str
    bio: str
    github: str
    linkedin: str
    target_career_id: str
    skills: List[UserSkillSchema]

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    target_career_id: Optional[str] = None
    degree: Optional[str] = None
    university: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[Dict[str, Any]]] = None

class SkillGapItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    status: str # "Strong", "Developing", "Missing"
    importance: str # "Critical", "High", "Medium", "Optional"
    user_level: Optional[str]
    expected_level: str
    priority_score: int # 1 (highest priority) to 5

class CareerMatchResponse(BaseModel):
    career_id: str
    career_title: str
    match_percentage: float
    total_required_skills: int
    matched_skills_count: int
    missing_skills_count: int
    skill_gaps: List[SkillGapItem]
    explanation: str

class RecommendationItem(BaseModel):
    type: str # "course", "certification", "project"
    id: str
    title: str
    provider_or_issuer: str
    skill_id: str
    skill_name: str
    level: str
    duration_or_effort: str
    why_recommended: str
    url: Optional[str] = None

class RoadmapStepItem(BaseModel):
    order: int
    phase_title: str
    skill_id: str
    skill_name: str
    why_it_matters: str
    prerequisites: List[str]
    estimated_duration: str
    recommended_course: Optional[str]
    recommended_cert: Optional[str]
    suggested_project: Optional[str]
    status: str # "completed", "in_progress", "upcoming"

class WhatIfRequest(BaseModel):
    query: str
    target_career_id: Optional[str] = None

class WhatIfResponse(BaseModel):
    intent: str
    query: str
    entity_name: str
    entity_type: str # "skill", "certification", "career", "recommendation", "resource"
    direct_answer: str
    benefit_summary: str
    why_it_changes: str
    what_is_still_missing: str
    recommended_next_step: str
    original_match_percentage: float
    simulated_match_percentage: float
    percentage_delta: float
    current_skills: List[str]
    simulated_addition: List[str]
    career_impacts: List[Dict[str, Any]]
    remaining_gaps: List[SkillGapItem]
    recommendations: List[RecommendationItem]
    updated_roadmap: List[RoadmapStepItem]
    explanation: str
    can_apply: bool

class ApplySimulationRequest(BaseModel):
    skills_to_add: List[str]
    proficiency: Optional[str] = "Intermediate"

class ResumeVariantItem(BaseModel):
    id: int
    role_target: str
    role_title: str
    match_percentage: float
    summary: str
    skills: List[str]
    projects: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    updated_at: str

class UniversityInsightsResponse(BaseModel):
    total_students_analyzed: int
    average_career_readiness: float
    cohort_degree: str
    common_skill_gaps: List[Dict[str, Any]]
    industry_demand_alignment: List[Dict[str, Any]]
    recommended_university_programs: List[Dict[str, Any]]
