import React from 'react';
import { Path, CheckCircle, BookOpen, Certificate, Flask } from '@phosphor-icons/react';
import { RoadmapStepItem } from '../../types';

interface RoadmapViewProps {
  roadmap: RoadmapStepItem[];
  careerTitle?: string;
  onExploreCareers: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  careerTitle = "Cloud Solutions Engineer",
  onExploreCareers
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <Path size={16} />
            <span>Dependency-Aware Progression</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Targeting: <strong className="text-charcoal font-semibold">{careerTitle}</strong>. Sequenced topologically based on skill prerequisites so you never take a course you are unequipped to understand.
          </p>
        </div>

        <button
          onClick={onExploreCareers}
          className="px-4 py-2 rounded-lg bg-surface border border-border text-charcoal hover:bg-surface-subtle text-xs font-semibold transition-colors shrink-0"
        >
          Change Target Career
        </button>
      </div>

      {/* Stepped Timeline */}
      <div className="space-y-4">
        {roadmap.map((step, idx) => {
          const isFirst = idx === 0;

          return (
            <div
              key={step.order}
              className={`p-6 rounded-xl border bg-surface transition-all ${
                isFirst 
                  ? 'border-accent shadow-sm ring-1 ring-accent/20' 
                  : 'border-border'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                    isFirst
                      ? 'bg-accent text-white'
                      : 'bg-surface-subtle text-muted border border-border'
                  }`}>
                    {step.order}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        {step.phase_title}
                      </span>
                      <span className="text-[10px] text-muted">· {step.estimated_duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-charcoal">{step.skill_name}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
                      {step.why_it_matters}
                    </p>

                    {/* Prerequisites */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Prerequisites:</span>
                      <div className="flex flex-wrap gap-1">
                        {step.prerequisites.map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-medium text-slate-700">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Learning Artifacts */}
                <div className="bg-surface-subtle p-3.5 rounded-lg border border-border space-y-2 text-xs md:w-80 shrink-0">
                  <div className="flex items-start gap-2">
                    <BookOpen size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Recommended Course</span>
                      <span className="text-[11px] font-semibold text-charcoal">{step.recommended_course || "Self-guided Lab"}</span>
                    </div>
                  </div>

                  {step.recommended_cert && (
                    <div className="flex items-start gap-2 pt-2 border-t border-border">
                      <Certificate size={15} className="text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Target Certification</span>
                        <span className="text-[11px] font-semibold text-charcoal">{step.recommended_cert}</span>
                      </div>
                    </div>
                  )}

                  {step.suggested_project && (
                    <div className="flex items-start gap-2 pt-2 border-t border-border">
                      <Flask size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Capstone Project</span>
                        <span className="text-[11px] font-semibold text-charcoal">{step.suggested_project}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
