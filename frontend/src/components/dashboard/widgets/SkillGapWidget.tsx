import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { SkillGapItem } from '../../../types';

interface SkillGapWidgetProps {
  skillGaps?: SkillGapItem[];
  onOpenSkills: () => void;
}

export const SkillGapWidget: React.FC<SkillGapWidgetProps> = ({
  skillGaps = [],
  onOpenSkills
}) => {
  const missingCritical = skillGaps.filter(g => g.status === 'Missing' && g.importance === 'Critical');
  const missingCount = skillGaps.filter(g => g.status === 'Missing').length;

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">
            Skill Gaps
          </span>
          <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <WarningCircle size={14} weight="fill" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-charcoal font-mono">{missingCount}</span>
          <span className="text-xs text-amber-600 font-semibold">Gaps Identified</span>
        </div>

        <p className="text-[11px] text-muted mb-2">
          {missingCritical.length} critical skills require priority action:
        </p>

        <div className="space-y-1.5">
          {missingCritical.slice(0, 2).map((g) => (
            <div key={g.skill_id} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-surface-subtle border border-border">
              <span className="font-medium text-charcoal truncate">{g.skill_name}</span>
              <span className="text-[10px] text-amber-600 font-semibold font-mono">Priority 1</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onOpenSkills}
        className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-accent hover:underline border-t border-border pt-2"
      >
        View All Skill Gaps
      </button>
    </div>
  );
};
