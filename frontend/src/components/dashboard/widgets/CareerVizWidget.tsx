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
    <div className="h-full flex flex-col justify-between p-5 bg-pigeon-800 rounded-xl border border-pigeon-600">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-acid-500 font-bold">
            <Compass size={16} />
            <span className="uppercase tracking-wider text-[10px]">Career Transformation Pipeline</span>
          </div>
          <button 
            onClick={onExploreCareer}
            className="text-[11px] font-bold text-acid-400 hover:underline"
          >
            Explore Paths
          </button>
        </div>

        {/* 3-Column Pipeline: YOUR SKILLS -> MISSING SKILLS -> TARGET CAREER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2 items-stretch">
          
          {/* Column 1: YOUR SKILLS */}
          <div className="p-3 bg-pigeon-900 border border-pigeon-600 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-almond-400 block mb-1.5">
                Your Current Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.slice(0, 6).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-pigeon-800 text-almond-200 border border-pigeon-600 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-acid-400 font-semibold mt-2 block">
              Verified in Master Profile
            </span>
          </div>

          {/* Column 2: MISSING SKILLS */}
          <div className="p-3 bg-pigeon-900 border border-tomato-500/40 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-tomato-400 block mb-1.5">
                Missing Required Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.slice(0, 5).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-tomato-950/60 text-tomato-300 border border-tomato-500/40 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-tomato-400 font-semibold mt-2 block">
              High Priority Gaps
            </span>
          </div>

          {/* Column 3: TARGET CAREER */}
          <div className="p-3 bg-pigeon-900 border border-pigeon-600 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-acid-400 block mb-1.5">
                Target Role
              </span>
              <h4 className="text-sm font-bold text-almond-200">{targetCareer}</h4>
              <p className="text-[11px] text-almond-400 mt-1 leading-snug">
                Average Market Demand: High · Core focus on resilient distributed systems.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-acid-400 mt-2">
              <span>View Requirements</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>
      </div>

      <div className="pt-2 border-t border-pigeon-600 text-[11px] text-almond-600 flex items-center justify-between">
        <span>From Where I Am → Where I Want to Go → What Skills Will Take Me There</span>
      </div>
    </div>
  );
};
