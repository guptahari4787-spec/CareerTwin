import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Database, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal, 
  Building2, 
  Users,
  GraduationCap,
  Scale,
  Brain,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTier, setExpandedTier] = useState<string | null>('priority');

  useEffect(() => {
    api.getOverview()
      .then(res => setData(res))
      .catch(err => console.error('Failed to load overview:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-basil border-r-transparent mb-3" />
        <p className="text-xs font-medium text-cream-muted">Loading Workforce Intelligence Briefing...</p>
      </div>
    );
  }

  const metrics = data?.headline_metrics || {};
  const activeSession = data?.active_session || { name: 'CareerTwin Demo Benchmark', is_benchmark: true };

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Intelligence Header */}
      <div className="p-6 md:p-8 rounded-xl bg-surface border border-border shadow-card">
        <div className="max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
              CareerTwin 2.0 • Workforce Intelligence Brief
            </span>
            <span className="text-soil-500 text-xs">•</span>
            <span className="text-[11px] font-medium text-cream-muted font-mono">
              Status: {metrics.pipeline_status || 'OPERATIONAL'}
            </span>
            {!activeSession.is_benchmark && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tomato-soft text-tomato-300 border border-tomato-dark font-bold">
                DYNAMIC SESSION: {activeSession.name}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-cream-heading leading-tight">
            Connecting Skills, Demand and Success.
          </h1>
          
          <p className="text-sm md:text-base text-cream-secondary leading-relaxed max-w-3xl font-normal">
            CareerTwin connects <strong className="text-cream-heading font-semibold">17,443 market job postings</strong> with <strong className="text-cream-heading font-semibold">300 independent outcome observations</strong> to identify capability priorities using statistical testing and machine-learning validation.
          </p>
        </div>

        {/* Executive Plain-Language Briefing: What is CareerTwin Telling Me? */}
        <div className="mt-6 p-5 rounded-xl bg-surface-subtle border border-border space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-basil"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cream-heading font-mono">
              Executive Briefing: What is CareerTwin Telling Me?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-cream-muted uppercase block font-semibold">01 What We Found</span>
              <p className="text-cream text-[11px] leading-relaxed">
                Coding is an entry requirement, but <strong>Storytelling</strong> and <strong>Applied Statistics</strong> are the true differentiators for higher salary hikes.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-cream-muted uppercase block font-semibold">02 Key Market Signal</span>
              <p className="text-cream text-[11px] leading-relaxed">
                17,443 job postings show strong demand for Python and SQL, with mid-tier average salary at <strong>₹12.15 LPA</strong>.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-cream-muted uppercase block font-semibold">03 Key Outcome Signal</span>
              <p className="text-cream text-[11px] leading-relaxed">
                Junior practitioners proficient in visual communication show <strong>3.3x higher odds</strong> of achieving top progression tiers.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-cream-muted uppercase block font-semibold">04 What You Should Do</span>
              <p className="text-cream text-[11px] leading-relaxed">
                Prioritize communication and stats. Test your profile in the <strong>What-If Simulator</strong> or view the <strong>Alignment Matrix</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Research Pipeline (Question -> Answer -> Evidence -> Action) */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cream-muted mb-3">
            Analytical Evidence Pipeline (Non-destructive Ingestion & Dual-population Modeling)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            
            <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] font-mono text-cream-muted block">01 MARKET</span>
              <strong className="text-cream-heading font-bold block text-sm">
                {(metrics.total_job_postings_analyzed || 17443).toLocaleString()}
              </strong>
              <span className="text-[11px] text-cream-muted">Job Postings</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] font-mono text-cream-muted block">02 OUTCOMES</span>
              <strong className="text-cream-heading font-bold block text-sm">
                {(metrics.junior_outcome_profiles_jds || 139) + (metrics.senior_success_profiles_sds || 161)}
              </strong>
              <span className="text-[11px] text-cream-muted">Trajectory Profiles</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] font-mono text-basil block">03 STATISTICS</span>
              <strong className="text-cream-heading font-bold block text-sm">Welch & Mann-U</strong>
              <span className="text-[11px] text-cream-muted">FDR-adjusted Signals</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] font-mono text-basil block">04 ML VALIDATION</span>
              <strong className="text-cream-heading font-bold block text-sm">Logit & RF</strong>
              <span className="text-[11px] text-cream-muted">5-Fold CV Verified</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] font-mono text-basil block">05 ALIGNMENT</span>
              <strong className="text-cream-heading font-bold block text-sm">4 Tiers</strong>
              <span className="text-[11px] text-cream-muted">Priority to Watch</span>
            </div>

            <div className="p-2.5 rounded-lg bg-basil-soft border border-basil-dark">
              <span className="text-[10px] font-mono text-basil-300 block">06 DECISIONS</span>
              <strong className="text-cream-heading font-bold block text-sm">Actionable</strong>
              <span className="text-[11px] text-basil-400">4 Stakeholder Groups</span>
            </div>

          </div>
        </div>
      </div>

      {/* Executive KPI Strip */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cream-muted">
            Empirical Corpus Metrics
          </h2>
          <span className="text-[11px] font-mono text-cream-muted">
            {activeSession.is_benchmark ? '100% Real Datasets • Zero Synthetic Records' : 'Dynamic User Ingestion Active'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          
          <div className="p-4 rounded-lg bg-surface border border-border">
            <span className="text-[11px] text-cream-muted block">Market Postings</span>
            <div className="text-2xl font-black text-cream-heading mt-1 font-mono">
              {(metrics.total_job_postings_analyzed || 17443).toLocaleString()}
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Analytics + DS Postings</span>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <span className="text-[11px] text-cream-muted block">Outcome Observations</span>
            <div className="text-2xl font-black text-cream-heading mt-1 font-mono">
              {(metrics.junior_outcome_profiles_jds || 139) + (metrics.senior_success_profiles_sds || 161)}
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Independent Trajectories</span>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <span className="text-[11px] text-cream-muted block">Junior Cohort (JDS)</span>
            <div className="text-2xl font-black text-basil mt-1 font-mono">
              {metrics.junior_outcome_profiles_jds || 139}
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Technical Skill Profiles</span>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <span className="text-[11px] text-cream-muted block">Senior Cohort (SDS)</span>
            <div className="text-2xl font-black text-cream-heading mt-1 font-mono">
              {metrics.senior_success_profiles_sds || 161}
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Leadership Trait Profiles</span>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <span className="text-[11px] text-cream-muted block">Hiring Companies</span>
            <div className="text-2xl font-black text-cream-heading mt-1 font-mono">
              {metrics.unique_hiring_companies || 642}
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Verified Employers</span>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border bg-surface-subtle">
            <span className="text-[11px] text-cream block font-semibold">Average Salary</span>
            <div className="text-2xl font-black text-cream-heading mt-1 font-mono">
              ₹{metrics.avg_market_salary_lakhs || 12.15} LPA
            </div>
            <span className="text-[10px] text-cream-muted mt-1 block">Midpoint Compensation</span>
          </div>

        </div>

        {/* Clear Distinction Clarification */}
        <div className="mt-2 text-[11px] text-cream-muted px-1 font-mono flex flex-wrap items-center justify-between gap-2">
          <span>* 17,443 Market Postings = 15,841 Analytics + 1,602 DataScience Jobs.</span>
          <span>* 17,743 Total Records = 17,443 Market + 139 JDS + 161 SDS Profiles.</span>
        </div>
      </div>

      {/* Main Core Sections: 4-Tier Matrix Preview & Evidence Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Strategic Alignment Matrix Preview */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-cream-heading">
                Capability Alignment Matrix (4 Strategic Tiers)
              </h3>
              <p className="text-xs text-cream-muted mt-0.5">
                Observed Market Demand crossed with Junior Progression Impact (Cohen's d)
              </p>
            </div>
            <button
              onClick={() => onNavigate('alignment')}
              className="text-xs font-semibold text-basil hover:text-basil-400 flex items-center gap-1"
            >
              <span>Explore Full Engine</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* 4 Interactive Tiers with Progressive Disclosure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            
            {/* Priority Tier */}
            <div 
              onClick={() => setExpandedTier(expandedTier === 'priority' ? null : 'priority')}
              className="p-3.5 rounded-lg border border-basil-dark bg-basil-soft/60 space-y-2 cursor-pointer transition-all hover:border-basil"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-basil-300 uppercase text-[10px] tracking-wider">
                  Priority Tier
                </span>
                <span className="text-[10px] font-mono text-basil font-semibold">
                  High Demand • High Outcome
                </span>
              </div>
              <p className="text-cream text-[11px] leading-relaxed">
                Coding & Programming (Python/SQL), Mathematics & Statistics, Dashboard & Storytelling, AI & Machine Learning.
              </p>
              <div className="pt-2 border-t border-basil-dark text-[10px] text-basil-300 font-mono flex items-center justify-between">
                <span>Outcome Signal: Cohen's d: 0.44 to 1.32</span>
                {expandedTier === 'priority' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>
              {expandedTier === 'priority' && (
                <div className="p-2 rounded bg-surface border border-border text-[11px] text-cream-secondary mt-2 space-y-1">
                  <p><strong>Strategic Action:</strong> Core non-negotiable foundations for university syllabi and student portfolios.</p>
                </div>
              )}
            </div>

            {/* Investigate Tier */}
            <div 
              onClick={() => setExpandedTier(expandedTier === 'investigate' ? null : 'investigate')}
              className="p-3.5 rounded-lg border border-tomato-dark bg-tomato-soft/60 space-y-2 cursor-pointer transition-all hover:border-tomato"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-tomato-300 uppercase text-[10px] tracking-wider">
                  Investigate Tier
                </span>
                <span className="text-[10px] font-mono text-tomato-400 font-semibold">
                  High Demand • Low Outcome
                </span>
              </div>
              <p className="text-cream text-[11px] leading-relaxed">
                Big Data Infrastructure tools. Heavy market buzz in postings, but lower direct promotion correlation for junior cohorts.
              </p>
              <div className="pt-2 border-t border-tomato-dark text-[10px] text-tomato-300 font-mono flex items-center justify-between">
                <span>Outcome Signal: Cohen's d: 0.19 (Small)</span>
                {expandedTier === 'investigate' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>
              {expandedTier === 'investigate' && (
                <div className="p-2 rounded bg-surface border border-border text-[11px] text-cream-secondary mt-2 space-y-1">
                  <p><strong>Strategic Action:</strong> Necessary as entry filter, but do not overweight at the expense of statistical fundamentals.</p>
                </div>
              )}
            </div>

            {/* Opportunity Tier */}
            <div 
              onClick={() => setExpandedTier(expandedTier === 'opportunity' ? null : 'opportunity')}
              className="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-2 cursor-pointer transition-all hover:border-soil-400"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cream uppercase text-[10px] tracking-wider">
                  Opportunity Tier
                </span>
                <span className="text-[10px] font-mono text-cream-muted">
                  Moderate Demand • High Outcome
                </span>
              </div>
              <p className="text-cream-secondary text-[11px] leading-relaxed">
                Storytelling & Business Translation. Undersupplied in general job requirements but strongly predictive of early leadership.
              </p>
              <div className="pt-2 border-t border-border text-[10px] text-cream-muted font-mono flex items-center justify-between">
                <span>Outcome Signal: Cohen's d: 0.61 (Medium-Large)</span>
                {expandedTier === 'opportunity' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>
              {expandedTier === 'opportunity' && (
                <div className="p-2 rounded bg-surface border border-border text-[11px] text-cream-secondary mt-2 space-y-1">
                  <p><strong>Strategic Action:</strong> Competitive differentiator in campus placements and early career mobility.</p>
                </div>
              )}
            </div>

            {/* Watch Tier */}
            <div 
              onClick={() => setExpandedTier(expandedTier === 'watch' ? null : 'watch')}
              className="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-2 cursor-pointer transition-all hover:border-soil-400"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cream-muted uppercase text-[10px] tracking-wider">
                  Watch Tier
                </span>
                <span className="text-[10px] font-mono text-cream-muted">
                  Low Demand • Low Outcome
                </span>
              </div>
              <p className="text-cream-secondary text-[11px] leading-relaxed">
                Legacy or declining tool suites with diminishing market frequency and negligible promotion signal.
              </p>
              <div className="pt-2 border-t border-border text-[10px] text-cream-muted font-mono flex items-center justify-between">
                <span>Outcome Signal: Cohen's d &lt; 0.15</span>
                {expandedTier === 'watch' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>
              {expandedTier === 'watch' && (
                <div className="p-2 rounded bg-surface border border-border text-[11px] text-cream-secondary mt-2 space-y-1">
                  <p><strong>Strategic Action:</strong> Sunset in coursework; deprioritize in enterprise re-skilling programs.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quick Analytical Pathways */}
        <div className="p-5 rounded-xl bg-surface border border-border space-y-3.5">
          <h3 className="text-sm font-bold text-cream-heading pb-2 border-b border-border">
            Analytical Workspaces
          </h3>

          <div 
            onClick={() => onNavigate('data-quality')}
            className="p-3 rounded-lg border border-border hover:border-basil cursor-pointer transition-all bg-surface-subtle hover:bg-surface-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cream-heading">
                <Database size={14} className="text-basil" />
                <span>02 Data Quality Audit</span>
              </div>
              <span className="text-[10px] font-mono text-cream-muted">17.4k rows</span>
            </div>
            <p className="text-[11px] text-cream-muted mt-1">
              Transparent audit of missing values, normalizations, and cleaning logs.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('market-intel')}
            className="p-3 rounded-lg border border-border hover:border-basil cursor-pointer transition-all bg-surface-subtle hover:bg-surface-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cream-heading">
                <TrendingUp size={14} className="text-basil" />
                <span>03 Market Intelligence</span>
              </div>
              <span className="text-[10px] font-mono text-cream-muted">Postings</span>
            </div>
            <p className="text-[11px] text-cream-muted mt-1">
              Prevalence distributions, salary bands, and skill co-occurrence.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('junior-outcomes')}
            className="p-3 rounded-lg border border-border hover:border-basil cursor-pointer transition-all bg-surface-subtle hover:bg-surface-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cream-heading">
                <GraduationCap size={14} className="text-basil" />
                <span>04 Junior Outcomes (JDS)</span>
              </div>
              <span className="text-[10px] font-mono text-cream-muted">n=139</span>
            </div>
            <p className="text-[11px] text-cream-muted mt-1">
              Cohen's d, Welch t-test, and 5-fold cross-validated Random Forest models.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('what-if-math')}
            className="p-3 rounded-lg border border-basil-dark bg-basil-soft/40 hover:bg-basil-soft cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cream-heading">
                <SlidersHorizontal size={14} className="text-basil" />
                <span>08 What-If Simulator</span>
              </div>
              <span className="text-[10px] font-mono text-basil font-bold">Sensitivity</span>
            </div>
            <p className="text-[11px] text-cream-secondary mt-1">
              Evaluate scenario sensitivity with validated logistic regression weights.
            </p>
          </div>

          <div 
            onClick={() => onNavigate('upload')}
            className="p-3 rounded-lg border border-border hover:border-basil cursor-pointer transition-all bg-surface-subtle hover:bg-surface-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cream-heading">
                <FileSpreadsheet size={14} className="text-basil" />
                <span>10 Upload & Dynamic Ingestion</span>
              </div>
              <span className="text-[10px] font-mono text-cream-muted">Multi-Session</span>
            </div>
            <p className="text-[11px] text-cream-muted mt-1">
              Upload custom CSV/Excel datasets and run isolated sandbox analytics.
            </p>
          </div>

        </div>

      </div>

      {/* Methodological Evidence Synthesis Strip */}
      <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-card">
        <div className="px-6 py-4 border-b border-border bg-surface-subtle flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cream-heading">
              Methodological Evidence Foundations
            </h3>
            <p className="text-[11px] text-cream-muted">
              Dual-population separation, non-destructive cleaning, and non-deterministic ethical guardrails
            </p>
          </div>
          <button
            onClick={() => onNavigate('methodology')}
            className="text-[10px] font-mono bg-surface hover:bg-surface-elevated text-cream px-2.5 py-1 rounded border border-border flex items-center gap-1 transition-colors"
          >
            <span>Read Full Methodology</span>
            <ExternalLink size={11} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-cream-heading flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-basil" />
              1. Population Separation
            </h4>
            <p className="text-cream-secondary leading-relaxed">
              Job Postings (17,443) measure aggregate macro demand. Outcomes (300) evaluate individual human progression. Row-level merges across these distinct populations are strictly avoided.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-cream-heading flex items-center gap-1.5">
              <Scale size={14} className="text-basil" />
              2. Statistical Rigor
            </h4>
            <p className="text-cream-secondary leading-relaxed">
              Every progression finding is evaluated via dual hypothesis testing (Welch's t-test and Mann-Whitney U), standard deviation normalized Cohen's d effect sizes, and Benjamini-Hochberg FDR adjustments.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-cream-heading flex items-center gap-1.5">
              <Brain size={14} className="text-basil" />
              3. Ethical Disclaimers
            </h4>
            <p className="text-cream-secondary leading-relaxed">
              Association does not equal causation. What-if scenarios compute parametric model sensitivity, not wage guarantees. Personality traits are observational and barred from standalone hiring gates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
