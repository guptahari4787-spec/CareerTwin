import React from 'react';
import {
  LayoutDashboard,
  Database,
  TrendingUp,
  GraduationCap,
  Users,
  Layers,
  SlidersHorizontal,
  Search,
  Briefcase,
  BookOpen,
  User as UserIcon,
  Compass,
  FileText,
  Workflow,
  Network,
  FlaskConical,
  UploadCloud,
  LogOut
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  studentName?: string;
  degree?: string;
  user?: User | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  studentName = "Hariom Gupta",
  degree = "B.E. Computer Science Engineering",
  user,
  onLogout
}) => {
  const workforceNav = [
    { id: 'overview', num: '01', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'data-quality', num: '02', label: 'Data Quality & Audit', icon: Database },
    { id: 'market-intel', num: '03', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'junior-outcomes', num: '04', label: 'Junior Outcomes', icon: GraduationCap },
    { id: 'senior-outcomes', num: '05', label: 'Senior Outcomes', icon: Users },
    { id: 'alignment', num: '06', label: 'Alignment Engine', icon: Layers },
    { id: 'evidence', num: '07', label: 'Evidence Explorer', icon: Search },
    { id: 'what-if-math', num: '08', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'workforce-decisions', num: '09', label: 'Workforce Decisions', icon: Briefcase },
    { id: 'upload', num: '10', label: 'Upload & Dynamic Ingestion', icon: UploadCloud },
  ];

  const researchNav = [
    { id: 'methodology', label: 'Empirical Methodology', icon: BookOpen },
    { id: 'architecture', label: 'System Architecture', icon: Network, badge: 'Live' }
  ];

  const studentNav = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Master Profile', icon: UserIcon },
    { id: 'careers', label: 'Career Paths', icon: Compass },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Workflow },
    { id: 'resume', label: 'Resume Studio', icon: FileText },
  ];

  const designLabNav = [
    { id: 'showcase', label: 'UI Component Lab', icon: FlaskConical, badge: 'Demo' }
  ];

  return (
    <aside className="w-64 bg-soil-900 border-r border-border flex flex-col justify-between shrink-0 select-none h-screen text-cream font-sans">
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Header Branding */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-cream-heading text-base">CAREERTWIN</span>
                <span className="text-[10px] font-bold bg-basil-soft text-basil-300 border border-basil-dark px-1.5 py-0.2 rounded font-mono">
                  2.0
                </span>
              </div>
              <p className="text-[11px] text-cream-muted font-medium tracking-tight mt-0.5">
                Workforce Intelligence Platform
              </p>
            </div>
          </div>

          {/* User Profile Capsule */}
          {(() => {
            const displayName = user?.name || studentName;
            const displaySub = user?.email || degree;
            const initials = displayName
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'CT';

            return (
              <div className="mt-3 p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div 
                    onClick={() => onSelectTab('profile')}
                    className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
                  >
                    <div className="w-7 h-7 rounded-md bg-basil text-soil-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="text-xs font-bold text-cream-heading truncate">{displayName}</h4>
                      <p className="text-[10px] text-cream-muted truncate">{displaySub}</p>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogout();
                      }}
                      title="Sign Out"
                      className="p-1.5 rounded hover:bg-surface-card text-cream-muted hover:text-tomato-400 transition-colors shrink-0"
                    >
                      <LogOut size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          
          {/* Section: Workforce Intelligence */}
          <div>
            <div className="px-2 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cream-muted">
                Workforce Intelligence
              </p>
            </div>
            <nav className="space-y-0.5">
              {workforceNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                      isActive
                        ? 'bg-basil-soft text-cream-heading font-semibold border-l-2 border-basil pl-2'
                        : 'text-cream-secondary hover:text-cream-heading hover:bg-surface font-medium'
                    }`}
                  >
                    <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-basil font-bold' : 'text-cream-muted'}`}>
                      {item.num}
                    </span>
                    <Icon size={14} className={isActive ? 'text-basil' : 'text-cream-muted'} />
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Research */}
          <div className="pt-2 border-t border-border">
            <div className="px-2 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cream-muted">
                Research
              </p>
            </div>
            <nav className="space-y-0.5">
              {researchNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                      isActive
                        ? 'bg-basil-soft text-cream-heading font-semibold border-l-2 border-basil pl-2'
                        : 'text-cream-secondary hover:text-cream-heading hover:bg-surface font-medium'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-basil' : 'text-cream-muted'} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-basil-soft text-basil-300 border border-basil-dark">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Career Studio */}
          <div className="pt-2 border-t border-border">
            <div className="px-2 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cream-muted">
                Career Studio
              </p>
            </div>
            <nav className="space-y-0.5">
              {studentNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                      isActive
                        ? 'bg-basil-soft text-cream-heading font-semibold border-l-2 border-basil pl-2'
                        : 'text-cream-secondary hover:text-cream-heading hover:bg-surface font-medium'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-basil' : 'text-cream-muted'} />
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Design Lab (Isolated at bottom) */}
          <div className="pt-2 border-t border-border">
            <div className="px-2 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cream-muted">
                Design Lab
              </p>
            </div>
            <nav className="space-y-0.5">
              {designLabNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                      isActive
                        ? 'bg-surface-elevated text-cream-heading font-semibold border-l-2 border-cream-muted pl-2'
                        : 'text-cream-muted hover:text-cream-heading hover:bg-surface font-medium'
                    }`}
                  >
                    <Icon size={14} className="text-cream-muted" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-surface text-cream-muted border border-border">
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 border-t border-border bg-soil-950">
        <div className="px-2 py-1.5 rounded border border-border text-[11px] text-cream-muted flex items-center justify-between">
          <span className="font-medium">Data Lake</span>
          <span className="font-mono text-basil font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-basil animate-pulse"></span> 17,743 Records
          </span>
        </div>
      </div>
    </aside>
  );
};
