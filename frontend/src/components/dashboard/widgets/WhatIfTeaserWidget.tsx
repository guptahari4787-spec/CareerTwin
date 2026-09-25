import React, { useState } from 'react';
import { Lightning, ArrowRight, Sparkle } from '@phosphor-icons/react';

interface WhatIfTeaserWidgetProps {
  onRunSimulation: (query: string) => void;
  onOpenSimulator: () => void;
}

export const WhatIfTeaserWidget: React.FC<WhatIfTeaserWidgetProps> = ({
  onRunSimulation,
  onOpenSimulator
}) => {
  const [query, setQuery] = useState("What if I learn AWS?");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onRunSimulation(query);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-accent font-semibold">
            <Lightning size={16} weight="fill" />
            <span className="uppercase tracking-wider text-[10px]">What-If Career Simulator</span>
          </div>
          <button 
            onClick={onOpenSimulator}
            className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
          >
            Full Workbench <ArrowRight size={12} />
          </button>
        </div>

        <p className="text-xs text-muted mb-3 leading-relaxed">
          Simulate acquiring skills or certifications. See real-time career match deltas without altering your profile.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What if I learn AWS?"
            className="flex-1 bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkle size={13} weight="fill" />
            <span>Simulate</span>
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["What if I learn AWS?", "What if I learn Docker?", "What if I learn Kubernetes?", "What if I learn AI?"].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setQuery(preset);
                onRunSimulation(preset);
              }}
              className="text-[11px] px-2 py-1 rounded bg-surface-subtle hover:bg-slate-100 text-slate-600 border border-border transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border mt-3 text-[11px] text-muted flex items-center justify-between">
        <span>Hypothesis Engine: Deterministic weighted calculations</span>
        <span className="font-mono text-charcoal font-semibold">Ready</span>
      </div>
    </div>
  );
};
