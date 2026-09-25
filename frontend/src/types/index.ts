export interface UserSkill {
  skill_id: string;
  name: string;
  category: string;
  proficiency: "Beginner" | "Intermediate" | "Mastered";
  verified: boolean;
}

export interface StudentProfile {
  user_id: number;
  full_name: string;
  email: string;
  university: string;
  degree: string;
  graduation_year: string;
  bio: string;
  github: string;
  linkedin: string;
  target_career_id: string;
  skills: UserSkill[];
}

export interface SkillGapItem {
  skill_id: string;
  skill_name: string;
  category: string;
  status: "Strong" | "Developing" | "Missing";
  importance: "Critical" | "High" | "Medium" | "Optional";
  user_level: string | null;
  expected_level: string;
  priority_score: number;
}

export interface CareerMatchResponse {
  career_id: string;
  career_title: string;
  match_percentage: number;
  total_required_skills: number;
  matched_skills_count: number;
  missing_skills_count: number;
  skill_gaps: SkillGapItem[];
  explanation: string;
}

export interface CareerListItem {
  id: string;
  title: string;
  category: string;
  overview: string;
  market_demand: string;
  average_salary: string;
  match_percentage: number;
  total_skills: number;
  matched_skills: number;
  missing_skills: number;
}

export interface RecommendationItem {
  type: "course" | "certification" | "project";
  id: string;
  title: string;
  provider_or_issuer: string;
  skill_id: string;
  skill_name: string;
  level: string;
  duration_or_effort: string;
  why_recommended: string;
  url?: string | null;
  priority_score?: number;
}

export interface RoadmapStepItem {
  order: number;
  phase_title: string;
  skill_id: string;
  skill_name: string;
  why_it_matters: string;
  prerequisites: string[];
  estimated_duration: string;
  recommended_course: string | null;
  recommended_cert: string | null;
  suggested_project: string | null;
  status: "completed" | "in_progress" | "upcoming";
}

export interface WhatIfResponse {
  intent: string;
  query: string;
  entity_name: string;
  entity_type: string;
  direct_answer: string;
  benefit_summary: string;
  why_it_changes: string;
  what_is_still_missing: string;
  recommended_next_step: string;
  original_match_percentage: number;
  simulated_match_percentage: number;
  percentage_delta: number;
  current_skills: string[];
  simulated_addition: string[];
  career_impacts: Array<{
    career_id: string;
    career_title: string;
    before_percentage: number;
    after_percentage: number;
    delta: number;
    reason?: string;
  }>;
  remaining_gaps: SkillGapItem[];
  recommendations: RecommendationItem[];
  updated_roadmap: RoadmapStepItem[];
  explanation: string;
  can_apply: boolean;
}

export interface ResumeVariantItem {
  id: number;
  role_target: string;
  role_title: string;
  match_percentage: number;
  summary: string;
  skills: string[];
  projects: Array<{
    title: string;
    tech: string;
    description: string;
    skills?: string[];
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    gpa: string;
  }>;
  updated_at: string;
}

export interface UniversityInsightsResponse {
  university_name: string;
  cohort_degree: string;
  total_students_analyzed: number;
  average_career_readiness: number;
  industry_alignment_score: string;
  common_skill_gaps: Array<{
    skill_name: string;
    category: string;
    missing_percentage: number;
    urgency: string;
    impacted_roles: string[];
  }>;
  industry_demand_alignment: Array<{
    career_title: string;
    industry_demand: string;
    cohort_readiness: number;
    alignment_status: string;
    recommended_action: string;
  }>;
  recommended_university_programs: Array<{
    title: string;
    target_gap: string;
    format: string;
    estimated_impact: string;
    industry_partner: string;
  }>;
  ecosystem_loop: Record<string, string>;
}
