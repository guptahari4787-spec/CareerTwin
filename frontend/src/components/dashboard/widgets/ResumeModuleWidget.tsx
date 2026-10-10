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
    <div className="h-full flex flex-col justify-between p-5 bg-pigeon-800 rounded-xl border border-pigeon-600">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-almond-600 uppercase tracking-wider text-[10px]">
            Resume / CV Studio
          </span>
          <div className="w-5 h-5 rounded-full bg-pigeon-900 text-acid-400 border border-pigeon-600 flex items-center justify-center">
            <FileText size={14} weight="fill" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-almond-200 font-mono">6 Reels</span>
          <span className="text-xs text-acid-400 font-semibold">Ready</span>
        </div>

        <p className="text-[11px] text-almond-400 mb-2">
          Master Profile Source of Truth:
        </p>

        <div className="p-2.5 rounded-lg bg-pigeon-900 border border-pigeon-600 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-almond-400">Extracted Skills:</span>
            <span className="font-mono font-bold text-almond-200">{extractedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-almond-400">Master Projects:</span>
            <span className="font-mono font-bold text-almond-200">3</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenResumeStudio}
        className="w-full mt-3 py-1.5 flex items-center justify-center gap-1 text-xs font-bold text-acid-400 hover:underline border-t border-pigeon-600 pt-2"
      >
        <span>Open Resume Studio</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};
