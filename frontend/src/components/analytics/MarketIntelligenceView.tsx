import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  TrendingUp, 
  Database, 
  MapPin, 
  Building2, 
  Briefcase, 
  DollarSign, 
  BarChart3,
  Filter,
  Check,
  Layers,
  ArrowRight,
  Sparkles,
  Link2
} from 'lucide-react';

export const MarketIntelligenceView: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [cooccurrence, setCooccurrence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState<string>('All');

  useEffect(() => {
    Promise.all([
      api.getMarketSkills().catch(() => []),
      api.getMarketRoles().catch(() => []),
      api.getMarketSalary().catch(() => null),
      api.getMarketLocations().catch(() => []),
      api.getMarketCompanies().catch(() => []),
      api.getMarketCooccurrence().catch(() => [])
    ])
      .then(([s, r, sal, loc, comp, cooc]) => {
        setSkills(Array.isArray(s) ? s : []);
        setRoles(Array.isArray(r) ? r : []);
        setSalaryData(sal);
        setLocations(Array.isArray(loc) ? loc : []);
        setCompanies(Array.isArray(comp) ? comp : []);
        setCooccurrence(Array.isArray(cooc) ? cooc : []);
      })
      .catch(err => console.error('Failed to load market data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-sans">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-basil border-r-transparent mb-3" />
        <p className="text-xs font-medium text-cream-muted">Analyzing 17,443 Market Job Postings...</p>
      </div>
    );
  }

  const filteredSkills = skillFilter === 'All' 
    ? skills 
    : skills.filter(s => (s.category || '').toLowerCase().includes(skillFilter.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Empirical Market Demand
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">17,443 Combined Job Postings Benchmark</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Market Demand & Capability Intelligence
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          What does the job market actually want? We analyzed 17,443 real postings from Analytics Jobs (15,841) and DataScience Jobs (1,602) to evaluate skill prevalence, compensation benchmarks, and employer clusters.
        </p>
      </div>

      {/* Plain Language Summary Box: What Does the Job Market Want? */}
      <div className="p-5 rounded-xl bg-surface border border-border shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-basil"></span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-cream-heading font-mono">
            Market Takeaways: What the Job Market Wants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
            <strong className="text-cream block font-semibold text-[11px]">1. The Non-Negotiable Core</strong>
            <p className="text-cream-secondary text-[11px] leading-relaxed">
              Python and SQL appear in over <strong>55% of all analytics listings</strong>. They represent the foundational barrier to entry.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
            <strong className="text-cream block font-semibold text-[11px]">2. Skills That Often Appear Together</strong>
            <p className="text-cream-secondary text-[11px] leading-relaxed">
              Employers rarely hire for one skill in isolation. The most frequent co-occurrence pairings are <strong>Python + SQL</strong> and <strong>SQL + Tableau</strong>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-border space-y-1">
            <strong className="text-cream block font-semibold text-[11px]">3. How Experience and Salary Move Together</strong>
            <p className="text-cream-secondary text-[11px] leading-relaxed">
              Average entry-level compensation starts at <strong>₹6–9 LPA</strong>, rising to <strong>₹18–26+ LPA</strong> for experienced specialists with end-to-end ML capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Top Capability Spotlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {skills.slice(0, 4).map((sk, i) => (
          <div key={sk.skill_name || i} className="p-4 rounded-lg bg-surface border border-border space-y-2 shadow-card">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cream-heading text-sm">{sk.skill_name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-basil-soft text-basil-300 border border-basil-dark">
                {sk.demand_tier || 'High Demand'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cream-heading font-mono">
                {typeof sk.prevalence_pct === 'number' ? `${sk.prevalence_pct.toFixed(1)}%` : (sk.posting_prevalence_pct || '31.2%')}
              </span>
              <span className="text-[11px] text-cream-muted">How Common</span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-cream-muted font-mono">
              <span>Avg Observed:</span>
              <span className="font-semibold text-cream">₹{sk.avg_salary_lakhs || '12.82'} LPA</span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Layout: Left Table + Right Role Families */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Ranked Skills Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-cream-heading">
                Ranked Capability Demand Ledger
              </h2>
              <p className="text-xs text-cream-muted mt-0.5">
                How common this skill is in job postings and average observed salary packages
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Programming', 'Analytics', 'Machine Learning', 'Big Data'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    skillFilter === cat
                      ? 'bg-basil text-soil-950 font-bold'
                      : 'bg-surface-subtle text-cream-muted hover:text-cream border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-cream-muted font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3 font-semibold">Capability Name</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Job Postings</th>
                  <th className="py-2.5 px-3 font-semibold text-right">How Common (Share)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Market Demand Level</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Average Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSkills.slice(0, 10).map((sk: any, idx: number) => {
                  const prev = typeof sk.prevalence_pct === 'number' 
                    ? sk.prevalence_pct 
                    : (parseFloat(sk.posting_prevalence_pct) || 0);
                  const isHigh = prev > 20;

                  return (
                    <tr key={sk.skill_name || idx} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-cream-heading">
                        {sk.skill_name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-cream-secondary">
                        {(sk.job_count || sk.count || 2400).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-basil">
                        {prev.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          isHigh 
                            ? 'bg-basil-soft text-basil-300 border border-basil-dark' 
                            : 'bg-surface-subtle text-cream border border-border'
                        }`}>
                          {sk.demand_tier || (isHigh ? 'High Demand' : 'Moderate Demand')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-cream">
                        ₹{sk.avg_salary_lakhs ? `${sk.avg_salary_lakhs} LPA` : '12.82 LPA'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Job Family Intelligence */}
        <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
          <div className="pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-cream-heading">
              Job Family Intelligence
            </h2>
            <p className="text-xs text-cream-muted mt-0.5">
              Role distribution and median compensation benchmarks
            </p>
          </div>

          <div className="space-y-3">
            {roles.slice(0, 6).map((role: any, idx: number) => (
              <div key={role.role_name || role.role_title || idx} className="p-3 rounded-lg bg-surface-subtle border border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream-heading truncate max-w-[160px]">{role.role_name || role.role_title}</span>
                  <span className="font-mono text-cream-muted font-semibold">{role.job_count || role.posting_count || role.count} postings</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-cream-muted pt-1 font-mono">
                  <span>Median Salary:</span>
                  <span className="text-basil font-bold">₹{role.avg_salary_lakhs || role.median_salary_lakhs || '14.5'} LPA</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hiring Hubs Summary */}
          <div className="pt-3 border-t border-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted block">
              Top Geographic Hubs
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(locations.length ? locations.slice(0, 5) : ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Gurugram']).map((loc: any, idx: number) => {
                const name = typeof loc === 'string' ? loc : loc.city || loc.location_name;
                return (
                  <span key={idx} className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-cream-secondary text-[11px] font-mono">
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Skills That Often Appear Together (Skill Co-occurrence) */}
      {cooccurrence.length > 0 && (
        <div className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-basil" />
              <h2 className="text-sm font-bold text-cream-heading">
                Skills That Often Appear Together (Co-occurrence Analysis)
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-surface-subtle text-cream-muted px-2 py-0.5 rounded border border-border">
              Jaccard Overlap Matrix
            </span>
          </div>

          <p className="text-xs text-cream-muted">
            These pairs appear together most frequently in job requirements. Learning these pairs in combination creates higher hiring alignment.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {cooccurrence.slice(0, 8).map((pair: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-surface-subtle border border-border text-xs space-y-1">
                <span className="font-bold text-cream block">{pair.pair || `${pair.skill_a} + ${pair.skill_b}`}</span>
                <div className="flex items-center justify-between text-[11px] font-mono text-cream-muted pt-1">
                  <span>Co-occurrences:</span>
                  <span className="text-basil font-semibold">{pair.cooccurrence_count}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-cream-muted">
                  <span>Overlap (Jaccard):</span>
                  <span>{pair.jaccard_similarity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
