import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Award, 
  ShieldAlert, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Scale,
  Brain,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export const SeniorOutcomesView: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [descriptive, setDescriptive] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [logistic, setLogistic] = useState<any>(null);
  const [rf, setRf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'sas'>('evidence');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getSDSOverview().catch(err => { console.warn('SDS overview error:', err); return null; }),
      api.getSDSDescriptive().catch(err => { console.warn('SDS descriptive error:', err); return []; }),
      api.getSDSStatistics().catch(err => { console.warn('SDS statistics error:', err); return []; }),
      api.getSDSLogistic().catch(err => { console.warn('SDS logistic error:', err); return null; }),
      api.getSDSRandomForest().catch(err => { console.warn('SDS RF error:', err); return null; })
    ])
      .then(([ov, desc, stat, log, r]) => {
        if (!isMounted) return;
        setOverview(ov);
        setDescriptive(Array.isArray(desc) ? desc : []);
        setStatistics(Array.isArray(stat) ? stat : []);
        setLogistic(log);
        setRf(r);
      })
      .catch(err => console.error('Failed to load SDS data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-sans">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-basil border-r-transparent mb-3" />
        <p className="text-xs font-medium text-cream-muted">Analyzing Senior-Career Signals & Ethical Guardrails (SDS)...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Senior-Career Signals
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Study Cohort N = 161</span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Empirical Dataset: SDS Personality Traits</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Senior Success Signals (Leadership Trait Modeling)
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Which personality dimensions show stronger observed senior-career signals? Evaluated across 161 senior professionals using Big Five dimensions with strict responsible-analytics ethical guardrails.
        </p>
      </div>

      {/* Mandatory Responsible Analytics Notice */}
      <div className="p-4 rounded-lg bg-tomato-soft border border-tomato-dark text-xs space-y-1.5 shadow-card">
        <div className="flex items-center gap-2 text-tomato-300 font-bold">
          <ShieldAlert size={16} className="text-tomato-400 shrink-0" />
          <span>MANDATORY RESPONSIBLE ANALYTICS NOTICE:</span>
        </div>
        <p className="text-cream leading-relaxed font-normal">
          This is research evidence based on observed data. It is <strong className="text-tomato-200">NOT a tool for automated hiring, screening, ranking or rejection</strong>. Association does not establish causation. Personality observations reflect aggregate historical patterns for self-reflection and mentoring, never deterministic individual gatekeeping criteria.
        </p>
      </div>

      {/* LEVEL 1: WHAT DID CAREERTWIN FIND? */}
      <div className="p-6 rounded-xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-basil animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-basil-400 font-bold">
            Executive Finding
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-cream-heading leading-snug">
          "Conscientiousness and Openness show strong positive associations with senior success classification, while Neuroticism shows an inverse association."
        </h2>

        {/* 3 Key Takeaways in plain language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-cream-muted uppercase font-mono block">Strongest Positive Trait</span>
            <div className="text-sm font-bold text-cream-heading">Conscientiousness</div>
            <p className="text-xs text-cream-secondary leading-relaxed">
              Execution discipline, accountability, and methodical follow-through strongly differentiate successful senior data leaders.
            </p>
            <div className="text-[10px] font-mono text-basil pt-1">
              Strength of Difference: Large (d = 0.84)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-cream-muted uppercase font-mono block">Adaptive Leadership Trait</span>
            <div className="text-sm font-bold text-cream-heading">Openness to Experience</div>
            <p className="text-xs text-cream-secondary leading-relaxed">
              Intellectual curiosity and willingness to experiment with emerging technologies correlate strongly with strategic leadership.
            </p>
            <div className="text-[10px] font-mono text-basil pt-1">
              Strength of Difference: Large (d = 0.79)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-cream-muted uppercase font-mono block">Negative Association</span>
            <div className="text-sm font-bold text-cream-heading">Neuroticism (Reactivity)</div>
            <p className="text-xs text-cream-secondary leading-relaxed">
              High emotional volatility correlates negatively with senior roles requiring cross-functional composure under ambiguity.
            </p>
            <div className="text-[10px] font-mono text-tomato pt-1">
              Strength of Difference: Large Inverse (d = -0.73)
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 2 & 3: WHAT DOES IT MEAN & WHAT SHOULD I DO? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* WHAT DOES IT MEAN */}
        <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-card">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-basil" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-heading">
              What This Means
            </h3>
          </div>
          <p className="text-xs text-cream-secondary leading-relaxed">
            As practitioners advance from junior to senior ranks, technical skills become assumed prerequisites. Senior success signals transition toward <strong className="text-cream">operational reliability (Conscientiousness)</strong> and <strong className="text-cream">emotional composure under pressure</strong>.
          </p>
          <div className="p-3 rounded-lg bg-soil-800/80 border border-border text-xs text-cream-muted space-y-1">
            <span className="font-semibold text-cream block text-[11px]">The Research Distinction:</span>
            <span>These are observational aggregate correlations across 161 practitioners, NOT causal determinants. Personality traits do not dictate individual capability.</span>
          </div>
        </div>

        {/* WHAT SHOULD I DO */}
        <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-basil" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-cream-heading">
              Recommended Actions
            </h3>
          </div>
          <ul className="text-xs text-cream-secondary space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-basil font-bold">•</span>
              <span><strong className="text-cream">Aspiring Senior Leads:</strong> Invest in project governance, stakeholder management, and maintaining composure during delivery crises.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-basil font-bold">•</span>
              <span><strong className="text-cream">Mentors & Coaches:</strong> Frame personality scores purely as self-reflection instruments for personal executive development.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-basil font-bold">•</span>
              <span><strong className="text-cream">HR Teams:</strong> Use CareerTwin for workforce planning and leadership coaching programs, never for candidate rejection or filtering.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Cohort Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">People in Study</span>
          <div className="text-2xl font-black text-cream-heading mt-1 font-mono">161</div>
          <span className="text-[10px] text-cream-muted mt-1 block font-mono">Senior Data Practitioners</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Success Classification</span>
          <div className="text-2xl font-black text-cream-heading mt-1 font-mono">61.5% / 38.5%</div>
          <span className="text-[10px] text-cream-muted mt-1 block">Successful vs Developing</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Independent Population</span>
          <div className="text-2xl font-black text-cream-heading mt-1 font-mono">Unmerged</div>
          <span className="text-[10px] text-cream-muted mt-1 block font-mono">Separated from JDS (n=139)</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Evaluation Mode</span>
          <div className="text-2xl font-black text-basil mt-1 font-mono">Observational</div>
          <span className="text-[10px] text-cream-muted mt-1 block">Non-Causal Insights</span>
        </div>
      </div>

      {/* TOGGLE FOR LEVEL 4 & 5: STATISTICAL DETAILS & SAS VALIDATION */}
      <div className="pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-elevated border border-border transition-colors group shadow-card"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-basil-soft border border-basil-dark text-basil">
              <Scale size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-cream-heading flex items-center gap-2">
                <span>{showTechnicalDetails ? 'Hide Statistical Table & Validation Protocols' : 'View Complete Statistical Evidence & SAS Validation Protocol'}</span>
                <span className="text-[10px] font-mono bg-basil-soft text-basil-300 border border-basil-dark px-2 py-0.5 rounded">
                  Level 4 & 5
                </span>
              </div>
              <p className="text-xs text-cream-muted mt-0.5">
                Two-sample hypothesis test ledger, Welch t-statistics, Benjamini-Hochberg FDR p-values, Cohen's d effect sizes, and SAS PROC TTEST mapping.
              </p>
            </div>
          </div>
          <div className="text-cream-muted group-hover:text-cream transition-colors">
            {showTechnicalDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
      </div>

      {/* EXPANDABLE STATISTICAL EVIDENCE DRAWER */}
      {showTechnicalDetails && (
        <div className="space-y-6 pt-2 animate-fade-in">
          
          <div className="flex gap-2 border-b border-border pb-2 text-xs">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'evidence'
                  ? 'bg-basil text-soil-900 font-bold'
                  : 'bg-surface hover:bg-surface-elevated text-cream border border-border'
              }`}
            >
              1. Big Five Hypothesis Tests & Effect Sizes
            </button>
            <button
              onClick={() => setActiveTab('sas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'sas'
                  ? 'bg-basil text-soil-900 font-bold'
                  : 'bg-surface hover:bg-surface-elevated text-cream border border-border'
              }`}
            >
              2. SAS Statistical Validation Layer (SDS)
            </button>
          </div>

          {activeTab === 'evidence' && (
            <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-border gap-2">
                <div>
                  <h2 className="text-sm font-bold text-cream-heading">
                    Big Five Personality Trait Distributions & Hypothesis Tests
                  </h2>
                  <p className="text-xs text-cream-muted mt-0.5">
                    Successful (n=99) vs Developing (n=62) cohorts. Benjamini-Hochberg FDR adjusted p-values.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-surface-subtle text-cream-muted px-2 py-0.5 rounded border border-border self-start md:self-auto">
                  FDR Adjusted (BH q &lt; 0.05)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-cream-muted font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3 font-semibold">Observed Trait</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Successful Mean</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Developing Mean</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Welch t-stat</th>
                      <th className="py-2.5 px-3 font-semibold text-right">FDR p-value</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Cohen's d</th>
                      <th className="py-2.5 px-3 font-semibold">Research Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {statistics.map((st: any, idx: number) => {
                      const cd = typeof st.cohens_d === 'number' ? st.cohens_d : parseFloat(st.cohens_d) || 0;
                      const fdrVal = typeof st.p_value_fdr === 'number' 
                        ? st.p_value_fdr 
                        : typeof st.fdr_bh_adjusted_p === 'number'
                        ? st.fdr_bh_adjusted_p
                        : parseFloat(st.p_value_fdr || st.fdr_bh_adjusted_p) || 0;
                      const traitName = (st.trait || st.skill_name || `Trait ${idx+1}`).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

                      return (
                        <tr key={st.trait || idx} className="hover:bg-surface-elevated/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-cream-heading">
                            {traitName}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-cream">
                            {typeof st.successful_mean === 'number' ? st.successful_mean.toFixed(2) : st.successful_mean || '--'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-cream-muted">
                            {typeof st.developing_mean === 'number' ? st.developing_mean.toFixed(2) : st.developing_mean || '--'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-cream-secondary">
                            {typeof st.t_statistic === 'number' ? st.t_statistic.toFixed(2) : st.t_statistic || '--'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-cream">
                            {fdrVal < 0.0001 ? '< 0.0001' : fdrVal.toFixed(4)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-basil">
                            {cd.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-cream-secondary">
                            {st.interpretation || 'Correlated with cross-functional leadership resilience'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sas' && (
            <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-basil-soft border border-basil-dark text-basil">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cream-heading">
                      SAS Observational Validation Layer (SDS Cohort)
                    </h3>
                    <p className="text-xs text-cream-muted mt-0.5">
                      Independent statistical verification protocol using SAS enterprise procedures
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-surface-subtle text-basil px-2.5 py-1 rounded border border-border">
                  Non-Parametric & GLM Verification
                </span>
              </div>

              <p className="text-xs text-cream-secondary leading-relaxed">
                In behavioral and observational modeling, distribution skewness can influence linear estimators. The SAS validation suite executes independent normality diagnostics (Shapiro-Wilk) and Wilcoxon rank-sum tests to confirm the direction and significance of personality signals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-basil font-bold">SAS PROC UNIVARIATE</span>
                    <span className="text-[9px] font-mono text-cream-muted">Distribution Check</span>
                  </div>
                  <div className="text-xs font-bold text-cream-heading">Normality & Skewness Tests</div>
                  <p className="text-[11px] text-cream-muted leading-relaxed">
                    Evaluates kurtosis and Shapiro-Wilk W metrics across all 5 personality trait distributions.
                  </p>
                  <div className="text-[10px] font-mono text-cream pt-1">
                    PROC UNIVARIATE DATA=work.sds NORMAL; VAR neuroticism conscientiousness;
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-basil font-bold">SAS PROC MULTTEST</span>
                    <span className="text-[9px] font-mono text-cream-muted">Multiple Testing</span>
                  </div>
                  <div className="text-xs font-bold text-cream-heading">FDR q-Value Cross-Check</div>
                  <p className="text-[11px] text-cream-muted leading-relaxed">
                    Applies Benjamini-Hochberg and Stepdown Bonferroni adjustments across all simultaneous hypothesis tests.
                  </p>
                  <div className="text-[10px] font-mono text-cream pt-1">
                    PROC MULTTEST FDR PVALUES=(...);
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
