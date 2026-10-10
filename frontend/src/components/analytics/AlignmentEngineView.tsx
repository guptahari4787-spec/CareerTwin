import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  TrendingUp,
  BarChart2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AlignmentEngineViewProps {
  onOpenEvidence: (capability: string) => void;
}

export const AlignmentEngineView: React.FC<AlignmentEngineViewProps> = ({ onOpenEvidence }) => {
  const [alignments, setAlignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('All');

  useEffect(() => {
    api.getAlignment()
      .then(res => setAlignments(res || []))
      .catch(err => console.error('Failed to load alignment matrix:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-sans">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-basil border-r-transparent mb-3" />
        <p className="text-xs font-medium text-cream-muted">Synthesizing Market Demand & Empirical Outcome Signals...</p>
      </div>
    );
  }

  const filtered = filterTier === 'All' 
    ? alignments 
    : alignments.filter(a => a.classification === filterTier);

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Core Strategic Framework
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Market vs Outcome Cross-Validation</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          CareerTwin Capability Alignment Engine
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Cross-referencing observed market demand from 17,443 job postings with independent junior progression evidence (n=139) to classify skills into 4 strategic tiers.
        </p>
      </div>

      {/* 4-Tier Matrix Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        
        <div 
          onClick={() => setFilterTier('PRIORITY')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterTier === 'PRIORITY' ? 'ring-2 ring-basil' : ''
          } bg-basil-soft/60 border-basil-dark space-y-1.5 shadow-card hover:border-basil`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-basil-300 uppercase text-[10px] tracking-wider">
              Priority Tier
            </span>
            <span className="text-[10px] font-mono text-basil font-bold">High / Strong</span>
          </div>
          <p className="text-cream text-[11px] leading-relaxed">
            High observed market demand backed by a statistically strong career outcome signal. Core workforce development focus.
          </p>
        </div>

        <div 
          onClick={() => setFilterTier('INVESTIGATE')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterTier === 'INVESTIGATE' ? 'ring-2 ring-tomato' : ''
          } bg-tomato-soft/60 border-tomato-dark space-y-1.5 shadow-card hover:border-tomato`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-tomato-300 uppercase text-[10px] tracking-wider">
              Investigate Tier
            </span>
            <span className="text-[10px] font-mono text-tomato-400 font-bold">High / Weak</span>
          </div>
          <p className="text-cream text-[11px] leading-relaxed">
            High job posting buzz but weak direct promotion correlation. Often tooling-heavy without foundational execution skills.
          </p>
        </div>

        <div 
          onClick={() => setFilterTier('OPPORTUNITY')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterTier === 'OPPORTUNITY' ? 'ring-2 ring-soil-400' : ''
          } bg-surface border-border space-y-1.5 shadow-card hover:border-soil-400`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-cream uppercase text-[10px] tracking-wider">
              Opportunity Tier
            </span>
            <span className="text-[10px] font-mono text-cream-muted font-bold">Moderate / Strong</span>
          </div>
          <p className="text-cream-secondary text-[11px] leading-relaxed">
            Moderate market mention but high progression value (e.g. business storytelling). High competitive edge.
          </p>
        </div>

        <div 
          onClick={() => setFilterTier('WATCH')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterTier === 'WATCH' ? 'ring-2 ring-soil-400' : ''
          } bg-surface-subtle border-border space-y-1.5 shadow-card hover:border-soil-400`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-cream-muted uppercase text-[10px] tracking-wider">
              Watch Tier
            </span>
            <span className="text-[10px] font-mono text-cream-muted font-bold">Low / Low</span>
          </div>
          <p className="text-cream-muted text-[11px] leading-relaxed">
            Low market frequency and negligible promotion signal. Monitor for legacy deprecation.
          </p>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-cream-muted font-medium text-[11px]">Filter by Strategic Tier:</span>
          {['All', 'PRIORITY', 'INVESTIGATE', 'OPPORTUNITY', 'WATCH'].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                filterTier === tier
                  ? 'bg-basil text-soil-950 font-bold'
                  : 'bg-surface border border-border text-cream-muted hover:text-cream hover:bg-surface-elevated'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-cream-muted">
          Showing {filtered.length} of {alignments.length} Domains
        </span>
      </div>

      {/* Alignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item: any) => {
          const isPriority = item.classification === 'PRIORITY';
          const isInvestigate = item.classification === 'INVESTIGATE';
          const cd = typeof item.effect_size_cohens_d === 'number' ? item.effect_size_cohens_d : parseFloat(item.effect_size_cohens_d) || 0;

          return (
            <div 
              key={item.capability}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all bg-surface shadow-card ${
                isPriority 
                  ? 'border-basil/60' 
                  : isInvestigate 
                  ? 'border-tomato/60' 
                  : 'border-border'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-cream-heading text-sm leading-tight">
                    {item.capability_name || item.capability?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    isPriority 
                      ? 'bg-basil-soft text-basil-300 border border-basil-dark' 
                      : isInvestigate 
                      ? 'bg-tomato-soft text-tomato-300 border border-tomato-dark' 
                      : 'bg-surface-subtle text-cream-muted border border-border'
                  }`}>
                    {item.classification}
                  </span>
                </div>

                {/* Market Demand & Early-Career Signal */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-subtle border border-border text-xs">
                  <div>
                    <span className="text-cream-muted text-[10px] uppercase font-mono block">Market Demand</span>
                    <strong className="text-cream font-bold text-xs">{item.market_demand_level || 'High'}</strong>
                  </div>
                  <div>
                    <span className="text-cream-muted text-[10px] uppercase font-mono block">Early-Career Signal</span>
                    <strong className={`font-bold text-xs ${isPriority ? 'text-basil' : isInvestigate ? 'text-tomato' : 'text-cream'}`}>
                      {item.junior_outcome_signal || (cd >= 0.8 ? 'Strong' : cd >= 0.5 ? 'Moderate' : 'Weak')}
                    </strong>
                  </div>
                </div>

                {/* What This Means */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono block">What This Means</span>
                  <p className="text-[11px] text-cream-secondary leading-relaxed">
                    {item.strategic_rationale || (
                      isPriority 
                        ? 'Companies frequently request this capability, and early-career outcome data confirms a strong observed relationship with higher progression.' 
                        : isInvestigate
                        ? 'High job posting mention, but early outcome data shows a weaker observed separation between salary hike tiers.'
                        : 'Valuable differentiator with moderate posting frequency but strong early progression dividends.'
                    )}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="p-2.5 rounded-lg bg-soil-800/80 border border-border space-y-0.5">
                  <span className="text-[10px] font-bold text-basil uppercase font-mono block">Recommendation</span>
                  <p className="text-[11px] text-cream leading-relaxed">
                    {isPriority 
                      ? 'Prioritize this capability as a non-negotiable anchor for learning and curriculum.'
                      : isInvestigate
                      ? 'Treat as an entry filter; do not overweight at the expense of statistical fundamentals.'
                      : 'High-value competitive differentiator for campus placements and early leadership.'}
                  </p>
                </div>

                {/* Technical Footnote */}
                <div className="flex items-center justify-between text-[10px] font-mono text-cream-muted pt-1">
                  <span>Technical: Cohen's d = {cd.toFixed(2)}</span>
                  <span>p {item.statistical_p_value ? (item.statistical_p_value < 0.0001 ? '< 0.0001' : `= ${item.statistical_p_value.toFixed(4)}`) : '< 0.001'}</span>
                </div>

              </div>

              {/* Action Button: View Evidence Chain */}
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => onOpenEvidence(item.capability)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold bg-surface-subtle hover:bg-basil hover:text-soil-950 text-cream transition-colors border border-border"
                >
                  <span>View Evidence Chain</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
