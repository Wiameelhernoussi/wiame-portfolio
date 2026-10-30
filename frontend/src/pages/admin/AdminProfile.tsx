import React, { useState, useEffect } from "react";
import {
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
import { api } from "../../services/api";
import { Profile, KeyFigure } from "../../types";

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get<Profile>("/profile");
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingPhoto(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");
    formData.append("crop_portrait", "true");

    try {
      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newAvatarUrl = res.data.url;

      // Update local and save to profile immediately
      setProfile({ ...profile, avatar_url: newAvatarUrl });
      await api.put("/profile/admin", { avatar_url: newAvatarUrl });
      setFeedback({ type: "success", text: "Profile photo uploaded and updated successfully!" });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to upload photo.",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingCV(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "cv");

    try {
      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newCvUrl = res.data.url;

      setProfile({ ...profile, cv_url: newCvUrl });
      await api.put("/profile/admin", { cv_url: newCvUrl });
      setFeedback({ type: "success", text: "CV document uploaded successfully!" });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to upload CV.",
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setFeedback(null);

    try {
      const { data } = await api.put<Profile>("/profile/admin", profile);
      setProfile(data);
      setFeedback({ type: "success", text: "Profile details saved successfully!" });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.response?.data?.detail || "Failed to save profile changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addKeyFigure = () => {
    if (!profile) return;
    const current = profile.key_figures || [];
    setProfile({
      ...profile,
      key_figures: [...current, { label: "New Metric", value: "100%", sub: "" }],
    });
  };

  const updateKeyFigure = (index: number, field: keyof KeyFigure, val: string) => {
    if (!profile) return;
    const updated = [...(profile.key_figures || [])];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, key_figures: updated });
  };

  const removeKeyFigure = (index: number) => {
    if (!profile) return;
    const updated = [...(profile.key_figures || [])].filter((_, i) => i !== index);
    setProfile({ ...profile, key_figures: updated });
  };

  if (loading || !profile) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-majorelle border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
          Profile &amp; Biography Editor
        </h1>
        <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
          Upload your portrait photo, configure your internship availability, and update contact information.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 1. Photo & CV Uploads Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm">
        <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-4">
          Photo &amp; Documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-majorelle overflow-hidden flex items-center justify-center shrink-0 relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url.startsWith("http") || profile.avatar_url.startsWith("/") ? profile.avatar_url : `/${profile.avatar_url}`}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-light dark:text-muted-dark" />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1">
                Profile Portrait
              </label>
              <p className="text-xs text-muted-light dark:text-muted-dark mb-3">
                Upload your formal blazer photo. Automatically crops and optimizes to WebP.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-majorelle text-white text-xs font-bold hover:bg-opacity-95 transition-all cursor-pointer shadow-sm">
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* CV Upload */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1">
                Curriculum Vitae (PDF)
              </label>
              <p className="text-xs text-muted-light dark:text-muted-dark mb-3">
                {profile.cv_url ? "CV attached and ready for visitors to download" : "No CV uploaded yet"}
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-line-light dark:border-line-dark hover:border-majorelle text-ink dark:text-ink-dark text-xs font-bold transition-all cursor-pointer shadow-sm">
                {uploadingCV ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload CV (PDF)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCVUpload}
                  disabled={uploadingCV}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Details */}
        <div className="p-6 sm:p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-5">
          <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
            Biographical Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
              Availability Badge Text
            </label>
            <input
              type="text"
              required
              value={profile.availability_badge}
              onChange={(e) => setProfile({ ...profile, availability_badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
              Hero Pitch
            </label>
            <textarea
              rows={2}
              required
              value={profile.pitch}
              onChange={(e) => setProfile({ ...profile, pitch: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
              About Bio
            </label>
            <textarea
              rows={4}
              required
              value={profile.about_bio}
              onChange={(e) => setProfile({ ...profile, about_bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            />
          </div>
        </div>

        {/* Contact Details & Links (Rule #2 Compliance) */}
        <div className="p-6 sm:p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line-light/60 dark:border-line-dark/60">
            <div>
              <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
                Contact &amp; Social Links
              </h2>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Note: Leave Email or Phone empty to hide them from the public site until you want them shown.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Direct Email (Optional)
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Leave blank to hide on public site"
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Direct Phone (Optional)
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Leave blank to hide on public site"
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              />
            </div>
          </div>
        </div>

        {/* Key Figures Editor */}
        <div className="p-6 sm:p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-line-light/60 dark:border-line-dark/60">
            <div>
              <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
                Key Metrics &amp; Figures
              </h2>
              <p className="text-xs text-muted-light dark:text-muted-dark">
                Displayed in the About section (e.g. 97.30% Intent Accuracy, 3,000+ Docs)
              </p>
            </div>
            <button
              onClick={addKeyFigure}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-majorelle text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Figure</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.key_figures?.map((fig, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Metric Label (e.g. Intent Accuracy)"
                  value={fig.label}
                  onChange={(e) => updateKeyFigure(idx, "label", e.target.value)}
                  className="col-span-4 px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 97.30%)"
                  value={fig.value}
                  onChange={(e) => updateKeyFigure(idx, "value", e.target.value)}
                  className="col-span-3 px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Subtitle detail"
                  value={fig.sub || ""}
                  onChange={(e) => updateKeyFigure(idx, "sub", e.target.value)}
                  className="col-span-4 px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
                />
                <button
                  onClick={() => removeKeyFigure(idx)}
                  type="button"
                  className="col-span-1 p-2 text-rose-500 hover:text-rose-700 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-majorelle text-white font-bold text-sm shadow-md hover:bg-opacity-95 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
