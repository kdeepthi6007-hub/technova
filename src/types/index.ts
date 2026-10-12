// Core Types for Farm2Pay AI Platform

export type UserRole = 'farmer' | 'buyer' | 'equipment_owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: 'en' | 'ta' | 'te';
  avatarUrl?: string;
  acres?: number;
  primaryCrops?: string[];
  companyName?: string;
  isDemoAccount?: boolean;
}

export type CropCategory = 
  | 'Cereals & Grains' 
  | 'Pulses' 
  | 'Oilseeds' 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Cash Crops' 
  | 'Spices';

export type QualityGrade = 
  | 'Grade A (Export / Premium)' 
  | 'Grade B (Standard Mandi)' 
  | 'Grade C (Fair Average Quality)';

export type CropStatus = 'Available' | 'Reserved' | 'Sold' | 'Expired' | 'Deactivated' | 'Archived';

export interface CropListing {
  id: string;
  cropName: string;
  category: CropCategory;
  variety: string;
  qualityGrade: QualityGrade;
  quantity: number;
  unit: 'Quintal' | 'Kg' | 'Ton' | 'Bags';
  expectedPricePerUnit: number;
  harvestDate: string; // YYYY-MM-DD
  location: {
    village: string;
    district: string;
    state: string;
  };
  isOrganic: boolean;
  organicCertNo?: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  status: CropStatus;
  createdAt: string;
  description?: string;
}

export type OfferStatus = 
  | 'Inquiry submitted' 
  | 'Offer received' 
  | 'Accepted' 
  | 'Confirmed' 
  | 'In transit' 
  | 'Completed' 
  | 'Cancelled'
  | 'Declined';

export interface CropOffer {
  id: string;
  cropListingId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  companyName: string;
  buyerPhone: string;
  offeredPricePerUnit: number;
  requestedQuantity: number;
  estimatedTransportCost: number;
  disclosedCharges: number; // APMC cess, loading, packaging
  chargesBreakdown?: {
    marketCess: number;
    loadingFee: number;
    inspectionFee: number;
  };
  paymentTerms: 'Instant UPI on dispatch' | '50% advance + 50% delivery' | 'Net 7 days NEFT';
  deliveryTerms: 'Farmgate Pickup (Buyer arranges)' | 'Seller Delivery to Mandi/Depot';
  status: OfferStatus;
  notes?: string;
  createdAt: string;
}

export type EquipmentCategory = 
  | 'Tractor & Implements' 
  | 'Power Tiller & Rotary' 
  | 'Harvester & Thresher' 
  | 'Water Pump & Irrigation' 
  | 'Sprayer & Duster' 
  | 'Seed Drill & Planter';

export type RentalUnit = 'per hour' | 'per day' | 'per week';
export type EquipmentCondition = 'Brand New' | 'Excellent' | 'Good' | 'Fair';

export interface EquipmentListing {
  id: string;
  name: string;
  category: EquipmentCategory;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  location: {
    village: string;
    district: string;
    state: string;
  };
  condition: EquipmentCondition;
  forSale: boolean;
  salePrice?: number;
  forRent: boolean;
  rentalRate?: number;
  rentalUnit?: RentalUnit;
  deposit: number;
  additionalFees: number; // operator fee, transport fee
  specifications: {
    horsePower?: string;
    fuelType?: 'Diesel' | 'Electric' | 'Solar';
    brand?: string;
    attachments?: string[];
  };
  isAvailable: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  durationUnits: number;
  rentalUnit: RentalUnit;
  rentalRate: number;
  depositAmount: number;
  additionalFees: number;
  totalEstimatedCost: number; // (rate * duration) + additionalFees
  status: OfferStatus;
  withOperator: boolean;
  deliveryOption: 'Self Pickup' | 'Owner Delivery (+₹500)';
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 
  | 'Crop Sales' 
  | 'Subsidies & Govt Grants' 
  | 'Equipment Rental Income' 
  | 'Livestock & Dairy' 
  | 'Other Farm Income';

export type ExpenseCategory = 
  | 'Seeds' 
  | 'Fertilizers' 
  | 'Pesticides & Bio-control' 
  | 'Labour & Wages' 
  | 'Irrigation & Electricity' 
  | 'Fuel & Transport' 
  | 'Equipment Purchase & Rental' 
  | 'Loan Repayments' 
  | 'Maintenance & Repairs' 
  | 'Storage & Packaging' 
  | 'Other Farm Expenses';

export type FarmFinancialCategory = IncomeCategory | ExpenseCategory;

export interface FinancialTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in INR
  category: FarmFinancialCategory;
  date: string; // YYYY-MM-DD
  description: string;
  relatedCropOrSeason?: string;
  paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Kisan Credit Card (KCC)';
  notes?: string;
  createdAt: string;
}

export interface CategoryBudget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  budgetAmount: number;
  period: string; // e.g., 'Current Season (Kharif 2026)'
  warningThresholdPercent: number; // e.g. 80
}

export type InterestType = 'Fixed' | 'Floating';
export type LoanVerification = 'Verified Bank Partner' | 'Sample / Demo Offer' | 'Unverified Private';

export interface LoanOffer {
  id: string;
  lenderName: string;
  loanProductName: string;
  principalAmount: number;
  annualInterestRate: number; // annual percentage e.g. 7.0 for 7%
  interestType: InterestType;
  calculationMethod: 'Reducing Balance' | 'Flat Rate';
  tenureMonths: number;
  repaymentFrequency: 'Monthly' | 'Quarterly' | 'Seasonal at Harvest';
  processingFee: number;
  otherUpfrontFees: number; // documentation, inspection
  insuranceCharges: number;
  latePenaltyPercent: number;
  prepaymentChargesPercent: number;
  gracePeriodMonths: number;
  collateralRequired: boolean;
  collateralDetails?: string;
  sourceOfOffer: string;
  verificationStatus: LoanVerification;
  notes?: string;
  isSimulatedDemo: boolean;
}

export interface LoanCalculatedMetrics {
  monthlyEmi: number;
  totalScheduledRepayment: number;
  totalScheduledInterest: number;
  upfrontDeductions: number;
  estimatedNetDisbursed: number;
  estimatedTotalBorrowingCost: number;
  riskFlags: {
    id: string;
    severity: 'danger' | 'warning' | 'info';
    title: string;
    description: string;
  }[];
  transparencyScore: number; // 0 to 100
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'buyer_offer' | 'equipment_booking' | 'budget_alert' | 'loan_reminder' | 'payment_due';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; actionId: string }[];
  isTamil?: boolean;
  isOnlineGemini?: boolean;
  modelName?: string;
  isFallback?: boolean;
  fallbackReason?: string;
}

