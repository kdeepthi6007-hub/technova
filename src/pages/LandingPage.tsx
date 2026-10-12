// Landing Page for Farm2Pay AI - Hero, Problem Statement, 4 Core Modules, Live Demo Entrance

import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  Wheat, 
  Wrench, 
  ReceiptIndianRupee, 
  Landmark, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Zap,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreModule: (modulePage: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreModule,
}) => {
  const { t } = useLanguage();
  const { enterDemoUser } = useApp();

  const handleRoleLaunch = (role: 'farmer' | 'buyer') => {
    enterDemoUser(role);
    onGetStarted();
  };

  const coreModules = [
    {
      id: 'crop-marketplace',
      title: '1. Crop Marketplace & Net Proceeds',
      desc: 'Sell grains, pulses, and cash crops directly to millers and buyers. Compare bids by calculating true Net Proceeds after transport and APMC fees.',
      icon: Wheat,
      color: 'from-emerald-700 to-emerald-900',
      tag: 'Direct Mandi Link',
      features: ['Automated Net Proceeds = Price − Freight − APMC Cess', 'Multi-buyer offer side-by-side comparison', 'Organic certification tagging']
    },
    {
      id: 'equipment-marketplace',
      title: '2. Farm Machinery & Rental Hub',
      desc: 'Rent tractors, power tillers, solar pumps, and combine harvesters by the hour or day from local custom-hire centers with upfront operator fees.',
      icon: Wrench,
      color: 'from-amber-700 to-amber-900',
      tag: 'Custom Hiring',
      features: ['Live rental cost calculator (Rate × Duration + Disclosed fees)', 'Booking availability checks', 'Buy or Rent options with full specs']
    },
    {
      id: 'expense-tracker',
      title: '3. Smart Farm Financial Accounting',
      desc: 'Simple bookkeeping built specifically for farmers. Track seeds, fertilizers, labour wages, and harvest sales with seasonal profit margins.',
      icon: ReceiptIndianRupee,
      color: 'from-farm-800 to-farm-950',
      tag: 'Seasonal Accounting',
      features: ['Automated Net Profit & Profit Margin % calculations', 'Seasonal budget alerts before cost overruns occur', 'One-click CSV exports for bank audits']
    },
    {
      id: 'loan-comparison',
      title: '4. AI Loan Comparison & Transparency',
      desc: 'Compare Kisan Credit Card (KCC) and agri loans using exact mathematical EMI formulas. Uncover hidden upfront processing deductions and predatory rates.',
      icon: Landmark,
      color: 'from-blue-800 to-slate-900',
      tag: 'Fintech Transparency',
      features: ['Standard amortizing EMI + Zero-interest subvention engine', 'Net Disbursed Amount (Principal − Upfront fees)', 'Automated Risk Audit Flags for floating rates & high fees']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle agricultural background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-farm-100/60 to-transparent pointer-events-none rounded-b-[4rem]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100/90 border border-farm-200/90 text-farm-800 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-farm-600" />
            <span>AI-Powered Farmer Financial & Marketplace Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Sell Crops Fairly. Rent Machinery. <br className="hidden sm:inline" />
            <span className="text-farm-700 underline decoration-farm-300 decoration-wavy decoration-2">
              Compare Loans Transparently.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.landingHeroSubtitle}
          </p>

          {/* CTA Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-2xl shadow-lg shadow-farm-700/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreModule('loan-comparison')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Landmark className="w-4 h-4 text-farm-700" />
              <span>Test Loan Comparison Engine</span>
            </button>
          </div>

          {/* Demo Persona Shortcuts */}
          <div className="mt-10 pt-6 border-t border-slate-200/70 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Fast Hackathon Demo Personas (1-Click Launch):
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleRoleLaunch('farmer')}
                className="px-4 py-2 bg-white hover:bg-farm-50 text-slate-800 hover:text-farm-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                🌾 Enter Farmer Demo
              </button>
              <button
                onClick={() => handleRoleLaunch('buyer')}
                className="px-4 py-2 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                🏢 Enter Customer Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Integrated Modules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-farm-700">
            Integrated Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Four Core Pillars Built for India's Small & Marginal Farmers
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            No fragmented tools. All modules share transactions, order records, and calculations in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-farm-50 text-farm-800 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {mod.desc}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    {mod.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-farm-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onExploreModule(mod.id)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-farm-50 text-slate-800 hover:text-farm-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-World Problem vs Farm2Pay AI Solution */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Existing Solutions Fail Rural Farmers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-200/70">
              <h3 className="font-bold text-red-900 text-base mb-3 flex items-center gap-2">
                <span>The Traditional Struggle</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-red-800 leading-relaxed">
                <li>• Mandi middlemen absorb 15–25% margins, leaving farmers unaware of true net realizations.</li>
                <li>• Farm machinery sits idle while neighboring farmers lack tractors during planting windows.</li>
                <li>• Seasonal income and fertilizer costs are tracked on paper scraps with no budget warnings.</li>
                <li>• Complex loan contracts hide high processing fees and compound late penalties.</li>
              </ul>
            </div>

            <div className="p-6 bg-farm-50/50 rounded-3xl border border-farm-200/70">
              <h3 className="font-bold text-farm-900 text-base mb-3 flex items-center gap-2">
                <span>The Farm2Pay AI Solution</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-farm-800 leading-relaxed">
                <li>• Direct buyer bids with automated Net Proceeds calculations (Crop Value − Freight − Cess).</li>
                <li>• Hourly & daily machinery bookings with instant transparent price calculations.</li>
                <li>• Real-time financial dashboard with automated profit margins and category spending limits.</li>
                <li>• Amortizing EMI engine that audits loan contracts and uncovers hidden upfront deductions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-farm-700 text-white flex items-center justify-center font-bold text-[10px]">
            F2P
          </div>
          <span className="font-bold text-slate-800">Farm2Pay AI</span>
          <span>— Hackathon Product Submission</span>
        </div>
        <p>Built for Smallholder Farmers across Tamil Nadu & Andhra Pradesh.</p>
      </footer>
    </div>
  );
};
