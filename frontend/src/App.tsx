import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Analytical Views (Workforce Intelligence Framework)
import { OverviewView } from './components/analytics/OverviewView';
import { DataQualityView } from './components/analytics/DataQualityView';
import { MarketIntelligenceView } from './components/analytics/MarketIntelligenceView';
import { JuniorOutcomesView } from './components/analytics/JuniorOutcomesView';
import { SeniorOutcomesView } from './components/analytics/SeniorOutcomesView';
import { AlignmentEngineView } from './components/analytics/AlignmentEngineView';
import { WhatIfSimulatorMathView } from './components/analytics/WhatIfSimulatorMathView';
import { EvidenceExplorerView } from './components/analytics/EvidenceExplorerView';
import { WorkforceDecisionsView } from './components/analytics/WorkforceDecisionsView';
import { MethodologyView } from './components/analytics/MethodologyView';
import { ShowcaseView } from './components/analytics/ShowcaseView';
import { SystemArchitectureView } from './components/analytics/SystemArchitectureView';
import { UploadView } from './components/analytics/UploadView';

// Existing Student Career Studio Views
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { WhatIfSimulatorView } from './components/whatif/WhatIfSimulatorView';
import { ResumeStudioView } from './components/resumes/ResumeStudioView';
import { CareerExplorerView } from './components/careers/CareerExplorerView';
import { MySkillsView } from './components/skills/MySkillsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { MasterProfileView } from './components/profile/MasterProfileView';
import { UniversityInsightsView } from './components/university/UniversityInsightsView';

import { AuthView } from './components/auth/AuthView';
import { AuthModal } from './components/auth/AuthModal';

