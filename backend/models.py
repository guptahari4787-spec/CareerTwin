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


class UserSession(Base):
    __tablename__ = "user_sessions"
    token = Column(String(128), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User")


# ============================================================================
# Pydantic Schemas
# ============================================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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


# ============================================================================
# CareerTwin Evidence-Driven Architecture: 16 Core Models
# ============================================================================

class MarketDataScienceJob(Base):
    __tablename__ = "market_datascience_jobs"
    id = Column(Integer, primary_key=True, index=True)
    reference_no = Column(Integer, index=True)
    company_name = Column(String(255), index=True)
    job_title = Column(String(255), index=True)
    min_experience = Column(Integer)
    avg_salary = Column(String(50))
    min_salary = Column(String(50))
    max_salary = Column(String(50))
    num_of_jobs = Column(Integer)
    avg_salary_numeric = Column(Float)
    min_salary_numeric = Column(Float)
    max_salary_numeric = Column(Float)

class MarketAnalyticsJob(Base):
    __tablename__ = "market_analytics_jobs"
    id = Column(Integer, primary_key=True, index=True)
    s_no = Column(Integer, index=True)
    experience = Column(String(100))
    min_exp_years = Column(Float)
    max_exp_years = Column(Float)
    job_description = Column(Text)
    job_desig = Column(String(255), index=True)
    normalized_role = Column(String(100), index=True)
    job_type = Column(String(100))
    key_skills = Column(Text)
    location = Column(String(255))
    primary_city = Column(String(100), index=True)
    salary_raw = Column(String(100))
    salary_band = Column(String(50), index=True)
    salary_midpoint_lakhs = Column(Float)

class JDSSkillTrait(Base):
    __tablename__ = "jds_skill_traits"
    id = Column(Integer, primary_key=True, autoincrement=True)
    candidate_id = Column(Integer, index=True)
    big_data_skills = Column(Float)
    maths_stats_skills = Column(Float)
    coding_skills = Column(Float)
    ai_and_ml_skills = Column(Float)
    dashboard_and_storytelling_skills = Column(Float)
    salary_hike_high_or_low = Column(Integer, index=True)

class SDSPersonalityTrait(Base):
    __tablename__ = "sds_personality_traits"
    id = Column(Integer, primary_key=True, autoincrement=True)
    candidate_id = Column(Integer, index=True)
    neuroticism = Column(Float)
    extraversion = Column(Float)
    openness_to_experience = Column(Float)
    agreeableness = Column(Float)
    conscientiousness = Column(Float)
    success_classification_high_low = Column(Integer, index=True)

class MarketSkillMetric(Base):
    __tablename__ = "market_skill_metrics"
    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, index=True)
    category = Column(String(100))
    job_count = Column(Integer)
    prevalence_pct = Column(Float)
    avg_salary_lakhs = Column(Float)
    demand_tier = Column(String(50))

class MarketRoleMetric(Base):
    __tablename__ = "market_role_metrics"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(100), unique=True, index=True)
    job_count = Column(Integer)
    avg_salary_lakhs = Column(Float)
    min_salary_lakhs = Column(Float)
    max_salary_lakhs = Column(Float)
    top_skills_json = Column(Text)

class MarketSalaryMetric(Base):
    __tablename__ = "market_salary_metrics"
    id = Column(Integer, primary_key=True, index=True)
    experience_band = Column(String(50), index=True)
    salary_band = Column(String(50))
    count = Column(Integer)
    avg_salary_lakhs = Column(Float)
    median_salary_lakhs = Column(Float)

class MarketLocationMetric(Base):
    __tablename__ = "market_location_metrics"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), unique=True, index=True)
    job_count = Column(Integer)
    share_pct = Column(Float)
    avg_salary_lakhs = Column(Float)

