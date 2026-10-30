import React from "react";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Experience } from "../../types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences = [] }) => {
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  return (
    <section id="experience" className="py-24 border-t border-line-light/80 dark:border-line-dark/80 bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <MotionReveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-majorelle dark:bg-majorelle-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
              Career &amp; Practical Training
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark mb-4">
            Professional Experience
          </h2>
          <p className="text-base text-muted-light dark:text-muted-dark max-w-[65ch] mb-16">
            Industry internships applying generative AI agents, retrieval systems, and conversational architectures into production environments.
          </p>
        </MotionReveal>

        {/* Timeline nodes */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-line-light dark:border-line-dark space-y-12">
          {safeExperiences.map((exp, index) => (
            <MotionReveal key={exp.id} delay={index * 0.15}>
              <div className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-majorelle text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-saffron transition-all">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Content Card */}
                <div className="p-6 sm:p-8 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-majorelle/50 dark:hover:border-majorelle-dark/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
                      {exp.role} ·{" "}
                      <span className="text-majorelle dark:text-majorelle-dark">
                        {exp.company}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-light dark:text-muted-dark">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.start_date} – {exp.end_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-light dark:text-muted-dark leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Highlights Bullet List */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/90 dark:text-ink-dark/90 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-saffron dark:text-saffron-dark shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line-light/60 dark:border-line-dark/60">
                    {exp.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
