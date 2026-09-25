import React, { useState, useEffect } from 'react';
import { Buildings, ArrowRight, ShieldCheck, ChartBar, LightbulbFilament } from '@phosphor-icons/react';
import { UniversityInsightsResponse } from '../../types';
import { api } from '../../services/api';

export const UniversityInsightsView: React.FC = () => {
  const [data, setData] = useState<UniversityInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUniversityInsights()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-muted">
        Loading aggregated university cohort insights...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <Buildings size={16} />
            <span>Curriculum & Industry Alignment</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">
            {data.university_name}: Cohort Insights
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Aggregated cohort analysis for {data.cohort_degree}. Preserves 100% student privacy while providing department heads with actionable data to close systemic curricular skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold shrink-0">
          <ShieldCheck size={16} weight="fill" />
          <span>Anonymized & Non-PII</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface border border-border">
          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Students Analyzed</span>
          <span className="text-3xl font-extrabold text-charcoal font-mono">{data.total_students_analyzed}</span>
          <span className="text-[11px] text-muted block mt-1">Class of 2026 Batch</span>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border">
          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Average Readiness</span>
          <span className="text-3xl font-extrabold text-accent font-mono">{data.average_career_readiness}%</span>
          <span className="text-[11px] text-emerald-600 block mt-1">+6% over previous cohort</span>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border">
          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Industry Alignment</span>
          <span className="text-3xl font-extrabold text-charcoal font-mono">{data.industry_alignment_score}</span>
          <span className="text-[11px] text-muted block mt-1">High Technical Placement Signal</span>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border">
          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Priority Training Areas</span>
          <span className="text-3xl font-extrabold text-amber-600 font-mono">3</span>
          <span className="text-[11px] text-muted block mt-1">Cloud, DevOps & Containers</span>
        </div>
      </div>

      {/* 2-Column Section: Common Skill Gaps vs Industry Demand Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Common Skill Gaps in Student Cohort */}
        <div className="p-6 rounded-xl bg-surface border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal">
              Cohort-Wide Skill Gaps
            </h3>
            <span className="text-[10px] text-muted font-medium">Frequency in Cohort</span>
          </div>

          <div className="space-y-3">
            {data.common_skill_gaps.map((gap) => (
              <div key={gap.skill_name} className="p-3.5 rounded-lg bg-surface-subtle border border-border text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-charcoal">{gap.skill_name}</span>
                  <span className="font-mono text-amber-700 font-semibold">{gap.missing_percentage}% Missing</span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${gap.missing_percentage}%` }} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span>Impacted Roles: {gap.impacted_roles.join(', ')}</span>
                  <span className="font-semibold text-rose-700 uppercase">{gap.urgency} Urgency</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Industry Demand vs Cohort Supply */}
        <div className="p-6 rounded-xl bg-surface border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal">
              Industry Demand vs Cohort Readiness
            </h3>
            <span className="text-[10px] text-muted font-medium">Market Discrepancy</span>
          </div>

          <div className="space-y-3">
            {data.industry_demand_alignment.map((row) => (
              <div key={row.career_title} className="p-3.5 rounded-lg bg-surface-subtle border border-border text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-charcoal">{row.career_title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    row.alignment_status.includes('Severe')
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : row.alignment_status.includes('Moderate')
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {row.alignment_status}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-muted">
                  <span>Market Demand: <strong className="text-charcoal">{row.industry_demand}</strong></span>
                  <span>Cohort Ready: <strong className="font-mono text-charcoal">{row.cohort_readiness}%</strong></span>
                </div>

                <p className="text-[11px] text-accent font-medium pt-1 border-t border-border">
                  Recommended Action: {row.recommended_action}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended University Training Bootcamps */}
      <div className="p-6 rounded-xl bg-surface border border-border shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-charcoal">
          Recommended University Training Programs
        </h3>
        <p className="text-xs text-muted">
          Structured interventions to systematically elevate placement readiness for the entire CSE cohort:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recommended_university_programs.map((prog) => (
            <div key={prog.title} className="p-4 rounded-xl bg-surface-subtle border border-border flex flex-col justify-between text-xs space-y-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-accent block mb-1">
                  {prog.target_gap}
                </span>
                <h4 className="font-bold text-charcoal leading-snug">{prog.title}</h4>
                <p className="text-[11px] text-muted mt-1">{prog.format}</p>
              </div>

              <div className="pt-3 border-t border-border text-[11px] space-y-1">
                <span className="text-emerald-700 font-bold block">{prog.estimated_impact}</span>
                <span className="text-[10px] text-slate-500 block">Partner: {prog.industry_partner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry -> Student -> University Loop Visualization */}
      <div className="p-6 rounded-xl bg-surface border border-border shadow-subtle space-y-3">
        <h3 className="text-sm font-bold text-charcoal">
          The CareerTwin Closed-Loop Ecosystem
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          How real-time student simulations and industry hiring standards inform institutional curriculum upgrades:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs pt-2">
          {Object.entries(data.ecosystem_loop).map(([stepKey, stepText], idx) => (
            <div key={stepKey} className="p-3 rounded-lg bg-surface-subtle border border-border flex flex-col justify-between">
              <span className="font-mono text-[10px] font-bold text-accent block mb-1">
                0{idx + 1}
              </span>
              <p className="text-[11px] font-medium text-slate-700 leading-snug">
                {stepText}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
