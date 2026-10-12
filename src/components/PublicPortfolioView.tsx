import React from 'react';
import { PortfolioData } from '../types';
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  ExternalLink,
  ArrowUpRight,
  Briefcase,
  Code2,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface PublicPortfolioViewProps {
  portfolio: PortfolioData;
  isStandalone?: boolean;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  portfolio,
  isStandalone = false,
}) => {
  const isCyber = portfolio.theme === 'cyber-glass';
  const isExecutive = portfolio.theme === 'executive-slate';
  const isCreative = portfolio.theme === 'creative-sunset';

  const bgClass = isCyber
    ? 'bg-slate-950 text-slate-100'
    : isExecutive
    ? 'bg-zinc-50 text-zinc-900'
    : isCreative
    ? 'bg-amber-50/30 text-slate-900'
    : 'bg-white text-slate-900';

  const cardBgClass = isCyber
    ? 'bg-slate-900/90 border-slate-800 text-slate-200'
    : isExecutive
    ? 'bg-white border-zinc-200 text-zinc-800'
    : 'bg-white border-slate-200 text-slate-800';

  return (
    <div className={`min-h-screen ${bgClass} font-sans selection:bg-blue-200 selection:text-blue-900`}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8 border-b border-slate-200/60 pb-12">
          <div className="space-y-4 max-w-2xl">
            {portfolio.statusText && (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {portfolio.statusText}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {portfolio.name || 'Anonymous Creator'}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-blue-600">
              {portfolio.tagline || 'Software Engineer & Builder'}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              {portfolio.bio || 'Welcome to my digital workshop. Explore my work and engineering journey below.'}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {portfolio.socialLinks.github && (
                <a
                  href={portfolio.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors bg-white shadow-2xs"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a
                  href={portfolio.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors bg-white shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a
                  href={portfolio.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors bg-white shadow-2xs"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.website && (
                <a
                  href={portfolio.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 transition-colors bg-white shadow-2xs"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {portfolio.contactEmail && (
                <a
                  href={`mailto:${portfolio.contactEmail}`}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Get in Touch
                </a>
              )}
            </div>
          </div>

          {portfolio.avatarUrl && (
            <div className="relative group shrink-0">
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.name}
                className="w-32 h-32 md:w-44 md:h-44 rounded-2xl object-cover shadow-lg border-2 border-white ring-1 ring-slate-200"
              />
            </div>
          )}
        </div>

        {/* Skills Section */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <div className="py-12 border-b border-slate-200/60">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Core Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects Section */}
        <div className="py-12 border-b border-slate-200/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Projects</h2>
              <p className="text-xs text-slate-500 mt-1">Key software engineering and open-source contributions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((project) => (
              <div
                key={project.id}
                className={`rounded-2xl border ${cardBgClass} overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col`}
              >
                {project.image && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                      {project.featured && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          Live Demo <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <div className="py-12 border-b border-slate-200/60">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Work Experience</h2>
            <div className="space-y-6">
              {portfolio.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-blue-500">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex flex-wrap items-baseline justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                    <span className="text-xs font-medium text-slate-500">{exp.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{exp.company}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Contact Banner */}
        <div className="py-12 text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">Let's build something together</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            I am always interested in hearing about new projects, technical challenges, and collaborative opportunities.
          </p>
          {portfolio.contactEmail && (
            <div className="pt-2">
              <a
                href={`mailto:${portfolio.contactEmail}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Say Hello ({portfolio.contactEmail})
              </a>
            </div>
          )}
          <p className="text-[11px] text-slate-400 pt-6">
            Crafted with CareerForge AI · Live Developer Showcase
          </p>
        </div>
      </div>
    </div>
  );
};
