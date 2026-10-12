// Mobile Bottom Navigation Bar & Mobile Drawer with Role-Specific Menus & Logout

import React from 'react';
import { 
  LayoutDashboard, 
  Wheat, 
  Wrench, 
  ReceiptIndianRupee, 
  Landmark, 
  Sparkles,
  BarChart3,
  ShoppingBag,
  Bell,
  UserCheck,
  X,
  LogOut,
  Clock,
  Truck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { currentUser, logoutUser } = useApp();

  if (!currentUser) return null;

  const isFarmer = currentUser.role === 'farmer';

  const primaryFarmerTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'crop-marketplace', label: 'Crops', icon: Wheat },
    { id: 'equipment-marketplace', label: 'Machinery', icon: Wrench },
    { id: 'expense-tracker', label: 'Finances', icon: ReceiptIndianRupee },
    { id: 'loan-comparison', label: 'Loans', icon: Landmark },
    { id: 'ai-assistant', label: 'AI Help', icon: Sparkles },
  ];

  const primaryCustomerTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'crop-marketplace', label: 'Crops', icon: Wheat },
    { id: 'my-offers', label: 'Bids', icon: Clock },
    { id: 'my-orders', label: 'Orders', icon: Truck },
    { id: 'profile-settings', label: 'Profile', icon: UserCheck },
  ];

  const primaryMobileTabs = isFarmer ? primaryFarmerTabs : primaryCustomerTabs;

  const fullFarmerDrawerLinks = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'crop-marketplace', label: t.cropMarketplace, icon: Wheat },
    { id: 'equipment-marketplace', label: t.equipmentMarketplace, icon: Wrench },
    { id: 'expense-tracker', label: t.expenseTracker, icon: ReceiptIndianRupee },
    { id: 'loan-comparison', label: t.loanComparison, icon: Landmark },
    { id: 'ai-assistant', label: t.aiAssistant, icon: Sparkles },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'orders-and-bookings', label: t.ordersAndBookings, icon: ShoppingBag },
    { id: 'notifications', label: t.notifications, icon: Bell },
    { id: 'profile-settings', label: t.profileSettings, icon: UserCheck },
  ];

  const fullCustomerDrawerLinks = [
    { id: 'dashboard', label: 'Customer Dashboard', icon: LayoutDashboard },
    { id: 'crop-marketplace', label: t.cropMarketplace, icon: Wheat },
    { id: 'my-offers', label: 'Offers & Inquiries', icon: Clock },
    { id: 'my-orders', label: 'My Orders', icon: Truck },
    { id: 'notifications', label: t.notifications, icon: Bell },
    { id: 'profile-settings', label: t.profileSettings, icon: UserCheck },
  ];

  const fullDrawerLinks = isFarmer ? fullFarmerDrawerLinks : fullCustomerDrawerLinks;

  return (
    <>
      {/* Fixed Bottom Bar on Small Screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {primaryMobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-farm-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-farm-100 text-farm-800' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Offcanvas Drawer when Mobile Hamburger is open */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-farm-700 text-white flex items-center justify-center font-bold text-xs">
                    F2P
                  </div>
                  <span className="font-bold text-slate-900">Farm2Pay AI</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {fullDrawerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        onNavigate(link.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive 
                          ? 'bg-farm-700 text-white' 
                          : 'text-slate-700 hover:bg-farm-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-cream-100 rounded-2xl border border-cream-200">
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.village}, {currentUser.district}</p>
                <span className="inline-block mt-1 text-[9px] font-bold text-farm-800 uppercase">
                  {currentUser.role === 'buyer' ? 'Customer / Buyer' : 'Farmer'}
                </span>
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
