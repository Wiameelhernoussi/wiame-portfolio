import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import { Skill } from "../../types";

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get<Skill[]>("/skills");
      setSkills(data);
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSkill({
      name: "",
      category: "AI & Machine Learning",
      level: 85,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setSaving(true);
    try {
      if (editingSkill.id) {
        await api.put(`/skills/admin/${editingSkill.id}`, editingSkill);
      } else {
        await api.post("/skills/admin", editingSkill);
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/admin/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
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

  const categories = ["AI & Machine Learning", "Data", "Engineering", "Languages & Databases"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Skills Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Manage your technical toolset, categorized competencies, and visual proficiency levels.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-bold text-xs sm:text-sm hover:bg-opacity-95 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catSkills = skills.filter(
            (s) => s.category.toLowerCase() === cat.toLowerCase()
          );

          return (
            <div
              key={cat}
              className="p-6 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm"
            >
              <h2 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-4 pb-2 border-b border-line-light/60 dark:border-line-dark/60">
                {cat}
              </h2>

              <div className="space-y-2.5">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light/40 dark:bg-canvas-dark/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-sm text-ink dark:text-ink-dark block">
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark">
                        Level: {skill.level}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1 text-muted-light dark:text-muted-dark hover:text-majorelle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-1 text-muted-light dark:text-muted-dark hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {catSkills.length === 0 && (
                  <p className="text-xs text-muted-light dark:text-muted-dark italic py-2">
                    No skills added in this category.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-muted-light dark:text-muted-dark hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading font-bold text-xl mb-4 text-ink dark:text-ink-dark">
              {editingSkill.id ? "Edit Skill" : "New Skill"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. PyTorch"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">Category</label>
                <select
                  value={editingSkill.category || "AI & Machine Learning"}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase">Proficiency Level</label>
                  <span className="text-xs font-mono font-bold text-majorelle dark:text-majorelle-dark">
                    {editingSkill.level || 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={editingSkill.level || 85}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })
                  }
                  className="w-full accent-majorelle"
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
