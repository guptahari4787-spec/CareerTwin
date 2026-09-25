import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { StudentDashboardView } from './components/dashboard/StudentDashboardView';
import { WhatIfSimulatorView } from './components/whatif/WhatIfSimulatorView';
import { ResumeStudioView } from './components/resumes/ResumeStudioView';
import { CareerExplorerView } from './components/careers/CareerExplorerView';
import { MySkillsView } from './components/skills/MySkillsView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { MasterProfileView } from './components/profile/MasterProfileView';
import { UniversityInsightsView } from './components/university/UniversityInsightsView';

import {
  StudentProfile,
  CareerListItem,
  CareerMatchResponse,
  RecommendationItem,
  RoadmapStepItem,
  ResumeVariantItem
} from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Master Connected State
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [careers, setCareers] = useState<CareerListItem[]>([]);
  const [careerMatch, setCareerMatch] = useState<CareerMatchResponse | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStepItem[]>([]);
  const [resumes, setResumes] = useState<ResumeVariantItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSimQuery, setActiveSimQuery] = useState<string>('What if I learn AWS?');

  const refreshAllData = async () => {
    try {
      // 1. Fetch Profile
      const prof = await api.getProfile();
      setProfile(prof);

      // 2. Fetch Careers List
      const cList = await api.getCareers();
      setCareers(cList);

      const targetId = prof.target_career_id || 'cloud-engineer';

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
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleSetTargetCareer = async (careerId: string) => {
    try {
      await api.updateProfile({ target_career_id: careerId });
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchSimulation = (query: string) => {
    setActiveSimQuery(query);
    setCurrentTab('whatif');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-charcoal">
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        studentName={profile?.full_name || "Hariom Gupta"}
        degree={`${profile?.degree || "B.E. CSE"}, 3rd Year`}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenWhatIf={() => handleLaunchSimulation("What if I learn AWS?")}
          targetCareerTitle={careerMatch?.career_title || "Cloud Solutions Engineer"}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="py-32 text-center text-xs text-muted">
              <span className="font-semibold text-charcoal block text-sm mb-1">Loading CareerTwin Platform...</span>
              <span>Synchronizing Master Profile with Career Intelligence Engine</span>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <StudentDashboardView
                  profile={profile}
                  careerMatch={careerMatch}
                  recommendations={recommendations}
                  roadmap={roadmap}
                  onNavigate={setCurrentTab}
                  onSimulate={handleLaunchSimulation}
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
                  onSimulate={handleLaunchSimulation}
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
                <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle max-w-2xl">
                  <h2 className="text-lg font-bold text-charcoal mb-2">Platform Settings</h2>
                  <p className="text-xs text-muted mb-4">
                    CareerTwin Prototype Environment Configuration
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-charcoal">Active Model Engine</span>
                      <span className="font-mono text-muted">Deterministic Weighted Rules + NLP Fallback</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-charcoal">Database Backend</span>
                      <span className="font-mono text-muted">SQLite (Relational Normalized Schema)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                      <span className="font-medium text-charcoal">Design Token System</span>
                      <span className="font-mono text-muted">TasteSkill Anti-Slop (Light Mode Calibrated)</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

    </div>
  );
};
export default App;
