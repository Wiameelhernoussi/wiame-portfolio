import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Loader2,
  Eye,
  Edit3,
} from "lucide-react";
import { SafeMarkdown } from "../../components/common/SafeMarkdown";
import { api } from "../../services/api";
import { Project, ProjectMetric } from "../../types";

interface ProjectEditorModalProps {
  project: Project | null; // null for creating a new project
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    slug: "",
    category: "AI & Machine Learning",
    short_description: "",
    long_description: "",
    technologies: [],
    start_date: "2026",
    end_date: "2026",
    status: "Completed",
    is_featured: false,
    is_published: true,
    cover_image: "",
    metrics: [],
    links: { github: "", demo: "", video: "", pdf: "" },
  });

  const [techInput, setTechInput] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        links: project.links || { github: "", demo: "", video: "", pdf: "" },
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        category: "AI & Machine Learning",
        short_description: "",
        long_description: "### Project Overview\n\n### Key Highlights\n* Point 1\n* Point 2",
        technologies: ["Python", "FastAPI"],
        start_date: "2026",
        end_date: "2026",
        status: "Completed",
        is_featured: false,
        is_published: true,
        cover_image: "",
        metrics: [{ label: "Accuracy", value: "95%" }],
        links: { github: "", demo: "", video: "", pdf: "" },
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      const current = formData.technologies || [];
      if (!current.includes(techInput.trim())) {
        setFormData({ ...formData, technologies: [...current, techInput.trim()] });
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    const current = formData.technologies || [];
    setFormData({
      ...formData,
      technologies: current.filter((t) => t !== tech),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "projects");

    try {
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, cover_image: res.data.url });
    } catch (err: any) {
      setError("Failed to upload image. Please ensure it is a valid JPG, PNG, or WebP.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addMetric = () => {
    const current = formData.metrics || [];
    setFormData({
      ...formData,
      metrics: [...current, { label: "Metric", value: "100%" }],
    });
  };

  const updateMetric = (idx: number, field: keyof ProjectMetric, val: string) => {
    const current = [...(formData.metrics || [])];
    current[idx] = { ...current[idx], [field]: val };
    setFormData({ ...formData, metrics: current });
  };

  const removeMetric = (idx: number) => {
    const current = [...(formData.metrics || [])];
    setFormData({ ...formData, metrics: current.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (project?.id) {
        await api.put(`/projects/admin/${project.id}`, formData);
      } else {
        await api.post("/projects/admin", formData);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line-light/60 dark:border-line-dark/60 shrink-0">
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
              {project ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Complete project documentation with Markdown, metrics, and cover preview
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SmartPark AI"
                className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Computer Vision"
                className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                placeholder="Feb 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                placeholder="May 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
              Short Description (Card Summary) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief overview shown on project card..."
              className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm resize-none"
            />
          </div>

          {/* Long Description Markdown with Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider">
                Full Documentation (Markdown)
              </label>
              <div className="flex items-center gap-1 border border-line-light dark:border-line-dark rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 ${
                    activeTab === "edit"
                      ? "bg-majorelle text-white"
                      : "text-muted-light dark:text-muted-dark"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 ${
                    activeTab === "preview"
                      ? "bg-majorelle text-white"
                      : "text-muted-light dark:text-muted-dark"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <textarea
                required
                rows={8}
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                placeholder="Write detailed Markdown here: ### Architecture, * Bullet point..."
                className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark"
              />
            ) : (
              <div className="p-4 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light/50 dark:bg-canvas-dark/50 max-h-60 overflow-y-auto">
                <SafeMarkdown content={formData.long_description || "_No content entered._"} />
              </div>
            )}
          </div>

          {/* Technologies Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
              Technologies (Type and press Enter)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark text-xs font-semibold inline-flex items-center gap-1"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
              placeholder="e.g. YOLOv8, PyTorch, Docker (press Enter)"
              className="w-full px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-1.5">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              {formData.cover_image && (
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="w-20 h-14 object-cover rounded-xl border border-line-light dark:border-line-dark"
                />
              )}
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark hover:border-majorelle text-xs font-semibold cursor-pointer">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="Or paste image URL"
                value={formData.cover_image || ""}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
              />
            </div>
          </div>

          {/* Quantified Metrics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider">
                Quantified Metrics (Shown in cards)
              </label>
              <button
                type="button"
                onClick={addMetric}
                className="text-xs text-majorelle dark:text-majorelle-dark font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.metrics?.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Accuracy)"
                    value={m.label}
                    onChange={(e) => updateMetric(idx, "label", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 97.30%)"
                    value={m.value}
                    onChange={(e) => updateMetric(idx, "value", e.target.value)}
                    className="w-36 px-3 py-1.5 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider">
              Project Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                placeholder="GitHub URL"
                value={formData.links?.github || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, github: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
              />
              <input
                type="url"
                placeholder="Live Demo URL"
                value={formData.links?.demo || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, demo: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
              />
              <input
                type="url"
                placeholder="Video presentation (YouTube / Canva)"
                value={formData.links?.video || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, video: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
              />
              <input
                type="url"
                placeholder="PDF Technical Report URL"
                value={formData.links?.pdf || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, pdf: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-xs"
              />
            </div>
          </div>

          {/* Switches */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded text-majorelle focus:ring-saffron"
              />
              <span>Featured Project (Highlight on Home)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.is_published ?? true}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded text-majorelle focus:ring-saffron"
              />
              <span>Published (Visible to public)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-line-light/60 dark:border-line-dark/60 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-line-light dark:border-line-dark text-xs font-semibold hover:bg-canvas-light dark:hover:bg-canvas-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-majorelle text-white text-xs font-bold hover:bg-opacity-95 shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
