// Realistic Sample & Seed Data for Farm2Pay AI Platform

import { 
  UserProfile, 
  CropListing, 
  CropOffer, 
  EquipmentListing, 
  EquipmentBooking, 
  FinancialTransaction, 
  CategoryBudget, 
  LoanOffer, 
  AppNotification 
} from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-farmer-1',
    name: 'Ramesh Kannan (Demo Farmer)',
    role: 'farmer',
    email: 'farmer@demo.com',
    phone: '+91 98421 78910',
    village: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLanguage: 'en',
    acres: 6.5,
    primaryCrops: ['Samba Paddy', 'Black Gram', 'Groundnut'],
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true
  },
  {
    id: 'user-buyer-1',
    name: 'Senthil Kumar (Demo Buyer)',
    role: 'buyer',
    email: 'buyer@demo.com',
    companyName: 'Kaveri Agro Mills',
    phone: '+91 94432 54321',
    village: 'Gandhi Market',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    preferredLanguage: 'ta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true
  },
  {
    id: 'user-eq-1',
    name: 'Murugan Custom Hire Center',
    role: 'equipment_owner',
    email: 'machinery@demo.com',
    phone: '+91 97890 11223',
    village: 'Papanasam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLanguage: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true
  },
  {
    id: 'user-admin-1',
    name: 'Farm2Pay Administrator',
    role: 'admin',
    email: 'admin@demo.com',
    phone: '+91 80000 12345',
    village: 'Secretariat Road',
    district: 'Chennai',
    state: 'Tamil Nadu',
    preferredLanguage: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true
  }
];

