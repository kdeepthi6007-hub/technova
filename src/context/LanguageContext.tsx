// Localization System for Farm2Pay AI (English & Tamil, extensible to Telugu)

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'ta' | 'te';

interface Translations {
  appName: string;
  tagline: string;
  // Nav
  dashboard: string;
  cropMarketplace: string;
  equipmentMarketplace: string;
  expenseTracker: string;
  loanComparison: string;
  aiAssistant: string;
  reports: string;
  ordersAndBookings: string;
  notifications: string;
  profileSettings: string;
  // Landing
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  getStarted: string;
  exploreDemo: string;
  signIn: string;
  activeRole: string;
  switchRole: string;
  farmer: string;
  buyer: string;
  equipmentOwner: string;
  admin: string;
  // Financial
  totalIncome: string;
  totalExpenses: string;
  netProfit: string;
  profitMargin: string;
  recordTransaction: string;
  addIncome: string;
  addExpense: string;
  budgetStatus: string;
  // Loans
  compareLoans: string;
  addLoanOffer: string;
  monthlyEmi: string;
  principalAmount: string;
  interestRate: string;
  tenureMonths: string;
  totalRepayment: string;
  totalInterest: string;
  upfrontDeductions: string;
  netDisbursed: string;
  riskFlags: string;
  // Marketplace
  cropListings: string;
  listNewCrop: string;
  equipmentRentals: string;
  listEquipment: string;
  submitOffer: string;
  compareOffers: string;
  netProceeds: string;
  transportCost: string;
  bookEquipment: string;
  rentPerDay: string;
  rentPerHour: string;
  // Common
  search: string;
  filter: string;
  viewDetails: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  confirm: string;
  resetDemoData: string;
  demoModeBadge: string;
  simulatedDataNotice: string;
}

