// Main Farm2Pay AI Application Container & Role-Protected Routing Shell

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Pages
import { AuthWelcomePage } from './pages/AuthWelcomePage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CustomerOffersPage } from './pages/CustomerOffersPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CropMarketplacePage } from './pages/CropMarketplacePage';
import { EquipmentMarketplacePage } from './pages/EquipmentMarketplacePage';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage';
import { LoanComparisonPage } from './pages/LoanComparisonPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { OrdersAndBookingsPage } from './pages/OrdersAndBookingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

// Modals
import { NewCropListingModal } from './components/forms/NewCropListingModal';
import { NewTransactionModal } from './components/forms/NewTransactionModal';
import { NewEquipmentListingModal } from './components/forms/NewEquipmentListingModal';
import { NewLoanOfferModal } from './components/forms/NewLoanOfferModal';

// Icons
import { Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Form Modals
  const [isNewCropModalOpen, setIsNewCropModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isNewEquipmentModalOpen, setIsNewEquipmentModalOpen] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);

  const navigateTo = (page: string) => {
    // Route guard on navigation
    if (currentUser?.role === 'buyer') {
      const farmerOnlyRoutes = [
        'expense-tracker', 
        'loan-comparison', 
        'reports', 
        'ai-assistant', 
        'equipment-marketplace', 
        'orders-and-bookings'
      ];
      if (farmerOnlyRoutes.includes(page)) {
        setCurrentPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (currentUser?.role === 'farmer') {
      const customerOnlyRoutes = ['my-offers', 'my-orders'];
      if (customerOnlyRoutes.includes(page)) {
        setCurrentPage('crop-marketplace');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Unauthenticated Entry Flow: If no authenticated session, show Welcome / Role Selection screen
  if (!isAuthenticated || !currentUser) {
    if (currentPage === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => navigateTo('dashboard')}
          onExploreModule={() => navigateTo('dashboard')}
        />
      );
    }
    return <AuthWelcomePage />;
  }

  // 2. User is authenticated (either farmer or customer)
  const isCustomer = currentUser.role === 'buyer';
  const isFarmer = currentUser.role === 'farmer';

  // If user explicitly views public landing page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => navigateTo('dashboard')}
        onExploreModule={(modulePage) => navigateTo(modulePage)}
      />
    );
  }

  // Route security check: ensure customer cannot view farmer-only pages
  const isFarmerOnlyRoute = [
    'expense-tracker',
    'loan-comparison',
    'reports',
    'ai-assistant',
    'equipment-marketplace',
    'orders-and-bookings'
  ].includes(currentPage);

  const isCustomerOnlyRoute = ['my-offers', 'my-orders'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans selection:bg-farm-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onNavigate={navigateTo}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Desktop Sidebar (Role-specific items & logout) */}
        <Sidebar currentPage={currentPage} onNavigate={navigateTo} />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* Quick Landing Page Banner for Judges */}
          <div className="no-print mb-4 p-2.5 px-4 bg-cream-100/80 rounded-2xl border border-cream-200/90 flex items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isCustomer
                  ? `Active Customer Session: ${currentUser.name} (${currentUser.companyName || 'Crop Buyer'})`
                  : `Active Farmer Session: ${currentUser.name} (${currentUser.village}, ${currentUser.district})`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('landing')}
                className="font-bold text-farm-800 hover:text-farm-950 underline text-[11px]"
              >
                View Overview
              </button>
            </div>
          </div>

          {/* Access Denied Shield for Customer on Farmer Financial Routes */}
          {isCustomer && isFarmerOnlyRoute && (
            <div className="bg-white p-8 rounded-3xl border border-red-200 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Farm financial bookkeeping, loan comparison audits, and machinery fleet controls are private to verified farmer accounts.
              </p>
              <button
                onClick={() => navigateTo('dashboard')}
                className="mt-5 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Customer Dashboard</span>
              </button>
            </div>
          )}

          {/* Dynamic Page Switcher: Dashboards */}
          {currentPage === 'dashboard' && (
            isCustomer ? (
              <CustomerDashboardPage onNavigate={navigateTo} />
            ) : (
              <DashboardPage
                onNavigate={navigateTo}
                onOpenNewTransaction={() => setIsNewTransactionModalOpen(true)}
                onOpenNewCropListing={() => setIsNewCropModalOpen(true)}
              />
            )
          )}

          {/* Shared Crop Marketplace (Both roles share 1 listing collection) */}
          {currentPage === 'crop-marketplace' && (
            <CropMarketplacePage
              onOpenNewListing={() => setIsNewCropModalOpen(true)}
              onNavigate={navigateTo}
            />
          )}

          {/* Customer-Only Pages */}
          {currentPage === 'my-offers' && isCustomer && (
            <CustomerOffersPage onNavigate={navigateTo} />
          )}

          {currentPage === 'my-orders' && isCustomer && (
            <CustomerOrdersPage onNavigate={navigateTo} />
          )}

          {/* Farmer-Only Pages */}
          {currentPage === 'equipment-marketplace' && !isCustomer && (
            <EquipmentMarketplacePage
              onOpenNewListing={() => setIsNewEquipmentModalOpen(true)}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'expense-tracker' && !isCustomer && (
            <ExpenseTrackerPage
              onOpenNewTransaction={() => setIsNewTransactionModalOpen(true)}
            />
          )}

          {currentPage === 'loan-comparison' && !isCustomer && (
            <LoanComparisonPage
              onOpenNewLoanModal={() => setIsNewLoanModalOpen(true)}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'ai-assistant' && !isCustomer && (
            <AiAssistantPage onNavigate={navigateTo} />
          )}

          {currentPage === 'orders-and-bookings' && !isCustomer && (
            <OrdersAndBookingsPage />
          )}

          {currentPage === 'reports' && !isCustomer && (
            <ReportsPage />
          )}

          {/* Shared Profile & Notifications Pages */}
          {currentPage === 'notifications' && (
            <NotificationsPage onNavigate={navigateTo} />
          )}

          {currentPage === 'profile-settings' && (
            <ProfileSettingsPage />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Slideout Menu */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={navigateTo}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* In-App Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Floating AI Assistant Quick Trigger (FARMERS ONLY) */}
      {isFarmer && currentPage !== 'ai-assistant' && (
        <button
          onClick={() => navigateTo('ai-assistant')}
          className="fixed bottom-20 lg:bottom-8 right-6 z-30 p-3.5 bg-gradient-to-tr from-farm-800 to-farm-600 text-white rounded-2xl shadow-xl shadow-farm-800/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs"
          title="Ask AI Farm Assistant"
        >
          <Sparkles className="w-5 h-5 text-emerald-200" />
          <span className="hidden sm:inline">AI Farm Help</span>
        </button>
      )}

      {/* Action Modals (Farmer-only creation tools) */}
      {isFarmer && (
        <>
          <NewCropListingModal
            isOpen={isNewCropModalOpen}
            onClose={() => setIsNewCropModalOpen(false)}
          />

          <NewTransactionModal
            isOpen={isNewTransactionModalOpen}
            onClose={() => setIsNewTransactionModalOpen(false)}
          />

          <NewEquipmentListingModal
            isOpen={isNewEquipmentModalOpen}
            onClose={() => setIsNewEquipmentModalOpen(false)}
          />

          <NewLoanOfferModal
            isOpen={isNewLoanModalOpen}
            onClose={() => setIsNewLoanModalOpen(false)}
          />
        </>
      )}

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
