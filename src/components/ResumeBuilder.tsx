import React, { useState } from 'react';
import { ResumeData, User } from '../types';
import { ResumeRenderer } from './resume-templates/ResumeTemplates';
import {
  Sparkles,
  Download,
  Plus,
  Trash2,
  Save,
  Palette,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Award,
  Eye,
  CheckCircle2,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface ResumeBuilderProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onSave: () => void;
  user: User | null;
  onOpenAIModal: (type: 'summary' | 'experience-bullets' | 'project-description' | 'skills' | 'ats-critique', context?: string) => void;
  onUpgradeClick: () => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  onChange,
  onSave,
  user,
  onOpenAIModal,
  onUpgradeClick,
}) => {
  const [activeSection, setActiveSection] = useState<
    'personal' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'style'
  >('personal');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const userPlan = user?.plan || 'free';

  // Template permissions
  const templates = [
    { id: 'modern-tech', name: 'Modern Tech', free: true },
    { id: 'ats-standard', name: 'ATS Standard', free: true },
    { id: 'minimal-executive', name: 'Minimal Executive', free: false },
    { id: 'creative-pro', name: 'Creative Pro', free: false },
    { id: 'vibrant-duo', name: 'Vibrant Duo', free: false },
  ];

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPdfUpgradePrompt, setShowPdfUpgradePrompt] = useState(false);

  const handlePrintPdf = () => {
    if (userPlan === 'free') {
      setShowPdfUpgradePrompt(true);
      return;
    }
    window.print();
  };

  const handleDownloadTxt = () => {
    let txt = `${(resume.personalInfo.fullName || 'Candidate Name').toUpperCase()}\n`;
    txt += `${resume.personalInfo.jobTitle || 'Role'}\n`;
    txt += `Contact: ${[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin, resume.personalInfo.github].filter(Boolean).join(' | ')}\n\n`;

    if (resume.personalInfo.summary) {
      txt += `PROFESSIONAL SUMMARY\n${'='.repeat(30)}\n${resume.personalInfo.summary}\n\n`;
    }

    if (resume.skills.technical.length > 0 || resume.skills.tools.length > 0) {
      txt += `TECHNICAL SKILLS\n${'='.repeat(30)}\n`;
      if (resume.skills.technical.length) txt += `Core Languages & Frameworks: ${resume.skills.technical.join(', ')}\n`;
      if (resume.skills.tools.length) txt += `Tools & Infrastructure: ${resume.skills.tools.join(', ')}\n`;
      if (resume.skills.soft.length) txt += `Leadership: ${resume.skills.soft.join(', ')}\n`;
      txt += '\n';
    }

    if (resume.experience.length > 0) {
      txt += `WORK EXPERIENCE\n${'='.repeat(30)}\n`;
      resume.experience.forEach((e) => {
        txt += `${e.role} — ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n`;
        if (e.location) txt += `Location: ${e.location}\n`;
        e.bullets.forEach((b) => {
          if (b.trim()) txt += `• ${b}\n`;
        });
        txt += '\n';
      });
    }

    if (resume.projects.length > 0) {
      txt += `PROJECTS\n${'='.repeat(30)}\n`;
      resume.projects.forEach((p) => {
        txt += `${p.title}${p.link ? ` [${p.link}]` : ''}\n`;
        txt += `${p.description}\n`;
        if (p.techStack.length) txt += `Tech Stack: ${p.techStack.join(', ')}\n`;
        txt += '\n';
      });
    }

    if (resume.education.length > 0) {
      txt += `EDUCATION\n${'='.repeat(30)}\n`;
      resume.education.forEach((edu) => {
        txt += `${edu.degree} — ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
        if (edu.grade) txt += `Grade: ${edu.grade}\n`;
        txt += '\n';
      });
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS_Plain.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_CareerForge.json`;
    a.click();
    setShowExportMenu(false);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) {
          onChange({ ...parsed, id: resume.id });
        }
      } catch (err) {
        alert('Could not parse JSON resume backup file.');
      }
    };
    reader.readAsText(file);
    setShowExportMenu(false);
  };

  const handleManualSave = () => {
    onSave();
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  // Updaters
  const updatePersonal = (field: string, val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  const addExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange({ ...resume, experience: [...resume.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...resume, experience: resume.experience.filter((e) => e.id !== id) });
  };

  const updateExperience = (id: string, field: string, val: any) => {
    onChange({
      ...resume,
      experience: resume.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
    };
    onChange({ ...resume, education: [...resume.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...resume, education: resume.education.filter((e) => e.id !== id) });
  };

  const updateEducation = (id: string, field: string, val: any) => {
    onChange({
      ...resume,
      education: resume.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const addProject = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      title: '',
      description: '',
      techStack: [],
      bullets: [''],
    };
    onChange({ ...resume, projects: [...resume.projects, newProj] });
  };

  const removeProject = (id: string) => {
    onChange({ ...resume, projects: resume.projects.filter((p) => p.id !== id) });
  };

  const updateProject = (id: string, field: string, val: any) => {
    onChange({
      ...resume,
      projects: resume.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
      {/* Top Action Subheader */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => onChange({ ...resume, title: e.target.value })}
            className="font-bold text-slate-900 text-base bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none transition-colors"
          />
          <span className="text-xs text-slate-500">
            {resume.updatedAt ? `Last saved ${new Date(resume.updatedAt).toLocaleTimeString()}` : 'Draft'}
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* AI ATS Audit Button */}
          <button
            type="button"
            onClick={() => onOpenAIModal('ats-critique', JSON.stringify(resume))}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ATS Audit Score
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleManualSave}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {isSavedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
            {isSavedFeedback ? 'Saved!' : 'Save'}
          </button>

          {/* Export Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs animate-fadeIn">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Download Plain Text (.txt)</span>
                  <span className="text-[10px] text-slate-400">ATS friendly</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Backup JSON Resume</span>
                  <span className="text-[10px] text-slate-400">Restore anytime</span>
                </button>
                <label className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer border-t border-slate-100">
                  <span>Import JSON Backup</span>
                  <span className="text-[10px] text-blue-600">Browse</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* PDF Upgrade Modal if on Free Plan */}
      {showPdfUpgradePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Download Vector PDF Resume</h3>
                <p className="text-xs text-slate-500">Pristine A4 layout with zero watermarks</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-resolution vector PDF export is included with the <strong>Medium (₹149)</strong> and <strong>Premium (₹199)</strong> plans, which also unlock additional recruiter-approved templates and generous AI generation limits!
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPdfUpgradePrompt(false);
                  onUpgradeClick();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Upgrade to Medium Plan (₹149)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPdfUpgradePrompt(false);
                  window.print();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors"
              >
                Continue with Preview Print
              </button>
              <button
                type="button"
                onClick={() => setShowPdfUpgradePrompt(false)}
                className="w-full py-1 text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Layout: Editor Form (Left) & Real-time Live Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Editor Form Column */}
        <div className="lg:col-span-5 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-120px)] overflow-y-auto no-print">
          {/* Section Navigation Tabs */}
          <div className="flex p-2 bg-slate-100/80 border-b border-slate-200 gap-1 overflow-x-auto text-xs font-medium sticky top-0 z-10 backdrop-blur-sm">
            {[
              { id: 'personal', label: 'Personal', icon: Eye },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'skills', label: 'Skills', icon: Wrench },
              { id: 'certifications', label: 'Certs & Honors', icon: Award },
              { id: 'style', label: 'Templates', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                    activeSection === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5 flex-1">
            {/* 1. PERSONAL INFO SECTION */}
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAIModal('summary', `${resume.personalInfo.jobTitle} - ${resume.skills.technical.join(', ')}`)
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Summary
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={resume.personalInfo.jobTitle}
                      onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                      placeholder="Senior Full-Stack Engineer"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                      placeholder="alex.chen@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      placeholder="Bengaluru, India"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">GitHub / Portfolio Link</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => updatePersonal('github', e.target.value)}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Personal Website</label>
                    <input
                      type="text"
                      value={resume.personalInfo.website || ''}
                      onChange={(e) => updatePersonal('website', e.target.value)}
                      placeholder="https://mywebsite.dev"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Professional Summary
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenAIModal('summary', `${resume.personalInfo.jobTitle} - ${resume.skills.technical.join(', ')}`)
                      }
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Refine with AI
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={resume.personalInfo.summary}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                    placeholder="Brief 3-4 sentence summary of your career accomplishments and specialization..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* 2. EXPERIENCE SECTION */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Position
                  </button>
                </div>

                {resume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Position #{expIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Role / Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Lead Engineer"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Synthetix Systems"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="2022"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          disabled={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="Present or 2024"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Currently Working Here
                      </label>

                      <button
                        type="button"
                        onClick={() => onOpenAIModal('experience-bullets', `${exp.role} at ${exp.company}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Generate Bullets
                      </button>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-700">Accomplishment Bullets</label>
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex gap-1.5">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const newBullets = [...exp.bullets];
                              newBullets[bIdx] = e.target.value;
                              updateExperience(exp.id, 'bullets', newBullets);
                            }}
                            placeholder="Accomplished [X] by doing [Z], resulting in [Y]..."
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newBullets = exp.bullets.filter((_, idx) => idx !== bIdx);
                              updateExperience(exp.id, 'bullets', newBullets);
                            }}
                            className="text-slate-400 hover:text-red-600 px-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateExperience(exp.id, 'bullets', [...exp.bullets, ''])}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. EDUCATION SECTION */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Education</h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Education
                  </button>
                </div>

                {resume.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{edu.institution || 'Institution'}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="IIT Delhi"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="B.Tech in Computer Science"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Start Year</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="2016"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">End Year</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="2020"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Grade / CGPA</label>
                        <input
                          type="text"
                          value={edu.grade || ''}
                          onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                          placeholder="8.9 CGPA"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. PROJECTS SECTION */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Featured Projects</h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                {resume.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{proj.title || 'New Project'}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                          placeholder="DocuPulse AI"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Live Link or GitHub</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="block text-[11px] font-medium text-slate-600">Short Description</label>
                        <button
                          type="button"
                          onClick={() => onOpenAIModal('project-description', proj.title)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Description
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="End-to-end intelligent document parser built using LLMs..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                        Tech Stack (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.techStack.join(', ')}
                        onChange={(e) =>
                          updateProject(
                            proj.id,
                            'techStack',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="React, TypeScript, Node.js, PostgreSQL"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. SKILLS SECTION */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Skills & Competencies</h3>
                  <button
                    type="button"
                    onClick={() => onOpenAIModal('skills', resume.personalInfo.jobTitle)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Suggest Skills
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Technical & Programming Skills (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={resume.skills.technical.join(', ')}
                    onChange={(e) =>
                      onChange({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          technical: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="TypeScript, React, Node.js, Python, PostgreSQL, Docker..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Developer Tools, Cloud & Frameworks (comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={resume.skills.tools.join(', ')}
                    onChange={(e) =>
                      onChange({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="Git, AWS, Kubernetes, Vite, Next.js, Redis, CI/CD..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Leadership & Core Soft Skills (comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={resume.skills.soft.join(', ')}
                    onChange={(e) =>
                      onChange({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          soft: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="Technical Leadership, System Architecture, Agile Delivery, Mentoring..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* 6. CERTS & HONORS SECTION */}
            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Certifications & Honors</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certifications</label>
                  <div className="space-y-2">
                    {resume.certifications.map((c, i) => (
                      <div key={c.id} className="flex gap-2">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const newCerts = [...resume.certifications];
                            newCerts[i].name = e.target.value;
                            onChange({ ...resume, certifications: newCerts });
                          }}
                          placeholder="Certificate Name"
                          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={c.issuer}
                          onChange={(e) => {
                            const newCerts = [...resume.certifications];
                            newCerts[i].issuer = e.target.value;
                            onChange({ ...resume, certifications: newCerts });
                          }}
                          placeholder="Issuer (e.g. Google Cloud)"
                          className="w-36 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onChange({
                              ...resume,
                              certifications: resume.certifications.filter((_, idx) => idx !== i),
                            });
                          }}
                          className="text-slate-400 hover:text-red-600 px-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...resume,
                          certifications: [
                            ...resume.certifications,
                            { id: 'c_' + Date.now(), name: '', issuer: '', issueDate: '2024' },
                          ],
                        })
                      }
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. STYLE & TEMPLATE CUSTOMIZER */}
            {activeSection === 'style' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Resume Templates</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {templates.map((tpl) => {
                      const isLocked = !tpl.free && userPlan === 'free';
                      const isSelected = resume.templateId === tpl.id;

                      return (
                        <div
                          key={tpl.id}
                          onClick={() => {
                            if (isLocked) {
                              onUpgradeClick();
                            } else {
                              onChange({ ...resume, templateId: tpl.id as any });
                            }
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-xs text-slate-900 block">{tpl.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {tpl.id === 'ats-standard'
                                ? 'Engineered for 99% ATS machine parsing'
                                : tpl.id === 'minimal-executive'
                                ? 'Single column executive layout'
                                : tpl.id === 'creative-pro'
                                ? 'Slate sidebar modern profile'
                                : tpl.id === 'vibrant-duo'
                                ? 'Dual-tone high impact contemporary'
                                : 'Two-column tech layout'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isLocked ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpgradeClick();
                                }}
                                className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                              >
                                Upgrade ₹149
                              </button>
                            ) : isSelected ? (
                              <span className="text-xs font-semibold text-blue-600">Active</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-2">Accent Color</h3>
                  <div className="flex items-center gap-2.5">
                    {[
                      { hex: '#2563eb', label: 'Tech Blue' },
                      { hex: '#4f46e5', label: 'Indigo' },
                      { hex: '#0f172a', label: 'Slate' },
                      { hex: '#059669', label: 'Emerald' },
                      { hex: '#e11d48', label: 'Rose' },
                      { hex: '#d97706', label: 'Amber' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => onChange({ ...resume, accentColor: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          resume.accentColor === c.hex ? 'border-white ring-2 ring-blue-600 scale-110' : 'border-transparent'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Font and Spacing */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Font Typography</label>
                    <select
                      value={resume.fontFamily}
                      onChange={(e) => onChange({ ...resume, fontFamily: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="sans">Clean Modern Sans</option>
                      <option value="serif">Executive Serif</option>
                      <option value="mono">Technical Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Layout Spacing</label>
                    <select
                      value={resume.spacing}
                      onChange={(e) => onChange({ ...resume, spacing: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="compact">Compact (Fit 1 Page)</option>
                      <option value="normal">Standard</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Resume Preview Column (Right) */}
        <div className="lg:col-span-7 bg-slate-200/60 p-4 lg:p-8 flex flex-col items-center justify-start overflow-y-auto h-[calc(100vh-120px)] relative">
          {/* Zoom floating controller */}
          <div className="sticky top-2 z-20 mb-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs no-print">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-600 font-mono w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Printable Page Sheet */}
          <div
            id="printable-resume"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-[800px] bg-white rounded-lg shadow-xl border border-slate-200/80 overflow-hidden mb-12"
          >
            <ResumeRenderer resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};
