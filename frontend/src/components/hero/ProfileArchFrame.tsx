import React, { useState } from "react";

interface ProfileArchFrameProps {
  avatarUrl?: string;
  name?: string;
}

export const ProfileArchFrame: React.FC<ProfileArchFrameProps> = ({
  avatarUrl = "assets/profile.png",
  name = "Wiame El Hernoussi",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If avatarUrl starts with "assets/", also try "/assets/..." or direct path
  const src = avatarUrl.startsWith("http") || avatarUrl.startsWith("/")
    ? avatarUrl
    : `/${avatarUrl}`;

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
      {/* Decorative layered ambient aura behind the arch */}
      <div className="absolute -inset-3 rounded-t-[140px] rounded-b-[40px] bg-gradient-to-b from-majorelle/20 via-saffron/15 to-transparent blur-xl dark:from-majorelle-dark/25 dark:via-saffron-dark/15 -z-10" />

      {/* Saffron accent corner ring */}
      <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border-2 border-dashed border-saffron/40 dark:border-saffron-dark/40 animate-[spin_20s_linear_infinite] -z-10" />

      {/* Main Arch Frame */}
      <div className="relative rounded-t-[130px] rounded-b-[32px] p-2 bg-gradient-to-b from-majorelle/40 via-line-light to-line-light dark:from-majorelle-dark/40 dark:via-line-dark dark:to-line-dark shadow-xl backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-t-[122px] rounded-b-[26px] bg-[#E8EBF5] dark:bg-[#151936] aspect-[4/5] flex items-center justify-center">
          
          {/* Subtle blend gradient over the plain grey photo background */}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-light/60 via-transparent to-transparent dark:from-canvas-dark/70 dark:via-transparent dark:to-transparent z-10 pointer-events-none" />

          {!imageError ? (
            <img
              src={src}
              alt={`${name} portrait`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-top transition-all duration-700 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ) : (
            /* Elegant Professional Silhouette Placeholder (Dark blazer with subtle tech aura) */
            <div className="w-full h-full flex flex-col items-center justify-end p-6 text-center select-none bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
              <svg
                viewBox="0 0 240 280"
                className="w-full h-full text-majorelle dark:text-majorelle-dark opacity-90 drop-shadow-sm"
                fill="currentColor"
              >
                {/* AI / Data Halo node */}
                <circle cx="120" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.6" />
                <circle cx="152" cy="30" r="4" fill="#E9A21F" />
                
                {/* Head */}
                <circle cx="120" cy="75" r="32" />
                
                {/* Formal Dark Blazer */}
                <path d="M60 260 L60 210 Q60 145 105 130 L120 160 L135 130 Q180 145 180 210 L180 260 Z" fill="#16193A" />
                {/* Inner Shirt & Lapel */}
                <path d="M105 130 L120 175 L135 130 Z" fill="#FFFFFF" opacity="0.9" />
                <path d="M95 135 L120 190 L105 190 Z" fill="#2B3FA3" opacity="0.7" />
                <path d="M145 135 L120 190 L135 190 Z" fill="#2B3FA3" opacity="0.7" />
              </svg>
              <div className="absolute bottom-4 left-4 right-4 z-20 py-2 px-3 rounded-xl bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border border-line-light dark:border-line-dark shadow-sm">
                <span className="text-xs font-semibold text-ink dark:text-ink-dark block">
                  Wiame El Hernoussi
                </span>
                <span className="text-[11px] text-muted-light dark:text-muted-dark block">
                  Profile Portrait
                </span>
              </div>
            </div>
          )}

          {/* Saffron status beacon */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border border-line-light/80 dark:border-line-dark/80 text-[11px] font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-saffron dark:bg-saffron-dark animate-pulse" />
            <span className="text-ink dark:text-ink-dark font-semibold">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
