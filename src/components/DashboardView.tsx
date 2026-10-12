import React, { useState } from 'react';
import { User, ResumeData, PortfolioData, PlanTier } from '../types';
import {
  FileText,
  Globe,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Copy,
  ExternalLink,
  Trash2,
  Edit3,
  Check,
  Calendar,
  Lock,
  Crown,
  CheckCircle2,
  Clock,
  Receipt,
  User as UserIcon,
} from 'lucide-react';

interface DashboardViewProps {
  user: User | null;
  resumes: ResumeData[];
  portfolio: PortfolioData;
  onOpenResume: (resumeId: string) => void;
  onCreateResume: () => void;
  onDeleteResume: (resumeId: string) => void;
  onOpenPortfolio: () => void;
  onUpgradeClick: () => void;
  onViewPublicPortfolio: (slug: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  resumes,
  portfolio,
  onOpenResume,
  onCreateResume,
  onDeleteResume,
  onOpenPortfolio,
  onUpgradeClick,
  onViewPublicPortfolio,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'resumes'>('overview');

  const plan = user?.plan || 'free';
  const aiUsed = user?.aiGenerationsUsed || 0;
  const maxAi = plan === 'free' ? 5 : plan === 'medium' ? 30 : Infinity;
  const publicUrl = `${window.location.origin}/#/portfolio/${portfolio.slug}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const latestPayment =
    user?.razorpayPayments && user.razorpayPayments.length > 0
      ? user.razorpayPayments[user.razorpayPayments.length - 1]
      : null;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your resumes, public portfolio, and Razorpay account subscription.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCreateResume}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Resume
            </button>
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              Edit Portfolio
            </button>
          </div>
        </div>

        {/* Tab Navigation Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            Account & Subscription
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resumes')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'resumes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resumes ({resumes.length})
          </button>
        </div>

        {/* ----------------------------------------------------
            ACCOUNT & SUBSCRIPTION SECTION (Requirement 12)
        ---------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'subscription') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {plan === 'premium' ? <Crown className="w-6 h-6 text-purple-600" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Account & Subscription Status</h2>
                  <p className="text-xs text-slate-500">
                    Securely verified and managed via Razorpay Payment Gateway
                  </p>
                </div>
              </div>

              {/* Upgrade Button */}
              {plan !== 'premium' ? (
                <button
                  type="button"
                  onClick={onUpgradeClick}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade Subscription
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Highest Plan Active
                </div>
              )}
            </div>

            {/* Grid of Subscription Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Current Plan */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-lg font-black uppercase text-slate-900">{plan} Plan</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      plan === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : plan === 'medium'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {plan === 'free' ? '₹0' : plan === 'medium' ? '₹149' : '₹199'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {plan === 'premium'
                    ? 'All 5 templates unlocked & unlimited AI'
                    : plan === 'medium'
                    ? 'Executive & Creative templates unlocked'
                    : 'Basic templates & 5 AI runs'}
                </p>
              </div>

              {/* Payment Status */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Status</span>
                <div className="flex items-center gap-2 pt-0.5">
                  {plan === 'free' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                      Free Tier
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified & Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {plan === 'free' ? 'No payment required for free plan' : 'Cryptographically verified via Razorpay'}
                </p>
              </div>

              {/* Purchased Plan & Price */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Purchased Plan</span>
                <p className="text-base font-bold text-slate-900 capitalize pt-0.5">
                  {plan === 'free' ? 'Free Starter' : plan === 'medium' ? 'Medium Pro (₹149)' : 'Premium Lifetime (₹199)'}
                </p>
                <p className="text-[11px] text-slate-500">One-time payment (Lifetime access)</p>
              </div>

              {/* Payment Date */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Date</span>
                <p className="text-base font-bold text-slate-900 pt-0.5">
                  {latestPayment
                    ? new Date(latestPayment.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {latestPayment ? new Date(latestPayment.date).toLocaleTimeString() : 'Account creation date'}
                </p>
              </div>
            </div>

            {/* AI Quota Meter */}
            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">AI Generation Usage</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {plan === 'premium'
                    ? 'Unlimited generations available with Gemini 3.8 Flash'
                    : `${aiUsed} of ${maxAi} generations used on your ${plan.toUpperCase()} plan`}
                </p>
              </div>
              <div className="w-full sm:w-48 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${plan === 'premium' ? 100 : Math.min(100, (aiUsed / maxAi) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            OVERVIEW CARDS (Resumes + Portfolio)
        ---------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'resumes') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your Resumes ({resumes.length})</h2>
              <button
                type="button"
                onClick={onCreateResume}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Another
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {res.templateId.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-1">{res.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {res.personalInfo.fullName} · {res.personalInfo.jobTitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      {res.updatedAt ? new Date(res.updatedAt).toLocaleDateString() : 'Draft'}
                    </span>
                    <div className="flex items-center gap-2">
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteResume(res.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                          title="Delete resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenResume(res.id)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create Card */}
              <div
                onClick={onCreateResume}
                className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white/50 hover:bg-blue-50/20 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2 min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800">Create New Resume</span>
                <span className="text-[11px] text-slate-500">Pick from 5 professional templates</span>
              </div>
            </div>
          </div>
        )}

        {/* Public Portfolio Summary Card */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Your Live Public Portfolio</h3>
              </div>
              <p className="text-xs text-slate-500">
                Shareable link: <span className="font-mono text-slate-700">/{portfolio.slug}</span> · Theme:{' '}
                <span className="font-semibold capitalize text-slate-700">{portfolio.theme.replace('-', ' ')}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyPublicLink}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy Link'}
              </button>
              <button
                type="button"
                onClick={() => onViewPublicPortfolio(portfolio.slug)}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Public
              </button>
            </div>
          </div>
        )}

        {/* Payment History Log (if any) */}
        {user?.razorpayPayments && user.razorpayPayments.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Verified Razorpay Transactions
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="divide-y divide-slate-100 text-xs">
                {user.razorpayPayments.map((p, idx) => (
                  <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-slate-900 capitalize">
                        {p.plan} Plan Subscription (₹{p.amount})
                      </span>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Order ID: {p.orderId} · Payment ID: {p.paymentId}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {new Date(p.date).toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        HMAC Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
