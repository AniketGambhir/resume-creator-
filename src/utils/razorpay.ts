import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CheckoutOptions {
  plan: 'medium' | 'premium';
  userId?: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (data: { plan: string; user?: any }) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
  openSimulatedModal?: (orderData: {
    orderId: string;
    amount: number;
    currency: string;
    plan: string;
  }) => void;
}

export async function initiateRazorpayCheckout(options: CheckoutOptions) {
  const {
    plan,
    userId,
    userName = 'CareerForge User',
    userEmail = 'user@careerforge.dev',
    onSuccess,
    onFailure,
    onDismiss,
    openSimulatedModal,
  } = options;

  try {
    // 1. Create order securely on backend
    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, userId }),
    });

    if (!orderRes.ok) {
      const errData = await orderRes.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to initialize payment order on server.');
    }

    const orderData = await orderRes.json();
    const { orderId, amount, currency, keyId, isSimulated } = orderData;

    // Check if real Razorpay script is present and valid
    if (typeof window.Razorpay !== 'undefined' && !isSimulated) {
      const rzpOptions = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'CareerForge AI',
        description: `Upgrade to ${plan.toUpperCase()} Plan (₹${amount / 100})`,
        order_id: orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#2563eb', // Blue AI accent
        },
        modal: {
          ondismiss: () => {
            if (onDismiss) onDismiss();
          },
        },
        handler: async function (response: any) {
          try {
            // 2. Verify payment signature on backend
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                userId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            // Confetti celebration
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#2563eb', '#6366f1', '#10b981', '#f59e0b'],
            });

            onSuccess({ plan, user: verifyData.user });
          } catch (err: any) {
            onFailure(err.message || 'Verification failed');
          }
        },
      };

      try {
        const razorpay = new window.Razorpay(rzpOptions);
        razorpay.on('payment.failed', function (resp: any) {
          onFailure(resp.error?.description || 'Payment failed or was cancelled by user.');
        });
        razorpay.open();
      } catch (sdkError: any) {
        console.warn('Official Razorpay SDK open failed, switching to interactive Test Sandbox:', sdkError);
        if (openSimulatedModal) {
          openSimulatedModal({ orderId, amount, currency, plan });
        } else {
          throw sdkError;
        }
      }
    } else {
      // Razorpay test simulation dialog (covers cases where external script is blocked or in test sandbox)
      if (openSimulatedModal) {
        openSimulatedModal({ orderId, amount, currency, plan });
      } else {
        // Direct test verification fallback
        const mockPaymentId = `pay_test_${Date.now()}`;
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'test_signature_verified',
            plan,
            userId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.6 },
          });
          onSuccess({ plan, user: verifyData.user });
        } else {
          onFailure(verifyData.error || 'Verification failed');
        }
      }
    }
  } catch (error: any) {
    onFailure(error.message || 'Payment initiation failed.');
  }
}
