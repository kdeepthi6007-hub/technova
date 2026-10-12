// Dedicated Customer / Crop Buyer Dashboard Component

import React from 'react';
import { 
  ShoppingBag, 
  Wheat, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  MapPin, 
  Search, 
  Truck, 
  DollarSign,
  AlertCircle,
  Eye,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR, formatDate } from '../utils/formatters';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { CropImage } from '../components/common/CropImage';

interface CustomerDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, crops, cropOffers } = useApp();
  const { t } = useLanguage();

  if (!currentUser) return null;

  // Filter offers submitted by THIS customer
  const myOffers = cropOffers.filter(o => o.buyerId === currentUser.id);

  const activeInquiries = myOffers.filter(o => o.status === 'Inquiry submitted' || o.status === 'Offer received');
  const acceptedOffers = myOffers.filter(o => o.status === 'Accepted' || o.status === 'Confirmed');
  const completedOrders = myOffers.filter(o => o.status === 'Completed' || o.status === 'In transit');

  const totalProcuredValue = [...acceptedOffers, ...completedOrders].reduce(
    (sum, o) => sum + (o.offeredPricePerUnit * o.requestedQuantity), 
    0
  );

  // Available crops on marketplace
  const availableCrops = crops.filter(c => c.status === 'Available').slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Customer / Crop Buyer Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.companyName || `${currentUser.name} Trading Co.`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser.name} 🌾
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor purchase bids, negotiate with farmer producers, and track crop deliveries.
          </p>
        </div>

        <button
          onClick={() => onNavigate('crop-marketplace')}
          className="flex items-center gap-2 px-5 py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Browse Crop Marketplace</span>
        </button>
      </div>

      {/* Customer KPI Cards (Tailored to buyer needs, NOT farmer finances!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Bids & Inquiries"
          value={activeInquiries.length}
          subtitle="Awaiting farmer review"
          icon={Clock}
          variant="amber"
          onClick={() => onNavigate('my-offers')}
        />

        <StatCard
          title="Confirmed Crop Orders"
          value={acceptedOffers.length}
          subtitle="Ready for pickup / dispatch"
          icon={CheckCircle2}
          variant="green"
          onClick={() => onNavigate('my-orders')}
        />

        <StatCard
          title="Orders In Transit"
          value={completedOrders.length}
          subtitle="Freight & fulfillment active"
          icon={Truck}
          variant="blue"
          onClick={() => onNavigate('my-orders')}
        />

        <StatCard
          title="Committed Procurement"
          value={formatINR(totalProcuredValue)}
          subtitle="Across accepted agreements"
          icon={DollarSign}
          variant="neutral"
        />
      </div>

      {/* Grid: My Submitted Bids & Confirmed Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: My Bids & Inquiries */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Active Purchase Inquiries</h3>
                <p className="text-xs text-slate-500">Bids submitted to farmers with transport arrangements</p>
              </div>
              <button
                onClick={() => onNavigate('my-offers')}
                className="text-xs font-bold text-farm-700 hover:text-farm-900"
              >
                View All ({myOffers.length})
              </button>
            </div>

            {myOffers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ShoppingBag className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <p className="text-xs font-bold text-slate-600">No active inquiries submitted yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Explore available crops from local farmers and submit price bids.</p>
                <button
                  onClick={() => onNavigate('crop-marketplace')}
                  className="mt-3 px-4 py-2 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold"
                >
                  Browse Crops
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myOffers.slice(0, 4).map((offer) => {
                  const grossVal = offer.offeredPricePerUnit * offer.requestedQuantity;
                  return (
                    <div
                      key={offer.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-farm-300 transition-all bg-cream-50/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{offer.cropName}</h4>
                          <span className="text-[11px] text-slate-500">
                            Bid: ₹{offer.offeredPricePerUnit}/unit • {offer.requestedQuantity} units
                          </span>
                        </div>
                        <Badge
                          label={offer.status}
                          variant={offer.status === 'Accepted' ? 'green' : 'amber'}
                          size="sm"
                        />
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">{offer.deliveryTerms}</span>
                        <strong className="text-slate-900">{formatINR(grossVal)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommended / Available Crops */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Featured Available Crops</h3>
                <p className="text-xs text-slate-500">Direct from verified delta region farmers</p>
              </div>
              <button
                onClick={() => onNavigate('crop-marketplace')}
                className="text-xs font-bold text-farm-700 hover:text-farm-900"
              >
                Browse All ({crops.length})
              </button>
            </div>

            <div className="space-y-3">
              {availableCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-farm-300 transition-all flex items-center gap-3.5"
                >
                  <CropImage
                    src={crop.imageUrl}
                    alt={crop.cropName}
                    category={crop.category}
                    className="w-16 h-16 object-cover"
                    containerClassName="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {crop.cropName}
                      </h4>
                      {crop.isOrganic && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                          Organic
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Seller: {crop.sellerName} • {crop.location.district}
                    </p>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{crop.expectedPricePerUnit}/{crop.unit}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({crop.quantity} {crop.unit} available)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('crop-marketplace')}
                    className="px-3 py-1.5 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Bid
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
