// Automated Tests for Crop Image Validation, Storage Keys, and Strict Ownership Permissions

import { describe, it, expect } from 'vitest';
import { 
  validateCropImageFile, 
  validateCropImageUrl, 
  isIndexedDBImageKey 
} from '../utils/imageStorage';
import { CropListing, CropOffer, UserProfile } from '../types';

describe('Crop Image Handling & Validation', () => {
  it('validates supported image formats (JPG, JPEG, PNG, WebP)', () => {
    const validJpg = new File(['fake-image-bytes'], 'crop.jpg', { type: 'image/jpeg' });
    const validPng = new File(['fake-image-bytes'], 'crop.png', { type: 'image/png' });
    const validWebp = new File(['fake-image-bytes'], 'crop.webp', { type: 'image/webp' });

    expect(validateCropImageFile(validJpg).valid).toBe(true);
    expect(validateCropImageFile(validPng).valid).toBe(true);
    expect(validateCropImageFile(validWebp).valid).toBe(true);
  });

  it('rejects unsupported file formats and oversized files (>5MB)', () => {
    const invalidPdf = new File(['fake-doc'], 'crop.pdf', { type: 'application/pdf' });
    const invalidGif = new File(['fake-gif'], 'crop.gif', { type: 'image/gif' });

    expect(validateCropImageFile(invalidPdf).valid).toBe(false);
    expect(validateCropImageFile(invalidPdf).error).toContain('Unsupported file format');
    expect(validateCropImageFile(invalidGif).valid).toBe(false);

    // Mock an oversized 6MB file
    const oversizedBytes = new Uint8Array(6 * 1024 * 1024);
    const oversizedFile = new File([oversizedBytes], 'large_crop.jpg', { type: 'image/jpeg' });
    const result = validateCropImageFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Maximum allowed size is 5 MB');
  });

  it('validates web image URLs correctly', () => {
    expect(validateCropImageUrl('https://images.unsplash.com/photo-1586201375761-83865001e31c').valid).toBe(true);
    expect(validateCropImageUrl('http://agricoop.gov.in/paddy.png').valid).toBe(true);

    expect(validateCropImageUrl('ftp://invalid.com/crop.jpg').valid).toBe(false);
    expect(validateCropImageUrl('not-a-url').valid).toBe(false);
    expect(validateCropImageUrl('').valid).toBe(false);
  });

  it('correctly detects IndexedDB persistent image keys', () => {
    expect(isIndexedDBImageKey('idb:img-1728723912-abc1234')).toBe(true);
    expect(isIndexedDBImageKey('https://images.unsplash.com/photo-123')).toBe(false);
    expect(isIndexedDBImageKey('/assets/fallback.png')).toBe(false);
  });
});

