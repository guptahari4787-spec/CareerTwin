import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle, WarningCircle, Check } from '@phosphor-icons/react';
import { CareerListItem } from '../../types';
import { api } from '../../services/api';

interface CareerExplorerViewProps {
  careers: CareerListItem[];
  currentTargetId?: string;
  onSetTargetCareer: (careerId: string) => void;
  onSimulate: (query: string) => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careers,
  currentTargetId = "cloud-engineer",
  onSetTargetCareer,
  onSimulate
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(currentTargetId);
  const [careerDetail, setCareerDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCareerId) {
      fetchDetail(selectedCareerId);
    }
  }, [selectedCareerId]);

  const fetchDetail = async (cid: string) => {
    setSelectedCareerId(cid);
    setLoadingDetail(true);
    try {
      const detail = await api.getCareerDetail(cid);
      setCareerDetail(detail);
    } catch (err) {
      console.error("Failed to fetch career detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-pigeon-800 border border-pigeon-600 rounded-xl p-6 shadow-subtle">
        <div className="flex items-center gap-2 text-acid-500 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass size={16} />
          <span>Industry Career Alignment</span>
        </div>
        <h1 className="text-2xl font-bold text-almond-200">
          Career Path Explorer
        </h1>
        <p className="text-xs text-almond-400 mt-1 max-w-2xl leading-relaxed">
          Evaluate 10 major technical career trajectories. Compatibility scores are transparently calculated by weighting your verified skills against industry hiring requirements.
        </p>
      </div>

      {/* Grid: Career Cards List (Left 5 cols) | Career Deep Dive (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 10 Careers List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-almond-400 px-1 mb-2">
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
                      ? 'bg-pigeon-700 border-acid-500 shadow-sm ring-1 ring-acid-500/30'
                      : 'bg-pigeon-800 border-pigeon-600 hover:bg-pigeon-700/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-almond-200">{career.title}</h4>
                        {isCurrentTarget && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-acid-500 text-pigeon-950 uppercase">
                            Target
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-almond-600 font-mono">{career.category}</span>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-acid-400 bg-pigeon-900 px-2 py-0.5 rounded border border-pigeon-600">
                      {career.match_percentage}%
                    </span>
                  </div>

                  <p className="text-[11px] text-almond-400 line-clamp-2 mb-2 leading-relaxed">
                    {career.overview}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-almond-400 pt-2 border-t border-pigeon-600">
                    <span>Matched: <strong className="text-acid-400 font-mono">{career.matched_skills}</strong> / {career.total_skills}</span>
                    <span className="font-semibold text-almond-200">{career.average_salary} avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-depth Requirements & Skill Gap Breakdown */}
        <div className="lg:col-span-7 bg-pigeon-800 rounded-xl border border-pigeon-600 p-6 shadow-subtle min-h-[600px]">
          {loadingDetail && (
            <div className="py-20 text-center text-xs text-almond-400">
              Loading career requirements...
            </div>
          )}

          {!loadingDetail && careerDetail && (
            <div className="space-y-6">
              
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-pigeon-600 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-almond-200">{careerDetail.career.title}</h2>
                    <span className="px-2 py-0.5 rounded bg-pigeon-900 border border-pigeon-600 text-[10px] font-semibold text-almond-400">
                      {careerDetail.career.category}
                    </span>
                  </div>
                  <p className="text-xs text-almond-400 mt-1">
                    Market Demand: <span className="font-semibold text-almond-200">{careerDetail.career.market_demand}</span> · Avg Compensation: <span className="font-mono font-semibold text-almond-200">{careerDetail.career.average_salary}</span>
                  </p>
                </div>

                {careerDetail.career.id !== currentTargetId ? (
                  <button
                    onClick={() => onSetTargetCareer(careerDetail.career.id)}
                    className="px-4 py-2 bg-acid-500 hover:bg-acid-400 text-pigeon-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Check size={14} weight="bold" />
                    <span>Set as Target Career</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-acid-400 px-3 py-1.5 rounded-lg bg-acid-950/60 border border-acid-600/40 flex items-center gap-1 shrink-0">
                    <CheckCircle size={14} weight="fill" /> Active Target
                  </span>
                )}
              </div>

              {/* Match Summary */}
              <div className="p-4 rounded-xl bg-pigeon-900 border border-pigeon-600 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-almond-600 block mb-0.5">Calculated Compatibility</span>
                  <p className="text-xs text-almond-200 font-medium">
                    {careerDetail.match.explanation}
                  </p>
                </div>
                <div className="text-right shrink-0 pl-4 border-l border-pigeon-600">
                  <span className="text-2xl font-extrabold text-acid-400 font-mono">
                    {careerDetail.match.match_percentage}%
                  </span>
                </div>
              </div>

              {/* Skill Gaps Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-almond-200 mb-3">
                  Skill Competency Checklist
                </h4>

                <div className="space-y-2">
                  {careerDetail.match.skill_gaps.map((gap: any) => (
                    <div 
                      key={gap.skill_id}
                      className="p-3 rounded-lg border border-pigeon-600 bg-pigeon-900 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {gap.status === 'Strong' ? (
                          <div className="w-5 h-5 rounded-full bg-acid-950 text-acid-400 flex items-center justify-center">
                            <CheckCircle size={14} weight="fill" />
                          </div>
                        ) : gap.status === 'Developing' ? (
                          <div className="w-5 h-5 rounded-full bg-pigeon-800 text-almond-200 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-almond-200"></span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-tomato-950 text-tomato-400 flex items-center justify-center">
                            <WarningCircle size={14} weight="fill" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-almond-200">{gap.skill_name}</span>
                          <span className="text-[10px] text-almond-600 block">
                            Expected: {gap.expected_level} · Importance: {gap.importance}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          gap.status === 'Strong'
                            ? 'bg-acid-950/60 text-acid-400 border border-acid-600/40'
                            : gap.status === 'Developing'
                            ? 'bg-pigeon-800 text-almond-200 border border-pigeon-600'
                            : 'bg-tomato-950/60 text-tomato-300 border border-tomato-500/40'
                        }`}>
                          {gap.status}
                        </span>

                        {gap.status === 'Missing' && (
                          <button
                            onClick={() => onSimulate(`What if I learn ${gap.skill_name}?`)}
                            className="text-[10px] px-2 py-0.5 rounded bg-pigeon-800 hover:bg-pigeon-700 text-almond-200 font-semibold border border-pigeon-600 transition-colors"
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
