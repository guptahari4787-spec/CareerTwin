import React, { useState } from 'react';
import { Compass, CheckCircle, WarningCircle, ArrowRight, Check } from '@phosphor-icons/react';
import { CareerListItem, CareerMatchResponse } from '../../types';
import { api } from '../../services/api';

interface CareerExplorerViewProps {
  careers: CareerListItem[];
  currentTargetId: string;
  onSetTargetCareer: (careerId: string) => void;
  onSimulate: (query: string) => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careers,
  currentTargetId,
  onSetTargetCareer,
  onSimulate
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(currentTargetId);
  const [careerDetail, setCareerDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchDetail = async (id: string) => {
    setSelectedCareerId(id);
    setLoadingDetail(true);
    try {
      const data = await api.getCareerDetail(id);
      setCareerDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  React.useEffect(() => {
    fetchDetail(selectedCareerId);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Compass size={16} />
          <span>Industry Career Alignment</span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal">
          Career Path Explorer
        </h1>
        <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
          Evaluate 10 major technical career trajectories. Compatibility scores are transparently calculated by weighting your verified skills against industry hiring requirements.
        </p>
      </div>

      {/* Grid: Career Cards List (Left 5 cols) | Career Deep Dive (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 10 Careers List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted px-1 mb-2">
            Available Career Paths ({careers.length})
          </h3>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {careers.map((career) => {
              const isSelected = career.id === selectedCareerId;
              const isCurrentTarget = career.id === currentTargetId;

              return (
                <div
                  key={career.id}
                  onClick={() => fetchDetail(career.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-accent shadow-sm'
                      : 'bg-surface border-border hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-charcoal">{career.title}</h4>
                        {isCurrentTarget && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-accent text-white uppercase">
                            Target
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted">{career.category}</span>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-accent bg-white px-2 py-0.5 rounded border border-border">
                      {career.match_percentage}%
                    </span>
                  </div>

                  <p className="text-[11px] text-muted line-clamp-2 mb-2 leading-relaxed">
                    {career.overview}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-border/60">
                    <span>Matched: <strong className="text-emerald-700 font-mono">{career.matched_skills}</strong> / {career.total_skills}</span>
                    <span className="font-semibold text-charcoal">{career.average_salary} avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-depth Requirements & Skill Gap Breakdown */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-border p-6 shadow-subtle min-h-[600px]">
          {loadingDetail && (
            <div className="py-20 text-center text-xs text-muted">
              Loading career requirements...
            </div>
          )}

          {!loadingDetail && careerDetail && (
            <div className="space-y-6">
              
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-charcoal">{careerDetail.career.title}</h2>
                    <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-semibold text-muted">
                      {careerDetail.career.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Market Demand: <span className="font-semibold text-charcoal">{careerDetail.career.market_demand}</span> · Avg Compensation: <span className="font-mono font-semibold text-charcoal">{careerDetail.career.average_salary}</span>
                  </p>
                </div>

                {careerDetail.career.id !== currentTargetId ? (
                  <button
                    onClick={() => onSetTargetCareer(careerDetail.career.id)}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Check size={14} weight="bold" />
                    <span>Set as Target Career</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <CheckCircle size={14} weight="fill" /> Active Target
                  </span>
                )}
              </div>

              {/* Match Summary */}
              <div className="p-4 rounded-xl bg-surface-subtle border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted block mb-0.5">Calculated Compatibility</span>
                  <p className="text-xs text-charcoal font-medium">
                    {careerDetail.match.explanation}
                  </p>
                </div>
                <div className="text-right shrink-0 pl-4 border-l border-border">
                  <span className="text-2xl font-extrabold text-accent font-mono">
                    {careerDetail.match.match_percentage}%
                  </span>
                </div>
              </div>

              {/* Skill Gaps Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                  Skill Competency Checklist
                </h4>

                <div className="space-y-2">
                  {careerDetail.match.skill_gaps.map((gap: any) => (
                    <div 
                      key={gap.skill_id}
                      className="p-3 rounded-lg border border-border bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {gap.status === 'Strong' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle size={14} weight="fill" />
                          </div>
                        ) : gap.status === 'Developing' ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-50 text-accent flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-accent"></span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <WarningCircle size={14} weight="fill" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-charcoal">{gap.skill_name}</span>
                          <span className="text-[10px] text-muted block">
                            Expected: {gap.expected_level} · Importance: {gap.importance}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          gap.status === 'Strong'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : gap.status === 'Developing'
                            ? 'bg-indigo-50 text-accent border border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {gap.status}
                        </span>

                        {gap.status === 'Missing' && (
                          <button
                            onClick={() => onSimulate(`What if I learn ${gap.skill_name}?`)}
                            className="text-[10px] px-2 py-0.5 rounded bg-surface-subtle hover:bg-slate-200 text-charcoal font-semibold border border-border"
                          >
                            Simulate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
