// Module: Orders & Bookings Management (Crop Offers & Equipment Rentals)

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Wheat, 
  Wrench, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { OfferStatus } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const OrdersAndBookingsPage: React.FC = () => {
  const { cropOffers, bookings, updateOfferStatus, updateBookingStatus } = useApp();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'all' | 'crop_orders' | 'equipment_bookings'>('all');

  const getStatusBadgeVariant = (status: OfferStatus) => {
    switch (status) {
      case 'Accepted':
      case 'Confirmed':
      case 'Completed':
        return 'green';
      case 'Offer received':
      case 'In transit':
        return 'blue';
      case 'Inquiry submitted':
        return 'amber';
      case 'Cancelled':
        return 'red';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Marketplace Operations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Demo Mode (Simulated Fulfillment)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders & Bookings Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track crop purchase negotiations, dispatch statuses, and agricultural machinery rental schedules.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setActiveTab('crop_orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'crop_orders' ? 'bg-white text-farm-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            🌾 Crops ({cropOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('equipment_bookings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'equipment_bookings' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            🚜 Machinery ({bookings.length})
          </button>
        </div>
      </div>

      {/* Crop Offers / Orders List */}
      {(activeTab === 'all' || activeTab === 'crop_orders') && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wheat className="w-4 h-4 text-farm-600" />
            <span>Crop Buyer Negotiations & Orders</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropOffers.map((offer) => {
              const grossVal = offer.offeredPricePerUnit * offer.requestedQuantity;
              const netVal = grossVal - offer.estimatedTransportCost - offer.disclosedCharges;

              return (
                <div
                  key={offer.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Order #{offer.id}</span>
                        <h3 className="text-base font-bold text-slate-900">{offer.cropName}</h3>
                        <p className="text-xs text-slate-500">{offer.companyName}</p>
                      </div>
                      <Badge
                        label={offer.status}
                        variant={getStatusBadgeVariant(offer.status)}
                        size="sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50/70 rounded-2xl border border-cream-200 my-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Price & Quantity</span>
                        <div className="font-extrabold text-slate-900 mt-0.5">
                          ₹{offer.offeredPricePerUnit}/unit • {offer.requestedQuantity} units
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Net Proceeds</span>
                        <div className="font-extrabold text-farm-800 mt-0.5">
                          {formatINR(netVal)}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p><strong>Delivery Terms:</strong> {offer.deliveryTerms}</p>
                      <p><strong>Payment Terms:</strong> {offer.paymentTerms}</p>
                      {offer.notes && <p><strong>Buyer Notes:</strong> {offer.notes}</p>}
                    </div>
                  </div>

                  {/* Status Progression Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">Status Control:</span>
                    <select
                      value={offer.status}
                      onChange={(e) => updateOfferStatus(offer.id, e.target.value as any)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                    >
                      <option value="Inquiry submitted">Inquiry submitted</option>
                      <option value="Offer received">Offer received</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In transit">In transit</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Equipment Bookings List */}
      {(activeTab === 'all' || activeTab === 'equipment_bookings') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Farm Equipment & Machinery Rentals</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">Booking #{booking.id}</span>
                      <h3 className="text-base font-bold text-slate-900">{booking.equipmentName}</h3>
                      <p className="text-xs text-slate-500">Center: {booking.ownerName}</p>
                    </div>
                    <Badge
                      label={booking.status}
                      variant={getStatusBadgeVariant(booking.status)}
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50/70 rounded-2xl border border-cream-200 my-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Schedule & Duration</span>
                      <div className="font-extrabold text-slate-900 mt-0.5">
                        {booking.durationUnits} {booking.rentalUnit} ({formatDate(booking.startDate)})
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Estimated Cost</span>
                      <div className="font-extrabold text-farm-800 mt-0.5">
                        {formatINR(booking.totalEstimatedCost)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p><strong>Renter:</strong> {booking.renterName} ({booking.renterPhone})</p>
                    <p><strong>Delivery Option:</strong> {booking.deliveryOption}</p>
                    <p><strong>Certified Driver:</strong> {booking.withOperator ? 'Included' : 'Self operated'}</p>
                  </div>
                </div>

                {/* Status Progression Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">Status Control:</span>
                  <select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="Inquiry submitted">Inquiry submitted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In transit">Active / In Operation</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
