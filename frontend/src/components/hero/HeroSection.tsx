import React from "react";
import { ArrowDown, FileText, Send, Sparkles } from "lucide-react";
import { ProfileArchFrame } from "./ProfileArchFrame";
import { ParkingBayMotif } from "./ParkingBayMotif";
import { Profile } from "../../types";

interface HeroSectionProps {
  profile: Profile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const name = profile?.full_name || "Wiame El Hernoussi";
  const title = profile?.title || "Data & AI Engineering Student";
  const pitch =
    profile?.pitch ||
    "Final-year engineering student in Data & AI. I take projects from raw data to a working product: pipelines, models, APIs and the interface people actually use.";
  const availability =
    profile?.availability_badge ||
    "Open to an end-of-studies internship from February 2027";
  const cvUrl = profile?.cv_url;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-20 lg:pt-12 lg:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm text-xs sm:text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saffron dark:bg-saffron-dark" />
              </span>
              <span className="text-ink dark:text-ink-dark font-semibold">
                {availability}
              </span>
            </div>

            {/* Name & Title */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-ink dark:text-ink-dark tracking-tight leading-[1.08] mb-4">
              {name}
            </h1>

            <p className="font-heading text-xl sm:text-2xl text-majorelle dark:text-majorelle-dark font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron dark:text-saffron-dark" />
              <span>{title}</span>
            </p>

            {/* Pitch */}
            <p className="text-base sm:text-lg text-muted-light dark:text-muted-dark leading-relaxed max-w-[65ch] mb-8">
              {pitch}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => scrollTo("projects")}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-majorelle text-white font-bold text-sm sm:text-base hover:bg-opacity-95 active:scale-95 transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              >
                <span>View projects</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {cvUrl ? (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-ink dark:border-ink-dark/40 text-ink dark:text-ink-dark font-bold text-sm sm:text-base hover:bg-surface-light dark:hover:bg-surface-dark active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                  <FileText className="w-4 h-4 text-majorelle dark:text-majorelle-dark" />
                  <span>Download CV</span>
                </a>
              ) : null}

              <button
                onClick={() => scrollTo("contact")}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-saffron active:scale-95 transition-all font-semibold text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              >
                <Send className="w-4 h-4" />
                <span>Contact me</span>
              </button>
            </div>

            {/* Subtle SmartPark telemetry card beneath pitch on mobile/tablet */}
            <div className="mt-10 lg:hidden w-full max-w-sm">
              <ParkingBayMotif />
            </div>
          </div>

          {/* Right Column: Portrait Arch Frame (Focal point) + Subtle ambient motif */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <ProfileArchFrame avatarUrl={profile?.avatar_url} name={name} />

            {/* Subtle floating telemetry motif on desktop (placed discreetly below/side, not stealing center stage) */}
            <div className="hidden lg:block absolute -bottom-6 -left-12 w-64 z-20 transition-transform hover:translate-y-[-2px]">
              <ParkingBayMotif />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
