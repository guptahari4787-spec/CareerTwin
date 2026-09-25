import React from 'react';
import { BookOpen, ArrowUpRight } from '@phosphor-icons/react';
import { RecommendationItem } from '../../../types';

interface RecommendedLearningWidgetProps {
  recommendations?: RecommendationItem[];
  onOpenCourses: () => void;
}

export const RecommendedLearningWidget: React.FC<RecommendedLearningWidgetProps> = ({
  recommendations = [],
  onOpenCourses
}) => {
  const displayItems = recommendations.slice(0, 3);

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-surface rounded-xl border border-border">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-muted font-semibold">
            <BookOpen size={16} />
            <span className="uppercase tracking-wider text-[10px]">Recommended Learning</span>
          </div>
          <button 
            onClick={onOpenCourses}
            className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
          >
            Catalog <ArrowUpRight size={12} />
          </button>
        </div>

        <p className="text-xs text-muted mb-3">
          Curated courses and certifications mapped directly to your active skill gaps:
        </p>

        <div className="space-y-2">
          {displayItems.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-lg bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    item.type === 'certification' 
                      ? 'bg-purple-100 text-purple-800' 
                      : item.type === 'project'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[11px] font-semibold text-charcoal truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate">
                  {item.why_recommended}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right text-[11px] text-muted">
                <span>{item.duration_or_effort}</span>
                <span className="px-2 py-0.5 rounded bg-white border border-border text-slate-700 font-medium">
                  {item.provider_or_issuer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border mt-3 text-[11px] text-muted flex items-center justify-between">
        <span>Grounded in verified syllabus standards (AWS, CNCF, HashiCorp)</span>
        <button onClick={onOpenCourses} className="font-semibold text-accent hover:underline">
          View All Recommendations →
        </button>
      </div>
    </div>
  );
};
