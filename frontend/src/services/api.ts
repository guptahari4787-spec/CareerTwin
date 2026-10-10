import {
  StudentProfile,
  CareerListItem,
  CareerMatchResponse,
  RecommendationItem,
  RoadmapStepItem,
  WhatIfResponse,
  ResumeVariantItem,
  UniversityInsightsResponse,
  User,
  AuthResponse
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';
const TOKEN_KEY = 'careertwin_auth_token';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('Failed to store auth token:', err);
  }
};

export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to remove auth token:', err);
  }
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      ...options,
      headers,
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
  // Real User Authentication
  register: async (payload: { name: string; email: string; password: string }) => {
    const res = await fetchJson<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  login: async (payload: { email: string; password?: string }) => {
    const res = await fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  getMe: () => fetchJson<User>('/auth/me'),

  logout: async () => {
    try {
      await fetchJson<{ status: string; message: string }>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      removeAuthToken();
    }
  },

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
  getTaxonomySkills: () => fetchJson<any[]>('/skills'),

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

  // CareerTwin Core Analytical Pipeline
  getOverview: () => fetchJson<any>('/overview'),
  getDataQuality: () => fetchJson<any>('/data-quality'),
  getMarketOverview: () => fetchJson<any>('/market/overview'),
  getMarketSkills: () => fetchJson<any[]>('/market/skills'),
  getMarketRoles: () => fetchJson<any[]>('/market/roles'),
  getMarketSalary: () => fetchJson<any>('/market/salary'),
  getMarketExperience: () => fetchJson<any[]>('/market/experience'),
  getMarketLocations: () => fetchJson<any[]>('/market/locations'),
  getMarketCompanies: () => fetchJson<any[]>('/market/companies'),
  getMarketCooccurrence: () => fetchJson<any[]>('/market/cooccurrence'),

  getJDSOverview: () => fetchJson<any>('/jds/overview'),
  getJDSDescriptive: () => fetchJson<any[]>('/jds/descriptive'),
  getJDSStatistics: () => fetchJson<any[]>('/jds/statistics'),
  getJDSLogistic: () => fetchJson<any>('/jds/logistic'),
  getJDSRandomForest: () => fetchJson<any>('/jds/random-forest'),
  getJDSModelComparison: () => fetchJson<any>('/jds/model-comparison'),

  getSDSOverview: () => fetchJson<any>('/sds/overview'),
  getSDSDescriptive: () => fetchJson<any[]>('/sds/descriptive'),
  getSDSStatistics: () => fetchJson<any[]>('/sds/statistics'),
  getSDSLogistic: () => fetchJson<any>('/sds/logistic'),
  getSDSRandomForest: () => fetchJson<any>('/sds/random-forest'),

  getAlignment: () => fetchJson<any[]>('/alignment'),
  simulateWhatIfMath: (payload: any) =>
    fetchJson<any>('/what-if', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getEvidence: (capability: string) => fetchJson<any>(`/evidence/${encodeURIComponent(capability)}`),
  getWorkforceDecisions: () => fetchJson<any>('/workforce-decisions'),
  getMethodology: () => fetchJson<any>('/methodology'),

  // Dynamic Dataset Upload & Multi-Session Engine
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },
  getSessions: () => fetchJson<{ active_session_id: string; sessions: any[] }>('/sessions'),
  switchSession: (sessionId: string) =>
    fetchJson<{ status: string; active_session_id: string; session: any }>('/sessions/switch', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
  mapColumns: (sessionId: string, mapping: Record<string, string>) =>
    fetchJson<{ status: string; session: any }>('/upload/map', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, mapping }),
    }),
  analyzeSession: (sessionId: string) =>
    fetchJson<{ status: string; session: any }>('/upload/analyze', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),
  getSessionDetail: (sessionId: string) => fetchJson<any>(`/sessions/${sessionId}`),
};


