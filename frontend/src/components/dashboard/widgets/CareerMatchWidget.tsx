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
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">
            Target Career Match
          </span>
          <button 
            onClick={onExploreCareers}
            className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
          >
            Switch Career <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h3 className="text-xl font-extrabold text-charcoal">{careerTitle}</h3>
            <p className="text-xs text-muted mt-0.5">
              {matchData?.explanation || "Calculated using weighted industry rubric requirements."}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-accent font-mono">{matchPct}%</span>
            <span className="block text-[10px] text-muted font-medium">Match Score</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex mb-3">
          <div 
            className="bg-accent h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(matchPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">Matched</span>
          <span className="font-mono font-bold text-emerald-600">{matched} skills</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">Skill Gaps</span>
          <span className="font-mono font-bold text-amber-600">{missing} skills</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">Total Required</span>
          <span className="font-mono font-bold text-charcoal">{total} skills</span>
        </div>
      </div>
    </div>
  );
};
