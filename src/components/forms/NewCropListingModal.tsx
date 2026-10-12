// Modal Form for Farmers to Post New Crop Listings with Image Upload & Web URL options

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CropCategory, QualityGrade } from '../../types';
import { CropImagePicker } from './CropImagePicker';

interface NewCropListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCropListingModal: React.FC<NewCropListingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCropListing, currentUser } = useApp();

  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<CropCategory>('Cereals & Grains');
  const [variety, setVariety] = useState('');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Export / Premium)');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<'Quintal' | 'Kg' | 'Ton' | 'Bags'>('Quintal');
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState<number>(2400);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isOrganic, setIsOrganic] = useState(false);
  const [organicCertNo, setOrganicCertNo] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    addCropListing({
      cropName,
      category,
      variety,
      qualityGrade,
      quantity: Number(quantity),
      unit,
      expectedPricePerUnit: Number(expectedPricePerUnit),
      harvestDate,
      location: {
        village: currentUser?.village || 'Thiruvaiyaru',
        district: currentUser?.district || 'Thanjavur',
        state: currentUser?.state || 'Tamil Nadu',
      },
      isOrganic,
      organicCertNo: isOrganic ? organicCertNo : undefined,
      imageUrl: imageUrl.trim() || '',
      status: 'Available',
      description,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Crop Listing for Direct Mandi Sale"
      subtitle="Connect directly with certified millers and buyers across the state."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name & Variety</label>
            <input
              type="text"
              required
              placeholder="e.g. Samba Paddy (CO-51)"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Cereals & Grains">Cereals & Grains</option>
              <option value="Pulses">Pulses</option>
              <option value="Oilseeds">Oilseeds</option>
              <option value="Spices">Spices</option>
              <option value="Cash Crops">Cash Crops</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Variety Specifics</label>
            <input
              type="text"
              placeholder="e.g. Fine Grain / Seed Foundation"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade</label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Grade A (Export / Premium)">Grade A (Export / Premium)</option>
              <option value="Grade B (Standard Mandi)">Grade B (Standard Mandi)</option>
              <option value="Grade C (Fair Average Quality)">Grade C (Fair Average Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Available Quantity & Unit</label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-1/3 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="Quintal">Quintal</option>
                <option value="Kg">Kg</option>
                <option value="Ton">Ton</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expected Asking Price (₹/{unit})</label>
            <input
              type="number"
              required
              min={1}
              value={expectedPricePerUnit}
              onChange={(e) => setExpectedPricePerUnit(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Harvest / Availability Date</label>
            <input
              type="date"
              required
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
        </div>

        {/* Crop Photo Picker (Device Upload with IndexedDB + Web URL) */}
        <CropImagePicker
          value={imageUrl}
          onChange={(newImg) => setImageUrl(newImg)}
          cropCategory={category}
          cropName={cropName || 'Crop Produce'}
        />

        {/* Organic Certification Checkbox */}
        <div className="p-3 bg-farm-50/70 rounded-xl border border-farm-200/80">
          <label className="flex items-center gap-2 text-xs font-bold text-farm-900 cursor-pointer">
            <input
              type="checkbox"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="rounded text-farm-600 focus:ring-farm-500 w-4 h-4"
            />
            <span>This produce is Certified Organic</span>
          </label>

          {isOrganic && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Organic Certificate No. (e.g. TNOCD-2026-9021)"
                value={organicCertNo}
                onChange={(e) => setOrganicCertNo(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-farm-300 rounded-lg text-xs"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Moisture Level</label>
          <textarea
            rows={2}
            placeholder="E.g. Cleaned using mechanical winnower, moisture verified under 13%..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
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
            Publish Crop Listing
          </button>
        </div>
      </form>
    </Modal>
  );
};
