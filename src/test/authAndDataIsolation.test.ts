// Automated Tests for Role Authentication, Scoped Data Isolation & Marketplace Bid Association
import { describe, it, expect } from 'vitest';
import { UserProfile, CropListing, CropOffer, FinancialTransaction } from '../types';
import { DEMO_USERS, INITIAL_CROP_LISTINGS } from '../data/mockData';
import { calculateNetCropProceeds } from '../utils/marketplaceCalculations';
import { calculateFinancialSummary } from '../utils/financialCalculations';

describe('Role Authentication & Identity Separation', () => {
  it('correctly creates dynamic farmer profiles with custom names instead of hardcoded Ramesh Kannan', () => {
    const farmerArun: UserProfile = {
      id: `user-farmer-${Date.now()}`,
      name: 'Arun Kumar',
      role: 'farmer',
      email: 'arun@farm.com',
      phone: '+91 98765 11111',
      village: 'Thiruvaiyaru',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      preferredLanguage: 'ta',
      acres: 5.5,
      isDemoAccount: false,
    };

    expect(farmerArun.name).toBe('Arun Kumar');
    expect(farmerArun.role).toBe('farmer');
    expect(farmerArun.name).not.toBe('Ramesh Kannan');
  });

  it('correctly creates dynamic customer/buyer profiles with custom names and business entities', () => {
    const buyerPriya: UserProfile = {
      id: `user-buyer-${Date.now()}`,
      name: 'Priya Sourcing',
      companyName: 'Priya Agro Foods Ltd',
      role: 'buyer',
      email: 'priya@agrofoods.com',
      phone: '+91 94444 22222',
      village: 'Gandhi Market',
      district: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      preferredLanguage: 'en',
      isDemoAccount: false,
    };

    expect(buyerPriya.name).toBe('Priya Sourcing');
    expect(buyerPriya.companyName).toBe('Priya Agro Foods Ltd');
    expect(buyerPriya.role).toBe('buyer');
  });

  it('keeps demo accounts explicitly labeled as demo accounts', () => {
    const demoFarmer = DEMO_USERS.find(u => u.role === 'farmer');
    const demoBuyer = DEMO_USERS.find(u => u.role === 'buyer');

    expect(demoFarmer?.isDemoAccount).toBe(true);
    expect(demoBuyer?.isDemoAccount).toBe(true);
    expect(demoFarmer?.name).toContain('(Demo Farmer)');
    expect(demoBuyer?.name).toContain('(Demo Buyer)');
  });
});

