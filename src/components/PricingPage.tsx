import React from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Star, Loader2, ArrowRight, Lock, Crown } from 'lucide-react';
import { User, PlanTier } from '../types';

interface PricingPageProps {
  user: User | null;
  onSelectPlan: (plan: 'medium' | 'premium') => void;
  onGetStartedFree: () => void;
  isLoadingPlan: string | null;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  user,
  onSelectPlan,
  onGetStartedFree,
  isLoadingPlan,
}) => {
  const currentPlan = user?.plan || 'free';

  return (
    <div className="bg-white min-h-[calc(100vh-64px)] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Honest & Transparent Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Simple, One-Time Investment in Your Career
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            No recurring monthly charges. No hidden auto-renewals. Upgrade securely via Razorpay with instant feature activation.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {/* 1. FREE PLAN */}
          <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-slate-900">FREE</h3>
                {currentPlan === 'free' && (
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-6">Essential tools for launching your initial job search.</p>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-black text-slate-950">₹0</span>
                <span className="text-xs text-slate-500 font-medium">/ One-time payment</span>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Basic Resume Builder</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>2 Resume Templates</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>5 AI generations</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Basic Portfolio</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onGetStartedFree}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800 transition-colors shadow-2xs"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* 2. MEDIUM PLAN (HIGHLIGHTED AS MOST POPULAR) */}
          <div className="relative rounded-2xl bg-white border-2 border-blue-600 p-8 shadow-xl ring-4 ring-blue-500/10 flex flex-col justify-between hover:shadow-2xl transition-all scale-[1.02] z-10">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-slate-900">MEDIUM</h3>
                {currentPlan === 'medium' && (
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-6">Designed for active job seekers wanting high-impact templates.</p>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-black text-slate-950">₹149</span>
                <span className="text-xs text-blue-700 font-semibold">/ One-time payment</span>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5 text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Everything in Free</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Executive Resume Template</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Creative Resume Template</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>PDF Export</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>30 AI generations</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Custom Portfolio Themes</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              {currentPlan === 'medium' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-blue-50 text-blue-700 cursor-not-allowed text-center"
                >
                  Current Active Plan
                </button>
              ) : currentPlan === 'premium' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-slate-100 text-slate-400 cursor-not-allowed text-center"
                >
                  Included in Premium
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoadingPlan === 'medium'}
                  onClick={() => onSelectPlan('medium')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoadingPlan === 'medium' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Medium</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 3. PREMIUM PLAN (ADVANCED STYLING WITH SUBTLE VIOLET ACCENT) */}
          <div className="relative rounded-2xl bg-white border border-violet-200 p-8 shadow-md flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden">
            {/* Subtle violet highlight badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-violet-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>Full Access</span>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  PREMIUM
                </h3>
                {currentPlan === 'premium' && (
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-6">Uncapped capability for ambitious builders and executives.</p>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-black text-slate-950">₹199</span>
                <span className="text-xs text-purple-700 font-semibold">/ One-time payment</span>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5 text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>Everything in Medium</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>All 5 Resume Templates</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-900">Unlimited AI generations</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>Premium Cyber Glass portfolio theme</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>Advanced AI Resume Assistant</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>Advanced ATS analysis</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              {currentPlan === 'premium' ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-purple-50 text-purple-700 cursor-not-allowed text-center"
                >
                  Current Active Plan
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isLoadingPlan === 'premium'}
                  onClick={() => onSelectPlan('premium')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 active:from-violet-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoadingPlan === 'premium' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Premium</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Razorpay Trust & Payment Methods Banner */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Secure Payment Gateway via Razorpay</h4>
            </div>
            <p className="text-xs text-slate-600">
              Accepts UPI (Google Pay, PhonePe, Paytm, BHIM), Indian & International Debit/Credit Cards, and Net Banking. Instant plan verification upon successful signature.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 shrink-0">
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">UPI</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">Cards</span>
            <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">Net Banking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
