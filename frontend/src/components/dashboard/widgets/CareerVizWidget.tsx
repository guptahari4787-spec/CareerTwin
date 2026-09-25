import React from 'react';
import { ArrowRight, Compass } from '@phosphor-icons/react';

interface CareerVizWidgetProps {
  userSkills?: string[];
  missingSkills?: string[];
  targetCareer?: string;
  onExploreCareer: () => void;
}

export const CareerVizWidget: React.FC<CareerVizWidgetProps> = ({
  userSkills = ["Python", "Java", "SQL", "Git", "React", "Data Structures"],
  missingSkills = ["AWS", "Linux", "Docker", "Kubernetes", "CI/CD"],
  targetCareer = "Cloud Solutions Engineer",
  onExploreCareer
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-muted font-semibold">
            <Compass size={16} />
            <span className="uppercase tracking-wider text-[10px]">Career Transformation Pipeline</span>
          </div>
          <button 
            onClick={onExploreCareer}
            className="text-[11px] font-semibold text-accent hover:underline"
          >
            Explore Paths
          </button>
        </div>

        {/* 3-Column Pipeline: YOUR SKILLS -> MISSING SKILLS -> TARGET CAREER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2 items-stretch">
          
          {/* Column 1: YOUR SKILLS */}
          <div className="p-3 bg-surface-subtle border border-border rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1.5">
                Your Current Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {userSkills.slice(0, 6).map((s) => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-white text-charcoal border border-border text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
              Verified in Master Profile
            </span>
          </div>

          {/* Column 2: MISSING SKILLS */}
          <div className="p-3 bg-amber-50/40 border border-amber-200/80 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1.5">
                Missing Required Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {missingSkills.slice(0, 5).map((s) => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-white text-amber-900 border border-amber-200 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold mt-2 block">
              High Priority Gaps
            </span>
          </div>

          {/* Column 3: TARGET CAREER */}
          <div className="p-3 bg-indigo-50/40 border border-indigo-200/80 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1.5">
                Target Role
              </span>
              <h4 className="text-sm font-bold text-charcoal">{targetCareer}</h4>
              <p className="text-[11px] text-muted mt-1 leading-snug">
                Average Market Demand: High · Core focus on resilient distributed systems.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-accent mt-2">
              <span>View Requirements</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>
      </div>

      <div className="pt-2 border-t border-border text-[11px] text-muted flex items-center justify-between">
        <span>From Where I Am → Where I Want to Go → What Skills Will Take Me There</span>
      </div>
    </div>
  );
};
