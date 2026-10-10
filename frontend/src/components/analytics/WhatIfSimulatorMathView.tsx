import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldAlert, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  Minus 
} from 'lucide-react';

export const WhatIfSimulatorMathView: React.FC = () => {
  // Baseline profile (defaults to representative junior baseline: 3.5 across skills)
  const defaultBaseline = {
    coding_skills: 3.5,
    maths_stats_skills: 3.5,
    dashboard_and_storytelling_skills: 3.5,
    ai_and_ml_skills: 3.5,
    big_data_skills: 3.5
  };

  const [baseline, setBaseline] = useState(defaultBaseline);
  const [scenario, setScenario] = useState(defaultBaseline);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async (currBaseline = baseline, currScenario = scenario, name = "Custom User Scenario") => {
    setLoading(true);
    try {
      const payload = {
        scenario_name: name,
        baseline_coding: currBaseline.coding_skills,
        baseline_maths_stats: currBaseline.maths_stats_skills,
        baseline_dashboard_and_storytelling: currBaseline.dashboard_and_storytelling_skills,
        baseline_ai_and_ml: currBaseline.ai_and_ml_skills,
        baseline_big_data: currBaseline.big_data_skills,
        coding_skills: currScenario.coding_skills,
        maths_stats_skills: currScenario.maths_stats_skills,
        dashboard_and_storytelling_skills: currScenario.dashboard_and_storytelling_skills,
        ai_and_ml_skills: currScenario.ai_and_ml_skills,
        big_data_skills: currScenario.big_data_skills
      };

      const res = await api.simulateWhatIfMath(payload);
      setResult(res);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(defaultBaseline, defaultBaseline, "Baseline Profile Initial");
  }, []);

  const handleSliderChange = (skill: string, value: number) => {
    const updated = { ...scenario, [skill]: value };
    setScenario(updated);
    runSimulation(baseline, updated, `Skill Adjustment: ${skill}`);
  };

  const applyIntervention = (type: string) => {
    let nextScenario = { ...baseline };
    let label = "";

    if (type === 'storytelling') {
      nextScenario.dashboard_and_storytelling_skills = Math.min(5.0, baseline.dashboard_and_storytelling_skills + 1.2);
      label = "Storytelling Intervention (+1.2)";
    } else if (type === 'stats') {
      nextScenario.maths_stats_skills = Math.min(5.0, baseline.maths_stats_skills + 1.2);
      label = "Applied Statistics Intervention (+1.2)";
    } else if (type === 'coding_stats') {
      nextScenario.coding_skills = Math.min(5.0, baseline.coding_skills + 1.0);
      nextScenario.maths_stats_skills = Math.min(5.0, baseline.maths_stats_skills + 1.0);
      label = "Coding + Statistics Mastery";
    } else if (type === 'big_data') {
      nextScenario.big_data_skills = Math.min(5.0, baseline.big_data_skills + 1.2);
      label = "Big Data Infrastructure Focus";
    }

    setScenario(nextScenario);
    runSimulation(baseline, nextScenario, label);
  };

  const resetToBaseline = () => {
    setScenario(baseline);
    runSimulation(baseline, baseline, "Reset to Baseline");
  };

  const delta = result?.delta_percentage_points ?? 0.0;
  const isZero = Math.abs(delta) < 0.01;
  const isPositive = delta > 0.01;

  const skillFields = [
    { id: 'coding_skills', label: 'Coding & Programming (Python/SQL)', or: '2.85x' },
    { id: 'maths_stats_skills', label: 'Mathematics & Applied Statistics', or: '4.27x' },
    { id: 'dashboard_and_storytelling_skills', label: 'Dashboard & Business Storytelling', or: '3.27x' },
    { id: 'ai_and_ml_skills', label: 'AI & Machine Learning Concepts', or: '2.84x' },
    { id: 'big_data_skills', label: 'Big Data Distributed Systems', or: '2.12x' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Interactive Scenario Analysis
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Validated JDS Model Weights</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Try a Career Scenario (What-If Simulator)
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Choose a capability, adjust its proficiency level, and explore how the fitted logistic regression model predicts early-career progression shifts.
        </p>
      </div>

      {/* Mandatory Responsible Analytics Disclaimer */}
      <div className="p-4 rounded-lg bg-tomato-soft border border-tomato-dark text-xs space-y-1 shadow-card">
        <div className="flex items-center gap-2 text-tomato-300 font-bold">
          <ShieldAlert size={15} className="text-tomato-400 shrink-0" />
          <span>RESPONSIBLE ANALYTICS NOTICE:</span>
        </div>
        <p className="text-cream leading-relaxed font-normal">
          This is a model-based scenario, not a guarantee of future career or salary outcomes. Improving a skill does not automatically cause promotion; observational association does not establish direct causation.
        </p>
      </div>

      {/* Intervention Shortcuts */}
      <div className="p-4 rounded-xl bg-surface border border-border space-y-2.5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cream-heading">
            Choose Standard Capability Intervention:
          </span>
          <button
            onClick={resetToBaseline}
            className="text-xs text-cream-muted hover:text-cream flex items-center gap-1 font-mono transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Sliders</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyIntervention('storytelling')}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-basil hover:text-soil-950 border border-border font-medium transition-all text-cream"
          >
            Storytelling Intervention (+1.2)
          </button>
          <button
            onClick={() => applyIntervention('stats')}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-basil hover:text-soil-950 border border-border font-medium transition-all text-cream"
          >
            Applied Statistics (+1.2)
          </button>
          <button
            onClick={() => applyIntervention('coding_stats')}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-basil hover:text-soil-950 border border-border font-medium transition-all text-cream"
          >
            Coding + Statistics (+1.0)
          </button>
          <button
            onClick={() => applyIntervention('big_data')}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-tomato hover:text-cream border border-border font-medium transition-all text-cream"
          >
            Big Data Focus (+1.2)
          </button>
        </div>
      </div>

      {/* Main Simulation Workspace: Sliders on Left, Mathematical Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Continuous Sliders */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-cream-heading">
              Capability Proficiency Sliders (Scale: 1.0 to 5.0)
            </h2>
            <span className="text-[11px] font-mono text-cream-muted">
              Baseline: 3.5 Avg
            </span>
          </div>

          <div className="space-y-4">
            {skillFields.map(sk => {
              const val = (scenario as any)[sk.id] ?? 3.5;
              const baseVal = (baseline as any)[sk.id] ?? 3.5;
              const skillDelta = val - baseVal;

              return (
                <div key={sk.id} className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-cream block">{sk.label}</strong>
                      <span className="text-[10px] text-cream-muted font-mono">Logistic Weight OR: {sk.or}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-cream-heading">{val.toFixed(1)} / 5.0</span>
                      {Math.abs(skillDelta) > 0.01 && (
                        <span className={`block text-[10px] font-bold ${skillDelta > 0 ? 'text-basil' : 'text-tomato'}`}>
                          {skillDelta > 0 ? `+${skillDelta.toFixed(1)}` : skillDelta.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={val}
                    onChange={(e) => handleSliderChange(sk.id, parseFloat(e.target.value))}
                    className="w-full accent-basil cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-cream-muted">
                    <span>1.0 (Novice)</span>
                    <span>3.0 (Competent)</span>
                    <span>5.0 (Master)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Scenario Mathematical Result Card */}
        <div className="p-5 rounded-xl bg-surface border border-border flex flex-col justify-between space-y-4 shadow-card">
          <div className="space-y-4">
            <div className="pb-3 border-b border-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cream-muted block">
                Model Prediction
              </span>
              <h2 className="text-sm font-bold text-cream-heading">
                Model-Predicted Career Outcome
              </h2>
            </div>

            {/* Metric Comparison Strip */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border">
                <span className="text-[10px] text-cream-muted block">Baseline Likelihood</span>
                <span className="text-xl font-black text-cream-heading font-mono mt-1 block">
                  {result?.baseline_probability_pct ?? '51.8'}%
                </span>
                <span className="text-[10px] text-cream-muted">Average Junior Profile</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                isPositive ? 'bg-basil-soft border-basil-dark' : isZero ? 'bg-surface-subtle border-border' : 'bg-tomato-soft border-tomato-dark'
              }`}>
                <span className="text-[10px] text-cream-muted block">Scenario Likelihood</span>
                <span className={`text-xl font-black font-mono mt-1 block ${
                  isPositive ? 'text-basil-300' : isZero ? 'text-cream' : 'text-tomato-300'
                }`}>
                  {result?.scenario_probability_pct ?? '51.8'}%
                </span>
                <span className="text-[10px] text-cream-muted">Adjusted Skills</span>
              </div>
            </div>

            {/* Delta Display Panel */}
            <div className={`p-4 rounded-lg border text-center space-y-1 ${
              isPositive 
                ? 'bg-basil-soft border-basil' 
                : isZero 
                ? 'bg-surface-subtle border-border' 
                : 'bg-tomato-soft border-tomato'
            }`}>
              <span className="text-[11px] font-mono text-cream-muted block">
                Model-Predicted Change
              </span>
              <div className={`text-3xl font-black font-mono ${
                isPositive ? 'text-basil-300' : isZero ? 'text-cream-muted' : 'text-tomato-300'
              }`}>
                {isPositive ? `+${delta.toFixed(1)}` : delta.toFixed(1)} pp
              </div>
              
              {/* Honest Handling of Δ = 0.0 */}
              {isZero ? (
                <p className="text-[11px] text-cream-muted font-medium pt-1">
                  No measurable probability change under this fitted model.
                </p>
              ) : (
                <p className={`text-[11px] font-medium pt-1 ${isPositive ? 'text-basil-300' : 'text-tomato-300'}`}>
                  {isPositive ? 'Positive progression sensitivity detected.' : 'Negative progression sensitivity.'}
                </p>
              )}
            </div>

            {/* Model Provenance Specs */}
            <div className="p-3 rounded-lg bg-surface-subtle border border-border text-[11px] font-mono text-cream-muted space-y-1">
              <div className="flex justify-between">
                <span>Underlying Model:</span>
                <strong className="text-cream font-bold">JDS Logistic Classifier</strong>
              </div>
              <div className="flex justify-between">
                <span>Cross-Validation:</span>
                <strong className="text-basil font-bold">84.1% Accuracy</strong>
              </div>
            </div>

          </div>

          <div className="text-[10px] text-cream-muted font-mono text-center">
            Calculated via logit link: P = 1 / (1 + e^-z)
          </div>
        </div>

      </div>

    </div>
  );
};
