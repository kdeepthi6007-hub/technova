// Central Application State & Local Persistence with Session Authentication & Data Isolation

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole,
  CropListing, 
  CropOffer, 
  EquipmentListing, 
  EquipmentBooking, 
  FinancialTransaction, 
  CategoryBudget, 
  LoanOffer, 
  AppNotification, 
  OfferStatus
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_CROP_LISTINGS, 
  INITIAL_CROP_OFFERS, 
  INITIAL_EQUIPMENT_LISTINGS, 
  INITIAL_EQUIPMENT_BOOKINGS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_LOAN_OFFERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  allUsers: UserProfile[];
  loginUser: (identifier: string, password?: string, role?: UserRole) => { success: boolean; message?: string };
  registerUser: (profile: Omit<UserProfile, 'id'>, password?: string) => UserProfile;
  logoutUser: () => void;
  enterDemoUser: (role: 'farmer' | 'buyer') => void;
  
  // Scoped Data Lists
  crops: CropListing[]; // All shared crop listings
  myCrops: CropListing[]; // Crops listed by the current farmer
  cropOffers: CropOffer[]; // Relevant offers (buyer's sent bids or farmer's received bids)
  allCropOffers: CropOffer[]; // Unfiltered store
  equipment: EquipmentListing[];
  bookings: EquipmentBooking[]; // Bookings made by current user
  transactions: FinancialTransaction[]; // Farmer's private transactions
  budgets: CategoryBudget[]; // Farmer's private budgets
  loanOffers: LoanOffer[]; // Loan offers (farmer view)
  notifications: AppNotification[]; // Scoped to current user
  
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  
  // Crop actions
  addCropListing: (crop: Omit<CropListing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerPhone'>) => CropListing;
  editCropListing: (crop: Partial<CropListing> & { id: string }) => { success: boolean; message?: string };
  deleteCropListing: (id: string, forceArchive?: boolean) => { success: boolean; archived?: boolean; message?: string };
  addCropOffer: (offer: Omit<CropOffer, 'id' | 'createdAt' | 'buyerId' | 'buyerName' | 'buyerPhone'>) => CropOffer;
  updateOfferStatus: (offerId: string, status: OfferStatus) => void;
  
  // Equipment actions
  addEquipmentListing: (eq: Omit<EquipmentListing, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone'>) => EquipmentListing;
  createEquipmentBooking: (booking: Omit<EquipmentBooking, 'id' | 'createdAt' | 'renterId' | 'renterName' | 'renterPhone'>) => EquipmentBooking;
  updateBookingStatus: (bookingId: string, status: OfferStatus) => void;
  
  // Financial actions
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'createdAt' | 'userId'>) => FinancialTransaction;
  editTransaction: (tx: FinancialTransaction) => void;
  deleteTransaction: (id: string) => void;
  saveBudget: (budget: Omit<CategoryBudget, 'id' | 'userId'> & { id?: string }) => void;
  
  // Loan actions
  addLoanOffer: (offer: Omit<LoanOffer, 'id'>) => LoanOffer;
  editLoanOffer: (offer: LoanOffer) => void;
  deleteLoanOffer: (id: string) => void;
  duplicateLoanOffer: (id: string) => LoanOffer;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'userId'>) => void;
  
  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SESSION: 'farm2pay_auth_session',
  USERS: 'farm2pay_registered_users',
  CROPS: 'farm2pay_crops',
  OFFERS: 'farm2pay_crop_offers',
  EQUIPMENT: 'farm2pay_equipment',
  BOOKINGS: 'farm2pay_bookings',
  TRANSACTIONS: 'farm2pay_transactions',
  BUDGETS: 'farm2pay_budgets',
  LOANS: 'farm2pay_loans',
  NOTIFICATIONS: 'farm2pay_notifications',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered Users list
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEMO_USERS;
  });

  // Current authenticated user session (null when unauthenticated)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null; // Start unauthenticated so welcome screen is presented
  });

  // All persistent storage data
  const [allCrops, setAllCrops] = useState<CropListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CROPS);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved crops', e);
    }
    return INITIAL_CROP_LISTINGS;
  });

  const [allCropOffers, setAllCropOffers] = useState<CropOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved offers', e);
    }
    return INITIAL_CROP_OFFERS;
  });

  const [allEquipment, setAllEquipment] = useState<EquipmentListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT_LISTINGS;
  });

  const [allBookings, setAllBookings] = useState<EquipmentBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT_BOOKINGS;
  });

  const [allTransactions, setAllTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [allBudgets, setAllBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [allLoanOffers, setAllLoanOffers] = useState<LoanOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    return saved ? JSON.parse(saved) : INITIAL_LOAN_OFFERS;
  });

  const [allNotifications, setAllNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [globalSearch, setGlobalSearch] = useState('');

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(allCrops));
  }, [allCrops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(allCropOffers));
  }, [allCropOffers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(allEquipment));
  }, [allEquipment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
  }, [allBookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(allTransactions));
  }, [allTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(allBudgets));
  }, [allBudgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(allLoanOffers));
  }, [allLoanOffers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));
  }, [allNotifications]);

  // Authentication Helpers
  const loginUser = (identifier: string, _password?: string, role?: UserRole): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Find matching user by email, phone, or name
    const found = allUsers.find(u => {
      const matchRole = role ? u.role === role : true;
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone.replace(/\s+/g, '').includes(cleanId.replace(/\s+/g, ''));
      const matchName = u.name.toLowerCase().includes(cleanId);
      return matchRole && (matchEmail || matchPhone || matchName);
    });

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    // Fallback: If demo login attempted with matching role
    const demoUser = DEMO_USERS.find(u => role ? u.role === role : true);
    if (demoUser && cleanId.includes('demo')) {
      setCurrentUser(demoUser);
      return { success: true };
    }

    return { 
      success: false, 
      message: `No ${role || 'user'} found with identifier "${identifier}". Please check your details or register a new account.` 
    };
  };

  const registerUser = (profileData: Omit<UserProfile, 'id'>): UserProfile => {
    const newId = `user-${profileData.role}-${Date.now()}`;
    const newUser: UserProfile = {
      ...profileData,
      id: newId,
      isDemoAccount: false,
      avatarUrl: profileData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name)}`
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Initial Welcome Notification for the new user
    const welcomeNotif: AppNotification = {
      id: `nt-${Date.now()}`,
      userId: newId,
      type: 'payment_due',
      title: `Welcome to Farm2Pay AI, ${newUser.name}!`,
      message: newUser.role === 'farmer'
        ? 'Your farmer account is ready. You can list crops for sale, track expenses, rent machinery, and compare loans.'
        : 'Your crop buyer account is active. Explore listed crops, contact farmers, and submit purchase bids directly.',
      timestamp: 'Just now',
      read: false,
      actionUrl: newUser.role === 'farmer' ? '/dashboard' : '/crop-marketplace'
    };
    setAllNotifications(prev => [welcomeNotif, ...prev]);

    return newUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  const enterDemoUser = (role: 'farmer' | 'buyer') => {
    const demo = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(demo);
  };

  // Scoped Data Lists according to active logged-in user
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role;

  // Crops: All shared listings
  const crops = allCrops;
  
  // Farmer's own listings: only active, non-archived listings
  const myCrops = allCrops.filter(c => c.sellerId === currentUserId && c.status !== 'Archived' && c.status !== 'Deactivated');

  // Scoped Crop Offers:
  // - If buyer: offers submitted by this buyer
  // - If farmer: offers received on crops owned by this farmer
  const cropOffers = allCropOffers.filter(offer => {
    if (!currentUser) return false;
    if (currentUserRole === 'buyer') {
      return offer.buyerId === currentUserId;
    }
    // Farmer sees bids on their crops
    const crop = allCrops.find(c => c.id === offer.cropListingId);
    return crop && crop.sellerId === currentUserId;
  });

  // Equipment bookings scoped to user
  const bookings = allBookings.filter(b => b.renterId === currentUserId);

  // Farmer's private financial transactions
  const transactions = allTransactions.filter(t => t.userId === currentUserId);

  // Farmer's private budgets
  const budgets = allBudgets.filter(b => b.userId === currentUserId);

  // Loan offers (farmer view)
  const loanOffers = allLoanOffers;

  // Notifications scoped to user
  const notifications = allNotifications.filter(n => n.userId === currentUserId);

  // Actions
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'userId'>) => {
    if (!currentUserId) return;
    const newNotif: AppNotification = {
      ...notif,
      id: `nt-${Date.now()}`,
      userId: currentUserId,
      timestamp: 'Just now',
    };
    setAllNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUserId) return;
    setAllNotifications(prev => prev.map(n => n.userId === currentUserId ? { ...n, read: true } : n));
  };

  // Crop CRUD with Strict Ownership Verification & Data Layer Protection
  const addCropListing = (cropData: Omit<CropListing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerPhone'>): CropListing => {
    if (!currentUser) throw new Error('Authentication required');
    if (currentUser.role !== 'farmer') throw new Error('Only registered farmers can publish crop listings.');

    const newCrop: CropListing = {
      ...cropData,
      id: `crop-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.phone,
      createdAt: new Date().toISOString().split('T')[0],
      status: cropData.status || 'Available',
    };
    setAllCrops(prev => [newCrop, ...prev]);
    addNotification({
      type: 'buyer_offer',
      title: 'New Crop Listed Successfully',
      message: `${newCrop.cropName} (${newCrop.quantity} ${newCrop.unit}) is now live for buyers on the marketplace.`,
      read: false,
      actionUrl: '/crop-marketplace'
    });
    return newCrop;
  };

  const editCropListing = (updated: Partial<CropListing> & { id: string }): { success: boolean; message?: string } => {
    if (!currentUser) {
      throw new Error('Authentication required: Please log in as a farmer to edit crop listings.');
    }
    if (currentUser.role !== 'farmer') {
      throw new Error('Access Denied: Only verified farmer producers can modify crop listings.');
    }

    const existingCrop = allCrops.find(c => c.id === updated.id);
    if (!existingCrop) {
      throw new Error('Listing not found.');
    }

    // Strict Ownership Enforcement in Data Layer
    if (existingCrop.sellerId !== currentUser.id) {
      throw new Error('Permission Denied: You do not have permission to edit another farmer\'s crop listing.');
    }

    // Preserve immutable ownership and creation fields from client-side tampering
    const sanitizedCrop: CropListing = {
      ...existingCrop,
      ...updated,
      id: existingCrop.id,
      sellerId: existingCrop.sellerId,
      sellerName: existingCrop.sellerName,
      sellerPhone: existingCrop.sellerPhone,
      createdAt: existingCrop.createdAt,
    };

    setAllCrops(prev => prev.map(c => c.id === sanitizedCrop.id ? sanitizedCrop : c));

    addNotification({
      type: 'buyer_offer',
      title: 'Crop Listing Updated',
      message: `Your listing "${sanitizedCrop.cropName}" was updated successfully.`,
      read: false,
      actionUrl: '/crop-marketplace'
    });

    return { success: true, message: `Listing "${sanitizedCrop.cropName}" updated.` };
  };

  const deleteCropListing = (id: string, forceArchive = false): { success: boolean; archived?: boolean; message?: string } => {
    if (!currentUser) {
      throw new Error('Authentication required: Please log in as a farmer to delete crop listings.');
    }
    if (currentUser.role !== 'farmer') {
      throw new Error('Access Denied: Only farmer producers can delete crop listings.');
    }

    const targetCrop = allCrops.find(c => c.id === id);
    if (!targetCrop) {
      throw new Error('Listing not found.');
    }

    // Strict Ownership Enforcement in Data Layer
    if (targetCrop.sellerId !== currentUser.id) {
      throw new Error('Permission Denied: You do not have permission to delete another farmer\'s crop listing.');
    }

    // Safe Rule: Check if crop has confirmed/in-progress orders that require transaction history preservation
    const linkedOffers = allCropOffers.filter(o => o.cropListingId === id);
    const hasConfirmedOrders = linkedOffers.some(o => 
      o.status === 'Accepted' || 
      o.status === 'Confirmed' || 
      o.status === 'In transit' ||
      o.status === 'Completed'
    );

    if (hasConfirmedOrders && !forceArchive) {
      // Safely archive the listing so order and financial transaction history is preserved!
      setAllCrops(prev => prev.map(c => c.id === id ? { ...c, status: 'Archived' } : c));

      // Cancel any remaining open/unaccepted bids on this archived crop
      setAllCropOffers(prev => prev.map(o => 
        (o.cropListingId === id && (o.status === 'Offer received' || o.status === 'Inquiry submitted'))
          ? { ...o, status: 'Declined' }
          : o
      ));

      addNotification({
        type: 'buyer_offer',
        title: 'Crop Listing Safely Archived',
        message: `"${targetCrop.cropName}" has confirmed buyer orders. It was safely archived rather than permanently deleted to preserve transaction audit records.`,
        read: false,
        actionUrl: '/crop-marketplace'
      });

      return {
        success: true,
        archived: true,
        message: `"${targetCrop.cropName}" has confirmed orders and was safely archived. It has been removed from active marketplace listings.`
      };
    }

    // Complete removal from active listing state when no confirmed orders exist
    setAllCrops(prev => prev.filter(c => c.id !== id));
    
    // Also clean up any unaccepted/pending bids on this crop
    setAllCropOffers(prev => prev.filter(o => o.cropListingId !== id));

    addNotification({
      type: 'buyer_offer',
      title: 'Crop Listing Removed',
      message: `"${targetCrop.cropName}" has been removed from the marketplace.`,
      read: false,
      actionUrl: '/crop-marketplace'
    });

    return {
      success: true,
      archived: false,
      message: `"${targetCrop.cropName}" has been successfully removed from your listings.`
    };
  };

  // Crop Offer Actions
  const addCropOffer = (offerData: Omit<CropOffer, 'id' | 'createdAt' | 'buyerId' | 'buyerName' | 'buyerPhone'>): CropOffer => {
    if (!currentUser) throw new Error('Authentication required');
    const newOffer: CropOffer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      companyName: currentUser.companyName || currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllCropOffers(prev => [newOffer, ...prev]);

    // Send notification to the buyer who submitted
    addNotification({
      type: 'buyer_offer',
      title: 'Bid Submitted to Farmer',
      message: `Your bid of ₹${newOffer.offeredPricePerUnit} on ${newOffer.cropName} was sent to the farmer.`,
      read: false,
      actionUrl: '/my-offers',
      priority: 'medium'
    });

    // Also notify the farmer who owns the crop
    const targetCrop = allCrops.find(c => c.id === newOffer.cropListingId);
    if (targetCrop && targetCrop.sellerId) {
      const farmerNotif: AppNotification = {
        id: `nt-${Date.now() + 1}`,
        userId: targetCrop.sellerId,
        type: 'buyer_offer',
        title: 'New Buyer Bid Received!',
        message: `${newOffer.companyName} submitted an offer of ₹${newOffer.offeredPricePerUnit} on your ${newOffer.cropName}.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: '/crop-marketplace',
        priority: 'high'
      };
      setAllNotifications(prev => [farmerNotif, ...prev]);
    }

    return newOffer;
  };

  const updateOfferStatus = (offerId: string, status: OfferStatus) => {
    setAllCropOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
    
    // Notify relevant parties
    const offer = allCropOffers.find(o => o.id === offerId);
    if (offer) {
      const updateNotif: AppNotification = {
        id: `nt-${Date.now()}`,
        userId: offer.buyerId,
        type: 'buyer_offer',
        title: `Offer Status: ${status}`,
        message: `Your bid on ${offer.cropName} has been marked as ${status}.`,
        timestamp: 'Just now',
        read: false,
        actionUrl: '/my-orders'
      };
      setAllNotifications(prev => [updateNotif, ...prev]);
    }
  };

  // Equipment CRUD
  const addEquipmentListing = (eqData: Omit<EquipmentListing, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerPhone'>): EquipmentListing => {
    if (!currentUser) throw new Error('Authentication required');
    const newEq: EquipmentListing = {
      ...eqData,
      id: `eq-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllEquipment(prev => [newEq, ...prev]);
    return newEq;
  };

  const createEquipmentBooking = (bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'renterId' | 'renterName' | 'renterPhone'>): EquipmentBooking => {
    if (!currentUser) throw new Error('Authentication required');
    const newBooking: EquipmentBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      renterId: currentUser.id,
      renterName: currentUser.name,
      renterPhone: currentUser.phone,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllBookings(prev => [newBooking, ...prev]);
    addNotification({
      type: 'equipment_booking',
      title: 'Equipment Booking Requested',
      message: `Booking for ${newBooking.equipmentName} requested. Estimated Outflow: ₹${newBooking.totalEstimatedCost.toLocaleString('en-IN')}`,
      read: false,
      actionUrl: '/orders-and-bookings'
    });
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: OfferStatus) => {
    setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  // Financial CRUD (Scoped to current user)
  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'userId'>): FinancialTransaction => {
    if (!currentUser) throw new Error('Authentication required');
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setAllTransactions(prev => [newTx, ...prev]);

    // Check budget threshold
    if (newTx.type === 'expense') {
      const userBudgets = allBudgets.filter(b => b.userId === currentUser.id);
      const budget = userBudgets.find(b => b.category === newTx.category);
      if (budget) {
        const totalCategorySpent = allTransactions
          .filter(t => t.userId === currentUser.id && t.type === 'expense' && t.category === newTx.category)
          .reduce((sum, t) => sum + Number(t.amount), 0) + Number(newTx.amount);

        const pct = (totalCategorySpent / budget.budgetAmount) * 100;
        if (pct >= (budget.warningThresholdPercent || 80)) {
          addNotification({
            type: 'budget_alert',
            title: `Budget Alert: ${newTx.category}`,
            message: `Spending reached ${pct.toFixed(1)}% of your seasonal limit (₹${totalCategorySpent.toLocaleString('en-IN')} of ₹${budget.budgetAmount.toLocaleString('en-IN')}).`,
            read: false,
            actionUrl: '/expense-tracker',
            priority: 'high'
          });
        }
      }
    }

    return newTx;
  };

  const editTransaction = (updated: FinancialTransaction) => {
    setAllTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTransaction = (id: string) => {
    setAllTransactions(prev => prev.filter(t => t.id !== id));
  };

  const saveBudget = (budgetData: Omit<CategoryBudget, 'id' | 'userId'> & { id?: string }) => {
    if (!currentUser) return;
    if (budgetData.id) {
      setAllBudgets(prev => prev.map(b => b.id === budgetData.id ? { ...b, ...budgetData } as CategoryBudget : b));
    } else {
      const newBudget: CategoryBudget = {
        ...budgetData,
        id: `bg-${Date.now()}`,
        userId: currentUser.id,
      };
      setAllBudgets(prev => [...prev, newBudget]);
    }
  };

  // Loan Actions
  const addLoanOffer = (loanData: Omit<LoanOffer, 'id'>): LoanOffer => {
    const newLoan: LoanOffer = {
      ...loanData,
      id: `loan-${Date.now()}`,
    };
    setAllLoanOffers(prev => [newLoan, ...prev]);
    return newLoan;
  };

  const editLoanOffer = (updated: LoanOffer) => {
    setAllLoanOffers(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  const deleteLoanOffer = (id: string) => {
    setAllLoanOffers(prev => prev.filter(l => l.id !== id));
  };

  const duplicateLoanOffer = (id: string): LoanOffer => {
    const orig = allLoanOffers.find(l => l.id === id);
    if (!orig) throw new Error('Loan offer not found');
    const copy: LoanOffer = {
      ...orig,
      id: `loan-${Date.now()}`,
      loanProductName: `${orig.loanProductName} (Copy)`,
    };
    setAllLoanOffers(prev => [...prev, copy]);
    return copy;
  };

  // Reset Demo Store
  const resetToDemoData = () => {
    setAllCrops(INITIAL_CROP_LISTINGS);
    setAllCropOffers(INITIAL_CROP_OFFERS);
    setAllEquipment(INITIAL_EQUIPMENT_LISTINGS);
    setAllBookings(INITIAL_EQUIPMENT_BOOKINGS);
    setAllTransactions(INITIAL_TRANSACTIONS);
    setAllBudgets(INITIAL_BUDGETS);
    setAllLoanOffers(INITIAL_LOAN_OFFERS);
    setAllNotifications(INITIAL_NOTIFICATIONS);
    setAllUsers(DEMO_USERS);

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROP_LISTINGS));
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_CROP_OFFERS));
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT_LISTINGS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_EQUIPMENT_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOAN_OFFERS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));

    if (currentUser) {
      addNotification({
        type: 'payment_due',
        title: 'Demo Store Reset Complete',
        message: 'All sample crops, equipment listings, transactions, and loan comparisons have been restored to default seed values.',
        read: false
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        allUsers,
        loginUser,
        registerUser,
        logoutUser,
        enterDemoUser,
        crops,
        myCrops,
        cropOffers,
        allCropOffers,
        equipment: allEquipment,
        bookings,
        transactions,
        budgets,
        loanOffers,
        notifications,
        globalSearch,
        setGlobalSearch,
        addCropListing,
        editCropListing,
        deleteCropListing,
        addCropOffer,
        updateOfferStatus,
        addEquipmentListing,
        createEquipmentBooking,
        updateBookingStatus,
        addTransaction,
        editTransaction,
        deleteTransaction,
        saveBudget,
        addLoanOffer,
        editLoanOffer,
        deleteLoanOffer,
        duplicateLoanOffer,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
