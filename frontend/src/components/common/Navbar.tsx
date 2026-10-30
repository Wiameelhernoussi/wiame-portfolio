import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, Lock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Projects", href: isHome ? "#projects" : "/#projects" },
    { name: "Experience", href: isHome ? "#experience" : "/#experience" },
    { name: "Skills", href: isHome ? "#skills" : "/#skills" },
    { name: "Education", href: isHome ? "#education" : "/#education" },
    { name: "About", href: isHome ? "#about" : "/#about" },
    { name: "Contact", href: isHome ? "#contact" : "/#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#") && isHome) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-canvas-light/90 dark:bg-canvas-dark/90 backdrop-blur-md border-b border-line-light/80 dark:border-line-dark/80 py-3.5 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-ink dark:text-ink-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-lg px-1"
        >
          <span className="w-8 h-8 rounded-lg bg-majorelle dark:bg-majorelle text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            W
          </span>
          <span className="group-hover:text-majorelle dark:group-hover:text-majorelle-dark transition-colors">
            Wiame El Hernoussi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-light dark:text-muted-dark">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith("#") && isHome) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              className="hover:text-majorelle dark:hover:text-majorelle-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded px-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark border border-majorelle/20"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin
            </Link>
          ) : null}

          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                handleNavClick("#contact");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-majorelle text-white hover:bg-opacity-90 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            <span>Let's talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden p-2 rounded-xl border border-line-light dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-light dark:hover:bg-surface-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-canvas-light dark:bg-canvas-dark border-b border-line-light dark:border-line-dark px-6 py-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-4 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("#") && isHome) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="py-2 text-ink dark:text-ink-dark hover:text-majorelle dark:hover:text-majorelle-dark transition-colors border-b border-line-light/50 dark:border-line-dark/50"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={isHome ? "#contact" : "/#contact"}
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-xl bg-majorelle text-white font-semibold text-sm shadow-sm"
              >
                Let's talk
              </a>
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className="w-full text-center py-2 px-4 rounded-xl border border-line-light dark:border-line-dark text-sm font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
