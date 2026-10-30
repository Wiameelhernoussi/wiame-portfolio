import React from "react";
import { Dumbbell, BookOpen, Trophy } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";

export const InterestsSection: React.FC = () => {
  const hobbies = [
    {
      name: "Basketball",
      desc: "Teamwork, rapid decision making under shot-clock pressure, and tactical court vision.",
      icon: Trophy,
    },
    {
      name: "Strength Training",
      desc: "Discipline, progressive overload mindset, and consistency in pursuit of physical and mental resilience.",
      icon: Dumbbell,
    },
    {
      name: "Reading",
      desc: "Exploring technical literature, machine learning papers, and books on cognitive science.",
      icon: BookOpen,
    },
  ];

  return (
    <section id="interests" className="py-20 border-t border-line-light/80 dark:border-line-dark/80 bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <MotionReveal>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-saffron dark:bg-saffron-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-muted-light dark:text-muted-dark">
              Beyond the Screen
            </span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark mb-10">
            Personal Pursuits &amp; Interests
          </h2>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hobbies.map((hobby, idx) => {
            const Icon = hobby.icon;
            return (
              <MotionReveal key={hobby.name} delay={idx * 0.1}>
                <div className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-majorelle/40 dark:hover:border-majorelle-dark/40 transition-all flex items-start gap-4">
                  <span className="p-3 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink dark:text-ink-dark mb-1">
                      {hobby.name}
                    </h3>
                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                      {hobby.desc}
                    </p>
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
