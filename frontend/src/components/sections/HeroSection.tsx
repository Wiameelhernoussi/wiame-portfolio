import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { resolveImageUrl } from '../../utils/imageUrl';
import type { Profile } from '../../types';

const SkeletonHero: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex flex-col md:flex-row items-center gap-12 animate-pulse">
    <div className="flex-1 space-y-4">
      <div className="h-4 w-28 bg-line-light dark:bg-line-dark rounded-full" />
      <div className="h-12 w-3/4 bg-line-light dark:bg-line-dark rounded-xl" />
      <div className="h-6 w-1/2 bg-line-light dark:bg-line-dark rounded-lg" />
      <div className="h-4 w-full bg-line-light dark:bg-line-dark rounded" />
      <div className="h-4 w-5/6 bg-line-light dark:bg-line-dark rounded" />
      <div className="flex gap-3 mt-4">
        <div className="h-10 w-32 bg-line-light dark:bg-line-dark rounded-xl" />
        <div className="h-10 w-32 bg-line-light dark:bg-line-dark rounded-xl" />
        <div className="h-10 w-32 bg-line-light dark:bg-line-dark rounded-xl" />
      </div>
    </div>
    <div className="w-64 h-80 bg-line-light dark:bg-line-dark rounded-3xl shrink-0" />
  </div>
);

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data: profile, loading, error } = useApi<Profile>(
    () => api.get<Profile>('/profile').then((r) => r.data),
    []
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <section id="hero"><SkeletonHero /></section>;
  if (error || !profile) {
    return (
      <section id="hero" className="max-w-6xl mx-auto px-4 py-20 text-center text-muted-light dark:text-muted-dark">
        Could not load profile.
      </section>
    );
  }

  const avatarSrc = resolveImageUrl(profile.avatar_url);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
      };

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 28px,#2B3FA3 28px,#2B3FA3 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#2B3FA3 28px,#2B3FA3 29px)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text column */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            {/* Availability badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-xs font-semibold text-muted-light dark:text-muted-dark mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
              {profile.availability_badge || 'Open to opportunities'}
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink dark:text-ink-dark tracking-tight leading-tight mb-3"
            >
              {profile.full_name}
            </motion.h1>

            {/* Title */}
            <motion.p variants={itemVariants} className="text-lg sm:text-xl font-semibold text-majorelle dark:text-majorelle-dark mb-4">
              {profile.title}
            </motion.p>

            {/* Pitch */}
            <motion.p variants={itemVariants} className="text-muted-light dark:text-muted-dark leading-relaxed max-w-xl mx-auto md:mx-0 mb-8">
              {profile.pitch}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={() => scrollTo('projects')}
                className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-semibold text-sm hover:bg-majorelle/90 transition-colors shadow-sm"
              >
                View Projects
              </button>

              {profile.cv_url && (
                <a
                  href={resolveImageUrl(profile.cv_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl border border-majorelle text-majorelle dark:text-majorelle-dark dark:border-majorelle-dark font-semibold text-sm hover:bg-majorelle-light dark:hover:bg-majorelle-darkSurface transition-colors"
                >
                  Download CV
                </a>
              )}

              <button
                onClick={() => scrollTo('contact')}
                className="px-5 py-2.5 rounded-xl border border-line-light dark:border-line-dark text-ink dark:text-ink-dark font-semibold text-sm hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
              >
                Contact Me
              </button>
            </motion.div>
          </div>

          {/* Photo column */}
          <motion.div variants={itemVariants} className="order-1 md:order-2 shrink-0 flex items-center justify-center">
            <div className="relative">
              {/* Gradient ring / glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br from-majorelle via-majorelle/60 to-saffron opacity-30 blur-xl"
              />
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-br from-majorelle to-saffron opacity-20"
              />
              {/* Photo container */}
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-[2rem] overflow-hidden border-2 border-majorelle/30 dark:border-majorelle-dark/30 bg-canvas-light dark:bg-canvas-dark shadow-xl">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={profile.full_name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-heading font-bold text-majorelle dark:text-majorelle-dark">
                    {profile.full_name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
