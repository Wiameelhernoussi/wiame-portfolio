import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Star, Tag, Calendar } from "lucide-react";
import { MotionReveal } from "../common/MotionReveal";
import { Project } from "../../types";

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === "All" ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query) ||
        (p.technologies || []).some((t) => t.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchTerm]);

  // Separate featured project from regular cards
  const featuredProject = useMemo(() => {
    return projects.find((p) => p.is_featured) || projects[0];
  }, [projects]);

  return (
    <section id="projects" className="py-24 border-t border-line-light/80 dark:border-line-dark/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <MotionReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron dark:bg-saffron-dark" />
                <span className="font-heading font-bold text-xs uppercase tracking-widest text-majorelle dark:text-majorelle-dark">
                  Portfolio &amp; Engineering
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink dark:text-ink-dark">
                Featured Projects
              </h2>
              <p className="text-base text-muted-light dark:text-muted-dark mt-2 max-w-[65ch]">
                From raw multimodal sensor data and enterprise ETL pipelines to fine-tuned vision models, LLM agents, and interactive PWAs.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects or tech..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-ink dark:text-ink-dark placeholder-muted-light dark:placeholder-muted-dark text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron transition-all"
              />
            </div>
          </div>
        </MotionReveal>

        {/* Category Filter Pills */}
        <MotionReveal delay={0.1}>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                  selectedCategory === cat
                    ? "bg-majorelle text-white shadow-sm"
                    : "border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-majorelle/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </MotionReveal>

        {/* Featured Project Showcase Card (Shown when All or relevant category selected and no search) */}
        {!searchTerm && selectedCategory === "All" && featuredProject && (
          <MotionReveal delay={0.15}>
            <div className="mb-14 rounded-3xl border border-line-light dark:border-line-dark bg-gradient-to-br from-majorelle via-majorelle/95 to-slate-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden group">
              {/* Decorative accent geometry */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/15 rounded-full blur-3xl -z-0 pointer-events-none" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-4 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
                    <span>Featured Internship Project</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mb-3">
                    {featuredProject.title}
                  </h3>

                  <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-[65ch]">
                    {featuredProject.short_description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredProject.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/projects/${featuredProject.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron-dark text-slate-900 font-bold text-sm shadow-md transition-all active:scale-95"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {featuredProject.links?.github && (
                      <a
                        href={featuredProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Quantified Metrics in Featured Card */}
                <div className="lg:col-span-5 flex flex-col gap-3.5">
                  {featuredProject.metrics?.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm text-white/80 font-medium">
                        {m.label}
                      </span>
                      <span className="font-heading font-extrabold text-xl sm:text-2xl text-saffron">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        )}

        {/* Regular Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <MotionReveal key={project.id} delay={(index % 3) * 0.1}>
              <div className="group h-full flex flex-col justify-between rounded-2xl border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm hover:shadow-md hover:border-majorelle dark:hover:border-majorelle-dark transition-all duration-300">
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-majorelle dark:text-majorelle-dark flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {project.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-canvas-light dark:bg-canvas-dark border border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark font-medium">
                      {project.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-ink dark:text-ink-dark group-hover:text-majorelle dark:group-hover:text-majorelle-dark transition-colors mb-2.5">
                    <Link to={`/projects/${project.slug}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed line-clamp-3 mb-4">
                    {project.short_description}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.technologies?.length || 0) > 4 && (
                      <span className="text-[11px] text-muted-light dark:text-muted-dark self-center">
                        +{(project.technologies?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer with Metrics & Detail Link */}
                <div className="pt-4 border-t border-line-light/60 dark:border-line-dark/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.start_date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-light dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
                        aria-label={`GitHub repo for ${project.title}`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-majorelle dark:text-majorelle-dark hover:underline"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-line-light dark:border-line-dark rounded-2xl">
            <p className="text-muted-light dark:text-muted-dark text-sm">
              No projects found matching your filter criteria.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
