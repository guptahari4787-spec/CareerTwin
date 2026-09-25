import {
  StudentProfile,
  CareerListItem,
  CareerMatchResponse,
  RecommendationItem,
  RoadmapStepItem,
  WhatIfResponse,
  ResumeVariantItem,
  UniversityInsightsResponse
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errBody.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on [${url}]:`, error);
    throw error;
  }
}

export const api = {
  // Authentication / Demo login
  login: (email = 'hariom@chandigarh.edu') =>
    fetchJson<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Profile
  getProfile: () => fetchJson<StudentProfile>('/profile'),
  
  updateProfile: (data: Partial<StudentProfile>) =>
    fetchJson<{ status: string; message: string }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  addUserSkill: (skillId: string, proficiency = 'Intermediate') =>
    fetchJson<{ status: string; message: string }>('/profile/skills/add', {
      method: 'POST',
      body: JSON.stringify({ skill_id: skillId, proficiency }),
    }),

  removeUserSkill: (skillId: string) =>
    fetchJson<{ status: string; message: string }>(`/profile/skills/${skillId}`, {
      method: 'DELETE',
    }),

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profile/resume/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Resume upload failed');
    return res.json();
  },

  // Skills Taxonomy
  getSkills: () => fetchJson<any[]>('/skills'),

  // Careers & Matching
  getCareers: () => fetchJson<CareerListItem[]>('/careers'),

  getCareerDetail: (careerId: string) =>
    fetchJson<{
      career: any;
      match: CareerMatchResponse;
      recommendations: RecommendationItem[];
      roadmap: RoadmapStepItem[];
    }>(`/careers/${careerId}`),

  getCareerMatch: (careerId: string) =>
    fetchJson<CareerMatchResponse>('/career/match', {
      method: 'POST',
      body: JSON.stringify({ career_id: careerId }),
    }),

  // What-If Simulator
  simulateWhatIf: (query: string, targetCareerId?: string) =>
    fetchJson<WhatIfResponse>('/simulator/what-if', {
      method: 'POST',
      body: JSON.stringify({ query, target_career_id: targetCareerId }),
    }),

  applySimulation: (skillsToAdd: string[], proficiency = 'Intermediate') =>
    fetchJson<{ status: string; added_skills: string[]; message: string }>('/simulator/apply', {
      method: 'POST',
      body: JSON.stringify({ skills_to_add: skillsToAdd, proficiency }),
    }),

  // Recommendations & Roadmap
  getRecommendations: (careerId?: string) =>
    fetchJson<RecommendationItem[]>(`/recommendations${careerId ? `?career_id=${careerId}` : ''}`),

  getRoadmap: (careerId?: string) =>
    fetchJson<RoadmapStepItem[]>(`/roadmap${careerId ? `?career_id=${careerId}` : ''}`),

  getCourses: () => fetchJson<any[]>('/courses'),
  getCertifications: () => fetchJson<any[]>('/certifications'),

  // Resumes
  getResumes: () => fetchJson<ResumeVariantItem[]>('/resumes'),
  
  updateResume: (id: number, summary: string) =>
    fetchJson<{ status: string; message: string }>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ summary }),
    }),

  // University Insights
  getUniversityInsights: () => fetchJson<UniversityInsightsResponse>('/university/insights'),
};
