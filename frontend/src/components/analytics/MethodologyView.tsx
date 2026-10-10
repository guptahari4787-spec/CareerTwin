import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  BookOpen, 
  Layers, 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  Binary, 
  Scale, 
  ArrowRight 
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getMethodology()
      .then(res => setData(res))
      .catch(err => console.error('Failed to load methodology:', err));
  }, []);

  const stages = data?.pipeline_stages || [
    { step: "1. Data Acquisition", detail: "Ingestion of 4 official hackathon datasets without row-level merging across distinct populations." },
    { step: "2. Data Quality & Cleaning", detail: "Schema validation, missing value imputation, text normalization, and non-destructive salary band parsing." },
    { step: "3. Market Intelligence", detail: "Frequency aggregation, role family classification, compensation cross-tabulation, and skill co-occurrence mining across 17,443 postings." },
    { step: "4. Junior Outcome Modeling (JDS)", detail: "Hypothesis testing (t-test & Mann-Whitney U), Cohen's d effect sizes, Benjamini-Hochberg FDR correction, Logistic Regression with odds ratios, and 5-fold CV Random Forest." },
    { step: "5. Senior Success Analysis (SDS)", detail: "Big Five personality trait observational evaluation with strict non-deterministic ethical guardrails." },
    { step: "6. Alignment Engine", detail: "Cross-dimensional matrix synthesizing market demand and empirical outcome signals into Priority, Investigate, Opportunity, and Watch tiers." },
    { step: "7. Scenario What-If Simulation", detail: "Model-based inference utilizing validated continuous logistic regression log-odds." },
    { step: "8. Workforce Decisions", detail: "Stakeholder-specific translation of validated evidence for students, universities, enterprise L&D, and HR." }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Research Rigor & Mathematics
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Scientific Reproducibility</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Empirical Methodology & Statistical Formulations
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Complete mathematical formulations, inferential hypothesis testing standards, and responsible analytical guardrails powering CareerTwin.
        </p>
      </div>

      {/* 8-Stage Pipeline Progression */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-cream-heading">
            The 8-Stage Analytical Pipeline
          </h2>
          <p className="text-xs text-cream-muted mt-0.5">
            End-to-end laboratory execution implemented in <code className="font-mono text-cream">backend/careertwin_pipeline.py</code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stages.map((st: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-lg bg-surface-subtle border border-border text-xs space-y-1">
              <span className="text-[10px] font-mono font-bold text-basil block">
                STAGE {idx + 1}
              </span>
              <strong className="text-cream-heading font-bold block">{st.step}</strong>
              <p className="text-[11px] text-cream-secondary leading-relaxed">{st.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
        <div className="pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-cream-heading">
            Mathematical Equations & Statistical Frameworks
          </h2>
          <p className="text-xs text-cream-muted mt-0.5">
            Rigorous mathematical definitions applied across inferential and predictive modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
            <span className="text-[10px] font-mono uppercase text-cream-muted font-bold block">
              01 • STANDARDIZED EFFECT SIZE
            </span>
            <h3 className="font-bold text-xs text-cream-heading">Cohen's d Formulation</h3>
            <div className="p-2.5 rounded bg-surface border border-border font-mono text-xs text-center text-basil my-2">
              d = (x̄₁ - x̄₂) / s_pooled
            </div>
            <p className="text-[11px] text-cream-secondary leading-relaxed">
              Quantifies the practical significance of technical capabilities between promoted and non-promoted cohorts independent of sample size.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
            <span className="text-[10px] font-mono uppercase text-cream-muted font-bold block">
              02 • MULTIPLE TESTING CORRECTION
            </span>
            <h3 className="font-bold text-xs text-cream-heading">Benjamini-Hochberg FDR</h3>
            <div className="p-2.5 rounded bg-surface border border-border font-mono text-xs text-center text-basil my-2">
              P(i) ≤ (i / m) × Q
            </div>
            <p className="text-[11px] text-cream-secondary leading-relaxed">
              Controls false discovery rates across simultaneous statistical hypothesis tests, bounding expected false positive discoveries to under 5%.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
            <span className="text-[10px] font-mono uppercase text-cream-muted font-bold block">
              03 • SCENARIO SENSITIVITY
            </span>
            <h3 className="font-bold text-xs text-cream-heading">Logistic Regression Link</h3>
            <div className="p-2.5 rounded bg-surface border border-border font-mono text-xs text-center text-basil my-2">
              P = 1 / (1 + e^-(β₀ + ΣβᵢXᵢ))
            </div>
            <p className="text-[11px] text-cream-secondary leading-relaxed">
              Calculates outcome probability shifts based on continuous skill improvements, yielding verified odds ratios (e^β) with 95% confidence bounds.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