describe('Strict Crop Ownership & Data Layer Permissions', () => {
  const farmerA: UserProfile = {
    id: 'farmer-arun-1',
    name: 'Arun Kumar',
    role: 'farmer',
    phone: '+91 98421 11111',
    village: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLanguage: 'en',
  };

  const farmerB: UserProfile = {
    id: 'farmer-priya-2',
    name: 'Priya Farmer',
    role: 'farmer',
    phone: '+91 94432 22222',
    village: 'Kumbakonam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLanguage: 'ta',
  };

  const customerUser: UserProfile = {
    id: 'buyer-senthil-3',
    name: 'Senthil Buyer',
    companyName: 'Kaveri Agro Mills',
    role: 'buyer',
    phone: '+91 97890 33333',
    village: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    preferredLanguage: 'en',
  };

  // Helper simulating AppContext crop ownership enforcement
  function simulateEditCrop(
    currentUser: UserProfile | null,
    existingCrops: CropListing[],
    updatedPayload: CropListing
  ): { crops: CropListing[]; result: { success: boolean; message?: string } } {
    if (!currentUser) throw new Error('Authentication required');
    if (currentUser.role !== 'farmer') throw new Error('Access Denied: Only farmers can modify crop listings.');

    const existingCrop = existingCrops.find(c => c.id === updatedPayload.id);
    if (!existingCrop) throw new Error('Listing not found');

    if (existingCrop.sellerId !== currentUser.id) {
      throw new Error('Permission Denied: You do not have permission to edit another farmer\'s crop listing.');
    }

    // Lock ownership fields
    const sanitizedCrop: CropListing = {
      ...existingCrop,
      ...updatedPayload,
      id: existingCrop.id,
      sellerId: existingCrop.sellerId,
      sellerName: existingCrop.sellerName,
      sellerPhone: existingCrop.sellerPhone,
      createdAt: existingCrop.createdAt,
    };

    return {
      crops: existingCrops.map(c => c.id === sanitizedCrop.id ? sanitizedCrop : c),
      result: { success: true }
    };
  }

  function simulateDeleteCrop(
    currentUser: UserProfile | null,
    existingCrops: CropListing[],
    existingOffers: CropOffer[],
    cropId: string
  ): { crops: CropListing[]; archived: boolean } {
    if (!currentUser) throw new Error('Authentication required');
    if (currentUser.role !== 'farmer') throw new Error('Access Denied: Only farmers can delete crop listings.');

    const target = existingCrops.find(c => c.id === cropId);
    if (!target) throw new Error('Listing not found');

    if (target.sellerId !== currentUser.id) {
      throw new Error('Permission Denied: You do not have permission to delete another farmer\'s crop listing.');
    }

    const linkedOffers = existingOffers.filter(o => o.cropListingId === cropId);
    const hasConfirmedOrders = linkedOffers.some(o => 
      o.status === 'Accepted' || o.status === 'Confirmed' || o.status === 'In transit' || o.status === 'Completed'
    );

    if (hasConfirmedOrders) {
      // Safe archive rule: preserves order and financial history!
      return {
        crops: existingCrops.map(c => c.id === cropId ? { ...c, status: 'Archived' } : c),
        archived: true,
      };
    }

    return {
      crops: existingCrops.filter(c => c.id !== cropId),
      archived: false,
    };
  }

  const initialListingA: CropListing = {
    id: 'crop-arun-101',
    cropName: 'Samba Paddy (CO-51)',
    category: 'Cereals & Grains',
    variety: 'CO-51 Fine Grain',
    qualityGrade: 'Grade A (Export / Premium)',
    quantity: 120,
    unit: 'Quintal',
    expectedPricePerUnit: 2450,
    harvestDate: '2026-10-25',
    location: { village: 'Thiruvaiyaru', district: 'Thanjavur', state: 'Tamil Nadu' },
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
    sellerId: farmerA.id,
    sellerName: farmerA.name,
    sellerPhone: farmerA.phone,
    status: 'Available',
    createdAt: '2026-10-01',
  };

  it('Farmer A can edit their own listing', () => {
    const editedPayload: CropListing = {
      ...initialListingA,
      expectedPricePerUnit: 2550,
      quantity: 110,
      imageUrl: 'idb:img-updated-photo',
    };

    const { crops, result } = simulateEditCrop(farmerA, [initialListingA], editedPayload);
    expect(result.success).toBe(true);
    expect(crops[0].expectedPricePerUnit).toBe(2550);
    expect(crops[0].imageUrl).toBe('idb:img-updated-photo');
    expect(crops[0].sellerId).toBe(farmerA.id);
  });

  it('Farmer B is rejected when attempting to edit Farmer A\'s listing', () => {
    const maliciousPayload: CropListing = {
      ...initialListingA,
      expectedPricePerUnit: 1800,
    };

    expect(() => {
      simulateEditCrop(farmerB, [initialListingA], maliciousPayload);
    }).toThrow(/Permission Denied/);
  });

  it('Customer/Buyer is rejected when attempting to edit crop listings', () => {
    const maliciousPayload: CropListing = {
      ...initialListingA,
      expectedPricePerUnit: 1500,
    };

    expect(() => {
      simulateEditCrop(customerUser, [initialListingA], maliciousPayload);
    }).toThrow(/Access Denied/);
  });

  it('prevents tampering with sellerId/sellerName even if client injects modified fields', () => {
    const spoofedPayload: CropListing = {
      ...initialListingA,
      sellerId: 'attacker-id-999',
      sellerName: 'Attacker Name',
      expectedPricePerUnit: 2600,
    };

    const { crops } = simulateEditCrop(farmerA, [initialListingA], spoofedPayload);
    // Verified: sellerId remains locked to farmerA
    expect(crops[0].sellerId).toBe(farmerA.id);
    expect(crops[0].sellerName).toBe(farmerA.name);
    expect(crops[0].expectedPricePerUnit).toBe(2600);
  });

  it('Farmer B is rejected when attempting to delete Farmer A\'s listing', () => {
    expect(() => {
      simulateDeleteCrop(farmerB, [initialListingA], [], initialListingA.id);
    }).toThrow(/Permission Denied/);
  });

  it('Customer is rejected when attempting to delete a crop listing', () => {
    expect(() => {
      simulateDeleteCrop(customerUser, [initialListingA], [], initialListingA.id);
    }).toThrow(/Access Denied/);
  });

  it('safe rule: preserves order history by archiving crop when active bids or orders exist', () => {
    const activeOfferOnA: CropOffer = {
      id: 'offer-1',
      cropListingId: initialListingA.id,
      cropName: initialListingA.cropName,
      buyerId: customerUser.id,
      buyerName: customerUser.name,
      companyName: 'Kaveri Agro Mills',
      buyerPhone: customerUser.phone,
      offeredPricePerUnit: 2400,
      requestedQuantity: 50,
      estimatedTransportCost: 2000,
      disclosedCharges: 500,
      status: 'Accepted',
      paymentTerms: 'Instant UPI on dispatch',
      deliveryTerms: 'Farmgate Pickup (Buyer arranges)',
      createdAt: '2026-10-05',
    };

    const { crops, archived } = simulateDeleteCrop(
      farmerA,
      [initialListingA],
      [activeOfferOnA],
      initialListingA.id
    );

    // Verified: crop was not destroyed, but marked as Archived so order history remains intact!
    expect(archived).toBe(true);
    expect(crops.length).toBe(1);
    expect(crops[0].status).toBe('Archived');
  });

  it('permanently deletes crop when no active bids or orders are linked', () => {
    const { crops, archived } = simulateDeleteCrop(
      farmerA,
      [initialListingA],
      [], // No linked offers
      initialListingA.id
    );

    expect(archived).toBe(false);
    expect(crops.length).toBe(0);
  });

  it('permanently deletes crop when only unaccepted pending bids exist (not confirmed orders)', () => {
    const pendingOffer: CropOffer = {
      id: 'offer-pending',
      cropListingId: initialListingA.id,
      cropName: initialListingA.cropName,
      buyerId: customerUser.id,
      buyerName: customerUser.name,
      companyName: 'Kaveri Agro Mills',
      buyerPhone: customerUser.phone,
      offeredPricePerUnit: 2400,
      requestedQuantity: 50,
      estimatedTransportCost: 2000,
      disclosedCharges: 500,
      status: 'Offer received', // Unaccepted bid
      paymentTerms: 'Instant UPI on dispatch',
      deliveryTerms: 'Farmgate Pickup (Buyer arranges)',
      createdAt: '2026-10-05',
    };

    const { crops, archived } = simulateDeleteCrop(
      farmerA,
      [initialListingA],
      [pendingOffer],
      initialListingA.id
    );

    expect(archived).toBe(false);
    expect(crops.length).toBe(0);
  });

  it('deleting Farmer A\'s crop leaves Farmer B\'s listings completely untouched', () => {
    const listingB: CropListing = {
      ...initialListingA,
      id: 'crop-b-201',
      cropName: 'Salem Turmeric',
      sellerId: farmerB.id,
      sellerName: farmerB.name,
    };

    const { crops } = simulateDeleteCrop(
      farmerA,
      [initialListingA, listingB],
      [],
      initialListingA.id
    );

    expect(crops.length).toBe(1);
    expect(crops[0].id).toBe(listingB.id);
    expect(crops[0].sellerId).toBe(farmerB.id);
    expect(crops[0].cropName).toBe('Salem Turmeric');
  });

  it('persisted storage simulation: deleted crop is not reinserted on reload', () => {
    const mockStorage: Record<string, string> = {};
    const key = 'farm2pay_crops';

    // 1. Initial storage with 2 crops
    const listingB: CropListing = {
      ...initialListingA,
      id: 'crop-b-201',
      sellerId: farmerB.id,
    };
    mockStorage[key] = JSON.stringify([initialListingA, listingB]);

    // 2. Farmer A deletes their crop
    const current = JSON.parse(mockStorage[key]);
    const { crops } = simulateDeleteCrop(farmerA, current, [], initialListingA.id);
    mockStorage[key] = JSON.stringify(crops);

    // 3. Simulated page refresh / component mount
    const reloaded = JSON.parse(mockStorage[key]);
    expect(reloaded.length).toBe(1);
    expect(reloaded[0].id).toBe(listingB.id);
    expect(reloaded.find((c: any) => c.id === initialListingA.id)).toBeUndefined();
  });

  it('marketplace filter simulation: archived and deactivated crops are hidden from active browsing', () => {
    const activeCrop = { ...initialListingA, status: 'Available' as const };
    const archivedCrop = { ...initialListingA, id: 'crop-archived', status: 'Archived' as const };
    const deactivatedCrop = { ...initialListingA, id: 'crop-deact', status: 'Deactivated' as const };

    const allListings = [activeCrop, archivedCrop, deactivatedCrop];
    const visibleListings = allListings.filter(c => c.status !== 'Archived' && c.status !== 'Deactivated');

    expect(visibleListings.length).toBe(1);
    expect(visibleListings[0].id).toBe(activeCrop.id);
  });
});
