import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import { Education } from "../../types";

export const AdminEducation: React.FC = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await api.get<Education[]>("/education");
      setEducation(data);
    } catch (err) {
      console.error("Failed to load education", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingEdu({
      degree: "",
      institution: "",
      location: "Marrakech, Morocco",
      start_date: "",
      end_date: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    setSaving(true);
    try {
      if (editingEdu.id) {
        await api.put(`/education/admin/${editingEdu.id}`, editingEdu);
      } else {
        await api.post("/education/admin", editingEdu);
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await api.delete(`/education/admin/${id}`);
      setEducation((prev) => prev.filter((e) => e.id !== id));
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
            Education Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Manage your academic credentials, engineering degrees, and preparatory classes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-bold text-xs sm:text-sm hover:bg-opacity-95 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-1">
                {edu.degree}
              </h3>
              <p className="text-xs font-semibold text-majorelle dark:text-majorelle-dark mb-1">
                {edu.institution}
              </p>
              <p className="text-xs text-muted-light dark:text-muted-dark font-mono mb-2">
                {edu.start_date} – {edu.end_date} · {edu.location}
              </p>
              {edu.description && (
                <p className="text-xs text-ink/80 dark:text-ink-dark/80 line-clamp-2 max-w-2xl">
                  {edu.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(edu)}
                className="p-2 rounded-xl border border-line-light dark:border-line-dark hover:border-majorelle text-majorelle dark:text-majorelle-dark"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-2 rounded-xl border border-line-light dark:border-line-dark hover:border-rose-500 text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-muted-light dark:text-muted-dark hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading font-bold text-xl mb-4 text-ink dark:text-ink-dark">
              {editingEdu.id ? "Edit Education" : "New Education Entry"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="Engineering Degree in Computer & Network Engineering"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="EMSI Marrakech"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingEdu.start_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">End Date</label>
                  <input
                    type="text"
                    value={editingEdu.end_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })}
                    placeholder="2027"
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editingEdu.location || "Marrakech, Morocco"}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm resize-none"
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
