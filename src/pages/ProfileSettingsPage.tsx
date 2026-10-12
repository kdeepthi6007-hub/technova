// Module: User Profile, Account Details, Regional Language Preferences & Demo Store Controls

import React, { useState } from 'react';
import { 
  UserCheck, 
  RotateCcw, 
  Globe, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  Users,
  LogOut,
  Building,
  Mail,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, logoutUser, resetToDemoData } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [village, setVillage] = useState(currentUser?.village || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [acres, setAcres] = useState(currentUser?.acres || 5);

  if (!currentUser) return null;

  const isFarmer = currentUser.role === 'farmer';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
              isFarmer ? 'text-farm-700 bg-farm-100' : 'text-amber-800 bg-amber-100'
            }`}>
              {isFarmer ? 'Farmer Account' : 'Customer Account'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your authenticated account details, regional language, and demo preferences.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200 transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Store</span>
        </button>
      </div>

      {/* Authenticated Account Info & Logout */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-extrabold shadow-sm ${
              isFarmer ? 'bg-farm-800' : 'bg-slate-900'
            }`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">{currentUser.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isFarmer ? 'bg-farm-100 text-farm-800 border border-farm-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {isFarmer ? 'Farmer' : 'Customer / Crop Buyer'}
                </span>
                {currentUser.isDemoAccount ? (
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    Demo Mode
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Registered User
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.phone} • {currentUser.village}, {currentUser.district}
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-farm-700 shrink-0 mt-0.5" />
          <span>
            {isFarmer
              ? 'You are logged into a Farmer account with full access to Crop Listings, Equipment Hub, Farm Expense Tracker, and Loan Comparisons.'
              : 'You are logged into a Customer account with access to browse crops, submit purchase offers, and track orders.'}
            {' '}To switch to another account or demo persona, click <strong>Logout Account</strong> above.
          </span>
        </div>
      </div>

      {/* Regional Language Preference Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-farm-700" />
            <span>Regional Language Preference</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Controls all navigation labels, financial terms, and AI assistant responses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              language === 'en'
                ? 'bg-farm-50 border-farm-600 ring-2 ring-farm-600/10'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">English</div>
            <div className="text-xs text-slate-500 mt-1">Standard Agricultural Fintech English</div>
          </button>

          <button
            onClick={() => setLanguage('ta')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              language === 'ta'
                ? 'bg-farm-50 border-farm-600 ring-2 ring-farm-600/10'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">தமிழ் (Tamil)</div>
            <div className="text-xs text-slate-500 mt-1">தமிழ்நாடு உழவர் வழிகாட்டி</div>
          </button>

          <button
            onClick={() => setLanguage('te')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              language === 'te'
                ? 'bg-farm-50 border-farm-600 ring-2 ring-farm-600/10'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-bold text-slate-900">తెలుగు (Telugu)</div>
            <div className="text-xs text-slate-500 mt-1">ఆంధ్రప్రదేశ్ & తెలంగాణ రైతుల కోసం</div>
          </button>
        </div>
      </div>

      {/* Edit Profile Details Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-farm-700" />
          <span>{isFarmer ? 'Farmer Information & Land Details' : 'Customer & Procurement Information'}</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (SMS / WhatsApp Alerts)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            {!isFarmer && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Mill Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Kaveri Agro Traders"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isFarmer ? 'Village / Revenue Circle' : 'City / Mandi Base'}
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District & State</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            {isFarmer && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Cultivable Land (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            )}
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile settings updated successfully!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog for Reset Demo Store */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All Demo Data?"
        message="This will restore all sample crop listings, buyer offers, tractor rentals, transactions, and loan comparisons to their original state."
        confirmLabel="Reset Demo Store"
        isDestructive={true}
        onConfirm={() => {
          resetToDemoData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

    </div>
  );
};
