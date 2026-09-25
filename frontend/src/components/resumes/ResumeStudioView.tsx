import React, { useState } from 'react';
import { HaloReel } from './HaloReel';
import { ResumeVariantItem, StudentProfile } from '../../types';
import { api } from '../../services/api';
import { Printer, CheckCircle, FloppyDisk, Sparkle } from '@phosphor-icons/react';

interface ResumeStudioViewProps {
  resumes: ResumeVariantItem[];
  profile: StudentProfile | null;
  onRefreshResumes: () => void;
}

export const ResumeStudioView: React.FC<ResumeStudioViewProps> = ({
  resumes,
  profile,
  onRefreshResumes
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editableSummary, setEditableSummary] = useState(resumes[0]?.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const activeResume = resumes[activeIndex] || resumes[0];

  React.useEffect(() => {
    if (activeResume) {
      setEditableSummary(activeResume.summary);
    }
  }, [activeIndex, activeResume]);

  const handleSaveSummary = async () => {
    if (!activeResume) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await api.updateResume(activeResume.id, editableSummary);
      setSaveMessage("Saved tailored summary to active resume variant.");
      onRefreshResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <span>CareerTwin Resume Studio</span>
            <span className="text-muted">· One Master Truth → Multiple Role Variants</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">
            Tailored Multiple-Resume Studio
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            All variants belong to {profile?.full_name || "Hariom Gupta"}. CareerTwin dynamically re-orders competencies, projects, and summaries to maximize ATS alignment without fabricating achievements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-surface hover:bg-slate-100 border border-border text-charcoal rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <Printer size={15} />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Master Selector on Left (4 cols) | Halo Reel on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Pane: Role Selector & Master Profile Grounding */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
              Generated Career Variants
            </h3>

            <div className="space-y-2">
              {resumes.map((r, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-accent text-charcoal shadow-sm'
                        : 'bg-surface-subtle border-border text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-charcoal">{r.role_title}</h4>
                      <p className="text-[10px] text-muted mt-0.5">
                        Targeting {r.role_target}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-accent bg-white px-2 py-0.5 rounded border border-border">
                      {r.match_percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Summary Editor */}
          {activeResume && (
            <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-charcoal">
                  Edit Role-Tailored Summary
                </h4>
                <span className="text-[10px] font-mono text-muted">{activeResume.role_target}</span>
              </div>

              <textarea
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                rows={4}
                className="w-full bg-surface-subtle border border-border rounded-lg p-3 text-xs text-charcoal focus:outline-none focus:border-accent"
              />

              <div className="flex items-center justify-between pt-1">
                {saveMessage && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" /> {saveMessage}
                  </span>
                )}
                <button
                  onClick={handleSaveSummary}
                  disabled={isSaving}
                  className="ml-auto px-3.5 py-1.5 bg-charcoal hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <FloppyDisk size={14} />
                  <span>{isSaving ? "Saving..." : "Save Summary"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Truth Verification Box */}
          <div className="p-4 rounded-xl bg-surface-subtle border border-border text-xs text-muted">
            <h5 className="font-bold text-charcoal mb-1">Master Profile Guarantee</h5>
            <p className="text-[11px] leading-relaxed">
              Every resume variant is constructed strictly from Hariom Gupta's verified master projects, coursework, and skills. No simulated data is exported without explicit confirmation.
            </p>
          </div>

        </div>

        {/* Right Canvas: Halo Reel */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border p-6 shadow-subtle">
          <HaloReel
            resumes={resumes}
            activeIndex={activeIndex}
            onSelectResume={setActiveIndex}
            candidateName={profile?.full_name || "Hariom Gupta"}
            candidateEducation={`${profile?.degree || "B.E. Computer Science Engineering"}, ${profile?.university || "Chandigarh University"}`}
          />
        </div>

      </div>

    </div>
  );
};
