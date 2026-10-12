// Main Header Navigation Bar with User Profile, Logout, Language & Notification Triggers

import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  Bell, 
  RotateCcw, 
  Menu, 
  X, 
  LogOut, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onOpenNotifications: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
  onOpenNotifications,
  onNavigate,
}) => {
  const { currentUser, logoutUser, resetToDemoData, notifications, globalSearch, setGlobalSearch } = useApp();
  const { language, setLanguage, t } = useLanguage();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReset = () => {
    resetToDemoData();
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-farm-700 hover:bg-farm-50 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-farm-800 to-farm-600 flex items-center justify-center text-white shadow-md shadow-farm-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-200" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-farm-800 transition-colors">
                  Farm<span className="text-farm-600">2</span>Pay <span className="text-xs bg-farm-100 text-farm-800 font-semibold px-1.5 py-0.5 rounded-md border border-farm-200">AI</span>
                </span>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase -mt-0.5">
                  Agricultural Platform
                </p>
              </div>
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.search}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 transition-all placeholder:text-slate-400"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Language, Notifications, Reset, User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === 'en' 
                    ? 'bg-white text-farm-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === 'ta' 
                    ? 'bg-white text-farm-800 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="தமிழுக்கு மாறவும்"
              >
                தமிழ்
              </button>
            </div>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-farm-700 hover:bg-farm-50 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-farm-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors font-medium"
              title="Reset sample data back to original state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Authenticated User Menu (Displays Logged-in User's Real Name) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-farm-50 border border-farm-200/80 rounded-xl hover:bg-farm-100/70 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-farm-800 text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-farm-700 font-semibold uppercase tracking-wider">
                      {currentUser.role === 'buyer' ? 'Customer / Buyer' : 'Farmer'}
                    </div>
                  </div>
                </button>

                {/* User Dropdown with Logout */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {currentUser.village}, {currentUser.district}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-farm-800 bg-farm-100 px-2 py-0.5 rounded uppercase">
                        {currentUser.role === 'buyer' ? 'Customer / Buyer' : 'Farmer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('profile-settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t.profileSettings}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 pt-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Reset Demo Store */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Reset Demo Store to Initial Seed Data?
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              This will restore all sample crop listings, buyer offers, tractor bookings, financial transactions, and loan comparisons back to their default demo state.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 text-sm font-semibold text-white bg-farm-700 hover:bg-farm-800 rounded-xl shadow-md transition-colors"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
