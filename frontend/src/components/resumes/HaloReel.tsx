import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
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
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const total = resumes.length;

  const handleNext = () => {
    onSelectResume((activeIndex + 1) % total);
  };

  const handlePrev = () => {
    onSelectResume((activeIndex - 1 + total) % total);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, total]);

  // Pointer swipe handling
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-acid-500 block">
            Signature Presentation
          </span>
          <h3 className="text-sm font-bold text-almond-200">
            Elliptical Resume Reel ({activeIndex + 1} of {total})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Resume"
            className="w-8 h-8 rounded-lg bg-pigeon-800 border border-pigeon-600 hover:bg-pigeon-700 flex items-center justify-center text-almond-200 transition-colors shadow-subtle"
          >
            <CaretLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Resume"
            className="w-8 h-8 rounded-lg bg-pigeon-800 border border-pigeon-600 hover:bg-pigeon-700 flex items-center justify-center text-almond-200 transition-colors shadow-subtle"
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
          const scale = 1 - Math.abs(offset) * 0.12;
          const rotateY = offset * -18;
          const opacity = 1 - Math.abs(offset) * 0.35;
          const zIndex = 20 - Math.abs(offset) * 5;

          return (
            <motion.div
              key={resume.id}
              onClick={() => onSelectResume(idx)}
              initial={false}
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
              className={`w-[92%] sm:w-[460px] h-[520px] bg-pigeon-800 text-almond-200 rounded-xl border p-6 flex flex-col justify-between overflow-hidden shadow-sheet ${
                isCenter ? 'border-acid-500/80 ring-1 ring-acid-500/20' : 'border-pigeon-600'
              }`}
            >
              {/* Clean Editorial Resume Card Styling */}
              <div>
                
                {/* Header */}
                <div className="border-b border-pigeon-600 pb-3 mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight text-almond-200 uppercase">
                      {candidateName}
                    </h2>
                    <p className="text-[11px] font-bold text-acid-400 uppercase tracking-wide mt-0.5">
                      Target: {resume.role_title}
                    </p>
                    <p className="text-[10px] text-almond-400 mt-0.5">{candidateEducation}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-pigeon-900 border border-pigeon-600 text-acid-400 font-mono text-[10px] font-bold inline-block">
                      {resume.match_percentage}% Role Match
                    </span>
                    <span className="text-[9px] text-almond-600 block mt-1 font-mono">Single Master Profile</span>
                  </div>
                </div>

                {/* Professional Tailored Summary */}
                <div className="mb-3">
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-almond-400 mb-1">
                    Professional Summary
                  </h5>
                  <p className="text-[11px] text-almond-300 leading-relaxed font-sans">
                    {resume.summary}
                  </p>
                </div>

                {/* Prioritized Competencies */}
                <div className="mb-3">
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-almond-400 mb-1">
                    Core Technical Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.slice(0, 8).map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-pigeon-900 text-almond-200 border border-pigeon-600 text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tailored Projects */}
                <div>
                  <h5 className="text-[9px] font-bold uppercase tracking-wider text-almond-400 mb-1">
                    Featured Relevant Projects
                  </h5>
                  <div className="space-y-2">
                    {resume.projects.slice(0, 2).map((proj) => (
                      <div key={proj.title} className="text-[11px]">
                        <div className="flex justify-between font-bold text-almond-200">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-almond-600 font-normal">{proj.tech}</span>
                        </div>
                        <p className="text-[10.5px] text-almond-400 mt-0.5 leading-snug">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Paper Footer */}
              <div className="pt-3 border-t border-pigeon-600 flex items-center justify-between text-[10px] text-almond-600">
                <span>Tailored from Master Profile · 0 fabricated claims</span>
                <span className="font-mono text-acid-400 font-semibold">{resume.role_target}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {resumes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectResume(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === activeIndex
                ? 'w-6 bg-acid-500'
                : 'bg-pigeon-600 hover:bg-almond-600'
            }`}
            aria-label={`Jump to Resume ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};
