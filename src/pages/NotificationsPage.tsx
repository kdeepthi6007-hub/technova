// Module: Dedicated Notifications & Critical Farm Reminders Center

import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const { t } = useLanguage();

  const handleAction = (url?: string, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (url) {
      const pageKey = url.replace('/', '');
      onNavigate(pageKey || 'dashboard');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-farm-100 text-farm-800 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Farm Reminders & Alerts
            </h1>
            <p className="text-xs text-slate-500">
              Real-time events regarding buyer bids, equipment bookings, and budget overruns.
            </p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
            <Bell className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-30" />
            <p className="text-sm font-semibold">You're all caught up! No notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-3xl border transition-all ${
                !notif.read
                  ? 'bg-white border-farm-300 shadow-xs ring-1 ring-farm-400/20'
                  : 'bg-white/70 border-slate-200/80 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'budget_alert'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'loan_reminder'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-farm-100 text-farm-700'
                  }`}>
                    {notif.type === 'budget_alert' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : notif.type === 'loan_reminder' ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-farm-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                {notif.actionUrl && (
                  <button
                    onClick={() => handleAction(notif.actionUrl, notif.id)}
                    className="px-4 py-2 bg-slate-50 hover:bg-farm-50 text-slate-700 hover:text-farm-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
