import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Invalid email or password. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-majorelle text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-majorelle/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            Admin CMS Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-1">
            Private management console for Wiame El Hernoussi
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-xl">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wiameelhernoussi.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-ink-dark uppercase tracking-wider mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-line-light dark:border-line-dark bg-canvas-light dark:bg-canvas-dark text-ink dark:text-ink-dark placeholder-muted-light/60 dark:placeholder-muted-dark/60 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-majorelle text-white font-bold text-sm hover:bg-opacity-95 active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick credentials hint for easy access */}
          <div className="mt-6 pt-5 border-t border-line-light/50 dark:border-line-dark/50 text-[11px] text-muted-light dark:text-muted-dark leading-relaxed">
            <span className="font-semibold block mb-1">Initial Superuser Credentials:</span>
            <code className="bg-canvas-light dark:bg-canvas-dark px-1.5 py-0.5 rounded text-[10px] font-mono block mb-1">
              admin@wiameelhernoussi.com
            </code>
            <code className="bg-canvas-light dark:bg-canvas-dark px-1.5 py-0.5 rounded text-[10px] font-mono block">
              ChangeMeNow123!
            </code>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-muted-light dark:text-muted-dark hover:text-majorelle dark:hover:text-majorelle-dark transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
};
