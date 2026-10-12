// Customer Portal: Confirmed Orders & Crop Delivery Tracking

import React from 'react';
import { Truck, CheckCircle2, PackageCheck, Phone, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

interface CustomerOrdersPageProps {
  onNavigate: (page: string) => void;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({ onNavigate }) => {
  const { currentUser, cropOffers, crops, updateOfferStatus } = useApp();

  if (!currentUser) return null;

  // Confirmed / active orders for this buyer
  const confirmedOrders = cropOffers.filter(
    o => o.buyerId === currentUser.id && 
    (o.status === 'Accepted' || o.status === 'Confirmed' || o.status === 'In transit' || o.status === 'Completed')
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Procurement Fulfillment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Confirmed Orders & Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed purchases, transport dispatch from farms, and payment completion.
          </p>
        </div>
      </div>

      {confirmedOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <Truck className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-30" />
          <h3 className="text-base font-bold text-slate-700">No Confirmed Orders Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once a farmer accepts your price offer, it will appear here as a confirmed order ready for dispatch.
          </p>
          <button
            onClick={() => onNavigate('crop-marketplace')}
            className="mt-4 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Browse Crop Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {confirmedOrders.map((order) => {
            const matchedCrop = crops.find(c => c.id === order.cropListingId);
            const totalValue = order.offeredPricePerUnit * order.requestedQuantity;

            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Order #{order.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{order.cropName}</h3>
                      {matchedCrop && (
                        <p className="text-xs text-slate-500">
                          Seller Farmer: <strong>{matchedCrop.sellerName}</strong> • {matchedCrop.sellerPhone}
                        </p>
                      )}
                    </div>
                    <Badge
                      label={order.status}
                      variant={order.status === 'Completed' ? 'green' : 'blue'}
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50/70 rounded-2xl border border-cream-200 my-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Quantity</span>
                      <div className="font-extrabold text-slate-900 mt-0.5">
                        {order.requestedQuantity} units @ ₹{order.offeredPricePerUnit}/unit
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Order Value</span>
                      <div className="font-extrabold text-farm-800 mt-0.5">
                        {formatINR(totalValue)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p><strong>Fulfillment Method:</strong> {order.deliveryTerms}</p>
                    <p><strong>Payment Terms:</strong> {order.paymentTerms}</p>
                    <p><strong>Estimated Freight:</strong> ₹{order.estimatedTransportCost}</p>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => updateOfferStatus(order.id, 'Confirmed')}
                      className="w-full py-2 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Confirm Order & Arrange Logistics
                    </button>
                  )}
                  {order.status === 'Confirmed' && (
                    <button
                      onClick={() => updateOfferStatus(order.id, 'In transit')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Mark Vehicle Dispatched (In Transit)
                    </button>
                  )}
                  {order.status === 'In transit' && (
                    <button
                      onClick={() => updateOfferStatus(order.id, 'Completed')}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Confirm Receipt & Settle Payment (Simulated)
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <span className="w-full py-2 bg-emerald-50 text-emerald-800 text-center rounded-xl text-xs font-bold border border-emerald-200">
                      ✓ Order Fulfilled & Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
