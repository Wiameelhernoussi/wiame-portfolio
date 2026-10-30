import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Lock } from "lucide-react";

interface FooterProps {
  githubUrl?: string;
  linkedinUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  githubUrl = "https://github.com/Wiameelhernoussi",
  linkedinUrl = "https://www.linkedin.com/in/wiameelhernoussi/",
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-line-light dark:border-line-dark bg-surface-light/40 dark:bg-surface-dark/40 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-base text-ink dark:text-ink-dark">
              <span>Wiame El Hernoussi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-saffron dark:bg-saffron-dark inline-block" />
              <span className="text-sm font-normal text-muted-light dark:text-muted-dark">
                Data &amp; AI Engineer
              </span>
            </div>
            <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
              Available for an end-of-studies internship starting February 2027.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-majorelle dark:hover:text-majorelle-dark hover:border-majorelle dark:hover:border-majorelle-dark transition-all"
                aria-label="GitHub Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-majorelle dark:hover:text-majorelle-dark hover:border-majorelle dark:hover:border-majorelle-dark transition-all"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.54a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                </svg>
              </a>
            )}
            <button
              onClick={scrollToTop}
              type="button"
              className="p-2.5 rounded-xl border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-line-light/50 dark:border-line-dark/50 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-light dark:text-muted-dark gap-3">
          <p>© {new Date().getFullYear()} Wiame El Hernoussi. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span>English Only</span>
            <span>•</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 hover:text-majorelle dark:hover:text-majorelle-dark transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
