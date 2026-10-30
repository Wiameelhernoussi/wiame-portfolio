import React, { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle2, Reply, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import { ContactMessage } from "../../types";

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filterUnread]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = filterUnread ? "/messages/admin/all?unread_only=true" : "/messages/admin/all";
      const { data } = await api.get<ContactMessage[]>(url);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/messages/admin/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    } catch (err) {
      console.error("Mark read error", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/admin/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Messages Inbox
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Recruiter and visitor inquiries submitted through your portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnread}
              onChange={(e) => setFilterUnread(e.target.checked)}
              className="rounded text-majorelle focus:ring-saffron"
            />
            <span>Show Unread Only</span>
          </label>
          <button
            onClick={fetchMessages}
            className="p-2 rounded-xl border border-line-light dark:border-line-dark hover:border-majorelle text-muted-light dark:text-muted-dark"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-2xl border shadow-sm transition-all ${
              !msg.is_read
                ? "border-majorelle/40 dark:border-majorelle-dark/40 bg-surface-light dark:bg-surface-dark"
                : "border-line-light dark:border-line-dark bg-surface-light/40 dark:bg-surface-dark/40 opacity-80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                {!msg.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron dark:bg-saffron-dark shrink-0 animate-pulse" />
                )}
                <h3 className="font-heading font-bold text-base text-ink dark:text-ink-dark">
                  {msg.name}
                </h3>
                <span className="text-xs text-muted-light dark:text-muted-dark font-mono">
                  &lt;{msg.email}&gt;
                </span>
              </div>

              <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>

            <div className="mb-3">
              <span className="text-xs font-semibold text-majorelle dark:text-majorelle-dark block mb-1">
                Subject: {msg.subject}
              </span>
              <p className="text-sm text-ink/90 dark:text-ink-dark/90 leading-relaxed whitespace-pre-wrap bg-canvas-light/60 dark:bg-canvas-dark/60 p-4 rounded-xl border border-line-light/50 dark:border-line-dark/50">
                {msg.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-muted-light dark:text-muted-dark font-mono">
                IP: {msg.sender_ip}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="px-3 py-1.5 rounded-lg border border-line-light dark:border-line-dark text-xs font-semibold hover:border-majorelle text-majorelle dark:text-majorelle-dark inline-flex items-center gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </a>
                {!msg.is_read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="px-3 py-1.5 rounded-lg border border-line-light dark:border-line-dark text-xs font-semibold hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="text-center py-16 border border-dashed border-line-light dark:border-line-dark rounded-2xl text-muted-light dark:text-muted-dark text-sm">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
};
