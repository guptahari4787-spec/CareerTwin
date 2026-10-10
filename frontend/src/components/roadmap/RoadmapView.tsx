import React from 'react';
import { Path, BookOpen, Certificate, Flask } from '@phosphor-icons/react';
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
      <div className="bg-pigeon-800 border border-pigeon-600 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-acid-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Path size={16} />
            <span>Dependency-Aware Progression</span>
          </div>
          <h1 className="text-2xl font-bold text-almond-200">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-almond-400 mt-1 max-w-2xl leading-relaxed">
            Targeting: <strong className="text-almond-200 font-semibold">{careerTitle}</strong>. Sequenced topologically based on skill prerequisites so you never take a course you are unequipped to understand.
          </p>
        </div>

        <button
          onClick={onExploreCareers}
          className="px-4 py-2 rounded-lg bg-pigeon-900 border border-pigeon-600 text-almond-200 hover:bg-pigeon-700 text-xs font-semibold transition-colors shrink-0"
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
              className={`p-6 rounded-xl border bg-pigeon-800 transition-all ${
                isFirst 
                  ? 'border-acid-500 shadow-sm ring-1 ring-acid-500/30' 
                  : 'border-pigeon-600'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                    isFirst
                      ? 'bg-acid-500 text-pigeon-950 font-black'
                      : 'bg-pigeon-900 text-almond-400 border border-pigeon-600'
                  }`}>
                    {step.order}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-acid-500">
                        {step.phase_title}
                      </span>
                      <span className="text-[10px] text-almond-600 font-mono">· {step.estimated_duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-almond-200">{step.skill_name}</h3>
                    <p className="text-xs text-almond-400 mt-1 leading-relaxed max-w-2xl">
                      {step.why_it_matters}
                    </p>

                    {/* Prerequisites */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-[11px] font-semibold text-almond-200">Prerequisites:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {step.prerequisites.length > 0 ? (
                          step.prerequisites.map((p) => (
                            <span key={p} className="px-2.5 py-0.5 rounded bg-pigeon-900 border border-pigeon-600 text-[10px] font-medium text-almond-200">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="px-2.5 py-0.5 rounded bg-pigeon-900 border border-pigeon-600 text-[10px] font-medium text-almond-400">
                            None (Ready to Start)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Learning Artifacts */}
                <div className="bg-pigeon-900 p-3.5 rounded-lg border border-pigeon-600 space-y-2 text-xs md:w-80 shrink-0">
                  <div className="flex items-start gap-2">
                    <BookOpen size={15} className="text-acid-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-almond-400 tracking-wider block">Recommended Course</span>
                      <span className="text-[11px] font-semibold text-almond-200">{step.recommended_course || "Self-guided Lab"}</span>
                    </div>
                  </div>

                  {step.recommended_cert && (
                    <div className="flex items-start gap-2 pt-2 border-t border-pigeon-600">
                      <Certificate size={15} className="text-acid-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-almond-400 tracking-wider block">Target Certification</span>
                        <span className="text-[11px] font-semibold text-almond-200">{step.recommended_cert}</span>
                      </div>
                    </div>
                  )}

                  {step.suggested_project && (
                    <div className="flex items-start gap-2 pt-2 border-t border-pigeon-600">
                      <Flask size={15} className="text-acid-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-almond-400 tracking-wider block">Capstone Project</span>
                        <span className="text-[11px] font-semibold text-almond-200">{step.suggested_project}</span>
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
