import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, ArrowRight, Zap, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onApplyToResume: (field: string, content: any) => void;
  onUpgradeClick: () => void;
  defaultType?: 'summary' | 'experience-bullets' | 'project-description' | 'skills' | 'ats-critique';
  initialContext?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  user,
  onApplyToResume,
  onUpgradeClick,
  defaultType = 'summary',
  initialContext = '',
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'experience-bullets' | 'project-description' | 'skills' | 'ats-critique'>(defaultType);
  const [promptInput, setPromptInput] = useState('');
  const [contextInput, setContextInput] = useState(initialContext);
  const [tone, setTone] = useState('Executive & Results-Oriented');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const userPlan = user?.plan || 'free';
  const aiUsed = user?.aiGenerationsUsed || 0;
  const maxAi = userPlan === 'free' ? 5 : userPlan === 'medium' ? 30 : Infinity;
  const isLimitReached = aiUsed >= maxAi;

  const handleGenerate = async () => {
    if (isLimitReached) {
      setErrorMsg(`AI generation limit reached for ${userPlan.toUpperCase()} plan.`);
      return;
    }

    if (!promptInput.trim()) {
      setErrorMsg('Please enter details or key points for the AI to work with.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedText('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          prompt: promptInput,
          context: activeTab === 'summary' ? `${tone}. ${contextInput}` : contextInput,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI content.');
      }

      setGeneratedText(data.text);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (activeTab === 'summary') {
      onApplyToResume('summary', generatedText);
    } else if (activeTab === 'experience-bullets') {
      // Split into array of bullet points
      const bullets = generatedText
        .split('\n')
        .map((l) => l.replace(/^[•\-\*\d\.]+\s*/, '').trim())
        .filter((l) => l.length > 5);
      onApplyToResume('bullets', bullets);
    } else if (activeTab === 'skills') {
      // Extract skills comma-separated
      const skills = generatedText
        .split(/[,\n]/)
        .map((s) => s.replace(/^[•\-\*\d\.]+\s*/, '').replace(/^[A-Za-z\s]+:/, '').trim())
        .filter((s) => s.length > 1 && s.length < 35);
      onApplyToResume('skills', skills);
    } else {
      onApplyToResume(activeTab, generatedText);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">CareerForge AI Copilot</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Gemini 3.8 Flash</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-blue-600">
                  {userPlan === 'premium' ? 'Unlimited generations' : `${aiUsed} of ${maxAi} used`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls - Functional Buttons */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto flex gap-1">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'experience-bullets', label: 'Bullet Points' },
            { id: 'project-description', label: 'Projects' },
            { id: 'skills', label: 'Skills' },
            { id: 'ats-critique', label: 'ATS Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setGeneratedText('');
                setErrorMsg(null);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLimitReached && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-xs text-amber-800">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Generation limit reached ({maxAi} max for {userPlan} plan)</p>
                  <p className="mt-0.5 text-amber-700">
                    Upgrade to Medium (30 generations) or Premium (unlimited) via Razorpay.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onUpgradeClick();
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 shadow-sm transition-colors"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Form Fields according to tab */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Skills, Roles & Years of Experience
                </label>
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. 5 years as Senior React and Node.js developer, worked in fintech, led 4 engineers, scaled systems to 1M users"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tone of Voice</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option>Executive & Results-Oriented</option>
                    <option>Technical & Architectural</option>
                    <option>Creative & Innovative</option>
                    <option>Early-Career & Ambitious</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="e.g. Staff Software Engineer"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience-bullets' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Title & Company
                </label>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer at Acme Inc."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Tasks / Achievements You Want Quantified
                </label>
                <textarea
                  rows={2}
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. built migration to Next.js, improved load speed, handled payments API with Razorpay, reduced errors"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'project-description' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Name & Purpose
                </label>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. AutoMetrics - Real-time Database Health Monitor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tech Stack & Highlights
                </label>
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. TypeScript, React, Go, Docker, WebSockets"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Job Title / Domain
                </label>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Full-Stack AI Engineer or Cloud DevOps Lead"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Current Experience / Tools (optional)
                </label>
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. JavaScript, Python, SQL"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'ats-critique' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste Resume Snippet or Summary for ATS Audit
                </label>
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Paste your resume content or experience section here to get an ATS audit score and recommendations..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading || isLimitReached}
            onClick={handleGenerate}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting with Gemini 3.8 Flash...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Tailored Content
              </>
            )}
          </button>

          {/* Generated Result */}
          {generatedText && (
            <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  AI Recommendation:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg text-xs flex items-center gap-1 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  {activeTab !== 'ats-critique' && (
                    <button
                      type="button"
                      onClick={handleApply}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Apply to Resume
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white p-3.5 rounded-lg border border-slate-200">
                {generatedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
