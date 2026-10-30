import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Award,
  Briefcase,
  GraduationCap,
  Wrench,
  Mail,
  Sliders,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../common/ThemeToggle";

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-light dark:bg-canvas-dark">
        <div className="w-8 h-8 rounded-full border-4 border-majorelle border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Profile & Photo", href: "/admin/profile", icon: User },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Skills", href: "/admin/skills", icon: Wrench },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Site Settings", href: "/admin/settings", icon: Sliders },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark transition-colors">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-line-light/70 dark:border-line-dark/70">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-majorelle text-white flex items-center justify-center font-bold text-sm">
                W
              </span>
              <div>
                <span className="font-heading font-bold text-sm block leading-tight">
                  Wiame CMS
                </span>
                <span className="text-[10px] text-muted-light dark:text-muted-dark block">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-majorelle text-white shadow-sm"
                        : "text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark hover:text-ink dark:hover:text-ink-dark"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-line-light/70 dark:border-line-dark/70 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-light dark:text-muted-dark hover:bg-canvas-light dark:hover:bg-canvas-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-line-light dark:border-line-dark bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-muted-light dark:text-muted-dark hidden sm:inline">
              Signed in as: <strong className="text-ink dark:text-ink-dark">{user?.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-line-light dark:border-line-dark hover:border-majorelle transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
