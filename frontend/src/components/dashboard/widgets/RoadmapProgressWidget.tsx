import React from 'react';
import { Path, ArrowRight } from '@phosphor-icons/react';
import { RoadmapStepItem } from '../../../types';

interface RoadmapProgressWidgetProps {
  roadmap?: RoadmapStepItem[];
  onOpenRoadmap: () => void;
}

export const RoadmapProgressWidget: React.FC<RoadmapProgressWidgetProps> = ({
  roadmap = [],
  onOpenRoadmap
}) => {
  const totalSteps = roadmap.length || 5;
  const currentStep = roadmap.find(s => s.status === 'in_progress') || roadmap[0];

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">
            Roadmap Progress
          </span>
          <div className="w-5 h-5 rounded-full bg-indigo-50 text-accent flex items-center justify-center">
            <Path size={14} weight="fill" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-charcoal font-mono">Phase 1</span>
          <span className="text-xs text-muted">of {totalSteps}</span>
        </div>

        <p className="text-[11px] text-muted mb-2">
          Active Focus:
        </p>

        <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
          <h4 className="text-xs font-bold text-charcoal truncate">
            {currentStep?.skill_name || "AWS Cloud Foundations"}
          </h4>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Est. Duration: {currentStep?.estimated_duration || "2 Weeks"}
          </span>
        </div>
      </div>

      <button
        onClick={onOpenRoadmap}
        className="w-full mt-3 py-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-accent hover:underline border-t border-border pt-2"
      >
        <span>Open Roadmap</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};
