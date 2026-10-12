// Customer Portal: Offers & Inquiries Sent to Farmers

import React from 'react';
import { ShoppingBag, Search, Clock, ArrowRight, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

interface CustomerOffersPageProps {
  onNavigate: (page: string) => void;
}

export const CustomerOffersPage: React.FC<CustomerOffersPageProps> = ({ onNavigate }) => {
  const { currentUser, cropOffers, crops, updateOfferStatus } = useApp();

  if (!currentUser) return null;

  // Filter offers submitted by this customer
  const myOffers = cropOffers.filter(o => o.buyerId === currentUser.id);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Procurement Inquiries
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Submitted Offers & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track price proposals sent to local farmers, negotiated freight terms, and farmer acceptance.
          </p>
        </div>

        <button
          onClick={() => onNavigate('crop-marketplace')}
          className="flex items-center gap-2 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Place New Bid</span>
        </button>
      </div>

      {/* Offers List */}
      {myOffers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
          <Clock className="w-12 h-12 mx-auto stroke-[1.5] mb-2 opacity-30" />
          <h3 className="text-base font-bold text-slate-700">No Inquiries Submitted Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You have not placed any bids on crops yet. Explore active crop listings from local farmers and submit offers.
          </p>
          <button
            onClick={() => onNavigate('crop-marketplace')}
            className="mt-4 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Explore Crop Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myOffers.map((offer) => {
            const matchedCrop = crops.find(c => c.id === offer.cropListingId);
            const grossVal = offer.offeredPricePerUnit * offer.requestedQuantity;
            const netProceeds = grossVal - offer.estimatedTransportCost - offer.disclosedCharges;

            return (
              <div
                key={offer.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Inquiry #{offer.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{offer.cropName}</h3>
                      {matchedCrop && (
                        <p className="text-xs text-slate-500">
                          Seller: <strong>{matchedCrop.sellerName}</strong> ({matchedCrop.sellerPhone})
                        </p>
                      )}
                    </div>
                    <Badge
                      label={offer.status}
                      variant={
                        offer.status === 'Accepted' || offer.status === 'Confirmed'
                          ? 'green'
                          : offer.status === 'Cancelled'
                          ? 'red'
                          : 'amber'
                      }
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50/70 rounded-2xl border border-cream-200 my-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Your Offer</span>
                      <div className="font-extrabold text-slate-900 mt-0.5">
                        ₹{offer.offeredPricePerUnit}/unit • {offer.requestedQuantity} units
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Commitment</span>
                      <div className="font-extrabold text-farm-800 mt-0.5">
                        {formatINR(grossVal)}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p><strong>Delivery Arrangement:</strong> {offer.deliveryTerms}</p>
                    <p><strong>Payment Terms:</strong> {offer.paymentTerms}</p>
                    <p><strong>Estimated Freight:</strong> ₹{offer.estimatedTransportCost}</p>
                    {offer.notes && <p><strong>Notes:</strong> {offer.notes}</p>}
                  </div>
                </div>

                {/* Cancel Action if pending */}
                {offer.status === 'Offer received' || offer.status === 'Inquiry submitted' ? (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => updateOfferStatus(offer.id, 'Cancelled')}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors"
                    >
                      Withdraw Inquiry
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
