import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { api } from "../../services/api";
import { Certificate } from "../../types";

export const AdminCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get<Certificate[]>("/certificates/admin/all");
      setCertificates(data);
    } catch (err) {
      console.error("Failed to load certificates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (c: Certificate) => {
    setEditingCert(c);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingCert({
      title: "",
      issuer: "Coursera",
      issue_date: "",
      image_url: "",
      pdf_url: "",
      verification_url: "",
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "certificates");

    try {
      const res = await api.post("/admin/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (file.type === "application/pdf") {
        setEditingCert({ ...editingCert, pdf_url: res.data.url });
      } else {
        setEditingCert({ ...editingCert, image_url: res.data.url });
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setSaving(true);
    try {
      if (editingCert.id) {
        await api.put(`/certificates/admin/${editingCert.id}`, editingCert);
      } else {
        await api.post("/certificates/admin", editingCert);
      }
      setIsModalOpen(false);
      fetchCertificates();
    } catch (err) {
      console.error("Save certificate error", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (cert: Certificate) => {
    try {
      const updated = !cert.is_visible;
      await api.put(`/certificates/admin/${cert.id}`, { is_visible: updated });
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, is_visible: updated } : c))
      );
    } catch (err) {
      console.error("Toggle visibility error", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await api.delete(`/certificates/admin/${id}`);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
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
            Certificates Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Upload images, attach verification links, and toggle visibility on the public site.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-majorelle text-white font-bold text-xs sm:text-sm hover:bg-opacity-95 shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-canvas-light/50 dark:bg-canvas-dark/50 border-b border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Issuer</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Files</th>
              <th className="py-3.5 px-4 text-center">Public Visibility</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light/60 dark:divide-line-dark/60">
            {certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-canvas-light/30 dark:hover:bg-canvas-dark/30">
                <td className="py-3.5 px-4 font-heading font-bold text-ink dark:text-ink-dark">
                  {cert.title}
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-muted-light dark:text-muted-dark">
                  {cert.issuer}
                </td>
                <td className="py-3.5 px-4 hidden md:table-cell">
                  {cert.image_url || cert.pdf_url ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      File Attached
                    </span>
                  ) : (
                    <span className="text-muted-light dark:text-muted-dark text-xs italic">
                      No document attached
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => toggleVisibility(cert)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      cert.is_visible
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {cert.is_visible ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="p-1.5 rounded-lg border border-line-light dark:border-line-dark hover:border-majorelle text-majorelle dark:text-majorelle-dark"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-1.5 rounded-lg border border-line-light dark:border-line-dark hover:border-rose-500 text-rose-500"
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

      {/* Certificate Modal */}
      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface-light dark:bg-surface-dark border border-line-light dark:border-line-dark p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-muted-light dark:text-muted-dark hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading font-bold text-xl mb-4 text-ink dark:text-ink-dark">
              {editingCert.id ? "Edit Certificate" : "New Certificate"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="e.g. Machine Learning"
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Issuer</label>
                  <input
                    type="text"
                    value={editingCert.issuer || "Coursera"}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={editingCert.issue_date || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Verification URL (Coursera link)
                </label>
                <input
                  type="url"
                  value={editingCert.verification_url || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, verification_url: e.target.value })
                  }
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-sm"
                />
              </div>

              {/* Upload Certificate file */}
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Certificate Document (Image or PDF)
                </label>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-line-light dark:border-line-dark rounded-xl hover:border-majorelle cursor-pointer text-xs font-semibold">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>
                        {editingCert.image_url || editingCert.pdf_url
                          ? "Replace Attached Document"
                          : "Upload Image or PDF"}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cert-vis"
                  checked={editingCert.is_visible ?? false}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, is_visible: e.target.checked })
                  }
                  className="rounded text-majorelle focus:ring-saffron"
                />
                <label htmlFor="cert-vis" className="text-xs font-semibold cursor-pointer">
                  Visible on public website
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line-light dark:border-line-dark text-xs font-semibold"
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
