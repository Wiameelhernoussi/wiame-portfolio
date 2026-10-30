import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { api } from "../../services/api";
import { Project } from "../../types";

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get<Project[]>("/projects/admin/all");
      setProjects(data);
    } catch (err) {
      console.error("Failed to load admin projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/projects/admin/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      const updated = !project.is_published;
      await api.put(`/projects/admin/${project.id}`, { is_published: updated });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_published: updated } : p))
      );
    } catch (err) {
      console.error("Failed to toggle publish status", err);
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update locally
    setProjects(reordered);

    // Send batch order update to backend
    const payload = reordered.map((p, idx) => ({ id: p.id, order_index: idx + 1 }));
    try {
      await api.put("/projects/admin/reorder/batch", payload);
    } catch (err) {
      console.error("Failed to persist project reordering", err);
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Projects Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Create, edit, reorder, and publish your technical portfolio projects.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          type="button"
          className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-bold text-xs sm:text-sm hover:bg-opacity-95 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-canvas-light/50 dark:bg-canvas-dark/50 border-b border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Status</th>
                <th className="py-3.5 px-4 text-center">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-light/60 dark:divide-line-dark/60">
              {projects.map((proj, idx) => (
                <tr
                  key={proj.id}
                  className="hover:bg-canvas-light/30 dark:hover:bg-canvas-dark/30 transition-colors"
                >
                  {/* Order move buttons */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveOrder(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-line-light/50 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveOrder(idx, "down")}
                        disabled={idx === projects.length - 1}
                        className="p-1 rounded hover:bg-line-light/50 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px] text-muted-light dark:text-muted-dark ml-1">
                        #{idx + 1}
                      </span>
                    </div>
                  </td>

                  {/* Title & Featured */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {proj.is_featured && (
                        <Star className="w-3.5 h-3.5 text-saffron fill-saffron shrink-0" />
                      )}
                      <div>
                        <span className="font-heading font-bold text-ink dark:text-ink-dark block">
                          {proj.title}
                        </span>
                        <span className="text-[11px] text-muted-light dark:text-muted-dark font-mono block">
                          /{proj.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-muted-light dark:text-muted-dark">
                    {proj.category}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-canvas-light dark:bg-canvas-dark border border-line-light dark:border-line-dark">
                      {proj.status}
                    </span>
                  </td>

                  {/* Visibility Switch */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => togglePublish(proj)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        proj.is_published
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {proj.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/projects/${proj.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-line-light dark:border-line-dark hover:text-majorelle text-muted-light dark:text-muted-dark"
                        title="View Public Case Study"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg border border-line-light dark:border-line-dark hover:border-majorelle text-majorelle dark:text-majorelle-dark"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded-lg border border-line-light dark:border-line-dark hover:border-rose-500 text-rose-500"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <ProjectEditorModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchProjects}
      />

    </div>
  );
};
