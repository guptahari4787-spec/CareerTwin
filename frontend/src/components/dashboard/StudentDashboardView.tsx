import React from 'react';
import { DraggableWidgetGrid, WidgetItem } from './DraggableWidgetGrid';
import { CareerMatchWidget } from './widgets/CareerMatchWidget';
import { SkillGapWidget } from './widgets/SkillGapWidget';
import { RoadmapProgressWidget } from './widgets/RoadmapProgressWidget';
import { WhatIfTeaserWidget } from './widgets/WhatIfTeaserWidget';
import { CareerVizWidget } from './widgets/CareerVizWidget';
import { RecommendedLearningWidget } from './widgets/RecommendedLearningWidget';
import { ResumeModuleWidget } from './widgets/ResumeModuleWidget';
import { SkillGrowthWidget } from './widgets/SkillGrowthWidget';
import { StudentProfile, CareerMatchResponse, RecommendationItem, RoadmapStepItem } from '../../types';

interface StudentDashboardViewProps {
  profile: StudentProfile | null;
  careerMatch: CareerMatchResponse | null;
  recommendations: RecommendationItem[];
  roadmap: RoadmapStepItem[];
  onNavigate: (tab: string) => void;
  onSimulate: (query: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  profile,
  careerMatch,
  recommendations,
  roadmap,
  onNavigate,
  onSimulate
}) => {
  const verifiedSkillCount = profile?.skills?.length || 12;
  const matchPct = careerMatch?.match_percentage || 82.0;
  const missingCount = careerMatch?.missing_skills_count || 8;

  // Initial intentional widget layout:
  // ROW 1: Career Match (wide), Skill Gap (small), Roadmap Progress (small)
  // ROW 2: What-If Simulator (wide), Career Visualization (wide)
  // ROW 3: Recommended Learning (wide), Resume / CV (small), Skill Growth (small)
  const initialWidgets: WidgetItem[] = [
    {
      id: 'career-match',
      title: 'Target Career Match',
      size: 'wide',
      content: (
        <CareerMatchWidget 
          matchData={careerMatch} 
          onExploreCareers={() => onNavigate('careers')} 
        />
      ),
    },
    {
      id: 'skill-gap',
      title: 'Skill Gap Analysis',
      size: 'small',
      content: (
        <SkillGapWidget 
          skillGaps={careerMatch?.skill_gaps} 
          onOpenSkills={() => onNavigate('skills')} 
        />
      ),
    },
    {
      id: 'roadmap-progress',
      title: 'Roadmap Progress',
      size: 'small',
      content: (
        <RoadmapProgressWidget 
          roadmap={roadmap} 
          onOpenRoadmap={() => onNavigate('roadmap')} 
        />
      ),
    },
    {
      id: 'what-if-simulator',
      title: 'What-If Career Simulator',
      size: 'wide',
      content: (
        <WhatIfTeaserWidget 
          onRunSimulation={onSimulate} 
          onOpenSimulator={() => onNavigate('whatif')} 
        />
      ),
    },
    {
      id: 'career-viz',
      title: 'Career Transformation Pipeline',
      size: 'wide',
      content: (
        <CareerVizWidget
          userSkills={profile?.skills?.map(s => s.name) || ["Python", "Java", "SQL", "Git", "React", "Data Structures"]}
          missingSkills={careerMatch?.skill_gaps?.filter(g => g.status === 'Missing').map(g => g.skill_name) || ["AWS", "Linux", "Docker", "Kubernetes", "CI/CD"]}
          targetCareer={careerMatch?.career_title || "Cloud Solutions Engineer"}
          onExploreCareer={() => onNavigate('careers')}
        />
      ),
    },
    {
      id: 'recommended-learning',
      title: 'Recommended Learning',
      size: 'wide',
      content: (
        <RecommendedLearningWidget 
          recommendations={recommendations} 
          onOpenCourses={() => onNavigate('roadmap')} 
        />
      ),
    },
    {
      id: 'resume-module',
      title: 'Resume Studio Module',
      size: 'small',
      content: (
        <ResumeModuleWidget 
          extractedCount={verifiedSkillCount} 
          onOpenResumeStudio={() => onNavigate('resume')} 
        />
      ),
    },
    {
      id: 'skill-growth',
      title: 'Skill Growth vs Industry Demand',
      size: 'small',
      content: <SkillGrowthWidget />,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            Welcome back, {profile?.full_name?.split(' ')[0] || "Hariom"}!
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Explore career opportunities, analyze your skill gaps, plan your learning path and create tailored resumes.
          </p>
        </div>

        {/* Overview Inline Metrics (Clean & Restrained) */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Skills</span>
            <span className="font-mono text-lg font-extrabold text-charcoal">{verifiedSkillCount}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Career Match</span>
            <span className="font-mono text-lg font-extrabold text-accent">{matchPct}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Skill Gaps</span>
            <span className="font-mono text-lg font-extrabold text-amber-600">{missingCount}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness</span>
            <span className="font-mono text-lg font-extrabold text-emerald-600">76%</span>
          </div>
        </div>
      </div>

      {/* Draggable Widget Grid */}
      <DraggableWidgetGrid widgets={initialWidgets} />

    </div>
  );
};
