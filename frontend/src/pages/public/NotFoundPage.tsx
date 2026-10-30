import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="font-heading font-extrabold text-7xl sm:text-9xl text-majorelle dark:text-majorelle-dark tracking-tighter block mb-2">
          404
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-light dark:text-muted-dark text-sm sm:text-base mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-majorelle text-white font-semibold text-sm hover:bg-opacity-95 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-line-light dark:border-line-dark text-ink dark:text-ink-dark font-medium text-sm hover:bg-surface-light dark:hover:bg-surface-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};