import {
  StudentProfile,
  CareerListItem,
  CareerMatchResponse,
  RecommendationItem,
  RoadmapStepItem,
  ResumeVariantItem,
  User
} from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      if (path === 'architecture') return 'architecture';
      if (path && ['overview', 'data-quality', 'market-intel', 'junior-outcomes', 'senior-outcomes', 'alignment', 'evidence', 'what-if-math', 'workforce-decisions', 'methodology', 'showcase', 'upload'].includes(path)) {
        return path;
      }
    }
    return 'overview';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvidenceCap, setSelectedEvidenceCap] = useState<string>('dashboard_and_storytelling_skills');

  // Keep browser URL bar synchronized
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetUrl = currentTab === 'overview' ? '/' : `/${currentTab}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
    }
  }, [currentTab]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path) setCurrentTab(path);
      else setCurrentTab('overview');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Master Connected State for Student Tools
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [careers, setCareers] = useState<CareerListItem[]>([]);
  const [careerMatch, setCareerMatch] = useState<CareerMatchResponse | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStepItem[]>([]);
  const [resumes, setResumes] = useState<ResumeVariantItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSimQuery, setActiveSimQuery] = useState<string>('What if I learn AWS?');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const refreshAllData = async () => {
    try {
      // 1. Fetch Profile
      const prof = await api.getProfile();
      setProfile(prof);

      // 2. Fetch Careers List
      const cList = await api.getCareers();
      setCareers(cList);

      const targetId = prof?.target_career_id || 'cloud-engineer';

      // 3. Fetch Match & Gaps for Target
      const match = await api.getCareerMatch(targetId);
      setCareerMatch(match);

      // 4. Fetch Recommendations
      const recs = await api.getRecommendations(targetId);
      setRecommendations(recs);

      // 5. Fetch Roadmap
      const rMap = await api.getRoadmap(targetId);
      setRoadmap(rMap);

      // 6. Fetch Resumes
      const rList = await api.getResumes();
      setResumes(rList);
    } catch (err) {
      console.warn('Note: Student profile sync completed with defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session token on initial mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await api.getMe();
        setCurrentUser(user);
        await refreshAllData();
      } catch (err) {
        console.info('No active auth session found:', err);
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    initAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout notification:', err);
    } finally {
      setCurrentUser(null);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    await refreshAllData();
  };

  const handleSetTargetCareer = async (careerId: string) => {
    try {
      await api.updateProfile({ target_career_id: careerId });
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchStudentSimulation = (query: string) => {
    setActiveSimQuery(query);
    setCurrentTab('whatif');
  };

  const handleOpenEvidence = (capability: string) => {
    setSelectedEvidenceCap(capability);
    setCurrentTab('evidence');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-soil-950 flex flex-col items-center justify-center text-cream font-sans p-4">
        <div className="w-10 h-10 rounded-xl bg-basil flex items-center justify-center text-soil-950 font-black text-sm mb-4 shadow-sm animate-pulse">
          CT
        </div>
        <h2 className="text-sm font-bold text-cream-heading mb-1">CareerTwin 2.0 Security Session</h2>
        <p className="text-xs text-cream-muted font-mono">Verifying authentication token in SQLite...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-cream font-sans">
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        studentName={currentUser?.name || profile?.full_name || "Hariom Gupta"}
        degree={profile?.degree ? `${profile.degree}, 3rd Year` : `${currentUser?.email || "B.E. Computer Science Engineering"}`}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenWhatIf={() => setCurrentTab('what-if-math')}
          onOpenUpload={() => setCurrentTab('upload')}
          onSessionSwitched={refreshAllData}
          targetCareerTitle={careerMatch?.career_title || "Data Science Specialist"}
          user={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="py-32 text-center text-xs text-cream-muted">
              <span className="font-semibold text-cream-heading block text-sm mb-1">Initializing CareerTwin Platform...</span>
              <span>Loading 17,743 market postings and career outcome models</span>
            </div>
          ) : (
            <ErrorBoundary
              fallbackTitle={`Unable to render section: ${currentTab}`}
              onReset={() => setCurrentTab('overview')}
            >
              {/* Workforce Intelligence Views */}
              {currentTab === 'overview' && (
                <OverviewView onNavigate={setCurrentTab} />
              )}

              {currentTab === 'data-quality' && (
                <DataQualityView />
              )}

              {currentTab === 'market-intel' && (
                <MarketIntelligenceView />
              )}

              {currentTab === 'junior-outcomes' && (
                <JuniorOutcomesView />
              )}

              {currentTab === 'senior-outcomes' && (
                <SeniorOutcomesView />
              )}

              {currentTab === 'alignment' && (
                <AlignmentEngineView onOpenEvidence={handleOpenEvidence} />
              )}

              {currentTab === 'evidence' && (
                <EvidenceExplorerView initialCapability={selectedEvidenceCap} />
              )}

              {currentTab === 'what-if-math' && (
                <WhatIfSimulatorMathView />
              )}

              {currentTab === 'workforce-decisions' && (
                <WorkforceDecisionsView />
              )}

              {currentTab === 'upload' && (
                <UploadView onSessionSwitched={refreshAllData} onNavigateTab={setCurrentTab} />
              )}

              {currentTab === 'methodology' && (
                <MethodologyView />
              )}

              {currentTab === 'architecture' && (
                <SystemArchitectureView />
              )}

              {currentTab === 'showcase' && (
                <ShowcaseView />
              )}

              {/* Student Career Studio Views */}
              {currentTab === 'dashboard' && (
                <StudentDashboardView
                  profile={profile}
                  careerMatch={careerMatch}
                  recommendations={recommendations}
                  roadmap={roadmap}
                  onNavigate={setCurrentTab}
                  onSimulate={handleLaunchStudentSimulation}
                />
              )}

              {currentTab === 'whatif' && (
                <WhatIfSimulatorView
                  profile={profile}
                  onProfileUpdated={refreshAllData}
                  initialQuery={activeSimQuery}
                />
              )}

              {currentTab === 'resume' && (
                <ResumeStudioView
                  resumes={resumes}
                  profile={profile}
                  onRefreshResumes={refreshAllData}
                />
              )}

              {currentTab === 'careers' && (
                <CareerExplorerView
                  careers={careers}
                  currentTargetId={profile?.target_career_id || 'cloud-engineer'}
                  onSetTargetCareer={handleSetTargetCareer}
                  onSimulate={handleLaunchStudentSimulation}
                />
              )}

              {currentTab === 'skills' && (
                <MySkillsView
                  userSkills={profile?.skills || []}
                  onSkillsUpdated={refreshAllData}
                />
              )}

              {currentTab === 'roadmap' && (
                <RoadmapView
                  roadmap={roadmap}
                  careerTitle={careerMatch?.career_title || "Cloud Solutions Engineer"}
                  onExploreCareers={() => setCurrentTab('careers')}
                />
              )}

              {currentTab === 'profile' && (
                <MasterProfileView
                  profile={profile}
                  onProfileUpdated={refreshAllData}
                />
              )}

              {currentTab === 'university' && (
                <UniversityInsightsView />
              )}

              {currentTab === 'settings' && (
                <div className="bg-surface rounded-xl border border-border p-6 shadow-card max-w-2xl text-cream">
                  <h2 className="text-lg font-bold text-cream-heading mb-2">Platform Settings</h2>
                  <p className="text-xs text-cream-muted mb-4">
                    CareerTwin Environment Configuration & Analytical Engines
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-cream">Active Model Engine</span>
                      <span className="font-mono text-basil">Deterministic Weighted Rules + Logit/RF Cross-Validated</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-cream">Database Backend</span>
                      <span className="font-mono text-cream-muted">SQLite (careertwin.db - 17,743 Records)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-cream">Validation Framework</span>
                      <span className="font-mono text-basil">Python Analytical Pipeline + SAS Validation Layer</span>
                    </div>
                  </div>
                </div>
              )}
            </ErrorBoundary>
          )}
        </main>
      </div>

      {/* Account Switching & Auth Dialog */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
};

export default App;
