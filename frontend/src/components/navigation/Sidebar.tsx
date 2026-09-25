import React from 'react';
import {
  House,
  User,
  CheckCircle,
  Compass,
  Path,
  FileText,
  Lightning,
  Buildings,
  Gear,
  SignOut
} from '@phosphor-icons/react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  studentName?: string;
  degree?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  studentName = "Hariom Gupta",
  degree = "B.E. CSE, 3rd Year"
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'skills', label: 'My Skills', icon: CheckCircle, badge: '12' },
    { id: 'careers', label: 'Career Paths', icon: Compass },
    { id: 'roadmap', label: 'Roadmap', icon: Path },
    { id: 'resume', label: 'Resume / CV', icon: FileText, badge: 'Reels' },
    { id: 'whatif', label: 'What-If Simulator', icon: Lightning, isHighlight: true },
    { id: 'university', label: 'University Insights', icon: Buildings },
    { id: 'settings', label: 'Settings', icon: Gear },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-9 w-9 rounded-lg bg-charcoal text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
            CT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-charcoal text-base">CAREERTWIN</span>
            </div>
            <p className="text-[11px] text-muted">Career Intelligence Platform</p>
          </div>
        </div>

        {/* Student Mini Profile Box */}
        <div 
          onClick={() => onSelectTab('profile')}
          className="p-3 rounded-xl bg-surface-subtle border border-border cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-accent font-bold text-xs flex items-center justify-center border border-indigo-200">
              HG
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-charcoal truncate">{studentName}</h4>
              <p className="text-[11px] text-muted truncate">{degree}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-indigo-50 text-accent font-semibold border border-indigo-100 shadow-sm'
                    : item.isHighlight
                    ? 'text-accent hover:bg-indigo-50/50'
                    : 'text-slate-600 hover:text-charcoal hover:bg-slate-100/70'
                }`}
              >
                <Icon size={18} weight={isActive ? 'bold' : 'regular'} className={isActive ? 'text-accent' : 'text-slate-500'} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-200/60 text-accent font-bold' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.isHighlight && !item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-accent text-white">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="px-3 py-2 rounded-lg bg-surface-subtle text-[11px] text-muted flex items-center justify-between">
          <span>Engine Status</span>
          <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
        <button
          onClick={() => onSelectTab('profile')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-charcoal rounded-lg hover:bg-slate-100/70 transition-colors text-left"
        >
          <SignOut size={16} />
          <span>Switch Account</span>
        </button>
      </div>
    </aside>
  );
};
