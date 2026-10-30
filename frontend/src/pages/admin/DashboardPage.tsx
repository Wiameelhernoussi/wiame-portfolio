import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Award,
  Mail,
  Users,
  Eye,
  Plus,
  ArrowRight,
  User,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../services/api";
import { DashboardSummary, ContactMessage } from "../../types";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, msgRes] = await Promise.all([
          api.get<DashboardSummary>("/analytics/admin/dashboard"),
          api.get<ContactMessage[]>("/messages/admin/all?unread_only=true"),
        ]);
        setStats(statsRes.data);
        setRecentMessages(msgRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/messages/admin/${id}/read`);
      setRecentMessages((prev) => prev.filter((m) => m.id !== id));
      if (stats) {
        setStats({
          ...stats,
          unread_messages_count: Math.max(0, stats.unread_messages_count - 1),
        });
      }
    } catch (err) {
      console.error("Failed to mark message read", err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-majorelle border-t-transparent animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Projects",
      value: stats?.projects_count ?? 0,
      icon: FolderGit2,
      color: "text-majorelle dark:text-majorelle-dark",
      bg: "bg-majorelle-light dark:bg-majorelle-darkSurface",
      link: "/admin/projects",
    },
    {
      label: "Certificates",
      value: stats?.certificates_count ?? 0,
      icon: Award,
      color: "text-saffron dark:text-saffron-dark",
      bg: "bg-saffron-light dark:bg-[#332711]",
      link: "/admin/certificates",
    },
    {
      label: "Unread Messages",
      value: stats?.unread_messages_count ?? 0,
      icon: Mail,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      link: "/admin/messages",
    },
    {
      label: "Total Visits",
      value: stats?.total_visits ?? 0,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      link: "/admin",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-majorelle to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-saffron uppercase tracking-widest block mb-1">
            Control Center
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mb-2">
            Welcome back, Wiame
          </h1>
          <p className="text-sm text-white/80 max-w-xl">
            Manage your portfolio projects, upload your formal portrait, update contact details, and review recruiter inquiries in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/profile"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm"
          >
            <User className="w-4 h-4 text-majorelle" />
            <span>Upload Photo &amp; Profile</span>
          </Link>
          <Link
            to="/admin/projects"
            className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:border-majorelle/50 dark:hover:border-majorelle-dark/50 transition-all hover:-translate-y-1 block group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </span>
                <ArrowRight className="w-4 h-4 text-muted-light dark:text-muted-dark opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-ink dark:text-ink-dark block mb-1">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                {card.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Unread Inquiries Section */}
      <div className="p-6 sm:p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-line-light/60 dark:border-line-dark/60">
          <div>
            <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
              Unread Inquiries
            </h2>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Messages received from your portfolio contact form
            </p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold text-majorelle dark:text-majorelle-dark hover:underline flex items-center gap-1"
          >
            <span>View all messages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages.length > 0 ? (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light/40 dark:bg-canvas-dark/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-sm text-ink dark:text-ink-dark">
                      {msg.name}
                    </span>
                    <span className="text-xs text-muted-light dark:text-muted-dark font-mono">
                      ({msg.email})
                    </span>
                  </div>
                  <p className="text-xs text-ink/80 dark:text-ink-dark/80 font-medium">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-1 mt-0.5">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="px-3 py-1.5 rounded-lg border border-line-light dark:border-line-dark text-xs font-semibold hover:border-majorelle text-majorelle dark:text-majorelle-dark"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => markAsRead(msg.id)}
                    type="button"
                    className="p-1.5 rounded-lg border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark hover:text-emerald-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-light dark:text-muted-dark text-sm">
            No unread messages. Your inbox is clean!
          </div>
        )}
      </div>

    </div>
  );
};
