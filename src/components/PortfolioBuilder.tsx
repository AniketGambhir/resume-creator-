import React, { useState } from 'react';
import { PortfolioData, ResumeData, User } from '../types';
import { PublicPortfolioView } from './PublicPortfolioView';
import {
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Palette,
  Sparkles,
  RefreshCw,
  FolderPlus,
  Layout,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface PortfolioBuilderProps {
  portfolio: PortfolioData;
  resume: ResumeData;
  onChange: (updated: PortfolioData) => void;
  onSave: () => void;
  user: User | null;
  onUpgradeClick: () => void;
  onViewPublic: (slug: string) => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({
  portfolio,
  resume,
  onChange,
  onSave,
  user,
  onUpgradeClick,
  onViewPublic,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'themes'>('profile');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const userPlan = user?.plan || 'free';

  const publicUrl = `${window.location.origin}/#/portfolio/${portfolio.slug}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleManualSave = () => {
    onSave();
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  // 1-Click sync with current resume
  const importFromResume = () => {
    const updated: PortfolioData = {
      ...portfolio,
      name: resume.personalInfo.fullName || portfolio.name,
      tagline: resume.personalInfo.jobTitle || portfolio.tagline,
      bio: resume.personalInfo.summary || portfolio.bio,
      contactEmail: resume.personalInfo.email || portfolio.contactEmail,
      socialLinks: {
        ...portfolio.socialLinks,
        github: resume.personalInfo.github ? `https://${resume.personalInfo.github}` : portfolio.socialLinks.github,
        linkedin: resume.personalInfo.linkedin ? `https://${resume.personalInfo.linkedin}` : portfolio.socialLinks.linkedin,
        website: resume.personalInfo.website || portfolio.socialLinks.website,
        email: resume.personalInfo.email || portfolio.socialLinks.email,
      },
      skills: [...new Set([...resume.skills.technical, ...resume.skills.tools])],
      experience: resume.experience.map((e) => ({
        id: 'pe_' + e.id,
        role: e.role,
        company: e.company,
        period: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`,
        description: e.bullets.slice(0, 2).join(' '),
      })),
      projects: resume.projects.map((p) => ({
        id: 'pp_' + p.id,
        title: p.title,
        description: p.description,
        tags: p.techStack,
        demoUrl: p.link,
        repoUrl: p.github ? `https://${p.github}` : undefined,
        featured: true,
      })),
    };
    onChange(updated);
  };

  const addProject = () => {
    const newProj = {
      id: 'pp_' + Date.now(),
      title: 'New Featured Project',
      description: 'Project description showcasing architecture and impact.',
      tags: ['React', 'TypeScript'],
      featured: true,
    };
    onChange({ ...portfolio, projects: [...portfolio.projects, newProj] });
  };

  const removeProject = (id: string) => {
    onChange({ ...portfolio, projects: portfolio.projects.filter((p) => p.id !== id) });
  };

  const updateProject = (id: string, field: string, val: any) => {
    onChange({
      ...portfolio,
      projects: portfolio.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
      {/* Top Bar with Public Shareable Link */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500 font-normal">Slug:</span>
            <input
              type="text"
              value={portfolio.slug}
              onChange={(e) =>
                onChange({
                  ...portfolio,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                })
              }
              className="bg-transparent font-mono font-medium text-slate-800 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
          </div>

          <button
            type="button"
            onClick={copyPublicLink}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync with Resume */}
          <button
            type="button"
            onClick={importFromResume}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Import projects, bio and experience from Resume"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            Sync from Resume
          </button>

          {/* View Public Live */}
          <button
            type="button"
            onClick={() => onViewPublic(portfolio.slug)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview Fullscreen
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleManualSave}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isSavedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> : <Save className="w-3.5 h-3.5" />}
            {isSavedFeedback ? 'Saved!' : 'Save Portfolio'}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor (Left) & Real-time Live Portfolio View (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Editor Form Column */}
        <div className="lg:col-span-5 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-120px)] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="flex p-2 bg-slate-100/80 border-b border-slate-200 gap-1 overflow-x-auto text-xs font-medium sticky top-0 z-10 backdrop-blur-sm">
            {[
              { id: 'profile', label: 'Profile & Bio' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'themes', label: 'Themes & Style' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4 flex-1">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Personal Information & Branding</h3>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={portfolio.name}
                    onChange={(e) => onChange({ ...portfolio, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Headline / Tagline</label>
                  <input
                    type="text"
                    value={portfolio.tagline}
                    onChange={(e) => onChange({ ...portfolio, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status Banner Text</label>
                  <input
                    type="text"
                    value={portfolio.statusText || ''}
                    onChange={(e) => onChange({ ...portfolio, statusText: e.target.value })}
                    placeholder="e.g. Open to Senior Engineering roles"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bio / About Me</label>
                  <textarea
                    rows={4}
                    value={portfolio.bio}
                    onChange={(e) => onChange({ ...portfolio, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">Profile Photo URL</label>
                    <div className="flex gap-1 text-[11px] text-blue-600 font-medium">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...portfolio,
                            avatarUrl:
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                          })
                        }
                        className="hover:underline"
                      >
                        1
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...portfolio,
                            avatarUrl:
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                          })
                        }
                        className="hover:underline"
                      >
                        2
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...portfolio,
                            avatarUrl:
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                          })
                        }
                        className="hover:underline"
                      >
                        3
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={portfolio.avatarUrl || ''}
                    onChange={(e) => onChange({ ...portfolio, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Social & Contact Links</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={portfolio.socialLinks.github || ''}
                      onChange={(e) =>
                        onChange({
                          ...portfolio,
                          socialLinks: { ...portfolio.socialLinks, github: e.target.value },
                        })
                      }
                      placeholder="GitHub URL"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={portfolio.socialLinks.linkedin || ''}
                      onChange={(e) =>
                        onChange({
                          ...portfolio,
                          socialLinks: { ...portfolio.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="LinkedIn URL"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={portfolio.contactEmail || ''}
                      onChange={(e) => onChange({ ...portfolio, contactEmail: e.target.value })}
                      placeholder="Contact Email Address"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Showcase Projects</h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                {portfolio.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">{proj.title || 'Project'}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.demoUrl || ''}
                          onChange={(e) => updateProject(proj.id, 'demoUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Repository URL</label>
                        <input
                          type="text"
                          value={proj.repoUrl || ''}
                          onChange={(e) => updateProject(proj.id, 'repoUrl', e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Image / Preview URL</label>
                      <input
                        type="text"
                        value={proj.image || ''}
                        onChange={(e) => updateProject(proj.id, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.tags.join(', ')}
                        onChange={(e) =>
                          updateProject(
                            proj.id,
                            'tags',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Career Timeline & Skills</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills Badges (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={portfolio.skills.join(', ')}
                    onChange={(e) =>
                      onChange({
                        ...portfolio,
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Experience Highlights</span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...portfolio,
                          experience: [
                            ...portfolio.experience,
                            {
                              id: 'pe_' + Date.now(),
                              role: 'Senior Engineer',
                              company: 'Company',
                              period: '2022 - Present',
                              description: 'Led core development and scaled systems.',
                            },
                          ],
                        })
                      }
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Position
                    </button>
                  </div>

                  {portfolio.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-800">#{idx + 1} {exp.role}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...portfolio,
                              experience: portfolio.experience.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExp = [...portfolio.experience];
                            newExp[idx].role = e.target.value;
                            onChange({ ...portfolio, experience: newExp });
                          }}
                          placeholder="Role"
                          className="px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...portfolio.experience];
                            newExp[idx].company = e.target.value;
                            onChange({ ...portfolio, experience: newExp });
                          }}
                          placeholder="Company"
                          className="px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const newExp = [...portfolio.experience];
                          newExp[idx].period = e.target.value;
                          onChange({ ...portfolio, experience: newExp });
                        }}
                        placeholder="2022 - Present"
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...portfolio.experience];
                          newExp[idx].description = e.target.value;
                          onChange({ ...portfolio, experience: newExp });
                        }}
                        placeholder="Description..."
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THEMES TAB */}
            {activeTab === 'themes' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Portfolio Themes</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: 'modern-minimal',
                      name: 'Modern Minimal',
                      desc: 'Clean white canvas, crisp slate typography, blue accents',
                      tier: 'free',
                    },
                    {
                      id: 'executive-slate',
                      name: 'Executive Slate',
                      desc: 'Refined zinc contrast, elegant luxury feel',
                      tier: 'medium',
                    },
                    {
                      id: 'cyber-glass',
                      name: 'Cyber Glass Dark',
                      desc: 'Sleek dark mode, neon cyan indicators, hacker aesthetics',
                      tier: 'premium',
                    },
                    {
                      id: 'creative-sunset',
                      name: 'Creative Sunset',
                      desc: 'Warm amber tones, creative studio styling',
                      tier: 'medium',
                    },
                  ].map((thm) => {
                    const isLocked =
                      (thm.tier === 'medium' && userPlan === 'free') ||
                      (thm.tier === 'premium' && userPlan !== 'premium');
                    const isSelected = portfolio.theme === thm.id;

                    return (
                      <div
                        key={thm.id}
                        onClick={() => {
                          if (isLocked) {
                            onUpgradeClick();
                          } else {
                            onChange({ ...portfolio, theme: thm.id as any });
                          }
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">{thm.name}</span>
                            {thm.tier !== 'free' && (
                              <span className="text-[10px] uppercase font-bold text-slate-500">
                                {thm.tier}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{thm.desc}</span>
                        </div>

                        {isLocked ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpgradeClick();
                            }}
                            className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded"
                          >
                            Unlock
                          </button>
                        ) : isSelected ? (
                          <span className="text-xs font-semibold text-blue-600">Active</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Portfolio Preview Column (Right) */}
        <div className="lg:col-span-7 bg-slate-100 overflow-y-auto h-[calc(100vh-120px)] border-t lg:border-t-0 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden min-h-full">
            <PublicPortfolioView portfolio={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
};
