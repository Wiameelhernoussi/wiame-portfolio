import React, { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";
import { SiteSetting } from "../../types";

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get<SiteSetting>("/settings");
      setSettings(data);
    } catch (err) {
      console.error("Failed to load site settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (sectionKey: string) => {
    if (!settings) return;
    const currentVis = settings.section_visibility || {};
    const updated = {
      ...currentVis,
      [sectionKey]: currentVis[sectionKey] === false ? true : false,
    };
    setSettings({ ...settings, section_visibility: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setFeedback(null);

    try {
      const { data } = await api.put<SiteSetting>("/settings/admin", {
        site_title: settings.site_title,
        meta_description: settings.meta_description,
        keywords: settings.keywords,
        og_image_url: settings.og_image_url,
        accent_color: settings.accent_color,
        primary_color: settings.primary_color,
        section_visibility: settings.section_visibility,
      });
      setSettings(data);
      setFeedback({ type: "success", text: "Site settings updated successfully!" });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to update settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-majorelle animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return <div className="text-center py-12 text-rose-500">Settings record not found.</div>;
  }

  const sectionsList = [
    { key: "hero", label: "Hero Section", desc: "Top introduction, profile photo & CTAs" },
    { key: "about", label: "About Section", desc: "Personal introduction, metrics & languages" },
    { key: "projects", label: "Projects Section", desc: "Interactive project cards & filters" },
    { key: "experience", label: "Experience Section", desc: "Internships and professional history" },
    { key: "skills", label: "Skills Section", desc: "Technical competencies by category" },
    { key: "certificates", label: "Certificates Section", desc: "Certified credentials & verification links" },
    { key: "education", label: "Education Section", desc: "Academic degrees & engineering track" },
    { key: "interests", label: "Interests Section", desc: "Extracurriculars (Basketball, Strength training, Reading)" },
    { key: "contact", label: "Contact Section", desc: "Direct inquiry form and contact coordinates" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Site Configuration & SEO
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Configure global website meta, branding colors, and section visibility.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO & Meta */}
        <div className="p-6 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark space-y-4">
          <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark flex items-center gap-2">
            <Sliders className="w-5 h-5 text-majorelle" />
            <span>SEO & Social Sharing Preview</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1.5">
              Site Title (Browser & Search Engines)
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1.5">
              Meta Description (Search Snippet & LinkedIn/Twitter cards)
            </label>
            <textarea
              rows={3}
              value={settings.meta_description}
              onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1.5">
              SEO Keywords (comma separated)
            </label>
            <input
              type="text"
              value={settings.keywords}
              onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>
        </div>

        {/* Section Visibility Controls */}
        <div className="p-6 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark space-y-4">
          <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
            Public Section Visibility
          </h2>
          <p className="text-xs text-muted-light dark:text-muted-dark">
            Toggle which sections are visible to public visitors. Disabled sections are completely hidden from the homepage navigation and view.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {sectionsList.map((sec) => {
              const isVisible = settings.section_visibility?.[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isVisible
                      ? "border-majorelle/30 bg-majorelle/5 dark:bg-majorelle/10"
                      : "border-line-light dark:border-line-dark bg-canvas-light/60 dark:bg-canvas-dark/60 opacity-60"
                  }`}
                >
                  <div className="pr-2">
                    <p className="text-xs font-bold text-ink dark:text-ink-dark">{sec.label}</p>
                    <p className="text-[11px] text-muted-light dark:text-muted-dark">{sec.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(sec.key)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isVisible
                        ? "bg-majorelle text-white shadow-sm"
                        : "bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark"
                    }`}
                  >
                    {isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Theme Info */}
        <div className="p-6 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
          <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-3">
            Brand Colors Specification
          </h2>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-light dark:border-line-dark">
              <span className="w-5 h-5 rounded-lg bg-[#2B3FA3] shadow-sm" />
              <span>Primary: #2B3FA3 (Majorelle Blue)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-canvas-light dark:bg-canvas-dark border border-line-light dark:border-line-dark">
              <span className="w-5 h-5 rounded-lg bg-[#E9A21F] shadow-sm" />
              <span>Accent: #E9A21F (Saffron)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-majorelle text-white font-bold text-sm hover:bg-opacity-95 active:scale-95 disabled:opacity-50 transition-all shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
