// Farm2Pay AI Entry Flow: Role Selection, Farmer & Customer Login and Registration

import React, { useState } from 'react';
import { 
  Sprout, 
  Wheat, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  MapPin, 
  Phone, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const AuthWelcomePage: React.FC = () => {
  const { loginUser, registerUser, enterDemoUser } = useApp();
  const { language, setLanguage, t } = useLanguage();

  // Mode: 'welcome' | 'farmer_login' | 'farmer_register' | 'buyer_login' | 'buyer_register'
  const [authMode, setAuthMode] = useState<
    'welcome' | 'farmer_login' | 'farmer_register' | 'buyer_login' | 'buyer_register'
  >('welcome');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('Thiruvaiyaru');
  const [district, setDistrict] = useState('Thanjavur');
  const [state, setState] = useState('Tamil Nadu');
  const [companyName, setCompanyName] = useState('');
  const [acres, setAcres] = useState<number>(5);
  const [primaryCrops, setPrimaryCrops] = useState('Samba Paddy, Black Gram');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearForm = () => {
    setIdentifier('');
    setPassword('');
    setName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginUser(identifier, password, 'farmer');
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed. Please check your credentials or click Enter Farmer Demo.');
    }
  };

  const handleBuyerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginUser(identifier, password, 'buyer');
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed. Please check your credentials or click Enter Customer Demo.');
    }
  };

  const handleFarmerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    try {
      registerUser({
        name,
        role: 'farmer',
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@farm.com`,
        phone: phone || '+91 98765 43210',
        village: village || 'Gram Panchayat',
        district: district || 'Thanjavur',
        state: state || 'Tamil Nadu',
        preferredLanguage: language,
        acres: Number(acres) || 4.5,
        primaryCrops: primaryCrops.split(',').map(s => s.trim()),
      });
      // User is logged in automatically inside registerUser
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  const handleBuyerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Please enter your contact name.');
      return;
    }

    try {
      registerUser({
        name,
        role: 'buyer',
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@trader.com`,
        companyName: companyName || `${name} Agri Sourcing`,
        phone: phone || '+91 94444 11223',
        village: village || 'APMC Mandi Yard',
        district: district || 'Tiruchirappalli',
        state: state || 'Tamil Nadu',
        preferredLanguage: language,
      });
      // User is logged in automatically inside registerUser
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between selection:bg-farm-600 selection:text-white">
      
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-5 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-farm-800 to-farm-600 flex items-center justify-center text-white shadow-md shadow-farm-700/20">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Farm<span className="text-farm-600">2</span>Pay <span className="text-xs bg-farm-100 text-farm-800 font-semibold px-1.5 py-0.5 rounded-md border border-farm-200">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase -mt-0.5">
              Agricultural Fintech & Marketplace Platform
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === 'en' ? 'bg-white text-farm-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === 'ta' ? 'bg-white text-farm-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        
        {/* VIEW 1: WELCOME SCREEN WITH THE TWO PROMINENT ROLE CARDS */}
        {authMode === 'welcome' && (
          <div className="space-y-8 text-center animate-in fade-in duration-200">
            
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100/90 border border-farm-200 text-farm-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-farm-600" />
                <span>Choose Your Role to Enter Farm2Pay AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome to Farm2Pay AI
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Empowering farmers with fair direct crop prices, transparent loan audits, and accessible machinery — connecting seamlessly with verified buyers.
              </p>
            </div>

            {/* The Two Prominent Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left pt-2">
              
              {/* CARD 1: FARMER */}
              <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-farm-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-farm-100 text-farm-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Wheat className="w-7 h-7 text-farm-700" />
                  </div>

                  <span className="text-[11px] font-bold text-farm-700 uppercase tracking-wider">
                    Role Option 1
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-2">
                    Farmer Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Sell crops, rent agricultural equipment, manage farm finances, track seasonal net profit, and compare loans with transparent EMI math.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      clearForm();
                      setAuthMode('farmer_login');
                    }}
                    className="w-full py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login as Farmer</span>
                  </button>

                  <button
                    onClick={() => {
                      clearForm();
                      setAuthMode('farmer_register');
                    }}
                    className="w-full py-2.5 bg-slate-50 hover:bg-farm-50 text-slate-700 hover:text-farm-800 font-bold rounded-2xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register as Farmer</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: CUSTOMER / CROP BUYER */}
              <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-7 h-7 text-amber-700" />
                  </div>

                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Role Option 2
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-2">
                    Customer / Crop Buyer
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Browse verified crops from local farmers, submit purchase inquiries and price bids, negotiate transport terms, and manage confirmed orders.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      clearForm();
                      setAuthMode('buyer_login');
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login as Customer</span>
                  </button>

                  <button
                    onClick={() => {
                      clearForm();
                      setAuthMode('buyer_register');
                    }}
                    className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-bold rounded-2xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register as Customer</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Fast Hackathon Demo Mode Buttons */}
            <div className="pt-6 max-w-2xl mx-auto border-t border-slate-200/80">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-farm-600" />
                <span>Hackathon Testing & Evaluation Mode (Simulated Preloaded Accounts)</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => enterDemoUser('farmer')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-farm-50 hover:bg-farm-100 text-farm-900 rounded-xl text-xs font-bold border border-farm-300 transition-all shadow-2xs flex items-center justify-center gap-2"
                >
                  <span>🌾 Enter Farmer Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => enterDemoUser('buyer')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-300 transition-all shadow-2xs flex items-center justify-center gap-2"
                >
                  <span>🏢 Enter Customer Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: FARMER LOGIN */}
        {authMode === 'farmer_login' && (
          <div className="max-w-md mx-auto w-full bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md animate-in fade-in duration-150">
            <button
              onClick={() => setAuthMode('welcome')}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-farm-100 text-farm-800 rounded-xl">
                <Wheat className="w-6 h-6 text-farm-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Farmer Login</h2>
                <p className="text-xs text-slate-500">Access your farm finances, crops, and loans</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name, Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kannan or farmer@demo.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">New farmer?</span>
              <button
                onClick={() => {
                  clearForm();
                  setAuthMode('farmer_register');
                }}
                className="font-bold text-farm-700 hover:text-farm-900 underline"
              >
                Register as Farmer
              </button>
            </div>

            {/* Quick Demo Autofill */}
            <div className="mt-4 p-3 bg-farm-50 rounded-xl border border-farm-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Test with demo account:</span>
              <button
                type="button"
                onClick={() => enterDemoUser('farmer')}
                className="font-bold text-farm-800 underline hover:text-farm-950"
              >
                1-Click Demo Farmer
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: FARMER REGISTRATION */}
        {authMode === 'farmer_register' && (
          <div className="max-w-lg mx-auto w-full bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md animate-in fade-in duration-150">
            <button
              onClick={() => setAuthMode('welcome')}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-farm-100 text-farm-800 rounded-xl">
                <UserPlus className="w-6 h-6 text-farm-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Register as Farmer</h2>
                <p className="text-xs text-slate-500">Create your personal agricultural profile</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFarmerRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Selvan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98400 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Panchayat</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Land (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Crops Grown</label>
                <input
                  type="text"
                  placeholder="e.g. Samba Paddy, Groundnut, Cotton"
                  value={primaryCrops}
                  onChange={(e) => setPrimaryCrops(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Create Farmer Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Already registered?</span>
              <button
                onClick={() => {
                  clearForm();
                  setAuthMode('farmer_login');
                }}
                className="font-bold text-farm-700 hover:text-farm-900 underline"
              >
                Login as Farmer
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: CUSTOMER LOGIN */}
        {authMode === 'buyer_login' && (
          <div className="max-w-md mx-auto w-full bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md animate-in fade-in duration-150">
            <button
              onClick={() => setAuthMode('welcome')}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer / Buyer Login</h2>
                <p className="text-xs text-slate-500">Procure crops directly from farmers</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBuyerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name, Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senthil Kumar or buyer@demo.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login to Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">New crop buyer?</span>
              <button
                onClick={() => {
                  clearForm();
                  setAuthMode('buyer_register');
                }}
                className="font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Register as Customer
              </button>
            </div>

            {/* Quick Demo Autofill */}
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Test with demo account:</span>
              <button
                type="button"
                onClick={() => enterDemoUser('buyer')}
                className="font-bold text-amber-800 underline hover:text-amber-950"
              >
                1-Click Demo Buyer
              </button>
            </div>
          </div>
        )}

        {/* VIEW 5: CUSTOMER REGISTRATION */}
        {authMode === 'buyer_register' && (
          <div className="max-w-lg mx-auto w-full bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md animate-in fade-in duration-150">
            <button
              onClick={() => setAuthMode('welcome')}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <UserPlus className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Register as Customer / Buyer</h2>
                <p className="text-xs text-slate-500">Connect with local farmer producer networks</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-start gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBuyerRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kumaraguru"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Mill Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tanjore Agro Traders Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94432 00112"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    placeholder="e.g. procurement@agro.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mandi / Market Location</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Already registered?</span>
              <button
                onClick={() => {
                  clearForm();
                  setAuthMode('buyer_login');
                }}
                className="font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Login as Customer
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        Farm2Pay AI — Secure Agricultural Financial & Marketplace Ecosystem
      </footer>

    </div>
  );
};
