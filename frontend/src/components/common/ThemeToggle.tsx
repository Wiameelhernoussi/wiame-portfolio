import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl transition-all duration-200 border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark hover:border-saffron dark:hover:border-saffron-dark text-ink dark:text-ink-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-saffron-dark transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-majorelle transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
