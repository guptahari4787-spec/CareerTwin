import React from 'react';
import { FileText, ArrowRight } from '@phosphor-icons/react';

interface ResumeModuleWidgetProps {
  extractedCount?: number;
  onOpenResumeStudio: () => void;
}

export const ResumeModuleWidget: React.FC<ResumeModuleWidgetProps> = ({
  extractedCount = 12,
  onOpenResumeStudio
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">
            Resume / CV Studio
          </span>
          <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
            <FileText size={14} weight="fill" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-charcoal font-mono">6 Reels</span>
          <span className="text-xs text-purple-700 font-semibold">Ready</span>
        </div>

        <p className="text-[11px] text-muted mb-2">
          Master Profile Source of Truth:
        </p>

        <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Extracted Skills:</span>
            <span className="font-mono font-bold text-charcoal">{extractedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Master Projects:</span>
            <span className="font-mono font-bold text-charcoal">3</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenResumeStudio}
        className="w-full mt-3 py-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-accent hover:underline border-t border-border pt-2"
      >
        <span>Open Resume Studio</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};
