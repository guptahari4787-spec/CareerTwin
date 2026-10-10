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
    <div className="h-full flex flex-col justify-between p-5 bg-pigeon-800 rounded-xl border border-pigeon-600">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-almond-600 uppercase tracking-wider text-[10px]">
            Skill Gaps
          </span>
          <div className="w-5 h-5 rounded-full bg-pigeon-900 text-tomato-400 border border-pigeon-600 flex items-center justify-center">
            <WarningCircle size={14} weight="fill" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-almond-200 font-mono">{missingCount}</span>
          <span className="text-xs text-tomato-400 font-semibold">Gaps Identified</span>
        </div>

        <p className="text-[11px] text-almond-400 mb-2">
          {missingCritical.length} critical skills require priority action:
        </p>

        <div className="space-y-1.5">
          {missingCritical.slice(0, 2).map((g) => (
            <div key={g.skill_id} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-pigeon-900 border border-pigeon-600">
              <span className="font-medium text-almond-200 truncate">{g.skill_name}</span>
              <span className="text-[10px] text-tomato-400 font-semibold font-mono">Priority 1</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onOpenSkills}
        className="w-full mt-3 py-1.5 text-center text-xs font-bold text-acid-400 hover:underline border-t border-pigeon-600 pt-2"
      >
        View All Skill Gaps
      </button>
    </div>
  );
};
