import React from 'react';
import { ShieldCheck, Check, ArrowRight, X, CreditCard, Smartphone, Building2, Sparkles, Lock } from 'lucide-react';
import { PlanTier } from '../types';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  plan: 'medium' | 'premium' | null;
  onClose: () => void;
  onProceedToRazorpay: (plan: 'medium' | 'premium') => void;
  isLoading: boolean;
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  plan,
  onClose,
  onProceedToRazorpay,
  isLoading,
}) => {
  if (!isOpen || !plan) return null;

  const isMedium = plan === 'medium';
  const planName = isMedium ? 'Medium Pro' : 'Premium Lifetime';
  const price = isMedium ? 149 : 199;

  const planFeatures = isMedium
    ? [
        'Executive & Creative Resume Templates',
        '30 AI Generations with STAR Formula',
        'High-Resolution PDF Export',
        'Custom Portfolio Themes (Slate & Sunset)',
        'Custom Domain Slug for Public Portfolio',
      ]
    : [
        'All 5 Professional Resume Templates Unlocked',
        'Unlimited AI Copilot Generations',
        'Premium Cyber Glass Dark Portfolio Theme',
        'Advanced ATS Keyword & Structure Analysis',
        'Priority Feature Updates & Support',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">Order Confirmation</span>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{planName}</h3>
              <p className="text-xs text-blue-100 mt-0.5">CareerForge AI Plan Upgrade</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black">₹{price}</span>
              <p className="text-[11px] text-blue-100">One-time payment</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Plan Features Summary */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Features Included in this Plan:
            </span>
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              {planFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Supported */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Supported Payment Methods:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 shadow-2xs">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-semibold text-slate-700">UPI / QR</span>
                <span className="text-[9px] text-slate-400">GPay, PhonePe, Paytm</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 shadow-2xs">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-700">Cards</span>
                <span className="text-[9px] text-slate-400">Visa, Master, RuPay</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 shadow-2xs">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span className="text-[11px] font-semibold text-slate-700">Net Banking</span>
                <span className="text-[9px] text-slate-400">All Major Banks</span>
              </div>
            </div>
          </div>

          {/* Security Assurance Banner */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950">Secure Razorpay Checkout</p>
              <p className="text-[11px] text-blue-800/80 mt-0.5">
                Your payment will be securely processed in Razorpay Test Mode with 256-bit encryption. No recurring charges or hidden fees.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onProceedToRazorpay(plan)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 disabled:opacity-60 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isLoading ? (
                <span>Initializing Razorpay Order...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Continue to Razorpay (₹{price})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
