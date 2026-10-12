// Module One: Crop Marketplace, Multi-Buyer Offer Comparison & Listing Management with Strict Ownership Controls

import React, { useState } from 'react';
import { 
  Wheat, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  Award, 
  ArrowRight, 
  Phone, 
  Scale, 
  Truck, 
  CheckCircle2, 
  DollarSign,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Pencil,
  Trash2,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { CropListing, CropOffer, CropCategory, QualityGrade } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { calculateNetCropProceeds } from '../utils/marketplaceCalculations';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CropImage } from '../components/common/CropImage';
import { EditCropListingModal } from '../components/forms/EditCropListingModal';

interface CropMarketplaceProps {
  onOpenNewListing: () => void;
  onNavigate: (page: string) => void;
}

export const CropMarketplacePage: React.FC<CropMarketplaceProps> = ({
  onOpenNewListing,
  onNavigate,
}) => {
  const { crops, cropOffers, currentUser, addCropOffer, updateOfferStatus, deleteCropListing } = useApp();
  const { t } = useLanguage();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'quantity'>('newest');

  // Modals & Action State
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [comparingCrop, setComparingCrop] = useState<CropListing | null>(null);
  const [offerTargetCrop, setOfferTargetCrop] = useState<CropListing | null>(null);
  const [editingCrop, setEditingCrop] = useState<CropListing | null>(null);
  const [cropToDelete, setCropToDelete] = useState<CropListing | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Offer Form State
  const [offeredPrice, setOfferedPrice] = useState<number>(2450);
  const [requestedQuantity, setRequestedQuantity] = useState<number>(50);
  const [transportCost, setTransportCost] = useState<number>(2500);
  const [disclosedCharges, setDisclosedCharges] = useState<number>(1000);
  const [paymentTerms, setPaymentTerms] = useState<CropOffer['paymentTerms']>('Instant UPI on dispatch');
  const [deliveryTerms, setDeliveryTerms] = useState<CropOffer['deliveryTerms']>('Farmgate Pickup (Buyer arranges)');
  const [buyerNotes, setBuyerNotes] = useState('');

  // Categories
  const categories: string[] = [
    'All',
    'Cereals & Grains',
    'Pulses',
    'Oilseeds',
    'Spices',
    'Cash Crops',
    'Vegetables',
    'Fruits'
  ];

  // Filtering & Sorting: Always hides Archived/Deactivated crops from active marketplace browsing
  const filteredCrops = crops.filter(c => {
    if (c.status === 'Archived' || c.status === 'Deactivated') {
      return false;
    }

    const matchesSearch = c.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesOrganic = !onlyOrganic || c.isOrganic;
    const matchesQuality = selectedQuality === 'All' || c.qualityGrade.includes(selectedQuality);

    return matchesSearch && matchesCategory && matchesOrganic && matchesQuality;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.expectedPricePerUnit - b.expectedPricePerUnit;
    if (sortBy === 'price_high') return b.expectedPricePerUnit - a.expectedPricePerUnit;
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Handle Offer Submission
  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTargetCrop) return;

    // Safety rule: farmer cannot bid on own crop
    if (currentUser?.id === offerTargetCrop.sellerId) {
      setFeedbackMessage({
        type: 'error',
        message: 'You cannot submit a buyer bid on your own crop listing.',
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
      setOfferTargetCrop(null);
      return;
    }

    addCropOffer({
      cropListingId: offerTargetCrop.id,
      cropName: offerTargetCrop.cropName,
      companyName: currentUser?.companyName || currentUser?.name || 'Direct Buyer',
      offeredPricePerUnit: Number(offeredPrice),
      requestedQuantity: Number(requestedQuantity),
      estimatedTransportCost: deliveryTerms.includes('Farmgate') ? 0 : Number(transportCost),
      disclosedCharges: Number(disclosedCharges),
      paymentTerms,
      deliveryTerms,
      status: 'Offer received',
      notes: buyerNotes,
    });

    setFeedbackMessage({
      type: 'success',
      message: `Your bid on "${offerTargetCrop.cropName}" has been submitted directly to the farmer.`,
    });
    setTimeout(() => setFeedbackMessage(null), 4000);

    setOfferTargetCrop(null);
    setBuyerNotes('');
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!cropToDelete) return;

    try {
      const result = deleteCropListing(cropToDelete.id);
      setFeedbackMessage({
        type: 'success',
        message: result.message || `Listing "${cropToDelete.cropName}" removed.`,
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
      if (selectedCrop?.id === cropToDelete.id) {
        setSelectedCrop(null);
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        message: err.message || 'Failed to delete crop listing.',
      });
      setTimeout(() => setFeedbackMessage(null), 5000);
    } finally {
      setCropToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Module 1: Direct Mandi Link
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Marketplace & Bids
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect directly with verified buyers. Calculate estimated Net Proceeds after freight and mandi cess.
          </p>
        </div>

        {currentUser?.role === 'farmer' && (
          <button
            onClick={onOpenNewListing}
            className="flex items-center gap-2 px-5 py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.listNewCrop}</span>
          </button>
        )}
      </div>

      {/* Action Feedback Banner */}
      {feedbackMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMessage.message}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-extrabold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by crop, variety (e.g. CO-51, TMV-7), district, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500"
            />
          </div>

          {/* Organic Filter Checkbox */}
          <label className="flex items-center gap-2 px-4 py-2.5 bg-farm-50/70 border border-farm-200 rounded-xl text-xs font-bold text-farm-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="rounded text-farm-600 focus:ring-farm-500 w-4 h-4"
            />
            <span>Certified Organic Only</span>
          </label>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-farm-500/20"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_low">Sort: Price (Low to High)</option>
            <option value="price_high">Sort: Price (High to Low)</option>
            <option value="quantity">Sort: Available Quantity</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-farm-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const offersOnThisCrop = cropOffers.filter(o => o.cropListingId === crop.id);
          const isOwnCrop = currentUser?.id === crop.sellerId;
          const isCustomer = currentUser?.role === 'buyer';

          return (
            <div
              key={crop.id}
              className={`bg-white rounded-3xl border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group ${
                isOwnCrop ? 'border-farm-300 ring-1 ring-farm-200/50' : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Reusable Image Display with IndexedDB resolution, skeletons, and graceful SVG fallbacks */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <CropImage
                    src={crop.imageUrl}
                    alt={crop.cropName}
                    category={crop.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full relative"
                  />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <Badge label={crop.status} variant={crop.status === 'Available' ? 'green' : 'amber'} size="sm" />
                    {isOwnCrop && (
                      <span className="bg-farm-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-farm-700">
                        <ShieldCheck className="w-3 h-3 text-emerald-300" />
                        Your Listing
                      </span>
                    )}
                    {crop.isOrganic && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Award className="w-3 h-3" />
                        Organic
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10">
                    {crop.quantity} {crop.unit}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-farm-700 uppercase tracking-wider">
                      {crop.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Harvest: {formatDate(crop.harvestDate)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-farm-800 transition-colors">
                    {crop.cropName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Variety: {crop.variety} • {crop.qualityGrade}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{crop.location.village}, {crop.location.district}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                      Seller: <strong className="text-slate-800">{isOwnCrop ? 'You' : crop.sellerName}</strong>
                    </span>
                  </div>

                  {/* Pricing Box */}
                  <div className="mt-4 p-3 bg-cream-50/80 rounded-2xl border border-cream-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Asking Price</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{crop.expectedPricePerUnit.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-semibold text-slate-500">/{crop.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Lot Value</span>
                      <div className="text-sm font-bold text-farm-800">
                        {formatINR(crop.expectedPricePerUnit * crop.quantity)}
                      </div>
                    </div>
                  </div>

                  {/* Buyer Offers Notification Pill */}
                  {offersOnThisCrop.length > 0 && (
                    <div className="mt-3 flex items-center justify-between text-xs p-2 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-900">
                      <span className="font-semibold">{offersOnThisCrop.length} Buyer Bids Received</span>
                      <button
                        onClick={() => setComparingCrop(crop)}
                        className="font-bold underline hover:text-amber-950 flex items-center gap-1"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Compare Proceeds</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer with Strict Ownership Permissions */}
              <div className="p-5 pt-0">
                {isOwnCrop ? (
                  // OWNER ONLY ACTIONS: View Details, Edit, Delete, Manage Bids
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setSelectedCrop(crop)}
                        className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="View Full Listing Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => setEditingCrop(crop)}
                        className="py-2 px-2 bg-farm-100 hover:bg-farm-200 text-farm-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-farm-200"
                        title="Edit Listing Details & Image"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setCropToDelete(crop)}
                        className="py-2 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-red-200"
                        title="Delete or Archive Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {offersOnThisCrop.length > 0 && (
                      <button
                        onClick={() => setComparingCrop(crop)}
                        className="w-full py-2 px-3 bg-farm-800 hover:bg-farm-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Scale className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Review {offersOnThisCrop.length} Buyer Bids</span>
                      </button>
                    )}
                  </div>
                ) : isCustomer ? (
                  // CUSTOMER / BUYER ACTIONS: View Details, Submit Offer
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCrop(crop)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setOfferTargetCrop(crop);
                        setOfferedPrice(crop.expectedPricePerUnit);
                        setRequestedQuantity(crop.quantity);
                      }}
                      className="py-2.5 px-3 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Submit Offer</span>
                    </button>
                  </div>
                ) : (
                  // OTHER FARMER ACTIONS: View Only (No Edit, No Delete, No Customer Bid)
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCrop(crop)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      disabled
                      className="py-2.5 px-3 bg-slate-50 text-slate-400 rounded-xl text-xs font-medium border border-slate-200 cursor-not-allowed flex items-center justify-center"
                      title="This produce lot is listed by another farmer producer"
                    >
                      <span>Farmer Lot</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Detailed Crop Information */}
      {selectedCrop && (
        <Modal
          isOpen={!!selectedCrop}
          onClose={() => setSelectedCrop(null)}
          title={selectedCrop.cropName}
          subtitle={`Variety: ${selectedCrop.variety} • ${selectedCrop.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <CropImage
              src={selectedCrop.imageUrl}
              alt={selectedCrop.cropName}
              category={selectedCrop.category}
              className="w-full h-56 object-cover rounded-2xl"
              containerClassName="w-full h-56 relative rounded-2xl overflow-hidden bg-slate-100 shadow-xs"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Lot Quantity</span>
                <p className="text-base font-bold text-slate-900">{selectedCrop.quantity} {selectedCrop.unit}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Expected Price</span>
                <p className="text-base font-bold text-slate-900">₹{selectedCrop.expectedPricePerUnit}/{selectedCrop.unit}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Quality Grade</span>
                <p className="text-xs font-bold text-farm-800 truncate">{selectedCrop.qualityGrade}</p>
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Seller / Producer:</span>
                <span className="font-bold text-slate-900">
                  {selectedCrop.sellerName} {selectedCrop.sellerId === currentUser?.id ? '(You)' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{selectedCrop.location.village}, {selectedCrop.location.district}, {selectedCrop.location.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Harvest Date:</span>
                <span className="font-bold text-slate-900">{formatDate(selectedCrop.harvestDate)}</span>
              </div>
              {selectedCrop.isOrganic && (
                <div className="flex justify-between text-emerald-800">
                  <span>Organic Certification:</span>
                  <span className="font-bold">{selectedCrop.organicCertNo || 'Verified NPOP Certified'}</span>
                </div>
              )}
            </div>

            {selectedCrop.description && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">Product Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedCrop.description}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCrop(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>

              {/* OWNER CONTROLS: Edit & Delete buttons */}
              {selectedCrop.sellerId === currentUser?.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCropToDelete(selectedCrop);
                      setSelectedCrop(null);
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Listing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCrop(selectedCrop);
                      setSelectedCrop(null);
                    }}
                    className="px-4 py-2 bg-farm-100 hover:bg-farm-200 text-farm-800 text-xs font-bold rounded-xl border border-farm-200 flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setComparingCrop(selectedCrop);
                      setSelectedCrop(null);
                    }}
                    className="px-5 py-2 bg-farm-800 hover:bg-farm-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Review Buyer Bids</span>
                  </button>
                </>
              ) : currentUser?.role === 'buyer' ? (
                <button
                  type="button"
                  onClick={() => {
                    setOfferTargetCrop(selectedCrop);
                    setOfferedPrice(selectedCrop.expectedPricePerUnit);
                    setRequestedQuantity(selectedCrop.quantity);
                    setSelectedCrop(null);
                  }}
                  className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Make an Offer
                </button>
              ) : null}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Submit Offer / Buyer Bid Form */}
      {offerTargetCrop && (
        <Modal
          isOpen={!!offerTargetCrop}
          onClose={() => setOfferTargetCrop(null)}
          title={`Submit Purchase Offer on ${offerTargetCrop.cropName}`}
          subtitle={`Seller Asking Price: ₹${offerTargetCrop.expectedPricePerUnit}/${offerTargetCrop.unit} • Max Available: ${offerTargetCrop.quantity} ${offerTargetCrop.unit}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmitOffer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Offered Price per {offerTargetCrop.unit} (₹)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Quantity ({offerTargetCrop.unit})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={offerTargetCrop.quantity}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Transport Cost (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  APMC Cess & Disclosed Deductions (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={disclosedCharges}
                  onChange={(e) => setDisclosedCharges(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Logistics Terms
                </label>
                <select
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Farmgate Pickup (Buyer arranges)">Farmgate Pickup (Buyer arranges)</option>
                  <option value="Seller Delivery to Mandi/Depot">Seller Delivery to Mandi/Depot</option>
                  <option value="Third-party Logistics (Shared)">Third-party Logistics (Shared)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method & Escrow
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Instant UPI on dispatch">Instant UPI on dispatch</option>
                  <option value="Bank NEFT/RTGS within 24h">Bank NEFT/RTGS within 24h</option>
                  <option value="50% Advance + 50% on weighment">50% Advance + 50% on weighment</option>
                  <option value="Farm2Pay Escrow Protected">Farm2Pay Escrow Protected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Procurement Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Mention inspection requirements, bagging, or dispatch deadlines..."
                value={buyerNotes}
                onChange={(e) => setBuyerNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Calculated Net Proceeds Preview */}
            <div className="p-3.5 bg-farm-50 rounded-2xl border border-farm-200 text-xs">
              <span className="text-[10px] font-bold text-farm-800 uppercase tracking-wider">
                Farmer Net Proceeds Calculation Preview:
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500">Gross Value:</span>
                  <div className="font-bold text-slate-900">{formatINR(offeredPrice * requestedQuantity)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Deductions:</span>
                  <div className="font-bold text-red-700">-{formatINR((deliveryTerms.includes('Farmgate') ? 0 : transportCost) + disclosedCharges)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Net Proceeds:</span>
                  <div className="font-extrabold text-farm-800">
                    {formatINR(Math.max(0, (offeredPrice * requestedQuantity) - (deliveryTerms.includes('Farmgate') ? 0 : transportCost) - disclosedCharges))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOfferTargetCrop(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm & Submit Offer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 3: Multi-Buyer Offer Comparison View */}
      {comparingCrop && (
        <Modal
          isOpen={!!comparingCrop}
          onClose={() => setComparingCrop(null)}
          title={`Compare Buyer Bids: ${comparingCrop.cropName}`}
          subtitle={`Farmer Asking: ₹${comparingCrop.expectedPricePerUnit}/${comparingCrop.unit} • Formula: Net Proceeds = Crop Value − Transport − Disclosed Charges`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            {cropOffers.filter(o => o.cropListingId === comparingCrop.id).length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No buyer bids have been submitted for this crop listing yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cropOffers
                  .filter(o => o.cropListingId === comparingCrop.id)
                  .map((offer) => {
                    const proceeds = calculateNetCropProceeds(
                      offer.offeredPricePerUnit,
                      offer.requestedQuantity,
                      offer.estimatedTransportCost,
                      offer.disclosedCharges,
                      comparingCrop.expectedPricePerUnit
                    );

                    return (
                      <div
                        key={offer.id}
                        className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-farm-500 transition-all shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {offer.companyName}
                            </span>
                            <Badge label={offer.status} variant="amber" size="sm" />
                          </div>

                          <div className="text-2xl font-extrabold text-slate-900 mb-1">
                            ₹{offer.offeredPricePerUnit}{' '}
                            <span className="text-xs font-semibold text-slate-500">
                              / {comparingCrop.unit}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                            <div className="flex justify-between">
                              <span>Requested Quantity:</span>
                              <strong className="text-slate-900">{offer.requestedQuantity} {comparingCrop.unit}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Gross Crop Value:</span>
                              <strong className="text-slate-900">{formatINR(proceeds.grossCropValue)}</strong>
                            </div>
                            <div className="flex justify-between text-red-700">
                              <span>Estimated Freight:</span>
                              <strong>-{formatINR(proceeds.transportCost)}</strong>
                            </div>
                            <div className="flex justify-between text-red-700">
                              <span>Mandi Cess & Handling:</span>
                              <strong>-{formatINR(proceeds.disclosedCharges)}</strong>
                            </div>
                          </div>

                          {/* Net Proceeds Highlight */}
                          <div className="mt-4 p-3.5 bg-farm-50 rounded-xl border border-farm-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-bold uppercase text-[10px]">
                                Realized Net Proceeds:
                              </span>
                              <span className="text-base font-extrabold text-farm-800">
                                {formatINR(proceeds.estimatedNetProceeds)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span>Effective Rate per Unit:</span>
                              <strong className="text-slate-900">₹{proceeds.netProceedsPerUnit}/{comparingCrop.unit}</strong>
                            </div>
                          </div>

                          <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                            <p><strong>Delivery:</strong> {offer.deliveryTerms}</p>
                            <p><strong>Payment:</strong> {offer.paymentTerms}</p>
                          </div>
                        </div>

                        {/* Status Actions */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                          {offer.status !== 'Accepted' ? (
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                              className="w-full py-2 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                            >
                              Accept This Bid
                            </button>
                          ) : (
                            <span className="w-full py-2 bg-emerald-100 text-emerald-800 text-center rounded-xl text-xs font-bold">
                              ✓ Bid Accepted
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal 4: Edit Crop Listing (Owner Only) */}
      <EditCropListingModal
        crop={editingCrop}
        isOpen={!!editingCrop}
        onClose={() => setEditingCrop(null)}
      />

      {/* Confirmation Dialog: Delete or Safe Archive Crop Listing */}
      <ConfirmDialog
        isOpen={!!cropToDelete}
        title={`Delete Listing: ${cropToDelete?.cropName || ''}`}
        message={`Are you sure you want to delete "${cropToDelete?.cropName}"? This will remove the listing from active marketplace browsing. If buyers have already submitted bids or active orders, it will be safely archived to protect audit records.`}
        confirmLabel="Confirm Delete / Archive"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCropToDelete(null)}
      />

    </div>
  );
};
