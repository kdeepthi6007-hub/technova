// In-App Notification Center Drawer with Categorized Alerts & Quick Actions

import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    onClose();
    if (notif.actionUrl) {
      // Clean leading slash for page router
      const pageKey = notif.actionUrl.replace('/', '');
      onNavigate(pageKey || 'dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-farm-100 text-farm-800 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Farm Alerts & Updates</h3>
              <p className="text-xs text-slate-500">{notifications.filter(n => !n.read).length} unread updates</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-semibold text-farm-700 hover:text-farm-900 px-2 py-1 rounded-lg hover:bg-farm-50 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto stroke-[1.5] mb-2 opacity-40" />
              <p className="text-sm font-medium">No alerts right now</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.read;
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnread
                      ? 'bg-farm-50/70 border-farm-200/90 shadow-xs'
                      : 'bg-white border-slate-200/70 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {notif.type === 'budget_alert' ? (
                        <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : notif.type === 'loan_reminder' ? (
                        <div className="p-1.5 bg-red-100 text-red-700 rounded-lg mt-0.5">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-farm-100 text-farm-700 rounded-lg mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {notif.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="flex items-center gap-1 text-xs font-bold text-farm-700 hover:text-farm-900 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Simulated notifications generated based on active farm operations.
        </div>
      </div>
    </div>
  );
};
