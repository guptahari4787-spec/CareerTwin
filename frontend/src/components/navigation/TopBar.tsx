import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronRight, Database, ChevronDown, Check, UploadCloud, LogOut, User as UserIcon } from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenWhatIf: () => void;
  onOpenUpload?: () => void;
  targetCareerTitle?: string;
  currentTabLabel?: string;
  onSessionSwitched?: (sessionId: string) => void;
  user?: User | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenWhatIf,
  onOpenUpload,
  targetCareerTitle = "DevOps Engineer",
  currentTabLabel = "Workforce Intelligence",
  onSessionSwitched,
  user,
  onLogout,
  onOpenAuth
}) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('demo');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const fetchSessions = async () => {
    try {
      const res = await api.getSessions();
      setSessions(res.sessions || []);
      setActiveSessionId(res.active_session_id || 'demo');
    } catch (err) {
      console.warn('Failed to fetch sessions in TopBar:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelectSession = async (sessId: string) => {
    try {
      await api.switchSession(sessId);
      setActiveSessionId(sessId);
      setDropdownOpen(false);
      if (onSessionSwitched) {
        onSessionSwitched(sessId);
      }
    } catch (err) {
      console.error('Error switching session:', err);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || {
    name: 'CareerTwin Demo Benchmark',
    is_benchmark: true,
  };

  return (
    <header className="h-14 bg-soil-900 border-b border-border px-6 flex items-center justify-between gap-4 shrink-0 font-sans text-cream">
      
      {/* Contextual Breadcrumb */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-cream-muted font-medium">
        <span className="font-semibold text-cream-heading">CareerTwin 2.0</span>
        <ChevronRight size={13} className="text-soil-500" />
        <span className="text-cream-secondary">{currentTabLabel}</span>
      </div>

      {/* Editorial Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search careers, skills, roles or evidence..."
          className="w-full bg-surface border border-border rounded-md pl-9 pr-4 py-1.5 text-xs text-cream placeholder-cream-muted focus:outline-none focus:border-basil focus:bg-surface-elevated transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Dynamic Multi-Session Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              fetchSessions();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-surface hover:bg-surface-elevated border border-border text-xs text-cream transition-colors"
          >
            <Database size={13} className={activeSession.is_benchmark ? "text-basil" : "text-tomato"} />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-cream-muted font-mono leading-none">ACTIVE DATASET</span>
              <span className="text-xs font-semibold text-cream-heading truncate max-w-[150px] leading-tight">
                {activeSession.is_benchmark ? 'Demo Benchmark (17.4k)' : activeSession.name}
              </span>
            </div>
            <ChevronDown size={12} className="text-cream-muted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-surface-elevated border border-border rounded-lg shadow-sheet p-2 z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-mono text-cream-muted uppercase border-b border-border flex items-center justify-between">
                <span>Select Analytical Session</span>
                <span>{sessions.length} Available</span>
              </div>
              <div className="max-h-52 overflow-y-auto py-1 space-y-1">
                {sessions.map((s) => {
                  const isCur = s.id === activeSessionId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSession(s.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                        isCur
                          ? 'bg-basil-soft text-cream-heading font-semibold'
                          : 'hover:bg-surface text-cream-secondary'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full ${s.is_benchmark ? 'bg-basil' : 'bg-tomato'}`} />
                          <span className="truncate">{s.name}</span>
                        </div>
                        <span className="text-[10px] text-cream-muted font-mono block">
                          {s.is_benchmark ? '17,443 Market + 300 Outcome records' : s.type}
                        </span>
                      </div>
                      {isCur && <Check size={13} className="text-basil shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
              {onOpenUpload && (
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenUpload();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-surface hover:bg-surface-card border border-border text-[11px] text-cream font-semibold transition-colors"
                  >
                    <UploadCloud size={13} className="text-basil" />
                    <span>Upload New Dataset</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Upload CTA */}
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface hover:bg-surface-elevated border border-border text-xs text-cream font-medium transition-colors"
          >
            <UploadCloud size={13} className="text-basil" />
            <span>Upload Data</span>
          </button>
        )}

        {/* Career Scenario CTA in Basil */}
        <button
          onClick={onOpenWhatIf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-basil hover:bg-basil-600 text-soil-950 text-xs font-bold transition-colors shadow-none"
        >
          <SlidersHorizontal size={13} />
          <span>Run Career Scenario</span>
        </button>

        {/* Authenticated User Capsule & Logout */}
        {user ? (
          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface border border-border text-xs">
              <div className="w-5 h-5 rounded bg-basil text-soil-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'CT'}
              </div>
              <span className="text-xs font-semibold text-cream-heading max-w-[120px] truncate hidden xl:inline">
                {user.name}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out of Session"
                className="p-1.5 rounded-md bg-surface hover:bg-surface-elevated border border-border text-cream-muted hover:text-tomato-400 transition-colors"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        ) : onOpenAuth ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface hover:bg-surface-elevated border border-border text-xs text-cream font-semibold transition-colors"
          >
            <UserIcon size={13} className="text-basil" />
            <span>Sign In</span>
          </button>
        ) : null}

      </div>
    </header>
  );
};
