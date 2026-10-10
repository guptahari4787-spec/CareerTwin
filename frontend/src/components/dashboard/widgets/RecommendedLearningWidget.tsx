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
    <div className="h-full flex flex-col justify-between p-5 bg-pigeon-800 rounded-xl border border-pigeon-600">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-acid-500 font-bold">
            <BookOpen size={16} />
            <span className="uppercase tracking-wider text-[10px]">Recommended Learning</span>
          </div>
          <button 
            onClick={onOpenCourses}
            className="flex items-center gap-1 text-[11px] font-bold text-acid-400 hover:underline"
          >
            Catalog <ArrowUpRight size={12} />
          </button>
        </div>

        <p className="text-xs text-almond-400 mb-3">
          Curated courses and certifications mapped directly to your active skill gaps:
        </p>

        <div className="space-y-2">
          {displayItems.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-lg bg-pigeon-900 border border-pigeon-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-pigeon-800 text-acid-400 border border-pigeon-600">
                    {item.type}
                  </span>
                  <span className="text-[11px] font-semibold text-almond-200 truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-almond-400 truncate">
                  {item.why_recommended}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right text-[11px] text-almond-400">
                <span className="font-mono">{item.duration_or_effort}</span>
                <span className="px-2 py-0.5 rounded bg-pigeon-800 border border-pigeon-600 text-almond-200 font-medium">
                  {item.provider_or_issuer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-pigeon-600 mt-3 text-[11px] text-almond-600 flex items-center justify-between">
        <span>Grounded in verified syllabus standards (AWS, CNCF, HashiCorp)</span>
        <button onClick={onOpenCourses} className="font-bold text-acid-400 hover:underline">
          View All Recommendations →
        </button>
      </div>
    </div>
  );
};
