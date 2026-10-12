import React, { useState } from 'react';
import { User, PlanTier } from '../types';
import {
  Sparkles,
  FileText,
  Globe,
  Tag,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'builder' | 'portfolio' | 'pricing' | 'dashboard' | 'public-portfolio';
  onNavigate: (view: 'landing' | 'builder' | 'portfolio' | 'pricing' | 'dashboard') => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpgradeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  onUpgradeClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const plan = user?.plan || 'free';

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'builder', label: 'Resume Builder' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'pricing', label: 'Pricing' },
    ...(user ? [{ id: 'dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              CareerForge <span className="text-blue-600">AI</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id as any)}
                className={`px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Plan Badge */}
              <button
                type="button"
                onClick={onUpgradeClick}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition-transform hover:scale-105 ${
                  plan === 'premium'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : plan === 'medium'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {plan === 'free' ? 'Free (Upgrade)' : `${plan} Plan`}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentView === link.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-700 px-3">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-[11px] font-bold uppercase text-blue-600">{plan} plan</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpgradeClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-center bg-blue-50 text-blue-700 rounded-lg"
                >
                  Manage Subscription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-center text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('builder');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg text-center shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