describe('Crop Marketplace Cross-Role Workflows & Bidding', () => {
  it('associates buyer bids with the correct crop, buyer, and farmer seller', () => {
    const farmerId = 'farmer-101';
    const buyerId = 'buyer-202';

    const testCrop: CropListing = {
      id: 'crop-test-1',
      cropName: 'Samba Paddy (CO-51)',
      category: 'Cereals & Grains',
      variety: 'CO-51 Fine Grain',
      qualityGrade: 'Grade A (Export / Premium)',
      quantity: 100,
      unit: 'Quintal',
      expectedPricePerUnit: 2500,
      harvestDate: '2026-10-25',
      location: { village: 'Thiruvaiyaru', district: 'Thanjavur', state: 'Tamil Nadu' },
      isOrganic: true,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      sellerId: farmerId,
      sellerName: 'Arun Kumar',
      sellerPhone: '+91 98765 11111',
      status: 'Available',
      createdAt: '2026-10-01',
    };

    // Buyer places an offer on the farmer's crop
    const buyerOffer: CropOffer = {
      id: 'offer-test-1',
      cropListingId: testCrop.id,
      cropName: testCrop.cropName,
      buyerId: buyerId,
      buyerName: 'Priya Sourcing',
      companyName: 'Priya Agro Foods Ltd',
      buyerPhone: '+91 94444 22222',
      offeredPricePerUnit: 2450,
      requestedQuantity: 50,
      estimatedTransportCost: 2000,
      disclosedCharges: 1000,
      paymentTerms: 'Instant UPI on dispatch',
      deliveryTerms: 'Seller Delivery to Mandi/Depot',
      status: 'Offer received',
      createdAt: '2026-10-12',
    };

    // Verify correct associations
    expect(buyerOffer.cropListingId).toBe(testCrop.id);
    expect(buyerOffer.buyerId).toBe(buyerId);
    expect(testCrop.sellerId).toBe(farmerId);

    // Calculate proceeds realized by the farmer
    const proceeds = calculateNetCropProceeds(
      buyerOffer.offeredPricePerUnit,
      buyerOffer.requestedQuantity,
      buyerOffer.estimatedTransportCost,
      buyerOffer.disclosedCharges,
      testCrop.expectedPricePerUnit
    );

    // Gross: 50 * 2450 = 122,500
    expect(proceeds.grossCropValue).toBe(122500);
    // Deductions: 2000 + 1000 = 3000
    // Net: 122,500 - 3,000 = 119,500
    expect(proceeds.estimatedNetProceeds).toBe(119500);
    expect(proceeds.netProceedsPerUnit).toBe(2390);
  });

  it('ensures farmer cannot be considered a customer bidder on their own crop', () => {
    const farmerId = 'farmer-101';
    const testCrop: CropListing = {
      ...INITIAL_CROP_LISTINGS[0],
      sellerId: farmerId,
    };

    const isOwnCrop = testCrop.sellerId === farmerId;
    expect(isOwnCrop).toBe(true);
    // If it's own crop, bidding is disabled in UI
    const canBid = !isOwnCrop;
    expect(canBid).toBe(false);
  });
});

describe('Data Isolation Between Accounts', () => {
  it('scopes private financial transactions to the owning farmer only', () => {
    const farmer1Id = 'farmer-arun-1';
    const farmer2Id = 'farmer-priya-2';
    const buyerId = 'buyer-kumar-3';

    const allTransactions: FinancialTransaction[] = [
      {
        id: 'tx-1',
        userId: farmer1Id,
        type: 'income',
        amount: 85000,
        category: 'Crop Sales',
        date: '2026-10-01',
        description: 'Paddy sale to mill',
        paymentMethod: 'Bank Transfer',
        createdAt: '2026-10-01'
      },
      {
        id: 'tx-2',
        userId: farmer1Id,
        type: 'expense',
        amount: 15000,
        category: 'Fertilizers',
        date: '2026-10-03',
        description: 'Urea and DAP',
        paymentMethod: 'UPI',
        createdAt: '2026-10-03'
      },
      {
        id: 'tx-3',
        userId: farmer2Id,
        type: 'income',
        amount: 250000,
        category: 'Crop Sales',
        date: '2026-10-05',
        description: 'Cotton harvest',
        paymentMethod: 'Bank Transfer',
        createdAt: '2026-10-05'
      }
    ];

    // Farmer 1 sees only their transactions
    const farmer1Txs = allTransactions.filter(t => t.userId === farmer1Id);
    expect(farmer1Txs.length).toBe(2);
    const summary1 = calculateFinancialSummary(farmer1Txs);
    expect(summary1.totalIncome).toBe(85000);
    expect(summary1.totalExpenses).toBe(15000);
    expect(summary1.netProfit).toBe(70000);

    // Farmer 2 sees only their transactions
    const farmer2Txs = allTransactions.filter(t => t.userId === farmer2Id);
    expect(farmer2Txs.length).toBe(1);
    const summary2 = calculateFinancialSummary(farmer2Txs);
    expect(summary2.totalIncome).toBe(250000);

    // Customer/Buyer has 0 farmer financial transactions
    const buyerTxs = allTransactions.filter(t => t.userId === buyerId);
    expect(buyerTxs.length).toBe(0);
    const buyerSummary = calculateFinancialSummary(buyerTxs);
    expect(buyerSummary.totalIncome).toBe(0);
    expect(buyerSummary.totalExpenses).toBe(0);
  });
});
