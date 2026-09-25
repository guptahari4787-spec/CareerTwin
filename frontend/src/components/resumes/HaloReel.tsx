import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight, Printer, Sparkle } from '@phosphor-icons/react';
import { ResumeVariantItem } from '../../types';

interface HaloReelProps {
  resumes: ResumeVariantItem[];
  activeIndex: number;
  onSelectResume: (index: number) => void;
  candidateName?: string;
  candidateEducation?: string;
}

export const HaloReel: React.FC<HaloReelProps> = ({
  resumes,
  activeIndex,
  onSelectResume,
  candidateName = "Hariom Gupta",
  candidateEducation = "B.E. Computer Science Engineering, Chandigarh University"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const total = resumes.length;

  const handlePrev = useCallback(() => {
    onSelectResume((activeIndex - 1 + total) % total);
  }, [activeIndex, total, onSelectResume]);

  const handleNext = useCallback(() => {
    onSelectResume((activeIndex + 1) % total);
  }, [activeIndex, total, onSelectResume]);

  // Keyboard navigation: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Drag interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setDragStartX(null);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Reel Header & Navigation Controls */}
      <div className="flex items-center justify-between px-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
            Signature Presentation
          </span>
          <h3 className="text-sm font-bold text-charcoal">
            Elliptical Resume Reel ({activeIndex + 1} of {total})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Resume"
            className="w-8 h-8 rounded-lg bg-surface border border-border hover:bg-slate-100 flex items-center justify-center text-charcoal transition-colors shadow-subtle"
          >
            <CaretLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Resume"
            className="w-8 h-8 rounded-lg bg-surface border border-border hover:bg-slate-100 flex items-center justify-center text-charcoal transition-colors shadow-subtle"
          >
            <CaretRight size={16} />
          </button>
        </div>
      </div>

      {/* 3D ELLIPTICAL STAGE */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[580px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {resumes.map((resume, idx) => {
          // Calculate offset relative to activeIndex in circular range [-2, 2]
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;
          if (!isVisible) return null;

          // Elliptical calculations
          const xOffset = offset * 210;
          const zDepth = -Math.abs(offset) * 160;
          const scale = isCenter ? 1.0 : Math.max(0.86 - Math.abs(offset) * 0.08, 0.7);
          const zIndex = 30 - Math.abs(offset) * 10;
          const rotateY = offset * -14;
          const opacity = isCenter ? 1 : Math.max(0.85 - Math.abs(offset) * 0.25, 0.4);

          return (
            <motion.div
              key={resume.id}
              onClick={() => onSelectResume(idx)}
              animate={reduceMotion ? {} : {
                x: xOffset,
                scale,
                rotateY,
                opacity,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{
                zIndex,
                position: 'absolute',
                transformStyle: 'preserve-3d',
              }}
              className="w-[92%] sm:w-[460px] h-[520px] bg-white text-charcoal rounded-xl border border-border shadow-sheet p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Clean Editorial Resume Paper Styling */}
              <div>
                
                {/* Header */}
                <div className="border-b border-border pb-3 mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-charcoal uppercase">
                      {candidateName}
                    </h2>
                    <p className="text-[11px] font-bold text-accent uppercase tracking-wide mt-0.5">
                      Target: {resume.role_title}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">{candidateEducation}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-accent font-mono text-[10px] font-bold inline-block">
                      {resume.match_percentage}% Role Match
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1">Single Master Profile</span>
                  </div>
                </div>

                {/* Professional Tailored Summary */}
                <div className="mb-3">
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Professional Summary
                  </h5>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                    {resume.summary}
                  </p>
                </div>

                {/* Prioritized Competencies */}
                <div className="mb-3">
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Core Technical Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {resume.skills.slice(0, 8).map((sk) => (
                      <span key={sk} className="px-1.5 py-0.5 rounded bg-surface-subtle text-slate-800 border border-border text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tailored Projects */}
                <div>
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Featured Relevant Projects
                  </h5>
                  <div className="space-y-2">
                    {resume.projects.slice(0, 2).map((proj) => (
                      <div key={proj.title} className="text-[11px]">
                        <div className="flex justify-between font-bold text-charcoal">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-muted font-normal">{proj.tech}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-600 mt-0.5 leading-snug">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Paper Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted">
                <span>Tailored from Master Profile · 0 fabricated claims</span>
                <span className="font-mono text-accent font-semibold">{resume.role_target}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center text-xs text-muted">
        <span>💡 Click any background resume, drag sideways, or use keyboard ← / → arrows to bring into center focus.</span>
      </div>

    </div>
  );
};
