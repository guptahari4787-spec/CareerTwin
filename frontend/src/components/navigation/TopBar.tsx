import React from 'react';
import { MagnifyingGlass, Sparkle } from '@phosphor-icons/react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenWhatIf: () => void;
  targetCareerTitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenWhatIf,
  targetCareerTitle = "Cloud Solutions Engineer"
}) => {
  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between gap-4 shrink-0">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-lg">
        <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search careers, skills or ask anything..."
          className="w-full bg-surface-subtle border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-charcoal placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Active Target Career Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs">
          <span className="text-muted text-[11px]">Target:</span>
          <span className="font-semibold text-charcoal truncate max-w-[180px]">{targetCareerTitle}</span>
        </div>

        {/* Quick Simulator CTA */}
        <button
          onClick={onOpenWhatIf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm"
        >
          <Sparkle size={14} weight="fill" />
          <span>Ask What-If</span>
        </button>

      </div>
    </header>
  );
};