const translationsData: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Farm2Pay AI',
    tagline: 'Smart Agricultural Marketplace & Financial Intelligence',
    dashboard: 'Dashboard',
    cropMarketplace: 'Crop Marketplace',
    equipmentMarketplace: 'Equipment Hub',
    expenseTracker: 'Expense Tracker',
    loanComparison: 'Loan Comparison',
    aiAssistant: 'AI Farm Assistant',
    reports: 'Reports & Analytics',
    ordersAndBookings: 'Orders & Bookings',
    notifications: 'Notifications',
    profileSettings: 'Profile & Settings',
    landingHeroTitle: 'Empowering Farmers with Fair Prices, Transparent Loans & Smart Accounting',
    landingHeroSubtitle: 'Sell crops directly to verified buyers, rent modern farm machinery at fair rates, track seasonal farm finances, and compare agricultural loans with transparent AI math.',
    getStarted: 'Launch Platform',
    exploreDemo: 'Explore Live Demo',
    signIn: 'Sign In / Demo Access',
    activeRole: 'Active Role',
    switchRole: 'Switch Demo Persona',
    farmer: 'Farmer (Ramesh)',
    buyer: 'Buyer (Kaveri Agro)',
    equipmentOwner: 'Equipment Owner (Murugan)',
    admin: 'Administrator',
    totalIncome: 'Total Farm Income',
    totalExpenses: 'Total Farm Expenses',
    netProfit: 'Recorded Net Profit',
    profitMargin: 'Profit Margin',
    recordTransaction: 'Record Transaction',
    addIncome: 'Record Income',
    addExpense: 'Record Expense',
    budgetStatus: 'Category Budgets',
    compareLoans: 'Compare Loan Offers',
    addLoanOffer: 'Add Loan Offer',
    monthlyEmi: 'Monthly EMI',
    principalAmount: 'Principal Loan Amount',
    interestRate: 'Annual Interest Rate',
    tenureMonths: 'Tenure (Months)',
    totalRepayment: 'Total Scheduled Repayment',
    totalInterest: 'Total Scheduled Interest',
    upfrontDeductions: 'Upfront Deductions',
    netDisbursed: 'Estimated Net Disbursed',
    riskFlags: 'Transparency & Risk Audit',
    cropListings: 'Crop Marketplace',
    listNewCrop: 'Post New Crop Listing',
    equipmentRentals: 'Agricultural Machinery',
    listEquipment: 'List Equipment for Rent/Sale',
    submitOffer: 'Submit Buyer Offer',
    compareOffers: 'Compare Buyer Offers',
    netProceeds: 'Estimated Net Proceeds',
    transportCost: 'Transport & Freight Cost',
    bookEquipment: 'Book Equipment',
    rentPerDay: 'Rate per Day',
    rentPerHour: 'Rate per Hour',
    search: 'Search crops, equipment, transactions...',
    filter: 'Filter',
    viewDetails: 'View Details',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm Action',
    resetDemoData: 'Reset Demo Store',
    demoModeBadge: 'Demo Mode (Simulated)',
    simulatedDataNotice: 'All data is stored locally in your browser demo store. Payments and lender offers are simulated for prototype verification.'
  },
  ta: {
    appName: 'ஃபார்ம்2பே AI (Farm2Pay)',
    tagline: 'விவசாய சந்தை மற்றும் நிதி நுண்ணறிவு தளம்',
    dashboard: 'முகப்பு பலகை',
    cropMarketplace: 'விளைபொருள் சந்தை',
    equipmentMarketplace: 'வேளாண் கருவிகள்',
    expenseTracker: 'வரவு-செலவு கணக்கு',
    loanComparison: 'கடன் ஒப்பீடு',
    aiAssistant: 'AI வேளாண் உதவியாளர்',
    reports: 'அறிக்கைகள் & ஆய்வு',
    ordersAndBookings: 'ஆர்டர்கள் & முன்பதிவுகள்',
    notifications: 'அறிவிப்புகள்',
    profileSettings: 'சுயவிவரம் & அமைப்புகள்',
    landingHeroTitle: 'விவசாயிகளுக்கான நியாயமான விலை, வெளிப்படையான கடன் & நிதி மேலாண்மை',
    landingHeroSubtitle: 'விளைபொருட்களை இடைத்தரகரின்றி நல்ல விலைக்கு விற்கவும், குறைந்த வாடகையில் கருவிகளைப் பெறவும், பண்ணை செலவுகளைக் கண்காணிக்கவும், எளிய தமிழில் கடன் ஒப்பீடு செய்யவும் Farm2Pay AI உதவுகிறது.',
    getStarted: 'தளத்தை தொடங்குங்கள்',
    exploreDemo: 'மாதிரி காட்சியை காண்க',
    signIn: 'உள்நுழைய / டெமோ அனுமதி',
    activeRole: 'நடப்பு பங்கு',
    switchRole: 'டெமோ பயனர் மாற்று',
    farmer: 'விவசாயி (ரமேஷ்)',
    buyer: 'கொள்முதல் செய்வோர் (காவேரி அக்ரோ)',
    equipmentOwner: 'கருவி உரிமையாளர் (முருகன்)',
    admin: 'நிர்வாகி (அட்மின்)',
    totalIncome: 'மொத்த பண்ணை வரவு',
    totalExpenses: 'மொத்த பண்ணை செலவு',
    netProfit: 'நிகர லாபம்',
    profitMargin: 'லாப சதவிகிதம்',
    recordTransaction: 'புதிய பரிவர்த்தனை பதிவு',
    addIncome: 'வரவு பதிவு செய்',
    addExpense: 'செலவு பதிவு செய்',
    budgetStatus: 'பட்ஜெட் நிலவரம்',
    compareLoans: 'கடன் வாய்ப்புகளை ஒப்பிடு',
    addLoanOffer: 'புதிய கடன் விவரம் சேர்',
    monthlyEmi: 'மாத தவணை (EMI)',
    principalAmount: 'அசல் கடன் தொகை',
    interestRate: 'ஆண்டு வட்டி விகிதம்',
    tenureMonths: 'தவணைக்காலம் (மாதங்கள்)',
    totalRepayment: 'மொத்த திருப்பிச் செலுத்தும் தொகை',
    totalInterest: 'மொத்த வட்டித் தொகை',
    upfrontDeductions: 'முன்கூட்டிய பிடித்தங்கள்',
    netDisbursed: 'கைக்கு வரும் நிகரத் தொகை',
    riskFlags: 'கடன் எச்சரிக்கைகள் & வெளிப்படைத்தன்மை',
    cropListings: 'பயிர் சந்தை',
    listNewCrop: 'புதிய பயிர் பட்டியல் இடு',
    equipmentRentals: 'விவசாய இயந்திரங்கள்',
    listEquipment: 'கருவி வாடகை/விற்பனைக்கு இடு',
    submitOffer: 'விலை வாய்ப்பு சமர்ப்பி',
    compareOffers: 'விலை வாய்ப்புகளை ஒப்பிடு',
    netProceeds: 'கைக்கு வரும் நிகர வருமானம்',
    transportCost: 'போக்குவரத்து செலவு',
    bookEquipment: 'கருவியை முன்பதிவு செய்',
    rentPerDay: 'தினசரி வாடகை',
    rentPerHour: 'மணிநேர வாடகை',
    search: 'பயிர்கள், கருவிகள், கணக்குகளைத் தேடு...',
    filter: 'வடிகட்டுதல்',
    viewDetails: 'முழு விவரம்',
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    confirm: 'உறுதி செய்',
    resetDemoData: 'டெமோ தரவை மீட்டமைக்க',
    demoModeBadge: 'டெமோ பயன்முறை (மாதிரி)',
    simulatedDataNotice: 'அனைத்து தரவுகளும் உங்கள் உலாவியில் மட்டுமே சேமிக்கப்படுகின்றன. நிதி மற்றும் வங்கி பரிவர்த்தனைகள் அனைத்தும் மாதிரி வடிவமே.'
  },
  te: {
    // Extensible Telugu base mirroring English
    appName: 'ఫార్మ్2పే AI (Farm2Pay)',
    tagline: 'రైతు మార్కెట్ & ఆర్థిక విశ్లేషణ ప్లాట్‌ఫారమ్',
    dashboard: 'డాష్‌బోర్డ్',
    cropMarketplace: 'పంటల మార్కెట్',
    equipmentMarketplace: 'వ్యవసాయ పరికరాలు',
    expenseTracker: 'ఆదాయం & ఖర్చుల ట్రాకర్',
    loanComparison: 'రుణాల పోలిక',
    aiAssistant: 'AI రైతు సహాయకుడు',
    reports: 'రిపోర్టులు & విశ్లేషణ',
    ordersAndBookings: 'ఆర్డర్లు & బుకింగ్‌లు',
    notifications: 'నోటిఫికేషన్‌లు',
    profileSettings: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    landingHeroTitle: 'రైతులకు సరసమైన ధరలు, పారదర్శక రుణాలు & స్మార్ట్ ఆర్థిక నిర్వహణ',
    landingHeroSubtitle: 'ధాన్యాన్ని నేరుగా కొనుగోలుదారులకు అమ్మండి, వ్యవసాయ పరికరాలను సరసమైన అద్దెకు పొందండి మరియు ఖచ్చితమైన EMI లెక్కింపులతో రుణాలను పోల్చండి.',
    getStarted: 'ప్రారంభించండి',
    exploreDemo: 'డెమో చూడండి',
    signIn: 'సైన్ ఇన్ / డెమో యాక్సెస్',
    activeRole: 'ప్రస్తుత పాత్ర',
    switchRole: 'డెమో వినియోగదారుని మార్చండి',
    farmer: 'రైతు (రమేష్)',
    buyer: 'కొనుగోలుదారు (కావేరి ఆగ్రో)',
    equipmentOwner: 'యజమాని (మురుగన్)',
    admin: 'నిర్వాహకుడు',
    totalIncome: 'మొత్తం ఆదాయం',
    totalExpenses: 'మొత్తం ఖర్చులు',
    netProfit: 'నికర లాభం',
    profitMargin: 'లాభ శాతం',
    recordTransaction: 'లావాదేవీ నమోదు',
    addIncome: 'ఆదాయం జోడించండి',
    addExpense: 'ఖర్చు జోడించండి',
    budgetStatus: 'బడ్జెట్ స్థితి',
    compareLoans: 'రుణాలను పోల్చండి',
    addLoanOffer: 'కొత్త రుణ ఆఫర్ జోడించండి',
    monthlyEmi: 'నెలవారీ EMI',
    principalAmount: 'అసలు మొత్తం',
    interestRate: 'వార్షిక వడ్డీ రేటు',
    tenureMonths: 'కాలపరిమితి (నెలలు)',
    totalRepayment: 'మొత్తం తిరిగి చెల్లించే మొత్తం',
    totalInterest: 'మొత్తం వడ్డీ',
    upfrontDeductions: 'ముందస్తు కోతలు',
    netDisbursed: 'చేతికి వచ్చే నికర మొత్తం',
    riskFlags: 'పారదర్శకత & రిస్క్ తనిఖీ',
    cropListings: 'పంటల మార్కెట్',
    listNewCrop: 'కొత్త పంటను జోడించండి',
    equipmentRentals: 'వ్యవసాయ యంత్రాలు',
    listEquipment: 'పరికరాల అద్దె/అమ్మకం',
    submitOffer: 'కొనుగోలు ఆఫర్ సమర్పించండి',
    compareOffers: 'ఆఫర్‌లను పోల్చండి',
    netProceeds: 'నికర ఆదాయం',
    transportCost: 'రవాణా ఖర్చు',
    bookEquipment: 'బుక్ చేయండి',
    rentPerDay: 'రోజువారీ అద్దె',
    rentPerHour: 'గంట అద్దె',
    search: 'శోధించండి...',
    filter: 'ఫిల్టర్',
    viewDetails: 'వివరాలు చూడండి',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి',
    confirm: 'నిర్ధారించండి',
    resetDemoData: 'డేటాను రీసెట్ చేయండి',
    demoModeBadge: 'డెమో మోడ్',
    simulatedDataNotice: 'ఈ సమాచారం డెమో ప్రయోజనాల కోసం మాత్రమే.'
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('farm2pay_language');
    return (saved as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('farm2pay_language', lang);
  };

  const t = translationsData[language] || translationsData.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
