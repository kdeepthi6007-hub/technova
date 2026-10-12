// Modal Form to List New Farm Equipment for Rent or Sale

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { EquipmentCategory, RentalUnit, EquipmentCondition } from '../../types';

interface NewEquipmentListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEquipmentListingModal: React.FC<NewEquipmentListingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addEquipmentListing, currentUser } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('Tractor & Implements');
  const [condition, setCondition] = useState<EquipmentCondition>('Excellent');
  const [forRent, setForRent] = useState(true);
  const [rentalRate, setRentalRate] = useState<number>(900);
  const [rentalUnit, setRentalUnit] = useState<RentalUnit>('per hour');
  const [deposit, setDeposit] = useState<number>(2000);
  const [additionalFees, setAdditionalFees] = useState<number>(400);
  const [forSale, setForSale] = useState(false);
  const [salePrice, setSalePrice] = useState<number>(650000);
  const [horsePower, setHorsePower] = useState('45 HP');
  const [fuelType, setFuelType] = useState<'Diesel' | 'Electric' | 'Solar'>('Diesel');
  const [brand, setBrand] = useState('Mahindra / Swaraj');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addEquipmentListing({
      name,
      category,
      location: {
        village: currentUser?.village || 'Papanasam',
        district: currentUser?.district || 'Thanjavur',
        state: currentUser?.state || 'Tamil Nadu',
      },
      condition,
      forSale,
      salePrice: forSale ? Number(salePrice) : undefined,
      forRent,
      rentalRate: forRent ? Number(rentalRate) : undefined,
      rentalUnit: forRent ? rentalUnit : undefined,
      deposit: Number(deposit),
      additionalFees: Number(additionalFees),
      specifications: {
        horsePower,
        fuelType,
        brand,
        attachments: ['Standard Implement'],
      },
      isAvailable: true,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List Agricultural Machinery for Rent or Sale"
      subtitle="Help nearby farmers mechanize their field operations while earning steady custom-hiring income."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Name & Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Swaraj 744 FE 48 HP with 9-Tyne Cultivator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Tractor & Implements">Tractor & Implements</option>
              <option value="Power Tiller & Rotary">Power Tiller & Rotary</option>
              <option value="Harvester & Thresher">Harvester & Thresher</option>
              <option value="Water Pump & Irrigation">Water Pump & Irrigation</option>
              <option value="Sprayer & Duster">Sprayer & Duster</option>
              <option value="Seed Drill & Planter">Seed Drill & Planter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Horsepower / Power Rating</label>
            <input
              type="text"
              value={horsePower}
              onChange={(e) => setHorsePower(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fuel / Energy Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Solar">Solar</option>
            </select>
          </div>
        </div>

        {/* Rent & Sale Toggles */}
        <div className="p-4 bg-cream-50/70 rounded-2xl border border-cream-200 space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={forRent}
                onChange={(e) => setForRent(e.target.checked)}
                className="rounded text-farm-600 focus:ring-farm-500 w-4 h-4"
              />
              <span>Available for Custom Hire / Rent</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={forSale}
                onChange={(e) => setForSale(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Available for Direct Sale</span>
            </label>
          </div>

          {forRent && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Rental Rate (₹)</label>
                <input
                  type="number"
                  value={rentalRate}
                  onChange={(e) => setRentalRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Rental Unit</label>
                <select
                  value={rentalUnit}
                  onChange={(e) => setRentalUnit(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="per hour">per hour</option>
                  <option value="per day">per day</option>
                  <option value="per week">per week</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Deposit (₹)</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {forSale && (
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Direct Sale Price (₹)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full sm:w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            List Equipment
          </button>
        </div>
      </form>
    </Modal>
  );
};
