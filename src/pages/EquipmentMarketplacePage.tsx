// Module One (B): Agricultural Equipment & Machinery Rental / Purchase Hub

import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  MapPin, 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Layers,
  ArrowRight,
  Eye,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { EquipmentListing, EquipmentCategory, RentalUnit } from '../types';
import { formatINR } from '../utils/formatters';
import { calculateEquipmentRentalCost } from '../utils/marketplaceCalculations';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface EquipmentMarketplaceProps {
  onOpenNewListing: () => void;
  onNavigate: (page: string) => void;
}

export const EquipmentMarketplacePage: React.FC<EquipmentMarketplaceProps> = ({
  onOpenNewListing,
  onNavigate,
}) => {
  const { equipment, bookings, currentUser, createEquipmentBooking } = useApp();
  const { t } = useLanguage();

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'buy'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedEq, setSelectedEq] = useState<EquipmentListing | null>(null);
  const [bookingTargetEq, setBookingTargetEq] = useState<EquipmentListing | null>(null);

  // Booking Form State
  const [bookingDuration, setBookingDuration] = useState<number>(8);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [withOperator, setWithOperator] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState<'Self Pickup' | 'Owner Delivery (+₹500)'>('Owner Delivery (+₹500)');

  const categories = [
    'All',
    'Tractor & Implements',
    'Seed Drill & Planter',
    'Harvester & Thresher',
    'Water Pump & Irrigation',
    'Power Tiller & Rotary',
    'Sprayer & Duster',
  ];

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || eq.category === selectedCategory;
    
    let matchesTab = true;
    if (activeTab === 'rent') matchesTab = eq.forRent;
    if (activeTab === 'buy') matchesTab = eq.forSale;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTargetEq || !bookingTargetEq.rentalRate) return;

    const rentalCalc = calculateEquipmentRentalCost(
      bookingTargetEq.rentalRate,
      bookingDuration,
      bookingTargetEq.additionalFees + (deliveryOption.includes('+₹500') ? 500 : 0),
      bookingTargetEq.deposit
    );

    createEquipmentBooking({
      equipmentId: bookingTargetEq.id,
      equipmentName: bookingTargetEq.name,
      ownerName: bookingTargetEq.ownerName,
      startDate,
      endDate,
      durationUnits: bookingDuration,
      rentalUnit: bookingTargetEq.rentalUnit || 'per hour',
      rentalRate: bookingTargetEq.rentalRate,
      depositAmount: bookingTargetEq.deposit,
      additionalFees: rentalCalc.additionalFees,
      totalEstimatedCost: rentalCalc.totalEstimatedOutflow,
      status: 'Inquiry submitted',
      withOperator,
      deliveryOption,
    });

    setBookingTargetEq(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Module 1: Machinery & Custom Hiring
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Equipment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rent tractors, transplanters, solar pumps & harvesters with upfront transparent operator fees.
          </p>
        </div>

        <button
          onClick={onOpenNewListing}
          className="flex items-center gap-2 px-5 py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.listEquipment}</span>
        </button>
      </div>

      {/* Filter and Mode Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Mode Tabs: All, For Rent, For Sale */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Machinery ({equipment.length})
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rent' ? 'bg-white text-farm-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚜 For Rent ({equipment.filter(e => e.forRent).length})
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'buy' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏷️ For Sale ({equipment.filter(e => e.forSale).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tractors, brands, pumps, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500"
            />
          </div>
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

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Image & Status Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={eq.imageUrl}
                  alt={eq.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {eq.forRent && (
                    <span className="bg-farm-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Rent
                    </span>
                  )}
                  {eq.forSale && (
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Buy
                    </span>
                  )}
                  <Badge label={eq.condition} variant="neutral" size="sm" />
                </div>

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {eq.specifications.horsePower || eq.specifications.fuelType || 'Agri Mach'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center justify-between text-[11px] font-bold text-farm-700 uppercase tracking-wider mb-1">
                  <span>{eq.category}</span>
                  <span className="text-slate-400 font-semibold normal-case">
                    {eq.location.district}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-farm-800 transition-colors">
                  {eq.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Owner: {eq.ownerName}
                </p>

                {/* Specs Snippet */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                  {eq.specifications.fuelType && (
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{eq.specifications.fuelType}</span>
                    </div>
                  )}
                  {eq.specifications.horsePower && (
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{eq.specifications.horsePower}</span>
                    </div>
                  )}
                </div>

                {/* Rate Card */}
                <div className="mt-4 p-3 bg-cream-50/80 rounded-2xl border border-cream-200 flex items-center justify-between">
                  {eq.forRent && eq.rentalRate ? (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Rental Rate</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{eq.rentalRate.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-semibold text-slate-500">/{eq.rentalUnit?.replace('per ', '')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Deposit: ₹{eq.deposit}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Sale Price</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        {formatINR(eq.salePrice || 0)}
                      </div>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Addl. Fees</span>
                    <div className="text-xs font-bold text-slate-700">
                      ₹{eq.additionalFees}
                    </div>
                    <span className="text-[10px] text-slate-400">Driver/Fuel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedEq(eq)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Specifications</span>
              </button>

              {eq.forRent ? (
                <button
                  onClick={() => {
                    setBookingTargetEq(eq);
                    setBookingDuration(eq.rentalUnit === 'per day' ? 2 : 6);
                  }}
                  className="py-2.5 px-3 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Equipment</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedEq(eq)}
                  className="py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Inquire to Buy</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal 1: Equipment Specifications */}
      {selectedEq && (
        <Modal
          isOpen={!!selectedEq}
          onClose={() => setSelectedEq(null)}
          title={selectedEq.name}
          subtitle={`Owner: ${selectedEq.ownerName} • Phone: ${selectedEq.ownerPhone}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <img
              src={selectedEq.imageUrl}
              alt={selectedEq.name}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedEq.category}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Horsepower / Spec</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedEq.specifications.horsePower || 'Standard'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedEq.location.village}, {selectedEq.location.district}</p>
              </div>
            </div>

            {selectedEq.specifications.attachments && selectedEq.specifications.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Included Attachments & Implements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEq.specifications.attachments.map((att, i) => (
                    <span key={i} className="px-3 py-1 bg-farm-50 text-farm-800 rounded-lg text-xs font-semibold border border-farm-200">
                      ✓ {att}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Rental Rate:</span>
                <strong className="text-slate-900">
                  {selectedEq.rentalRate ? `₹${selectedEq.rentalRate} ${selectedEq.rentalUnit}` : 'N/A'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Deposit (Refundable):</span>
                <strong className="text-slate-900">₹{selectedEq.deposit}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Additional Charges (Driver/Service):</span>
                <strong className="text-slate-900">₹{selectedEq.additionalFees}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedEq(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              {selectedEq.forRent && (
                <button
                  onClick={() => {
                    setBookingTargetEq(selectedEq);
                    setSelectedEq(null);
                  }}
                  className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Proceed to Book
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Equipment Booking Calculator & Request */}
      {bookingTargetEq && (
        <Modal
          isOpen={!!bookingTargetEq}
          onClose={() => setBookingTargetEq(null)}
          title={`Book: ${bookingTargetEq.name}`}
          subtitle={`Owner: ${bookingTargetEq.ownerName} • Rate: ₹${bookingTargetEq.rentalRate} ${bookingTargetEq.rentalUnit}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration ({bookingTargetEq.rentalUnit?.replace('per ', '')}s)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery / Transport Option</label>
                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Self Pickup">Self Pickup from Owner Center</option>
                  <option value="Owner Delivery (+₹500)">Owner Road Delivery (+₹500)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withOperator}
                    onChange={(e) => setWithOperator(e.target.checked)}
                    className="rounded text-farm-600 focus:ring-farm-500 w-4 h-4"
                  />
                  <span>Include Certified Driver / Operator</span>
                </label>
              </div>
            </div>

            {/* Live Rental Cost Calculation Preview */}
            {(() => {
              const deliveryExtra = deliveryOption.includes('+₹500') ? 500 : 0;
              const calc = calculateEquipmentRentalCost(
                bookingTargetEq.rentalRate || 0,
                bookingDuration,
                bookingTargetEq.additionalFees + deliveryExtra,
                bookingTargetEq.deposit
              );

              return (
                <div className="p-4 bg-farm-50 rounded-2xl border border-farm-200/90 text-xs space-y-2">
                  <span className="text-[10px] font-bold text-farm-800 uppercase tracking-wider">
                    Transparent Rental Cost Calculation:
                  </span>
                  
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Rental ({bookingDuration} × ₹{bookingTargetEq.rentalRate}):</span>
                      <strong className="text-slate-900">{formatINR(calc.baseRentalCost)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Disclosed Operator & Delivery Fees:</span>
                      <strong className="text-slate-900">{formatINR(calc.additionalFees)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Refundable Security Deposit:</span>
                      <strong className="text-slate-900">{formatINR(calc.depositAmount)}</strong>
                    </div>
                    <div className="pt-2 border-t border-farm-200 flex justify-between text-sm font-extrabold text-farm-900">
                      <span>Total Estimated Cash Outflow:</span>
                      <span>{formatINR(calc.totalEstimatedOutflow)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingTargetEq(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Booking Request
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
