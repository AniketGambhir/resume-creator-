import React, { useState, useEffect } from 'react';
import { User, ResumeData, PortfolioData, PlanTier } from './types';
import { sampleResume, samplePortfolio } from './data/initialData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResumeBuilder } from './components/ResumeBuilder';
import { PortfolioBuilder } from './components/PortfolioBuilder';
import { PricingPage } from './components/PricingPage';
import { DashboardView } from './components/DashboardView';
import { PublicPortfolioView } from './components/PublicPortfolioView';
import { AuthModal } from './components/AuthModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { RazorpayModal } from './components/RazorpayModal';
import { PaymentConfirmationModal } from './components/PaymentConfirmationModal';
import { initiateRazorpayCheckout } from './utils/razorpay';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function App() {
  // Navigation & Routing state
  const [currentView, setCurrentView] = useState<
    'landing' | 'builder' | 'portfolio' | 'pricing' | 'dashboard' | 'public-portfolio'
  >('landing');
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const [publicPortfolioData, setPublicPortfolioData] = useState<PortfolioData | null>(null);

  // User & Auth state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cf_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cf_token'));

  // Resumes state
  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    try {
      const stored = localStorage.getItem('cf_resumes');
      return stored ? JSON.parse(stored) : [sampleResume];
    } catch {
      return [sampleResume];
    }
  });
  const [currentResumeId, setCurrentResumeId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('cf_resumes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return sampleResume.id;
  });

  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    try {
      const stored = localStorage.getItem('cf_portfolio');
      return stored ? JSON.parse(stored) : samplePortfolio;
    } catch {
      return samplePortfolio;
    }
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalConfig, setAiModalConfig] = useState<{
    type: 'summary' | 'experience-bullets' | 'project-description' | 'skills' | 'ats-critique';
    context?: string;
  }>({ type: 'summary' });

  // Payment Confirmation Modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedPlanForConfirmation, setSelectedPlanForConfirmation] = useState<'medium' | 'premium' | null>(null);

  // Razorpay payment state
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayOrderData, setRazorpayOrderData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    plan: string;
  } | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<string | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cf_resumes', JSON.stringify(resumes));
    } catch {}
  }, [resumes]);

  useEffect(() => {
    try {
      localStorage.setItem('cf_portfolio', JSON.stringify(portfolio));
    } catch {}
  }, [portfolio]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cf_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cf_token', token);
    } else {
      localStorage.removeItem('cf_token');
    }
  }, [token]);

  // Check Hash Routing on mount and hash changes (e.g. #/portfolio/alex-chen)
  useEffect(() => {
    const checkHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/portfolio/')) {
        const slug = hash.replace('#/portfolio/', '').trim();
        if (slug) {
          setPublicSlug(slug);
          setCurrentView('public-portfolio');

          // Fetch public portfolio from server or fallback to local
          try {
            const res = await fetch(`/api/portfolios/public/${slug}`);
            if (res.ok) {
              const data = await res.json();
              setPublicPortfolioData(data.portfolio);
            } else if (slug === portfolio.slug) {
              setPublicPortfolioData(portfolio);
            }
          } catch {
            if (slug === portfolio.slug) {
              setPublicPortfolioData(portfolio);
            }
          }
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [portfolio]);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // Active Resume
  const currentResume = resumes.find((r) => r.id === currentResumeId) || resumes[0] || sampleResume;

  const updateCurrentResume = (updated: ResumeData) => {
    setResumes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleSaveResume = async () => {
    const updatedResume = { ...currentResume, updatedAt: new Date().toISOString() };
    updateCurrentResume(updatedResume);

    if (token) {
      try {
        await fetch(`/api/resumes/${updatedResume.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedResume),
        });
      } catch {}
    }

    showToast('Resume saved successfully!', 'success');
  };

  const handleSavePortfolio = async () => {
    const updated = { ...portfolio, updatedAt: new Date().toISOString() };
    setPortfolio(updated);

    if (token) {
      try {
        await fetch('/api/portfolios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        });
      } catch {}
    }

    showToast('Portfolio saved successfully!', 'success');
  };

  const handleCreateResume = () => {
    const newResume: ResumeData = {
      ...sampleResume,
      id: 'res_' + Date.now(),
      title: `Resume #${resumes.length + 1}`,
      updatedAt: new Date().toISOString(),
    };
    setResumes((prev) => [newResume, ...prev]);
    setCurrentResumeId(newResume.id);
    setCurrentView('builder');
    showToast('Created new resume draft', 'success');
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) {
      showToast('You must keep at least one resume draft.', 'info');
      return;
    }
    const filtered = resumes.filter((r) => r.id !== id);
    setResumes(filtered);
    if (currentResumeId === id) {
      setCurrentResumeId(filtered[0].id);
    }
    showToast('Resume draft deleted', 'info');
  };

  // Auth callbacks
  const handleAuthSuccess = (authenticatedUser: User, authToken: string) => {
    setUser(authenticatedUser);
    setToken(authToken);
    showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    showToast('Signed out successfully.', 'info');
    setCurrentView('landing');
  };

  // AI Assistant callback
  const handleOpenAIModal = (
    type: 'summary' | 'experience-bullets' | 'project-description' | 'skills' | 'ats-critique',
    context?: string
  ) => {
    setAiModalConfig({ type, context });
    setIsAIModalOpen(true);
  };

  const handleApplyAIContent = (field: string, content: any) => {
    if (field === 'summary') {
      updateCurrentResume({
        ...currentResume,
        personalInfo: {
          ...currentResume.personalInfo,
          summary: content,
        },
      });
      showToast('AI Summary applied to resume!', 'success');
    } else if (field === 'bullets' && Array.isArray(content)) {
      if (currentResume.experience.length > 0) {
        const firstExp = currentResume.experience[0];
        const updatedExp = {
          ...firstExp,
          bullets: [...firstExp.bullets.filter(Boolean), ...content],
        };
        updateCurrentResume({
          ...currentResume,
          experience: currentResume.experience.map((e) => (e.id === firstExp.id ? updatedExp : e)),
        });
        showToast('AI Bullet points added to your latest experience!', 'success');
      }
    } else if (field === 'skills' && Array.isArray(content)) {
      updateCurrentResume({
        ...currentResume,
        skills: {
          ...currentResume.skills,
          technical: [...new Set([...currentResume.skills.technical, ...content])],
        },
      });
      showToast('AI recommended skills added!', 'success');
    }
  };

  // 1. Open confirmation modal first (Requirement 11)
  const handleSelectPlan = (planToUpgrade: 'medium' | 'premium') => {
    setSelectedPlanForConfirmation(planToUpgrade);
    setIsConfirmationModalOpen(true);
  };

  // 2. Proceed to Razorpay checkout from confirmation modal
  const handleProceedToRazorpay = async (planToUpgrade: 'medium' | 'premium') => {
    setIsConfirmationModalOpen(false);
    setIsLoadingPlan(planToUpgrade);

    await initiateRazorpayCheckout({
      plan: planToUpgrade,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      onSuccess: ({ plan, user: upgradedUser }) => {
        setIsLoadingPlan(null);
        if (upgradedUser) {
          setUser(upgradedUser);
        } else if (user) {
          setUser({ ...user, plan: plan as PlanTier });
        }
        showToast(`Payment Successful! You are now upgraded to the ${plan.toUpperCase()} plan.`, 'success');
      },
      onFailure: (err) => {
        setIsLoadingPlan(null);
        showToast(`Payment Failed. ${err} Please try again.`, 'error');
      },
      onDismiss: () => {
        setIsLoadingPlan(null);
        showToast('Payment Cancelled. No charges were made.', 'info');
      },
      openSimulatedModal: (orderData) => {
        setIsLoadingPlan(null);
        setRazorpayOrderData(orderData);
        setIsRazorpayModalOpen(true);
      },
    });
  };

  const handleViewPublicPortfolio = (slug: string) => {
    window.location.hash = `/portfolio/${slug}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn no-print">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-current opacity-60 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar (Hidden in Standalone Public Portfolio view) */}
      {currentView !== 'public-portfolio' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            window.location.hash = '';
            setCurrentView(view);
          }}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onUpgradeClick={() => setCurrentView('pricing')}
        />
      )}

      {/* View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentView('builder')}
            onExplorePricing={() => setCurrentView('pricing')}
            onLoginClick={() => setIsAuthModalOpen(true)}
            previewResume={currentResume}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentView === 'builder' && (
          <ResumeBuilder
            resume={currentResume}
            onChange={updateCurrentResume}
            onSave={handleSaveResume}
            user={user}
            onOpenAIModal={handleOpenAIModal}
            onUpgradeClick={() => setCurrentView('pricing')}
          />
        )}

        {currentView === 'portfolio' && (
          <PortfolioBuilder
            portfolio={portfolio}
            resume={currentResume}
            onChange={setPortfolio}
            onSave={handleSavePortfolio}
            user={user}
            onUpgradeClick={() => setCurrentView('pricing')}
            onViewPublic={handleViewPublicPortfolio}
          />
        )}

        {currentView === 'pricing' && (
          <PricingPage
            user={user}
            onSelectPlan={handleSelectPlan}
            onGetStartedFree={() => setCurrentView('builder')}
            isLoadingPlan={isLoadingPlan}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            resumes={resumes}
            portfolio={portfolio}
            onOpenResume={(id) => {
              setCurrentResumeId(id);
              setCurrentView('builder');
            }}
            onCreateResume={handleCreateResume}
            onDeleteResume={handleDeleteResume}
            onOpenPortfolio={() => setCurrentView('portfolio')}
            onUpgradeClick={() => setCurrentView('pricing')}
            onViewPublicPortfolio={handleViewPublicPortfolio}
          />
        )}

        {currentView === 'public-portfolio' && (
          <div>
            {/* Top Back bar for previewers */}
            <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs no-print">
              <span className="font-semibold text-slate-300">
                Viewing Public Portfolio: <span className="text-white">/{publicSlug || portfolio.slug}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '';
                  setCurrentView('builder');
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-medium transition-colors"
              >
                Back to CareerForge App
              </button>
            </div>
            <PublicPortfolioView portfolio={publicPortfolioData || portfolio} isStandalone={true} />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        user={user}
        defaultType={aiModalConfig.type}
        initialContext={aiModalConfig.context}
        onApplyToResume={handleApplyAIContent}
        onUpgradeClick={() => setCurrentView('pricing')}
      />

      {/* Payment Confirmation Modal (Requirement 11) */}
      <PaymentConfirmationModal
        isOpen={isConfirmationModalOpen}
        plan={selectedPlanForConfirmation}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setSelectedPlanForConfirmation(null);
        }}
        onProceedToRazorpay={handleProceedToRazorpay}
        isLoading={Boolean(isLoadingPlan)}
      />

      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        orderData={razorpayOrderData}
        userId={user?.id}
        onClose={() => {
          setIsRazorpayModalOpen(false);
          setRazorpayOrderData(null);
        }}
        onCancel={() => {
          showToast('Payment Cancelled. No charges were made.', 'info');
        }}
        onSuccess={({ plan, user: upgradedUser }) => {
          if (upgradedUser) {
            setUser(upgradedUser);
          } else if (user) {
            setUser({ ...user, plan: plan as PlanTier });
          }
          showToast(`Payment Successful! You are now upgraded to the ${plan.toUpperCase()} plan.`, 'success');
        }}
        onFailure={(err) => {
          showToast(`Payment Failed. ${err} Please try again.`, 'error');
        }}
      />
    </div>
  );
}
