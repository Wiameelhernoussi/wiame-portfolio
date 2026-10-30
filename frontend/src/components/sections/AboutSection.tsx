import React from "react";
import { Globe, Award, Database, Cpu, Activity } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Profile } from "../../types";

interface AboutSectionProps {
  profile: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const bio =
    profile?.about_bio ||
    "I am a final-year engineering student in Computer & Network Engineering (Data & AI track) at EMSI Marrakech. I specialize in designing and deploying end-to-end intelligent systems: from robust ETL data pipelines and state-of-the-art computer vision and LLM agent architectures to high-performance FastAPI backends and intuitive user interfaces. Looking for a challenging 6-month end-of-studies internship (PFE) starting February 2027 in Morocco or abroad.";

  const figures = profile?.key_figures && profile.key_figures.length > 0
    ? profile.key_figures
    : [
        { label: "Intent Accuracy", value: "97.30%", sub: "5-fold cross-validation on 148 examples" },
        { label: "Dataset Indexed", value: "3,000+", sub: "hotel documents for RAG semantic search" },
        { label: "Inference Latency", value: "2.0 ms", sub: "YOLOv11s defect detection per image" },
        { label: "Transactions Processed", value: "96,000+", sub: "ETL warehouse with 7 Talend jobs" },
      ];

  const languages = profile?.languages && profile.languages.length > 0
    ? profile.languages
    : [
        { language: "Arabic", level: "Native" },
        { language: "French", level: "Fluent" },
        { language: "English", level: "Advanced" },
      ];

  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Activity className="w-5 h-5 text-saffron dark:text-saffron-dark" />;
      case 1:
        return <Database className="w-5 h-5 text-majorelle dark:text-majorelle-dark" />;
      case 2:
        return <Cpu className="w-5 h-5 text-saffron dark:text-saffron-dark" />;
      default:
        return <Award className="w-5 h-5 text-majorelle dark:text-majorelle-dark" />;
    }
  };

  return (
    <section id="about" className="py-20 border-t border-line-light/80 dark:border-line-dark/80 bg-surface-light/40 dark:bg-surface-dark/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <MotionReveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-majorelle dark:bg-majorelle-dark" />
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
              About &amp; Impact
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink dark:text-ink-dark mb-4">
            Engineering data into deployed intelligence.
          </h2>
          <p className="text-base sm:text-lg text-muted-light dark:text-muted-dark leading-relaxed max-w-[75ch] mb-12">
            {bio}
          </p>
        </MotionReveal>

        {/* Key Figures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {figures.map((fig, idx) => (
            <MotionReveal key={idx} delay={idx * 0.1}>
              <div className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-majorelle/50 dark:hover:border-majorelle-dark/50 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface">
                    {getMetricIcon(idx)}
                  </span>
                  <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    Metric
                  </span>
                </div>
                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight mb-1">
                  {fig.value}
                </div>
                <div className="font-semibold text-sm text-majorelle dark:text-majorelle-dark mb-1">
                  {fig.label}
                </div>
                {fig.sub && (
                  <p className="text-xs text-muted-light dark:text-muted-dark leading-normal">
                    {fig.sub}
                  </p>
                )}
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Languages & Location Sub-block */}
        <MotionReveal delay={0.2}>
          <div className="p-6 sm:p-8 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-base text-ink dark:text-ink-dark">
                  Working Languages
                </h3>
                <p className="text-xs text-muted-light dark:text-muted-dark">
                  Ready for international and multilingual cross-functional teams
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light/60 dark:bg-canvas-dark/60 text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron dark:bg-saffron-dark" />
                  <span>{lang.language}</span>
                  <span className="text-muted-light dark:text-muted-dark font-normal">
                    ({lang.level})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>

      </div>
    </section>
  );
};
