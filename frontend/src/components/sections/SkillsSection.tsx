import React from "react";
import { Brain, Database, Wrench, Code2 } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Skill } from "../../types";

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Group skills by category
  const categories = [
    { name: "AI & Machine Learning", icon: Brain, color: "text-majorelle dark:text-majorelle-dark" },
    { name: "Data", icon: Database, color: "text-saffron dark:text-saffron-dark" },
    { name: "Engineering", icon: Wrench, color: "text-majorelle dark:text-majorelle-dark" },
    { name: "Languages & Databases", icon: Code2, color: "text-saffron dark:text-saffron-dark" },
  ];

  return (
    <section id="skills" className="py-24 border-t border-line-light/80 dark:border-line-dark/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <MotionReveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron dark:bg-saffron-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
              Core Competencies
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark mb-4">
            Technical Arsenal
          </h2>
          <p className="text-base text-muted-light dark:text-muted-dark max-w-[65ch] mb-16">
            Technologies, frameworks, and database architectures battle-tested across engineering coursework and real-world client implementations.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, catIdx) => {
            const Icon = cat.icon;
            const categorySkills = skills.filter(
              (s) => s.category.toLowerCase() === cat.name.toLowerCase()
            );

            return (
              <MotionReveal key={cat.name} delay={catIdx * 0.1}>
                <div className="p-6 sm:p-8 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line-light/60 dark:border-line-dark/60">
                      <span className="p-2.5 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface">
                        <Icon className={`w-5 h-5 ${cat.color}`} />
                      </span>
                      <h3 className="font-heading font-bold text-xl text-ink dark:text-ink-dark">
                        {cat.name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
                            <span className="text-ink dark:text-ink-dark">{skill.name}</span>
                            <span className="text-muted-light dark:text-muted-dark font-mono text-xs">
                              {skill.level}%
                            </span>
                          </div>
                          {/* Visual progress bar */}
                          <div className="w-full h-2 rounded-full bg-line-light/50 dark:bg-line-dark/50 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-majorelle to-saffron dark:from-majorelle-dark dark:to-saffron-dark transition-all duration-1000 ease-out"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
