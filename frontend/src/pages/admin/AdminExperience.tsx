import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import { Experience } from "../../types";

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await api.get<Experience[]>("/experiences");
      setExperiences(data);
    } catch (err) {
      console.error("Failed to load experiences", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingExp({
      role: "",
      company: "",
      location: "Marrakech, Morocco",
      start_date: "",
      end_date: "",
      description: "",
      highlights: [],
      technologies: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setIsModalOpen(true);
  };

  const handleAddHighlight = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && highlightInput.trim() && editingExp) {
      e.preventDefault();
      setEditingExp({
        ...editingExp,
        highlights: [...(editingExp.highlights || []), highlightInput.trim()],
      });
      setHighlightInput("");
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim() && editingExp) {
      e.preventDefault();
      setEditingExp({
        ...editingExp,
        technologies: [...(editingExp.technologies || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    setSaving(true);
    try {
      if (editingExp.id) {
        await api.put(`/experiences/admin/${editingExp.id}`, editingExp);
      } else {
        await api.post("/experiences/admin", editingExp);
      }
      setIsModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      await api.delete(`/experiences/admin/${id}`);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-majorelle border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Experience Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Manage your internships, roles, bullet highlights, and company details.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-bold text-xs sm:text-sm hover:bg-opacity-95 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading font-bold text-lg text-ink dark:text-ink-dark">
                  {exp.role}
                </h3>
                <span className="text-sm font-semibold text-majorelle dark:text-majorelle-dark">
                  @ {exp.company}
                </span>
              </div>
              <p className="text-xs text-muted-light dark:text-muted-dark font-mono mb-2">
                {exp.start_date} – {exp.end_date} · {exp.location}
              </p>
              <p className="text-xs text-ink/80 dark:text-ink-dark/80 line-clamp-2 max-w-2xl">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-xl border border-line-light dark:border-line-dark hover:border-majorelle text-majorelle dark:text-majorelle-dark"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-xl border border-line-light dark:border-line-dark hover:border-rose-500 text-rose-500"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 rounded-3xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-muted-light dark:text-muted-dark hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading font-bold text-xl mb-4 text-ink dark:text-ink-dark">
              {editingExp.id ? "Edit Experience" : "New Experience"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingExp.start_date || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    placeholder="Jul 2026"
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">End Date</label>
                  <input
                    type="text"
                    value={editingExp.end_date || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    placeholder="Sep 2026"
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || "Marrakech, Morocco"}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Summary Description</label>
                <textarea
                  rows={3}
                  value={editingExp.description || ""}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm resize-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Bullet Highlights (Type and press Enter)
                </label>
                <div className="space-y-1 mb-2">
                  {editingExp.highlights?.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-canvas-light dark:bg-canvas-dark p-2 rounded-lg">
                      <span>• {h}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingExp({
                            ...editingExp,
                            highlights: editingExp.highlights?.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-rose-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={handleAddHighlight}
                  placeholder="e.g. Achieved 97.30% intent accuracy (press Enter)"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Technologies (Type and press Enter)
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editingExp.technologies?.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="e.g. FastAPI, ChromaDB (press Enter)"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-majorelle text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