class JDSStatisticalResult(Base):
    __tablename__ = "jds_statistical_results"
    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, index=True)
    display_name = Column(String(100))
    mean_high = Column(Float)
    std_high = Column(Float)
    mean_low = Column(Float)
    std_low = Column(Float)
    difference = Column(Float)
    t_statistic = Column(Float)
    p_value = Column(Float)
    p_value_fdr = Column(Float)
    mann_whitney_u = Column(Float)
    mann_whitney_p = Column(Float)
    cohens_d = Column(Float)
    significant = Column(Boolean)

class JDSModelResult(Base):
    __tablename__ = "jds_model_results"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), index=True)
    metric_name = Column(String(100), index=True)
    metric_value = Column(Float)
    details_json = Column(Text)

class SDSStatisticalResult(Base):
    __tablename__ = "sds_statistical_results"
    id = Column(Integer, primary_key=True, index=True)
    trait_name = Column(String(100), unique=True, index=True)
    display_name = Column(String(100))
    mean_high = Column(Float)
    std_high = Column(Float)
    mean_low = Column(Float)
    std_low = Column(Float)
    difference = Column(Float)
    t_statistic = Column(Float)
    p_value = Column(Float)
    p_value_fdr = Column(Float)
    cohens_d = Column(Float)
    significant = Column(Boolean)

class SDSModelResult(Base):
    __tablename__ = "sds_model_results"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), index=True)
    metric_name = Column(String(100), index=True)
    metric_value = Column(Float)
    details_json = Column(Text)

class AlignmentResult(Base):
    __tablename__ = "alignment_results"
    id = Column(Integer, primary_key=True, index=True)
    capability = Column(String(100), unique=True, index=True)
    display_name = Column(String(100))
    market_demand_level = Column(String(50))
    market_prevalence_pct = Column(Float)
    outcome_signal_level = Column(String(50))
    cohens_d = Column(Float)
    statistical_p_value = Column(Float)
    ml_importance = Column(Float)
    classification = Column(String(50), index=True)
    interpretation = Column(Text)
    decision_recommendation = Column(Text)

class WhatIfResult(Base):
    __tablename__ = "what_if_results"
    id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String(255))
    inputs_json = Column(Text)
    baseline_prob = Column(Float)
    scenario_prob = Column(Float)
    delta_prob = Column(Float)
    model_used = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class DataQualityResult(Base):
    __tablename__ = "data_quality_results"
    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String(100), unique=True, index=True)
    file_name = Column(String(255))
    total_records_raw = Column(Integer)
    total_records_clean = Column(Integer)
    missing_values_count = Column(Integer)
    duplicate_records_count = Column(Integer)
    invalid_records_count = Column(Integer)
    valid_observations_count = Column(Integer)
    quality_status = Column(String(50))
    cleaning_log_json = Column(Text)
    column_summary_json = Column(Text)

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"
    id = Column(Integer, primary_key=True, index=True)
    run_timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50))
    summary_json = Column(Text)


# ============================================================================
# CareerTwin Analytical Request / Response Pydantic Models
# ============================================================================

class DataQualityItem(BaseModel):
    dataset_name: str
    file_name: str
    total_records_raw: int
    total_records_clean: int
    missing_values_count: int
    duplicate_records_count: int
    invalid_records_count: int
    valid_observations_count: int
    quality_status: str
    cleaning_actions: List[str]
    column_summaries: List[Dict[str, Any]]

class CareerTwinWhatIfScenarioRequest(BaseModel):
    coding_skills: Optional[float] = 3.0
    maths_stats_skills: Optional[float] = 3.0
    ai_and_ml_skills: Optional[float] = 3.0
    dashboard_and_storytelling_skills: Optional[float] = 3.0
    big_data_skills: Optional[float] = 3.0
    baseline_coding: Optional[float] = 3.0
    baseline_maths_stats: Optional[float] = 3.0
    baseline_ai_and_ml: Optional[float] = 3.0
    baseline_dashboard_and_storytelling: Optional[float] = 3.0
    baseline_big_data: Optional[float] = 3.0

