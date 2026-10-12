import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building2, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  isOpen: boolean;
  orderData: {
    orderId: string;
    amount: number;
    currency: string;
    plan: string;
  } | null;
  userId?: string;
  onClose: () => void;
  onSuccess: (data: { plan: string; user?: any }) => void;
  onFailure: (err: string) => void;
  onCancel?: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  orderData,
  userId,
  onClose,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !orderData) return null;

  const planName = orderData.plan === 'medium' ? 'Medium Plan' : 'Premium Plan';
  const amountInRupees = orderData.amount / 100;

  const handlePayNow = async (shouldFail = false) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate Razorpay network processing
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (shouldFail) {
        setIsProcessing(false);
        setErrorMessage('Payment failed: Transaction was declined by customer bank. Please try another payment method.');
        onFailure('Transaction was declined by bank.');
        return;
      }

      // Generate payment ID
      const paymentId = `pay_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
      const signature = `sig_${Date.now()}`;

      // Call server verification
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          plan: orderData.plan,
          userId,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment signature verification failed on the server.');
      }

      setIsProcessing(false);
      onClose();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#2563eb', '#6366f1', '#10b981', '#3b82f6'],
      });

      onSuccess({ plan: orderData.plan, user: verifyData.user });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed.');
      onFailure(err.message || 'Payment processing failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">Razorpay</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 text-blue-100 px-2 py-0.5 rounded">
                Test Mode
              </span>
            </div>
            <button
              onClick={() => {
                if (onCancel) onCancel();
                onClose();
              }}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <p className="text-xs text-blue-100">CareerForge AI</p>
              <h3 className="text-base font-semibold">{planName}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">₹{amountInRupees}</span>
              <p className="text-[11px] text-blue-100">Order #{orderData.orderId.slice(-6)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                method === 'upi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              UPI / QR
            </button>
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                method === 'card'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setMethod('netbanking')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                method === 'netbanking'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-700" />
              NetBanking
            </button>
          </div>

          {/* UPI Form */}
          {method === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter UPI ID / VPA
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. name@okhdfcbank"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setUpiId('success@razorpay')}
                    className="px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    Use Test VPA
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-around p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <span className="font-semibold text-slate-800">GPay</span>
                <span>PhonePe</span>
                <span>Paytm</span>
                <span>BHIM</span>
              </div>
            </div>
          )}

          {/* Cards Form */}
          {method === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NetBanking Form */}
          {method === 'netbanking' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 text-xs font-medium text-left rounded-xl border transition-all ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="mt-6 space-y-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePayNow(false)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying with Razorpay...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Pay ₹{amountInRupees} Securely
                </>
              )}
            </button>

            {/* Test cancel/failure trigger for testing robust error handling */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePayNow(true)}
              className="w-full py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Simulate Bank Decline / Payment Failure
            </button>
          </div>

          {/* Footer security badges */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Secured</span>
            </div>
            <span>Razorpay Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
