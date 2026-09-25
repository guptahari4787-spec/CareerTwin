import React, { useState } from 'react';
import { 
  Lightning, 
  Sparkle, 
  Check, 
  ArrowRight, 
  CheckCircle, 
  WarningCircle,
  TrendUp,
  Info,
  GraduationCap,
  Certificate,
  FolderSimple,
  Target
} from '@phosphor-icons/react';
import { WhatIfResponse, StudentProfile } from '../../types';
import { api } from '../../services/api';

interface WhatIfSimulatorViewProps {
  profile: StudentProfile | null;
  onProfileUpdated: () => void;
  initialQuery?: string;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  profile,
  onProfileUpdated,
  initialQuery = "What if I learn AWS?"
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<WhatIfResponse | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = [
    "What if I learn AWS?",
    "What if I learn Docker?",
    "What if I learn Kubernetes?",
    "What if I learn AI?",
    "What if I complete AWS Cloud Practitioner?",
    "What if I get Microsoft Certified: Azure Fundamentals?",
    "What skills do I need for Cloud Engineer?",
    "What am I missing for DevOps?",
    "What should I learn next?",
    "What course should I take for AWS?"
  ];

  const handleSimulate = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    setApplySuccessMessage(null);

    try {
      const res = await api.simulateWhatIf(searchQuery, profile?.target_career_id);
      setSimulationResult(res);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to run simulation. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!simulationResult || !simulationResult.simulated_addition.length) return;
    setApplying(true);
    try {
      const res = await api.applySimulation(simulationResult.simulated_addition);
      setApplySuccessMessage(res.message);
      onProfileUpdated();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to apply skills to profile.");
    } finally {
      setApplying(false);
    }
  };

  // Initial simulation trigger on mount
  React.useEffect(() => {
    handleSimulate(initialQuery);
  }, []);

  const getIntentBadgeLabel = (intent: string) => {
    switch (intent) {
      case 'skill_simulation':
        return 'Skill Simulation';
      case 'certification_simulation':
        return 'Certification Simulation';
      case 'career_requirements':
        return 'Career Requirements';
      case 'skill_gap_query':
        return 'Gap Analysis';
      case 'next_skill_recommendation':
        return 'Strategic Recommendation';
      case 'learning_resource':
        return 'Curated Learning Resource';
      default:
        return 'Career Intelligence';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Simulator Prompt Area */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
            <Lightning size={16} weight="fill" />
            <span>Interactive Career Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">
            What-If Career Simulator
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Test career hypotheses before committing study hours. CareerTwin recalculates multi-role compatibility, explains causal score shifts, identifies residual gaps, and prescribes your single next bottleneck action.
          </p>
        </div>

        {/* Natural Language Prompt Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSimulate(); }}
          className="mt-5 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What if I learn AWS? What if I learn Kubernetes? What am I missing for DevOps?"
              className="w-full bg-surface-subtle border border-border rounded-lg px-4 py-3 text-xs text-charcoal font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-charcoal hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
          >
            <Sparkle size={15} weight="fill" />
            <span>{loading ? "Simulating..." : "Simulate Hypothesis"}</span>
          </button>
        </form>

        {/* 10 Quick Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
          <span className="text-[11px] text-muted self-center mr-1">Quick Simulations:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setQuery(preset);
                handleSimulate(preset);
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-surface-subtle hover:bg-slate-100 text-slate-700 border border-border transition-colors font-medium"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Error / Success Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <WarningCircle size={16} weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}

      {applySuccessMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle size={16} weight="fill" />
          <span>{applySuccessMessage}</span>
        </div>
      )}

      {/* SIMULATION ADVISOR RESULTS (8-Stage Causal Structure) */}
      {simulationResult && (
        <div className="space-y-6">

          {/* STAGE 1: DIRECT ANSWER & HERO DELTA BANNER */}
          <div className="bg-surface border border-indigo-100 rounded-xl p-6 shadow-subtle bg-gradient-to-r from-indigo-50/40 via-white to-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider text-[10px]">
                    {getIntentBadgeLabel(simulationResult.intent)}
                  </span>
                  <span className="text-muted font-medium">Entity: <strong className="text-charcoal">{simulationResult.entity_name}</strong></span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-sm">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                    Direct Career Advisor Assessment
                  </span>
                  <p className="text-sm font-semibold text-charcoal leading-relaxed">
                    {simulationResult.direct_answer}
                  </p>
                </div>

                {/* Quantitative Comparison Strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Baseline Fit:</span>
                    <span className="font-mono font-bold text-charcoal">{simulationResult.original_match_percentage}%</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-400" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Simulated Fit:</span>
                    <span className="font-mono font-bold text-indigo-700">{simulationResult.simulated_match_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Net Delta:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      simulationResult.percentage_delta > 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {simulationResult.percentage_delta > 0 ? `+${simulationResult.percentage_delta}%` : `${simulationResult.percentage_delta}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Add to Master Profile */}
              {simulationResult.can_apply && (
                <div className="shrink-0 self-start md:self-center">
                  <button
                    onClick={handleApplyToProfile}
                    disabled={applying}
                    className="px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check size={16} weight="bold" />
                    <span>{applying ? "Applying to Profile..." : `Add ${simulationResult.entity_name} to My Profile`}</span>
                  </button>
                  <span className="text-[10px] text-muted block text-center mt-1">
                    Permanently updates your master skill inventory
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* STAGE 2 & STAGE 4: BENEFIT / WHY DOES IT MATTER & EVALUATION LOGIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stage 2: Benefit & Career Impact */}
            <div className="p-5 bg-surface rounded-xl border border-border flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <TrendUp size={16} weight="bold" />
                  <span>Why Does It Matter?</span>
                </div>
                <h3 className="text-sm font-bold text-charcoal mb-2">
                  Career Benefit and Market Value
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {simulationResult.benefit_summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-[11px] text-slate-600">
                <Target size={14} className="text-emerald-600" />
                <span>Expands candidate qualification against current hiring benchmarks</span>
              </div>
            </div>

            {/* Stage 4: Why It Changes (Causal Model Logic) */}
            <div className="p-5 bg-surface rounded-xl border border-border flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <Info size={16} weight="bold" />
                  <span>Causal Logic</span>
                </div>
                <h3 className="text-sm font-bold text-charcoal mb-2">
                  Why the Match Percentage Changes
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {simulationResult.why_it_changes}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-[11px] text-slate-600">
                <span className="font-mono text-xs font-bold text-indigo-700">Weight Multiplier</span>
                <span>Deterministic assessment grounded in transparent curriculum weights</span>
              </div>
            </div>

          </div>

          {/* STAGE 3: MULTI-CAREER FIT MATRIX (What Changes & What Does Not Change) */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
                  Multi-Role Impact Matrix
                </span>
                <h3 className="text-sm font-bold text-charcoal">
                  What Changes and What Remains Flat
                </h3>
              </div>
              <span className="text-xs text-muted">
                Evaluated against 5 primary industry career paths
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {simulationResult.career_impacts.map((ci) => (
                <div key={ci.career_id} className="p-3.5 rounded-lg bg-surface-subtle border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start text-xs font-semibold text-charcoal mb-1.5">
                      <span className="truncate pr-2">{ci.career_title}</span>
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        ci.delta > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ci.delta > 0 ? `+${ci.delta}%` : `${ci.delta}%`}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex my-2">
                      <div className="bg-slate-400 h-full" style={{ width: `${ci.before_percentage}%` }} />
                      <div className="bg-emerald-500 h-full" style={{ width: `${Math.max(ci.delta, 0)}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] text-muted font-mono mb-2">
                      <span>Baseline: {ci.before_percentage}%</span>
                      <span className="text-charcoal font-semibold">Simulated: {ci.after_percentage}%</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal pt-2 border-t border-border/60">
                    {ci.reason || (ci.delta > 0 ? "Satisfies curriculum requirements." : "Not in primary benchmark.")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE 5 & STAGE 6: WHAT IS STILL MISSING & RECOMMENDED NEXT STEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Stage 5: What Is Still Missing (Residual Gaps) */}
            <div className="p-5 bg-surface rounded-xl border border-amber-200 bg-amber-50/20 flex flex-col justify-between shadow-subtle">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Honest Gap Assessment
                </span>
                <h3 className="text-sm font-bold text-charcoal mb-2">
                  What You Still Need
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  {simulationResult.what_is_still_missing}
                </p>

                <div className="space-y-2">
                  {simulationResult.remaining_gaps.filter(g => g.status === 'Missing').slice(0, 3).map((g) => (
                    <div key={g.skill_id} className="p-2.5 rounded-lg bg-white border border-amber-200/80 text-xs">
                      <div className="flex justify-between items-center font-bold text-charcoal">
                        <span>{g.skill_name}</span>
                        <span className="text-[10px] text-amber-700 font-mono uppercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {g.importance}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted mt-0.5 block">
                        Category: {g.category} · Expected Proficiency: {g.expected_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage 6: Recommended Next Step (Single Clear Bottleneck Action) */}
            <div className="p-5 bg-surface rounded-xl border border-indigo-200 bg-indigo-50/20 flex flex-col justify-between shadow-subtle">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
                  Actionable Next Move
                </span>
                <h3 className="text-sm font-bold text-charcoal mb-2">
                  Recommended Immediate Bottleneck Action
                </h3>
                
                <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm mt-3 mb-4">
                  <div className="flex items-start gap-2.5">
                    <Sparkle size={18} className="text-accent shrink-0 mt-0.5" weight="fill" />
                    <p className="text-xs font-semibold text-charcoal leading-relaxed">
                      {simulationResult.recommended_next_step}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Focusing on a single priority bottleneck avoids cognitive overload and produces the fastest measurable qualification gains for your target career.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-100 text-[11px] text-indigo-700 font-semibold flex items-center gap-1.5">
                <span>Highest-leverage sequential milestone</span>
              </div>
            </div>

          </div>

          {/* STAGE 7: TARGETED LEARNING & CERTIFICATIONS (Zero Cross-Contamination) */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
                  Verified Curricula & Credentials
                </span>
                <h3 className="text-sm font-bold text-charcoal">
                  Targeted Learning Resources for Remaining Gaps
                </h3>
              </div>
              <span className="text-xs text-muted">
                Strictly matched to verified gaps without technology cross-contamination
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulationResult.recommendations.slice(0, 6).map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-surface-subtle border border-border flex flex-col justify-between hover:border-slate-300 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                        rec.type === 'course' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : rec.type === 'certification' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rec.type === 'course' && <GraduationCap size={12} weight="bold" />}
                        {rec.type === 'certification' && <Certificate size={12} weight="bold" />}
                        {rec.type === 'project' && <FolderSimple size={12} weight="bold" />}
                        <span>{rec.type}</span>
                      </span>
                      <span className="text-[10px] text-muted font-medium truncate">{rec.provider_or_issuer}</span>
                    </div>

                    <h4 className="text-xs font-bold text-charcoal mb-1.5 line-clamp-2">
                      {rec.title}
                    </h4>

                    <p className="text-[11px] text-muted leading-relaxed line-clamp-3 mb-3">
                      {rec.why_recommended}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-mono">{rec.duration_or_effort}</span>
                    {rec.url && (
                      <a 
                        href={rec.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-accent hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>View Guide</span>
                        <ArrowRight size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STAGE 8: DYNAMIC UPDATED ROADMAP */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
                Chronological Execution Plan
              </span>
              <h3 className="text-sm font-bold text-charcoal">
                Simulated Learning Roadmap
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Dependency-ordered phase timeline to achieve full career qualification:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {simulationResult.updated_roadmap.map((step) => (
                <div key={step.order} className="p-4 rounded-xl bg-surface-subtle border border-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-accent">Phase {step.order}</span>
                      <span className="text-[10px] text-muted font-medium">{step.estimated_duration}</span>
                    </div>
                    <h4 className="text-xs font-bold text-charcoal mb-1">{step.skill_name}</h4>
                    <p className="text-[11px] text-muted leading-relaxed mb-3">
                      {step.why_it_matters}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border text-[10px] text-slate-500 space-y-1">
                    <div>
                      Prerequisites: <span className="font-semibold text-charcoal">{step.prerequisites.join(", ")}</span>
                    </div>
                    <div>
                      Course: <span className="font-semibold text-charcoal truncate block">{step.recommended_course || "Core Practice"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
