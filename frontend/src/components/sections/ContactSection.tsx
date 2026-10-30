import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { api } from "../../services/api";
import { Profile } from "../../types";

interface ContactSectionProps {
  profile: Profile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // hidden anti-spam field
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const email = profile?.email;
  const phone = profile?.phone;
  const location = profile?.location || "Marrakech, Morocco (Open to Relocation)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await api.post("/messages", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#2B3FA3", "#E9A21F", "#7E92F2"],
      });
    } catch (err: any) {
      setStatus("error");
      const detail = err.response?.data?.detail;
      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-line-light/80 dark:border-line-dark/80 bg-surface-light dark:bg-surface-dark transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Outreach & Status */}
          <div className="lg:col-span-5">
            <MotionReveal>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron dark:bg-saffron-dark" />
                <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
                  Let's Connect
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark mb-4">
                Let's discuss an internship or project.
              </h2>
              <p className="text-base text-muted-light dark:text-muted-dark leading-relaxed mb-8 max-w-[45ch]">
                Currently seeking an end-of-studies internship (PFE) starting February 2027 in Data Engineering, AI, or Machine Learning in Morocco or abroad.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 text-sm text-ink dark:text-ink-dark">
                  <span className="p-2.5 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>{location}</span>
                </div>

                {/* Conditional display of email per rule #2 */}
                {email ? (
                  <div className="flex items-center gap-3.5 text-sm text-ink dark:text-ink-dark">
                    <span className="p-2.5 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark shrink-0">
                      <Mail className="w-4 h-4" />
                    </span>
                    <a href={`mailto:${email}`} className="hover:underline text-majorelle dark:text-majorelle-dark font-medium">
                      {email}
                    </a>
                  </div>
                ) : null}

                {/* Conditional display of phone per rule #2 */}
                {phone ? (
                  <div className="flex items-center gap-3.5 text-sm text-ink dark:text-ink-dark">
                    <span className="p-2.5 rounded-xl bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark shrink-0">
                      <Phone className="w-4 h-4" />
                    </span>
                    <a href={`tel:${phone}`} className="hover:underline text-majorelle dark:text-majorelle-dark font-medium">
                      {phone}
                    </a>
                  </div>
                ) : null}
              </div>

              {/* Verified Profiles */}
              <div className="mt-10 pt-8 border-t border-line-light/60 dark:border-line-dark/60">
                <span className="text-xs font-semibold text-muted-light dark:text-muted-dark block mb-3 uppercase tracking-wider">
                  Professional Profiles
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/wiameelhernoussi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark text-xs font-semibold hover:border-majorelle dark:hover:border-majorelle-dark transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/Wiameelhernoussi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark text-xs font-semibold hover:border-majorelle dark:hover:border-majorelle-dark transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <MotionReveal delay={0.15}>
              <div className="p-8 sm:p-10 rounded-3xl border border-line-light dark:border-line-dark bg-canvas-light/50 dark:bg-canvas-dark/50 shadow-sm">
                
                {status === "success" && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-bold">Message sent successfully!</p>
                      <p className="text-xs mt-0.5">
                        Thank you for reaching out. I have received your message and will reply promptly.
                      </p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <p className="font-bold">Unable to send message</p>
                      <p className="text-xs mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Hidden Anti-Spam Honeypot Field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-field">Leave this empty</label>
                    <input
                      id="website-field"
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                        Your Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sarah@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. 2027 End-of-Studies Internship Opportunity"
                      className="w-full px-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about the role, your team, or project details..."
                      className="w-full px-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-majorelle text-white font-bold text-sm sm:text-base hover:bg-opacity-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </MotionReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
