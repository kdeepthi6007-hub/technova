// Desktop Sidebar Navigation with Role-Specific Menus (Farmer vs Customer) & Logout

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
  LogOut,
  Clock,
  Truck,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { t } = useLanguage();
  const { currentUser, notifications, logoutUser } = useApp();

  if (!currentUser) return null;

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const isFarmer = currentUser.role === 'farmer';

  // Role-Specific Navigation Links
  const farmerNavItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'crop-marketplace', label: t.cropMarketplace, icon: Wheat },
    { id: 'equipment-marketplace', label: t.equipmentMarketplace, icon: Wrench },
    { id: 'expense-tracker', label: t.expenseTracker, icon: ReceiptIndianRupee },
    { id: 'loan-comparison', label: t.loanComparison, icon: Landmark, highlight: true },
    { id: 'ai-assistant', label: t.aiAssistant, icon: Sparkles, aiBadge: true },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'orders-and-bookings', label: t.ordersAndBookings, icon: ShoppingBag },
    { id: 'notifications', label: t.notifications, icon: Bell, count: unreadNotifications },
    { id: 'profile-settings', label: t.profileSettings, icon: UserCheck },
  ];

  const customerNavItems = [
    { id: 'dashboard', label: 'Buyer Dashboard', icon: LayoutDashboard },
    { id: 'crop-marketplace', label: t.cropMarketplace, icon: Wheat },
    { id: 'my-offers', label: 'Offers & Inquiries', icon: Clock },
    { id: 'my-orders', label: 'My Orders', icon: Truck },
    { id: 'notifications', label: t.notifications, icon: Bell, count: unreadNotifications },
    { id: 'profile-settings', label: t.profileSettings, icon: UserCheck },
  ];

  const activeNavItems = isFarmer ? farmerNavItems : customerNavItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 justify-between">
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isFarmer ? 'Farmer Operations' : 'Crop Buyer Portal'}
        </div>

        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? isFarmer
                    ? 'bg-farm-800 text-white shadow-sm'
                    : 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive 
                    ? 'text-emerald-300' 
                    : isFarmer 
                    ? 'text-slate-400 group-hover:text-farm-600' 
                    : 'text-slate-400 group-hover:text-amber-600'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {(item as any).aiBadge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-farm-700 text-emerald-200' : 'bg-farm-100 text-farm-800 border border-farm-200'
                }`}>
                  AI
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Persona & Logout */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        
        {/* Dynamic Authenticated User Card */}
        <div className="p-3 bg-cream-100/90 rounded-2xl border border-cream-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-farm-800 text-white font-extrabold flex items-center justify-center text-sm shadow-2xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.village}, {currentUser.district}
              </p>
              <span className={`inline-block mt-0.5 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                isFarmer ? 'text-farm-800 bg-farm-200/70' : 'text-amber-900 bg-amber-200/70'
              }`}>
                {isFarmer ? 'Farmer' : 'Customer / Buyer'}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200/60 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Account</span>
        </button>

        {/* Demo Mode Notice */}
        {currentUser.isDemoAccount && (
          <div className="flex items-start gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[10px] leading-tight">
            <Info className="w-3 h-3 text-farm-600 shrink-0 mt-0.5" />
            <span>Simulated demo session. Changes save locally in browser.</span>
          </div>
        )}
      </div>
    </aside>
  );
};
