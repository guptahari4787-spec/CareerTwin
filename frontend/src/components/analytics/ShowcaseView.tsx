import * as React from "react";
import { FreelancerProfileCard } from "@/components/ui/freelancer-profile-card";
import Casestudies from "@/components/ui/case-studies";
import { FlaskConical, AlertCircle, CheckCircle2 } from "lucide-react";

export const ShowcaseView: React.FC = () => {
  const [bookmarked, setBookmarked] = React.useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cream-muted bg-surface-subtle border border-border px-2 py-0.5 rounded font-mono">
            Isolated Design Sandbox
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-tomato-300 font-mono font-semibold">Demo Content Only</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Design System Laboratory (UI Component Lab)
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Experimental interface components used during CareerTwin development. These examples are not analytical evidence and are strictly isolated from empirical workforce models.
        </p>
      </div>

      {/* Prominent Demo Isolation Alert */}
      <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs shadow-card">
        <div className="flex items-center gap-2">
          <AlertCircle size={15} className="text-cream-muted shrink-0" />
          <span className="text-cream-secondary font-medium">
            <strong className="text-cream-heading">NOTICE:</strong> The metrics and figures shown in these component previews are UI demo placeholders, not CareerTwin research findings.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-tomato-soft text-tomato-300 border border-tomato-dark px-2 py-0.5 rounded font-bold shrink-0">
          DEMO CONTENT
        </span>
      </div>

      {/* Component 1: FreelancerProfileCard Showcase */}
      <div className="p-5 md:p-6 rounded-xl bg-surface border border-border space-y-4 shadow-card">
        <div className="pb-2 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-cream-heading">
              Component: FreelancerProfileCard (Candidate / Mentor Avatar Preview)
            </h2>
            <p className="text-xs text-cream-muted mt-0.5">
              Interactive motion card used in student portfolio and peer-mentor matching
            </p>
          </div>
          <span className="text-[10px] font-mono text-cream-muted">
            DEMO PREVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          
          <div className="flex justify-center">
            <FreelancerProfileCard
              name="Sophia Patel"
              title="Senior Analytics Translator"
              avatarSrc="https://cdn.21st.dev/assets/mirror/60/60f1fc317cc965fa57d1bb420b79a441aaebc281f64fceda8b7bff238686177d.png"
              bannerSrc="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80"
              rating={4.9}
              duration="Senior Cohort"
              rate="₹28 LPA"
              tools={
                <div className="flex gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Tableau</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">SQL</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Python</span>
                </div>
              }
              onBookmark={() => toggleBookmark('1')}
            />
          </div>

          <div className="flex justify-center">
            <FreelancerProfileCard
              name="Aarav Mehta"
              title="Applied Machine Learning Specialist"
              avatarSrc="https://cdn.21st.dev/assets/mirror/5b/5be809c811b5c484f4f36c477a13b0af7da32fdd20512c7f6c2c38e681e32afa.png"
              bannerSrc="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80"
              rating={4.8}
              duration="Junior Cohort"
              rate="₹16 LPA"
              tools={
                <div className="flex gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">PyTorch</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">SciKit</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Docker</span>
                </div>
              }
              onBookmark={() => toggleBookmark('2')}
            />
          </div>

          <div className="flex justify-center">
            <FreelancerProfileCard
              name="David Liu"
              title="Distributed Big Data Architect"
              avatarSrc="https://cdn.21st.dev/assets/mirror/6c/6c1a829d1b4c7e47d0916ff1ab901e414b6943ca338094e2bbbdba35da4e5446.png"
              bannerSrc="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80"
              rating={4.7}
              duration="Investigate Tier"
              rate="₹24 LPA"
              tools={
                <div className="flex gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Spark</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Kafka</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-cream">Hadoop</span>
                </div>
              }
              onBookmark={() => toggleBookmark('3')}
            />
          </div>

        </div>
      </div>

      {/* Component 2: CaseStudies Showcase */}
      <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-card">
        <div className="px-6 py-3 border-b border-border bg-surface-subtle flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cream-heading">
              Component: CaseStudies (Interactive CountUp Case Study Module)
            </h3>
            <p className="text-[11px] text-cream-muted">
              Interactive testimonial carousel component
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-tomato-soft text-tomato-300 border border-tomato-dark px-2 py-0.5 rounded font-bold">
            DEMO CONTENT
          </span>
        </div>
        <Casestudies />
      </div>

    </div>
  );
};
