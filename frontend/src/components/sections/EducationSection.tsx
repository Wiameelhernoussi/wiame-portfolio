import React from "react";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Education } from "../../types";

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education = [] }) => {
  const safeEducation = Array.isArray(education) ? education : [];
  return (
    <section id="education" className="py-24 border-t border-line-light/80 dark:border-line-dark/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <MotionReveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-majorelle dark:bg-majorelle-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
              Academic Background
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark mb-4">
            Education &amp; Preparatory Classes
          </h2>
          <p className="text-base text-muted-light dark:text-muted-dark max-w-[65ch] mb-16">
            Rigorous mathematical foundation from CPGE (Mathematics &amp; Physics) followed by advanced engineering specialization in Data and Artificial Intelligence.
          </p>
        </MotionReveal>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-line-light dark:border-line-dark space-y-10">
          {safeEducation.map((edu, index) => (
            <MotionReveal key={edu.id} delay={index * 0.15}>
              <div className="relative group">
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-saffron dark:bg-saffron-dark text-slate-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>

                <div className="p-6 sm:p-8 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-saffron/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
                      {edu.degree}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-light dark:text-muted-dark">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.start_date} – {edu.end_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {edu.location}
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-sm text-majorelle dark:text-majorelle-dark mb-3">
                    {edu.institution}
                  </p>

                  {edu.description && (
                    <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
