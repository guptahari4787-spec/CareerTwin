import React from 'react';
import { ChartLineUp, Info } from '@phosphor-icons/react';

export const SkillGrowthWidget: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-muted uppercase tracking-wider text-[10px]">
            Skill Growth vs Demand
          </span>
          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ChartLineUp size={14} weight="bold" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-charcoal font-mono">+38%</span>
          <span className="text-xs text-emerald-600 font-semibold">Growth this Sem</span>
        </div>

        <p className="text-[11px] text-muted mb-2">
          Cohort Benchmark Alignment:
        </p>

        {/* Comparison Bars */}
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted">Cloud & DevOps</span>
              <span className="font-mono text-charcoal font-semibold">Demand: High</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-accent h-full w-[65%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted">Full-Stack & APIs</span>
              <span className="font-mono text-charcoal font-semibold">Demand: High</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[85%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-[10px] text-slate-400">
        <Info size={13} className="shrink-0" />
        <span>Seeded benchmark data (Chandigarh University CSE 2026)</span>
      </div>
    </div>
  );
};
