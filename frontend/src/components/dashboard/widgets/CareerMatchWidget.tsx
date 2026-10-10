import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { CareerMatchResponse } from '../../../types';

interface CareerMatchWidgetProps {
  matchData?: CareerMatchResponse | null;
  onExploreCareers: () => void;
}

export const CareerMatchWidget: React.FC<CareerMatchWidgetProps> = ({
  matchData,
  onExploreCareers
}) => {
  const matchPct = matchData?.match_percentage ?? 82.0;
  const careerTitle = matchData?.career_title ?? "Cloud Solutions Engineer";
  const matched = matchData?.matched_skills_count ?? 3;
  const total = matchData?.total_required_skills ?? 11;
  const missing = matchData?.missing_skills_count ?? 8;

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-pigeon-800 rounded-xl border border-pigeon-600">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-almond-600 uppercase tracking-wider text-[10px]">
            Target Career Match
          </span>
          <button 
            onClick={onExploreCareers}
            className="flex items-center gap-1 text-[11px] font-bold text-acid-400 hover:underline"
          >
            Switch Career <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h3 className="text-xl font-extrabold text-almond-200">{careerTitle}</h3>
            <p className="text-xs text-almond-400 mt-0.5">
              {matchData?.explanation || "Calculated using weighted industry rubric requirements."}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-acid-400 font-mono">{matchPct}%</span>
            <span className="block text-[10px] text-almond-600 font-medium">Match Score</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-pigeon-900 h-2 rounded-full overflow-hidden flex mb-3">
          <div 
            className="bg-acid-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(matchPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-pigeon-600 text-center text-xs">
        <div>
          <span className="text-almond-600 text-[10px] uppercase font-bold block">Matched</span>
          <span className="font-mono font-bold text-acid-400">{matched} skills</span>
        </div>
        <div>
          <span className="text-almond-600 text-[10px] uppercase font-bold block">Skill Gaps</span>
          <span className="font-mono font-bold text-tomato-400">{missing} skills</span>
        </div>
        <div>
          <span className="text-almond-600 text-[10px] uppercase font-bold block">Total Required</span>
          <span className="font-mono font-bold text-almond-200">{total} skills</span>
        </div>
      </div>
    </div>
  );
};