export const INITIAL_CROP_LISTINGS: CropListing[] = [
  {
    id: 'crop-101',
    cropName: 'Samba Paddy (CO-51)',
    category: 'Cereals & Grains',
    variety: 'CO-51 Fine Grain',
    qualityGrade: 'Grade A (Export / Premium)',
    quantity: 120,
    unit: 'Quintal',
    expectedPricePerUnit: 2450,
    harvestDate: '2026-10-25',
    location: {
      village: 'Thiruvaiyaru',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    isOrganic: true,
    organicCertNo: 'TNOCD-2026-0988',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    sellerId: 'user-farmer-1',
    sellerName: 'Ramesh Kannan',
    sellerPhone: '+91 98421 78910',
    status: 'Available',
    createdAt: '2026-10-01',
    description: 'High-yielding CO-51 paddy harvested with combine harvester. Moisture tested at 13.5%, free from discoloration.'
  },
  {
    id: 'crop-102',
    cropName: 'Groundnut (TMV-7)',
    category: 'Oilseeds',
    variety: 'TMV-7 Pods',
    qualityGrade: 'Grade B (Standard Mandi)',
    quantity: 45,
    unit: 'Quintal',
    expectedPricePerUnit: 6800,
    harvestDate: '2026-10-18',
    location: {
      village: 'Budalur',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=80',
    sellerId: 'user-farmer-1',
    sellerName: 'Ramesh Kannan',
    sellerPhone: '+91 98421 78910',
    status: 'Available',
    createdAt: '2026-10-04',
    description: 'Sun-dried oilseed groundnut with sound mature kernel ratio above 70%. Ideal for oil expellers.'
  },
  {
    id: 'crop-103',
    cropName: 'Black Gram (VBN-8)',
    category: 'Pulses',
    variety: 'VBN-8 Bold Seed',
    qualityGrade: 'Grade A (Export / Premium)',
    quantity: 25,
    unit: 'Quintal',
    expectedPricePerUnit: 7900,
    harvestDate: '2026-10-30',
    location: {
      village: 'Kumbakonam',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    isOrganic: true,
    organicCertNo: 'NPOP-TN-5421',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80',
    sellerId: 'user-farmer-1',
    sellerName: 'Ramesh Kannan',
    sellerPhone: '+91 98421 78910',
    status: 'Available',
    createdAt: '2026-10-08',
    description: 'Cleaned, bold black gram pulse. High protein content and uniform size.'
  },
  {
    id: 'crop-104',
    cropName: 'Salem Turmeric (Erode Finger)',
    category: 'Spices',
    variety: 'PTS-10 High Curcumin',
    qualityGrade: 'Grade A (Export / Premium)',
    quantity: 60,
    unit: 'Quintal',
    expectedPricePerUnit: 14200,
    harvestDate: '2026-11-10',
    location: {
      village: 'Attur',
      district: 'Salem',
      state: 'Tamil Nadu'
    },
    isOrganic: true,
    organicCertNo: 'TNOCD-2026-4412',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    sellerId: 'user-farmer-2',
    sellerName: 'Palanisamy Velu',
    sellerPhone: '+91 94451 90909',
    status: 'Available',
    createdAt: '2026-10-09',
    description: 'Boiled and polished yellow turmeric fingers with verified 4.2% curcumin levels.'
  }
];

export const INITIAL_CROP_OFFERS: CropOffer[] = [
  {
    id: 'offer-201',
    cropListingId: 'crop-101',
    cropName: 'Samba Paddy (CO-51)',
    buyerId: 'user-buyer-1',
    buyerName: 'Senthil Kumar',
    companyName: 'Kaveri Modern Rice Mill Ltd',
    buyerPhone: '+91 94432 54321',
    offeredPricePerUnit: 2520, // Higher price
    requestedQuantity: 80,
    estimatedTransportCost: 4800, // Farmer pays or deducted
    disclosedCharges: 1200, // Mandi inspection & weighing
    chargesBreakdown: {
      marketCess: 600,
      loadingFee: 400,
      inspectionFee: 200
    },
    paymentTerms: 'Instant UPI on dispatch',
    deliveryTerms: 'Seller Delivery to Mandi/Depot',
    status: 'Offer received',
    notes: 'Immediate dispatch required. Moisture below 14% verified upon arrival.',
    createdAt: '2026-10-10'
  },
  {
    id: 'offer-202',
    cropListingId: 'crop-101',
    cropName: 'Samba Paddy (CO-51)',
    buyerId: 'user-buyer-2',
    buyerName: 'Anand Prakash',
    companyName: 'Thanjavur Agro Direct Procurement',
    buyerPhone: '+91 98840 33445',
    offeredPricePerUnit: 2420, // Slightly lower, but zero transport cost (Farmgate pickup)
    requestedQuantity: 100,
    estimatedTransportCost: 0, // Farmgate pickup!
    disclosedCharges: 500, // Loading assistance
    chargesBreakdown: {
      marketCess: 0,
      loadingFee: 500,
      inspectionFee: 0
    },
    paymentTerms: '50% advance + 50% delivery',
    deliveryTerms: 'Farmgate Pickup (Buyer arranges)',
    status: 'Offer received',
    notes: 'We bring our 10-wheel truck directly to your threshing floor. No transport hassle.',
    createdAt: '2026-10-11'
  },
  {
    id: 'offer-203',
    cropListingId: 'crop-102',
    cropName: 'Groundnut (TMV-7)',
    buyerId: 'user-buyer-1',
    buyerName: 'Senthil Kumar',
    companyName: 'Kaveri Agro Mills',
    buyerPhone: '+91 94432 54321',
    offeredPricePerUnit: 6900,
    requestedQuantity: 40,
    estimatedTransportCost: 2000,
    disclosedCharges: 800,
    paymentTerms: 'Instant UPI on dispatch',
    deliveryTerms: 'Farmgate Pickup (Buyer arranges)',
    status: 'Accepted',
    notes: 'Advance token transfer ₹15,000 completed.',
    createdAt: '2026-10-09'
  }
];

export const INITIAL_EQUIPMENT_LISTINGS: EquipmentListing[] = [
  {
    id: 'eq-301',
    name: 'Mahindra 575 DI 45 HP Tractor with Rotary Tiller',
    category: 'Tractor & Implements',
    ownerId: 'user-eq-1',
    ownerName: 'Murugan Custom Hire Center',
    ownerPhone: '+91 97890 11223',
    location: {
      village: 'Papanasam',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    condition: 'Excellent',
    forSale: false,
    forRent: true,
    rentalRate: 850,
    rentalUnit: 'per hour',
    deposit: 2000,
    additionalFees: 400, // Experienced driver charge included
    specifications: {
      horsePower: '45 HP',
      fuelType: 'Diesel',
      brand: 'Mahindra Bhoomiputra',
      attachments: ['42-blade Rotavator', '9-tyne Cultivator', 'Cage Wheels for Paddy Puddling']
    },
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-09-20'
  },
  {
    id: 'eq-302',
    name: 'Kubota 4-Row Riding Rice Transplanter (NSP-4W)',
    category: 'Seed Drill & Planter',
    ownerId: 'user-eq-1',
    ownerName: 'Murugan Custom Hire Center',
    ownerPhone: '+91 97890 11223',
    location: {
      village: 'Papanasam',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    condition: 'Brand New',
    forSale: false,
    forRent: true,
    rentalRate: 3200,
    rentalUnit: 'per day',
    deposit: 3000,
    additionalFees: 600,
    specifications: {
      horsePower: '4.3 HP Petrol',
      fuelType: 'Electric',
      brand: 'Kubota Japan',
      attachments: ['Mat seedling trays guide', 'Depth control skid']
    },
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-09-25'
  },
  {
    id: 'eq-303',
    name: 'Yanmar Tracked Paddy Combine Harvester (AW70V)',
    category: 'Harvester & Thresher',
    ownerId: 'user-eq-2',
    ownerName: 'Delta Agro Machinery Hub',
    ownerPhone: '+91 94441 87654',
    location: {
      village: 'Mannargudi',
      district: 'Tiruvarur',
      state: 'Tamil Nadu'
    },
    condition: 'Excellent',
    forSale: true,
    salePrice: 1850000,
    forRent: true,
    rentalRate: 2400,
    rentalUnit: 'per hour',
    deposit: 5000,
    additionalFees: 800,
    specifications: {
      horsePower: '70 HP Turbocharged',
      fuelType: 'Diesel',
      brand: 'Yanmar',
      attachments: ['Grain tank unloader', 'Paddy straw chopper']
    },
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-10-01'
  },
  {
    id: 'eq-304',
    name: 'Shakti 5 HP Solar Submersible Water Pump Set',
    category: 'Water Pump & Irrigation',
    ownerId: 'user-eq-3',
    ownerName: 'Kaveri Green Solutions',
    ownerPhone: '+91 93456 78120',
    location: {
      village: 'Kumbakonam',
      district: 'Thanjavur',
      state: 'Tamil Nadu'
    },
    condition: 'Brand New',
    forSale: true,
    salePrice: 165000,
    forRent: false,
    deposit: 0,
    additionalFees: 0,
    specifications: {
      horsePower: '5 HP',
      fuelType: 'Solar',
      brand: 'Shakti Solar',
      attachments: ['MNRE 4800W Solar Panels', 'VFD Controller', '50m Submersible Cable']
    },
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-10-05'
  }
];

export const INITIAL_EQUIPMENT_BOOKINGS: EquipmentBooking[] = [
  {
    id: 'bk-401',
    equipmentId: 'eq-301',
    equipmentName: 'Mahindra 575 DI 45 HP Tractor with Rotary Tiller',
    ownerName: 'Murugan Custom Hire Center',
    renterId: 'user-farmer-1',
    renterName: 'Ramesh Kannan',
    renterPhone: '+91 98421 78910',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    durationUnits: 6,
    rentalUnit: 'per hour',
    rentalRate: 850,
    depositAmount: 2000,
    additionalFees: 400,
    totalEstimatedCost: 5500, // (850 * 6) + 400
    status: 'Confirmed',
    withOperator: true,
    deliveryOption: 'Owner Delivery (+₹500)',
    createdAt: '2026-10-10'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-501',
    userId: 'user-farmer-1',
    type: 'income',
    amount: 185000,
    category: 'Crop Sales',
    date: '2026-07-28',
    description: 'Kuruvai Paddy harvest batch 1 sale to Mandi',
    relatedCropOrSeason: 'Kuruvai 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'Sold at ₹2,380/qtl to direct purchase center',
    createdAt: '2026-07-28'
  },
  {
    id: 'tx-502',
    userId: 'user-farmer-1',
    type: 'income',
    amount: 92000,
    category: 'Crop Sales',
    date: '2026-08-14',
    description: 'Summer Moong & Black Gram pulse produce sale',
    relatedCropOrSeason: 'Summer 2026',
    paymentMethod: 'UPI',
    notes: 'Paid promptly via GPay by Kaveri Mills',
    createdAt: '2026-08-14'
  },
  {
    id: 'tx-503',
    userId: 'user-farmer-1',
    type: 'income',
    amount: 6000,
    category: 'Subsidies & Govt Grants',
    date: '2026-08-01',
    description: 'PM-KISAN Samman Nidhi installment credit',
    relatedCropOrSeason: 'Kharif 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'DBT direct bank transfer to SBI savings account',
    createdAt: '2026-08-01'
  },
  {
    id: 'tx-504',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 28500,
    category: 'Seeds',
    date: '2026-08-20',
    description: 'Certified CO-51 Paddy foundation seed bags (10 bags)',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'UPI',
    notes: 'Purchased from Agricultural Extension Center',
    createdAt: '2026-08-20'
  },
  {
    id: 'tx-505',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 38000,
    category: 'Fertilizers',
    date: '2026-08-25',
    description: 'Basal application: DAP, MOP potash and micro-nutrients',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'Cash',
    notes: 'Subsidized rates from Thiruvaiyaru PACCS',
    createdAt: '2026-08-25'
  },
  {
    id: 'tx-506',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 22000,
    category: 'Labour & Wages',
    date: '2026-09-02',
    description: 'Nursery preparation & paddy transplantation labour wages (10 workers)',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'Cash',
    notes: '2 days transplantation work completed',
    createdAt: '2026-09-02'
  },
  {
    id: 'tx-507',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 14500,
    category: 'Equipment Purchase & Rental',
    date: '2026-09-05',
    description: 'Tractor wetland puddling & leveling (14 hours)',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'UPI',
    notes: 'Hired from Murugan Center @ ₹900/hr + operator',
    createdAt: '2026-09-05'
  },
  {
    id: 'tx-508',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 16800,
    category: 'Pesticides & Bio-control',
    date: '2026-09-18',
    description: 'Bio-fungicide (Trichoderma) & leaf folder spray',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'UPI',
    notes: 'Organic certified spray',
    createdAt: '2026-09-18'
  },
  {
    id: 'tx-509',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 18500,
    category: 'Labour & Wages',
    date: '2026-09-28',
    description: 'First & second manual weeding operations (8 workers)',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'Cash',
    createdAt: '2026-09-28'
  },
  {
    id: 'tx-510',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 8200,
    category: 'Fuel & Transport',
    date: '2026-10-02',
    description: 'Diesel fuel for irrigation diesel engine pump backup',
    relatedCropOrSeason: 'Samba 2026',
    paymentMethod: 'UPI',
    notes: 'Kanagavelu HP pump station',
    createdAt: '2026-10-02'
  },
  {
    id: 'tx-511',
    userId: 'user-farmer-1',
    type: 'expense',
    amount: 12500,
    category: 'Loan Repayments',
    date: '2026-10-05',
    description: 'KCC semi-annual interest service payment to SBI Agri Branch',
    relatedCropOrSeason: 'Kharif 2026',
    paymentMethod: 'Bank Transfer',
    notes: 'Maintained prompt repayment track record for 3% interest subvention',
    createdAt: '2026-10-05'
  }
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  {
    id: 'bg-601',
    userId: 'user-farmer-1',
    category: 'Seeds',
    budgetAmount: 32000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  },
  {
    id: 'bg-602',
    userId: 'user-farmer-1',
    category: 'Fertilizers',
    budgetAmount: 42000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  },
  {
    id: 'bg-603',
    userId: 'user-farmer-1',
    category: 'Labour & Wages',
    budgetAmount: 45000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  },
  {
    id: 'bg-604',
    userId: 'user-farmer-1',
    category: 'Equipment Purchase & Rental',
    budgetAmount: 25000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  },
  {
    id: 'bg-605',
    userId: 'user-farmer-1',
    category: 'Pesticides & Bio-control',
    budgetAmount: 20000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  },
  {
    id: 'bg-606',
    userId: 'user-farmer-1',
    category: 'Fuel & Transport',
    budgetAmount: 15000,
    period: 'Samba 2026 Season',
    warningThresholdPercent: 80
  }
];

export const INITIAL_LOAN_OFFERS: LoanOffer[] = [
  {
    id: 'loan-701',
    lenderName: 'Kisan Gramin Vikas Bank (KGVB)',
    loanProductName: 'Kisan Credit Card (KCC) Crop Production Loan',
    principalAmount: 200000,
    annualInterestRate: 7.0, // With 3% subvention on prompt repayment, effective 4%
    interestType: 'Fixed',
    calculationMethod: 'Reducing Balance',
    tenureMonths: 24,
    repaymentFrequency: 'Monthly',
    processingFee: 1000,
    otherUpfrontFees: 500, // Documentation
    insuranceCharges: 850, // PMFBY crop insurance
    latePenaltyPercent: 1.5,
    prepaymentChargesPercent: 0.0, // Zero foreclosure fee as per RBI
    gracePeriodMonths: 6,
    collateralRequired: false, // Up to 1.6 Lakh collateral free, KCC norm
    collateralDetails: 'Hypothecation of Standing Samba Paddy Crop',
    sourceOfOffer: 'District Lead Bank Agri Portal',
    verificationStatus: 'Verified Bank Partner',
    notes: 'Eligible for 3% Central Interest Subvention on timely repayment within 12 months.',
    isSimulatedDemo: true
  },
  {
    id: 'loan-702',
    lenderName: 'AgroSamriddhi Agri Finance (NBFC)',
    loanProductName: 'Farm Mechanization & Tractor Term Loan',
    principalAmount: 350000,
    annualInterestRate: 11.2,
    interestType: 'Fixed',
    calculationMethod: 'Reducing Balance',
    tenureMonths: 36,
    repaymentFrequency: 'Monthly',
    processingFee: 5250, // 1.5% processing fee
    otherUpfrontFees: 1800, // RTO inspection + CIBIL check
    insuranceCharges: 3200, // Machinery comprehensive insurance
    latePenaltyPercent: 2.5,
    prepaymentChargesPercent: 2.0,
    gracePeriodMonths: 2,
    collateralRequired: true,
    collateralDetails: 'Hypothecation of Purchased Agricultural Machinery & 2 Guarantors',
    sourceOfOffer: 'Dealer Financing Desk',
    verificationStatus: 'Verified Bank Partner',
    notes: 'Fast 48-hour disbursement directly to machinery dealer.',
    isSimulatedDemo: true
  },
  {
    id: 'loan-703',
    lenderName: 'GreenField Quick AgriCapital (Private)',
    loanProductName: 'Express Instant Harvest Cash Credit',
    principalAmount: 150000,
    annualInterestRate: 17.5, // High interest!
    interestType: 'Floating', // Floating risk!
    calculationMethod: 'Reducing Balance',
    tenureMonths: 18,
    repaymentFrequency: 'Monthly',
    processingFee: 6500, // Very high upfront deduction (>4%)
    otherUpfrontFees: 2500,
    insuranceCharges: 1500,
    latePenaltyPercent: 4.0, // Harsh late penalty!
    prepaymentChargesPercent: 3.5, // High foreclosure fee!
    gracePeriodMonths: 0,
    collateralRequired: true,
    collateralDetails: 'Agricultural Land Patta Passbook Pledge & 3 Signed Cheques',
    sourceOfOffer: 'Mandi Noticeboard Flyer',
    verificationStatus: 'Unverified Private',
    notes: 'CAUTION: Very high fees and floating interest rate. Lender license not verified.',
    isSimulatedDemo: true
  },
  {
    id: 'loan-704',
    lenderName: 'Thanjavur District Central Cooperative Bank',
    loanProductName: 'Interest-Free Cooperative Crop Advance',
    principalAmount: 50000,
    annualInterestRate: 0.0, // Zero interest!
    interestType: 'Fixed',
    calculationMethod: 'Flat Rate',
    tenureMonths: 6,
    repaymentFrequency: 'Monthly',
    processingFee: 150,
    otherUpfrontFees: 100,
    insuranceCharges: 250,
    latePenaltyPercent: 1.0,
    prepaymentChargesPercent: 0.0,
    gracePeriodMonths: 1,
    collateralRequired: false,
    collateralDetails: 'Cooperative Society Membership Shares',
    sourceOfOffer: 'Primary Agricultural Co-op Society (PACS)',
    verificationStatus: 'Verified Bank Partner',
    notes: 'State Government 100% interest subvention scheme for small and marginal farmers.',
    isSimulatedDemo: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'nt-801',
    userId: 'user-farmer-1',
    type: 'buyer_offer',
    title: 'New High Offer on Samba Paddy',
    message: 'Kaveri Modern Rice Mill offered ₹2,520/qtl for 80 quintals of your CO-51 Paddy.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/crop-marketplace',
    priority: 'high'
  },
  {
    id: 'nt-802',
    userId: 'user-farmer-1',
    type: 'budget_alert',
    title: 'Labour & Wages Budget Alert',
    message: 'You have consumed 90.0% of your Samba 2026 Labour budget (₹40,500 of ₹45,000).',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/expense-tracker',
    priority: 'high'
  },
  {
    id: 'nt-803',
    userId: 'user-farmer-1',
    type: 'equipment_booking',
    title: 'Equipment Booking Confirmed',
    message: 'Murugan Center confirmed your Mahindra 575 DI Tractor booking for Oct 15.',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/orders-and-bookings',
    priority: 'medium'
  },
  {
    id: 'nt-804',
    userId: 'user-farmer-1',
    type: 'loan_reminder',
    title: 'Loan Comparison Audit Flag',
    message: 'GreenField Quick AgriCapital has been flagged for 7.0% upfront deductions and unverified status.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/loan-comparison',
    priority: 'medium'
  }
];
