import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  FileText,
  Globe,
  Zap,
  Code,
  Download,
  Users,
  Star,
  ChevronRight,
  Award,
  Layers,
} from 'lucide-react';
import { ResumeData } from '../types';
import { ResumeRenderer } from './resume-templates/ResumeTemplates';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplorePricing: () => void;
  onLoginClick: () => void;
  previewResume: ResumeData;
  onSelectPlan?: (plan: 'medium' | 'premium') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExplorePricing,
  onLoginClick,
  previewResume,
  onSelectPlan,
}) => {
  return (
    <div className="bg-white text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-slate-100">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Resume & Developer Portfolio Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Build job-winning resumes & public portfolios in minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop struggling with formatting and blank screens. CareerForge AI transforms your work experience into ATS-optimized resumes and high-converting developer showcase websites.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Start Building for Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExplorePricing}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              View Affordable Plans (₹0 - ₹199)
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-500 font-medium border-t border-slate-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>99% ATS Friendly</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Razorpay One-Time Payment</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Watermarks</span>
            </div>
          </div>
        </div>

        {/* Live Mockup Showcase */}
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5 shadow-2xl">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner max-h-[500px] overflow-y-auto">
              <ResumeRenderer resume={previewResume} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Built for Modern Tech Careers</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to land interviews and showcase projects
            </h3>
            <p className="text-sm text-slate-600">
              Crafted with clean typography, recruiter-tested schemas, and intelligent writing assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Gemini 3.8 Flash AI Copilot</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate action-oriented bullet points using the Google XYZ formula, crisp executive summaries, and recommended skills tailored to your exact role.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">5 Recruiter-Approved Templates</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                From 1-column ATS-hardened templates to modern executive and creative portfolios. Easily customize accent colors, typography, and density.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Live Public Portfolio Page</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly convert your resume into a live personal portfolio website with a unique shareable slug. Showcase GitHub repos, live demos, and skills.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Flawless Vector PDF Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Print or download high-fidelity A4 PDFs formatted with print CSS media queries. No text clipping, no unwanted second pages, 100% selectable text.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Instant Razorpay Checkout</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No recurring entrapment. Upgrade for ₹149 or ₹199 via UPI, Cards, or NetBanking. Payments are cryptographically verified on the server.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Real-Time Live Editing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch every character update immediately in the resume preview. Switch templates or adjust zoom on the fly without page reloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Streamlined Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From zero to hired in 3 simple steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 relative">
              <div className="text-3xl font-black text-blue-600/20 font-mono">01.</div>
              <h4 className="text-base font-bold text-slate-900">Input Your Experience or Import Sample</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your work history, education, and projects. Use our pre-built engineer templates to get started in seconds.
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="text-3xl font-black text-blue-600/20 font-mono">02.</div>
              <h4 className="text-base font-bold text-slate-900">Refine with Gemini 3.8 AI</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click "AI Generate" to polish your bullet points, quantify results, and optimize for target job keywords and ATS criteria.
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="text-3xl font-black text-blue-600/20 font-mono">03.</div>
              <h4 className="text-base font-bold text-slate-900">Export PDF & Publish Your Portfolio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download your print-ready PDF resume and share your live public portfolio link with recruiters on LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Loved by Engineers & Designers</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Real results from job seekers across India and beyond
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "The STAR bullet point generator is incredible. It turned my vague job descriptions into quantified accomplishments that helped me land 4 interview callbacks in 2 weeks."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-900">Rohan Verma</p>
                <p className="text-[11px] text-slate-500">Software Engineer at FinCorp</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Having a live portfolio page created directly from my resume without writing CSS from scratch was a game changer. The ₹149 plan paid for itself immediately."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-900">Pooja Nair</p>
                <p className="text-[11px] text-slate-500">Full-Stack Developer</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "The ATS Standard template passed Greenhouse and Workday tests flawlessly. The PDF export formatting is crisp and sharp on print. Outstanding tool."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-900">Karthik Sundaram</p>
                <p className="text-[11px] text-slate-500">Cloud Solutions Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Affordable Career Investment</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Fair, One-Time Pricing Powered by Razorpay
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              No recurring monthly subscriptions. Choose your plan and unlock immediate ATS advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* FREE */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">FREE</h4>
                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="text-3xl font-black text-slate-950">₹0</span>
                  <span className="text-xs text-slate-500">/ One-time payment</span>
                </div>
                <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Basic Resume Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>2 Resume Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>5 AI generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Basic Portfolio</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* MEDIUM (MOST POPULAR) */}
            <div className="p-8 rounded-2xl bg-white border-2 border-blue-600 shadow-xl ring-4 ring-blue-500/10 flex flex-col justify-between relative scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">MEDIUM</h4>
                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="text-3xl font-black text-slate-950">₹149</span>
                  <span className="text-xs text-blue-700 font-semibold">/ One-time payment</span>
                </div>
                <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Executive Resume Template</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Creative Resume Template</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>PDF Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>30 AI generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Custom Portfolio Themes</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (onSelectPlan ? onSelectPlan('medium') : onExplorePricing())}
                className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Upgrade to Medium
              </button>
            </div>

            {/* PREMIUM */}
            <div className="p-8 rounded-2xl bg-white border border-violet-200 shadow-md flex flex-col justify-between relative">
              <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase">
                Best Value
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">PREMIUM</h4>
                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="text-3xl font-black text-slate-950">₹199</span>
                  <span className="text-xs text-purple-700 font-semibold">/ One-time payment</span>
                </div>
                <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Everything in Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>All 5 Resume Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Unlimited AI generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Premium Cyber Glass theme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Advanced AI Resume Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Advanced ATS analysis</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (onSelectPlan ? onSelectPlan('premium') : onExplorePricing())}
                className="mt-6 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 bg-white text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              CF
            </div>
            <span className="font-bold text-slate-900">CareerForge AI</span>
            <span className="text-slate-400">·</span>
            <span>AI Resume & Developer Portfolio Builder</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={onGetStarted} className="hover:text-slate-900 transition-colors">
              Builder
            </button>
            <button onClick={onExplorePricing} className="hover:text-slate-900 transition-colors">
              Pricing
            </button>
            <button onClick={onLoginClick} className="hover:text-slate-900 transition-colors">
              Sign In
            </button>
          </div>

          <div>
            <p>© {new Date().getFullYear()} CareerForge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
