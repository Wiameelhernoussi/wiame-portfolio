import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Video,
  FileText,
  Calendar,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { SafeMarkdown } from "../../components/common/SafeMarkdown";
import { MotionReveal } from "../../components/common/MotionReveal";
import { api } from "../../services/api";
import { Project } from "../../types";

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<Project>(`/projects/by-slug/${slug}`);
        setProject(data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-majorelle border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading font-bold text-3xl mb-3 text-ink dark:text-ink-dark">
          Project Not Found
        </h1>
        <p className="text-muted-light dark:text-muted-dark text-sm mb-6">
          The requested project does not exist or has been unpublished.
        </p>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-majorelle text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(project.cover_image ? [{ url: project.cover_image, caption: "Cover Preview" }] : []),
    ...(project.gallery_images || []),
  ];

  return (
    <div className="pb-28">
      {/* Breadcrumb & Navigation Bar */}
      <div className="border-b border-line-light/80 dark:border-line-dark/80 bg-surface-light/40 dark:bg-surface-dark/40 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-muted-light dark:text-muted-dark hover:text-majorelle dark:hover:text-majorelle-dark transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects</span>
          </Link>

          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">
            {project.category}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Header Block */}
        <MotionReveal>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark text-xs font-bold">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-canvas-light dark:bg-canvas-dark border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark text-xs font-medium">
              {project.status}
            </span>
            <span className="text-xs font-mono text-muted-light dark:text-muted-dark ml-auto flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.start_date} – {project.end_date}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-light dark:text-muted-dark leading-relaxed mb-8 max-w-prose">
            {project.short_description}
          </p>
        </MotionReveal>

        {/* Quantified Metrics Showcase */}
        {project.metrics && project.metrics.length > 0 && (
          <MotionReveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {project.metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm"
                >
                  <span className="text-xs text-muted-light dark:text-muted-dark block mb-1">
                    {m.label}
                  </span>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-majorelle dark:text-majorelle-dark">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </MotionReveal>
        )}

        {/* Interactive Action Links */}
        <MotionReveal delay={0.15}>
          <div className="flex flex-wrap gap-3 pb-8 mb-8 border-b border-line-light/80 dark:border-line-dark/80">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-all hover:bg-slate-800"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-majorelle text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-opacity-95 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Interactive Demo</span>
              </a>
            )}
            {project.links?.video && (
              <a
                href={project.links.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold hover:border-saffron transition-all"
              >
                <Video className="w-4 h-4 text-saffron dark:text-saffron-dark" />
                <span>Video Presentation</span>
              </a>
            )}
            {project.links?.pdf && (
              <a
                href={project.links.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold hover:border-majorelle transition-all"
              >
                <FileText className="w-4 h-4 text-majorelle dark:text-majorelle-dark" />
                <span>Technical Report (PDF)</span>
              </a>
            )}
          </div>
        </MotionReveal>

        {/* Gallery / Image Lightbox Preview if images available */}
        {allImages.length > 0 && (
          <MotionReveal delay={0.2}>
            <div className="mb-12">
              <h3 className="font-heading font-bold text-lg text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-majorelle dark:text-majorelle-dark" />
                <span>Project Gallery &amp; Architecture Diagrams</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark aspect-video shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Image ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                      <Eye className="w-4 h-4" />
                      <span>Zoom View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        )}

        {/* Long Markdown Description rendered with SafeMarkdown (sanitized) */}
        <MotionReveal delay={0.25}>
          <div className="p-8 sm:p-12 rounded-3xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark shadow-sm mb-16">
            <SafeMarkdown content={project.long_description} />
          </div>
        </MotionReveal>

        {/* Technologies Breakdown Pills */}
        <MotionReveal delay={0.3}>
          <div className="p-6 rounded-2xl border border-line-light dark:border-line-dark bg-surface-light/40 dark:bg-surface-dark/40 mb-16">
            <h4 className="font-heading font-bold text-sm text-ink dark:text-ink-dark uppercase tracking-wider mb-3">
              Technologies &amp; Libraries Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark border border-majorelle/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </MotionReveal>

        {/* Previous / Next Project Navigation Bar */}
        {project.navigation && (
          <div className="pt-8 border-t border-line-light dark:border-line-dark grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.navigation.prev_slug ? (
              <Link
                to={`/projects/${project.navigation.prev_slug}`}
                className="p-5 rounded-2xl border border-line-light dark:border-line-dark hover:border-majorelle dark:hover:border-majorelle-dark transition-all flex items-center gap-3 group"
              >
                <ArrowLeft className="w-5 h-5 text-muted-light dark:text-muted-dark group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="text-[11px] font-mono uppercase text-muted-light dark:text-muted-dark block">
                    Previous Project
                  </span>
                  <span className="font-heading font-bold text-sm sm:text-base text-ink dark:text-ink-dark group-hover:text-majorelle dark:group-hover:text-majorelle-dark">
                    {project.navigation.prev_title}
                  </span>
                </div>
              </Link>
            ) : <div />}

            {project.navigation.next_slug ? (
              <Link
                to={`/projects/${project.navigation.next_slug}`}
                className="p-5 rounded-2xl border border-line-light dark:border-line-dark hover:border-majorelle dark:hover:border-majorelle-dark transition-all flex items-center justify-end gap-3 group text-right"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase text-muted-light dark:text-muted-dark block">
                    Next Project
                  </span>
                  <span className="font-heading font-bold text-sm sm:text-base text-ink dark:text-ink-dark group-hover:text-majorelle dark:group-hover:text-majorelle-dark">
                    {project.navigation.next_title}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-light dark:text-muted-dark group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && allImages[activeImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (activeImageIndex - 1 + allImages.length) % allImages.length
                  )
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((activeImageIndex + 1) % allImages.length)
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={allImages[activeImageIndex].url}
              alt={allImages[activeImageIndex].caption || "Enlarged preview"}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            {allImages[activeImageIndex].caption && (
              <p className="mt-3 text-sm text-white/80 font-medium">
                {allImages[activeImageIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
