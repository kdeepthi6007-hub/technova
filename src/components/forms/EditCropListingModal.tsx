// Modal Form for Farmer Owners to Edit Their Crop Listings & Manage Images

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CropListing, CropCategory, QualityGrade, CropStatus } from '../../types';
import { CropImagePicker } from './CropImagePicker';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EditCropListingModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCropListingModal: React.FC<EditCropListingModalProps> = ({
  crop,
  isOpen,
  onClose,
}) => {
  const { editCropListing, currentUser } = useApp();

  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<CropCategory>('Cereals & Grains');
  const [variety, setVariety] = useState('');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Export / Premium)');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<'Quintal' | 'Kg' | 'Ton' | 'Bags'>('Quintal');
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState<number>(2400);
  const [harvestDate, setHarvestDate] = useState<string>('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [organicCertNo, setOrganicCertNo] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<CropStatus>('Available');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when crop changes
  useEffect(() => {
    if (crop) {
      setCropName(crop.cropName);
      setCategory(crop.category);
      setVariety(crop.variety);
      setQualityGrade(crop.qualityGrade);
      setQuantity(crop.quantity);
      setUnit(crop.unit);
      setExpectedPricePerUnit(crop.expectedPricePerUnit);
      setHarvestDate(crop.harvestDate);
      setIsOrganic(crop.isOrganic);
      setOrganicCertNo(crop.organicCertNo || '');
      setDescription(crop.description || '');
      setImageUrl(crop.imageUrl || '');
      setStatus(crop.status);
      setVillage(crop.location.village);
      setDistrict(crop.location.district);
      setState(crop.location.state);
      setFormError(null);
    }
  }, [crop]);

  if (!crop) return null;

  const isOwner = currentUser?.id === crop.sellerId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isOwner) {
      setFormError('Permission Denied: You cannot modify another farmer\'s crop listing.');
      return;
    }

    if (!cropName.trim()) {
      setFormError('Please enter a valid crop name.');
      return;
    }

    try {
      setIsSaving(true);
      editCropListing({
        ...crop,
        id: crop.id,
        cropName,
        category,
        variety,
        qualityGrade,
        quantity: Number(quantity),
        unit,
        expectedPricePerUnit: Number(expectedPricePerUnit),
        harvestDate,
        location: {
          village,
          district,
          state,
        },
        isOrganic,
        organicCertNo: isOrganic ? organicCertNo : undefined,
        imageUrl: imageUrl.trim(),
        status,
        description,
      });

      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to update listing.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Crop Listing: ${crop.cropName}`}
      subtitle={`Owner: ${crop.sellerName} • Listing ID: ${crop.id}`}
      maxWidth="2xl"
    >
      {!isOwner ? (
        <div className="p-6 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="text-base font-extrabold">Unauthorized Modification Attempt</h3>
          <p className="text-xs text-red-700 max-w-md mx-auto">
            You do not own this crop listing. Only <strong>{crop.sellerName}</strong> has permission to modify or update its pricing, quantity, and images.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name & Variety</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Available">Available (Open for Bids)</option>
                <option value="Reserved">Reserved (Negotiation Pending)</option>
                <option value="Sold">Sold (Harvest Dispatched)</option>
                <option value="Deactivated">Deactivated (Temporarily Hidden)</option>
                <option value="Archived">Archived (Closed)</option>
              </select>
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Harvest / Availability Date</label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village / Origin</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Image Picker for replacing / removing crop image */}
          <CropImagePicker
            value={imageUrl}
            onChange={(newImg) => setImageUrl(newImg)}
            cropCategory={category}
            cropName={cropName}
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Description</label>
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
              disabled={isSaving}
              className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
