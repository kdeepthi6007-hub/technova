// AI Farm Assistant Engine with Contextual Data Grounding, Google Gemini Online API & Bilingual (EN/TA) Processing

import { 
  FinancialTransaction, 
  CategoryBudget, 
  LoanOffer, 
  CropListing, 
  CropOffer, 
  EquipmentListing 
} from '../types';
import { calculateFinancialSummary, calculateBudgetStatuses } from '../utils/financialCalculations';
import { calculateLoanMetrics } from '../utils/loanCalculations';
import { calculateNetCropProceeds } from '../utils/marketplaceCalculations';
import { formatINR } from '../utils/formatters';

export interface AiDataContext {
  transactions: FinancialTransaction[];
  budgets: CategoryBudget[];
  loanOffers: LoanOffer[];
  crops: CropListing[];
  cropOffers: CropOffer[];
  equipment: EquipmentListing[];
  userName: string;
  language: 'en' | 'ta' | 'te';
}

export interface AiResponse {
  answer: string;
  suggestedActions?: { label: string; actionId: string }[];
  isRuleBasedDemo: boolean;
  isOnlineGemini?: boolean;
  modelName?: string;
  fallbackReason?: string;
}

/**
 * Builds grounded summary of live farm data without exposing private credentials
 */
export function buildGroundedFarmSummary(context: AiDataContext): string {
  const finSummary = calculateFinancialSummary(context.transactions);
  const budgetStatuses = calculateBudgetStatuses(context.transactions, context.budgets);
  const exceeded = budgetStatuses.filter(b => b.isExceeded);
  
  const loansSummary = context.loanOffers.map(o => {
    const metrics = calculateLoanMetrics(o);
    return `- ${o.lenderName} (${o.loanProductName}): Principal ₹${o.principalAmount}, Tenure ${o.tenureMonths}m, Monthly EMI ₹${metrics.monthlyEmi}, Total Borrowing Cost ₹${metrics.estimatedTotalBorrowingCost}, Disbursed ₹${metrics.estimatedNetDisbursed}`;
  }).join('\n');

  const cropsSummary = context.crops.slice(0, 5).map(c => 
    `- ${c.cropName} (${c.variety}): ${c.quantity} ${c.unit} @ ₹${c.expectedPricePerUnit}/${c.unit}, Status: ${c.status}`
  ).join('\n');

  const offersSummary = context.cropOffers.slice(0, 5).map(o => {
    const proceeds = calculateNetCropProceeds(
      o.offeredPricePerUnit,
      o.requestedQuantity,
      o.estimatedTransportCost,
      o.disclosedCharges
    );
    return `- Offer on ${o.cropName} by ${o.companyName}: Offered ₹${o.offeredPricePerUnit}/unit, Net proceeds ₹${proceeds.estimatedNetProceeds} (₹${proceeds.netProceedsPerUnit}/unit), Status: ${o.status}`;
  }).join('\n');

  return `
Farmer Name: ${context.userName}
Language Preference: ${context.language === 'ta' ? 'Tamil' : 'English'}

FINANCIAL SUMMARY:
- Total Recorded Farm Income: ₹${finSummary.totalIncome}
- Total Recorded Farm Expenses: ₹${finSummary.totalExpenses}
- Net Operating Profit: ₹${finSummary.netProfit} (${finSummary.profitMarginPercent.toFixed(1)}% margin)
- Category Budgets Exceeded: ${exceeded.length > 0 ? exceeded.map(b => `${b.category} (Spent ₹${b.spentAmount} / Budget ₹${b.budgetAmount})`).join(', ') : 'None, all within budget'}

ACTIVE LOAN OFFERS UNDER COMPARISON:
${loansSummary || 'No active loan offers.'}

ACTIVE CROP MARKETPLACE LISTINGS:
${cropsSummary || 'No active crops listed.'}

BUYER BIDS & PURCHASE OFFERS:
${offersSummary || 'No buyer bids recorded.'}
`.trim();
}

function determineSuggestedActions(prompt: string): { label: string; actionId: string }[] {
  const p = prompt.toLowerCase();
  if (p.includes('loan') || p.includes('கடன்') || p.includes('emi') || p.includes('bank')) {
    return [{ label: 'View Loan Comparison', actionId: 'nav_loans' }];
  }
  if (p.includes('crop') || p.includes('offer') || p.includes('பயிர்') || p.includes('விலை') || p.includes('bid')) {
    return [{ label: 'Open Crop Marketplace', actionId: 'nav_crops' }];
  }
  if (p.includes('profit') || p.includes('expense') || p.includes('budget') || p.includes('லாபம்') || p.includes('செலவு')) {
    return [{ label: 'View Expense Tracker', actionId: 'nav_expenses' }];
  }
  return [];
}

/**
 * Main AI Assistant Entry Point:
 * 1. Tries Google Gemini server-side endpoint (/api/gemini-chat)
 * 2. If Gemini API is unconfigured, unreachable, or errors, seamlessly falls back to
 *    the deterministic grounded rule engine, explicitly labeling provenance.
 */
export async function getAiFarmAdvice(
  prompt: string,
  context: AiDataContext
): Promise<AiResponse> {
  const farmSummary = buildGroundedFarmSummary(context);

  try {
    const res = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        language: context.language,
        farmSummary,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.isOnlineGemini && data.answer) {
        return {
          answer: data.answer,
          isRuleBasedDemo: false,
          isOnlineGemini: true,
          modelName: data.model || 'Gemini 2.5 Flash',
          suggestedActions: determineSuggestedActions(prompt),
        };
      } else if (data.error === 'GEMINI_API_KEY_NOT_CONFIGURED') {
        const fallback = getRuleBasedFarmAdvice(prompt, context);
        return {
          ...fallback,
          isRuleBasedDemo: true,
          isOnlineGemini: false,
          fallbackReason: 'GEMINI_API_KEY is not configured in server environment (.env). Operating in offline rule-based mode.'
        };
      }
    }
  } catch (err: any) {
    console.info('Server Gemini endpoint unavailable, falling back to rule engine:', err?.message || err);
  }

  // Fallback to grounded rule-based engine
  const fallback = getRuleBasedFarmAdvice(prompt, context);
  return {
    ...fallback,
    isRuleBasedDemo: true,
    isOnlineGemini: false,
    fallbackReason: 'Online Gemini API unavailable. Operating in verified offline rule-based mode.'
  };
}

/**
 * Deterministic & grounded offline rule-based assistant for Farm2Pay AI
 */
export function getRuleBasedFarmAdvice(
  prompt: string,
  context: AiDataContext
): AiResponse {
  const p = prompt.toLowerCase().trim();
  const isTa = context.language === 'ta';

  // 1. Calculate actual live data metrics for grounding
  const finSummary = calculateFinancialSummary(context.transactions);
  const budgetStatuses = calculateBudgetStatuses(context.transactions, context.budgets);
  const overBudget = budgetStatuses.filter(b => b.isExceeded);

  // Intent A: Loan Cost Comparison & Tradeoffs
  if (p.includes('which loan') || p.includes('loan cost') || p.includes('cheapest loan') || p.includes('எந்த கடன்') || p.includes('கடன் குறைவு')) {
    if (context.loanOffers.length === 0) {
      return {
        answer: isTa 
          ? 'தற்போது எந்த கடன் வாய்ப்புகளும் சேர்க்கப்படவில்லை. ஒப்பீடு செய்ய கடன் பிரிவில் புதிய கடன் விவரங்களைச் சேர்க்கவும்.' 
          : 'No loan offers are currently recorded. Please add at least two loan offers in the Loan Comparison module to analyze them.',
        isRuleBasedDemo: true
      };
    }

    const loanMetricsList = context.loanOffers.map(o => ({
      offer: o,
      metrics: calculateLoanMetrics(o)
    })).sort((a, b) => a.metrics.estimatedTotalBorrowingCost - b.metrics.estimatedTotalBorrowingCost);

    const cheapest = loanMetricsList[0];
    const highest = loanMetricsList[loanMetricsList.length - 1];

    if (isTa) {
      return {
        answer: `🔎 **கடன் ஒப்பீடு ஆய்வு முடிவுகள்:**\n\n` +
          `• **குறைந்த மொத்த செலவு கடன்:** **${cheapest.offer.lenderName}** (${cheapest.offer.loanProductName})\n` +
          `  - அசல்: ${formatINR(cheapest.offer.principalAmount)}\n` +
          `  - மாத EMI: ${formatINR(cheapest.metrics.monthlyEmi)}\n` +
          `  - மொத்த வட்டி + கட்டணங்கள்: ${formatINR(cheapest.metrics.estimatedTotalBorrowingCost)}\n\n` +
          `• **எச்சரிக்கை:** **${highest.offer.lenderName}** கடனில் மொத்த கூடுதல் செலவு **${formatINR(highest.metrics.estimatedTotalBorrowingCost)}** ஆகும்.\n\n` +
          `💡 *முக்கிய ஆலோசனை:* குறைந்த EMI என்பது குறைந்த வட்டி என்று அர்த்தமல்ல! அதிக தவணைக் காலம் (Tenure) இருந்தால் EMI குறைவாக இருந்தாலும், வட்டி அதிகம் செலுத்த வேண்டி வரும். ஒப்பந்தத்தில் கையொப்பமிடும் முன் வங்கி மேலாளரிடம் உறுதி செய்யவும்.`,
        suggestedActions: [
          { label: 'கடன் ஒப்பீட்டு பக்கம் செல்க', actionId: 'nav_loans' }
        ],
        isRuleBasedDemo: true
      };
    }

    return {
      answer: `📊 **Grounded Loan Comparison Findings:**\n\n` +
        `• **Lowest Total Borrowing Cost:** **${cheapest.offer.lenderName}** (${cheapest.offer.loanProductName})\n` +
        `  - Principal: ${formatINR(cheapest.offer.principalAmount)} over ${cheapest.offer.tenureMonths} months\n` +
        `  - Monthly EMI: **${formatINR(cheapest.metrics.monthlyEmi)}**\n` +
        `  - Total Borrowing Cost: **${formatINR(cheapest.metrics.estimatedTotalBorrowingCost)}**\n\n` +
        `• **Highest Cost Comparison:** **${highest.offer.lenderName}** will cost you **${formatINR(highest.metrics.estimatedTotalBorrowingCost)}** in total interest and fees.\n\n` +
        `⚠️ *Farmer Tip:* Do not judge loans solely on monthly EMI. Longer tenures lower your monthly installment but significantly increase total interest outgo. Check upfront deduction amounts before signing!`,
      suggestedActions: [
        { label: 'View Loan Comparison Table', actionId: 'nav_loans' }
      ],
      isRuleBasedDemo: true
    };
  }

  // Intent B: Net Disbursed / Money Actually Received
  if (p.includes('actually receive') || p.includes('net disbursed') || p.includes('கைக்கு வரும்') || p.includes('எவ்வளவு பணம் கிடைக்கும்')) {
    if (context.loanOffers.length === 0) {
      return {
        answer: isTa ? 'கடன் விவரங்களைச் சேர்க்கவும்.' : 'Please add a loan offer to calculate net disbursement.',
        isRuleBasedDemo: true
      };
    }
    const sample = context.loanOffers[0];
    const metrics = calculateLoanMetrics(sample);

    if (isTa) {
      return {
        answer: `💰 **கடன் தொகை பிடித்தம் & கைக்கு வரும் பணம் (${sample.lenderName}):**\n\n` +
          `• அனுமதிக்கப்பட்ட அசல் கடன் தொகை: **${formatINR(sample.principalAmount)}**\n` +
          `• செயலாக்கக் கட்டணம் (Processing Fee): -${formatINR(sample.processingFee)}\n` +
          `• இதர ஆவணக் கட்டணங்கள்: -${formatINR(sample.otherUpfrontFees)}\n` +
          `• பயிர் காப்பீட்டுக் கட்டணம்: -${formatINR(sample.insuranceCharges)}\n` +
          `-----------------------------------------\n` +
          `✅ **உங்கள் வங்கிக் கணக்கில் வரவு வைக்கப்படும் நிகரத் தொகை:** **${formatINR(metrics.estimatedNetDisbursed)}**\n\n` +
          `முன்கூட்டியே பிடித்தம் செய்யப்படும் மொத்த தொகை: **${formatINR(metrics.upfrontDeductions)}** (${((metrics.upfrontDeductions / sample.principalAmount) * 100).toFixed(1)}%).`,
        isRuleBasedDemo: true
      };
    }

    return {
      answer: `💰 **Net Disbursed Amount Breakdown for ${sample.lenderName}:**\n\n` +
        `• Sanctioned Principal: **${formatINR(sample.principalAmount)}**\n` +
        `• Processing Fee Deducted: -${formatINR(sample.processingFee)}\n` +
        `• Documentation & Legal Charges: -${formatINR(sample.otherUpfrontFees)}\n` +
        `• Insurance Deduction: -${formatINR(sample.insuranceCharges)}\n` +
        `-----------------------------------------\n` +
        `✅ **Estimated Amount Credited to Your Bank Account:** **${formatINR(metrics.estimatedNetDisbursed)}**\n\n` +
        `Total Upfront Deductions: **${formatINR(metrics.upfrontDeductions)}** (${((metrics.upfrontDeductions / sample.principalAmount) * 100).toFixed(1)}% of loan).`,
      isRuleBasedDemo: true
    };
  }

  // Intent C: Crop Buyer Offers & Net Proceeds Comparison
  if (p.includes('buyer offer') || p.includes('crop offer') || p.includes('net proceed') || p.includes('விளைபொருள் விலை') || p.includes('கொள்முதல்')) {
    if (context.cropOffers.length === 0) {
      return {
        answer: isTa 
          ? 'தற்போது எந்த கொள்முதல் வாய்ப்புகளும் வரவில்லை.' 
          : 'No buyer offers have been received yet on your crop listings.',
        isRuleBasedDemo: true
      };
    }

    const offerComparisons = context.cropOffers.map(o => {
      const calc = calculateNetCropProceeds(o.offeredPricePerUnit, o.requestedQuantity, o.estimatedTransportCost, o.disclosedCharges);
      return { offer: o, calc };
    }).sort((a, b) => b.calc.netProceedsPerUnit - a.calc.netProceedsPerUnit);

    const bestOffer = offerComparisons[0];

    if (isTa) {
      return {
        answer: `🌾 **கொள்முதல் விலை ஒப்பீடு (உண்மையான நிகர வருமானம்):**\n\n` +
          `• **சிறந்த நிகர விலை வாய்ப்பு:** **${bestOffer.offer.companyName}**\n` +
          `  - பயிர்: ${bestOffer.offer.cropName}\n` +
          `  - கொள்முதல் விலை: ₹${bestOffer.offer.offeredPricePerUnit}/க்விண்டால் (${bestOffer.offer.requestedQuantity} க்விண்டால்)\n` +
          `  - போக்குவரத்து செலவு: ₹${bestOffer.offer.estimatedTransportCost}\n` +
          `  - மண்டிக் கட்டணங்கள்: ₹${bestOffer.offer.disclosedCharges}\n` +
          `  - **கையில் கிடைக்கும் நிகர விலை:** **₹${bestOffer.calc.netProceedsPerUnit}/க்விண்டால்**\n` +
          `  - **மொத்த நிகர தொகை:** **${formatINR(bestOffer.calc.estimatedNetProceeds)}**\n\n` +
          `💡 *கவனிக்கவும்:* அதிக விலை சொல்லும் வியாபாரி போக்குவரத்தை உங்களிடம் சுமத்தினால், கையில் வரும் தொகை குறையலாம். பண்ணையிலேயே கொள்முதல் (Farmgate Pickup) செய்யும் வாய்ப்புகளை முன்னுரிமைப்படுத்துங்கள்.`,
        suggestedActions: [
          { label: 'விளைபொருள் சந்தை செல்க', actionId: 'nav_crops' }
        ],
        isRuleBasedDemo: true
      };
    }

    return {
      answer: `🌾 **Buyer Offer Net Proceeds Comparison:**\n\n` +
        `• **Highest Net Return Offer:** **${bestOffer.offer.companyName}** on ${bestOffer.offer.cropName}\n` +
        `  - Quoted Price: ₹${bestOffer.offer.offeredPricePerUnit}/unit for ${bestOffer.offer.requestedQuantity} units\n` +
        `  - Estimated Transport: ₹${bestOffer.offer.estimatedTransportCost}\n` +
        `  - Disclosed Cess & Loading: ₹${bestOffer.offer.disclosedCharges}\n` +
        `  - **Effective Net Realization:** **₹${bestOffer.calc.netProceedsPerUnit}/unit**\n` +
        `  - **Total Net Proceeds:** **${formatINR(bestOffer.calc.estimatedNetProceeds)}**\n\n` +
        `💡 *Insight:* A buyer quoting ₹2,520 with ₹4,800 freight deduction yields less net cash than a buyer quoting ₹2,450 with free farmgate pickup! Always evaluate Net Proceeds.`,
      suggestedActions: [
        { label: 'View Crop Marketplace', actionId: 'nav_crops' }
      ],
      isRuleBasedDemo: true
    };
  }

  // Intent D: Farm Financial Performance / Expenses / Profits
  if (p.includes('profit') || p.includes('expense') || p.includes('income') || p.includes('spending') || p.includes('லாபம்') || p.includes('செலவு')) {
    if (isTa) {
      return {
        answer: `📊 **உங்கள் பண்ணை நிதி நிலை அறிக்கை:**\n\n` +
          `• பதிவு செய்யப்பட்ட மொத்த வரவு: **${formatINR(finSummary.totalIncome)}**\n` +
          `• பதிவு செய்யப்பட்ட மொத்த செலவு: **${formatINR(finSummary.totalExpenses)}**\n` +
          `• நிகர லாபம் (Net Profit): **${formatINR(finSummary.netProfit)}**\n` +
          `• லாப விகிதம் (Profit Margin): **${finSummary.profitMarginPercent}%**\n\n` +
          (overBudget.length > 0 
            ? `⚠️ **பட்ஜெட் எச்சரிக்கை:** ${overBudget.map(b => `${b.category} (அளவு தாண்டியது: ${formatINR(b.spentAmount)} / ${formatINR(b.budgetAmount)})`).join(', ')}.\n\n` 
            : `✅ அனைத்து வகை செலவுகளும் பருவ பட்ஜெட்டிற்குள் உள்ளன.\n\n`) +
          `💡 *செலவு குறைப்பு ஆலோசனை:* உரம் மற்றும் கூலி செலவுகளை முறைப்படுத்த உழவர் உற்பத்தியாளர் குழு (FPO) மூலம் கூட்டாக இயந்திரங்களை வாடகைக்கு எடுக்கலாம்.`,
        suggestedActions: [
          { label: 'வரவு-செலவு கணக்கு காண்க', actionId: 'nav_expenses' }
        ],
        isRuleBasedDemo: true
      };
    }

    return {
      answer: `📊 **Active Farm Financial Health Summary:**\n\n` +
        `• Total Recorded Income: **${formatINR(finSummary.totalIncome)}**\n` +
        `• Total Recorded Expenses: **${formatINR(finSummary.totalExpenses)}**\n` +
        `• Net Profit: **${formatINR(finSummary.netProfit)}**\n` +
        `• Operating Profit Margin: **${finSummary.profitMarginPercent}%**\n\n` +
        (overBudget.length > 0 
          ? `⚠️ **Over-Budget Warning:** ${overBudget.map(b => `${b.category} has exceeded allocation (${formatINR(b.spentAmount)} spent vs ${formatINR(b.budgetAmount)} allocated)`).join('; ')}.\n\n` 
          : `✅ All major categories are operating within seasonal budget limits.\n\n`) +
        `💡 *Recommendation:* Review ongoing labour and diesel transport expenses before the upcoming harvesting cycle.`,
      suggestedActions: [
        { label: 'Open Expense Tracker', actionId: 'nav_expenses' }
      ],
      isRuleBasedDemo: true
    };
  }

  // Intent E: Terminology Explanations
  if (p.includes('tamil') || p.includes('explain') || p.includes('விளக்கம்') || p.includes('moratorium') || p.includes('emi') || p.includes('collateral')) {
    if (isTa) {
      return {
        answer: `📖 **முக்கிய நிதி சொற்களுக்கான எளிய விளக்கம்:**\n\n` +
          `1. **அசல் (Principal):** நீங்கள் வங்கியில் வாங்கும் நேரடி கடன் தொகை.\n` +
          `2. **மாத தவணை (EMI):** அசல் மற்றும் வட்டியை பிரித்து ஒவ்வொரு மாதமும் செலுத்தும் குறிப்பிட்ட தொகை.\n` +
          `3. **சலுகைக் காலம் (Moratorium):** பயிர் அறுவடை வரை அசலை திருப்பிச் செலுத்தாமல் இருக்க வங்கி வழங்கும் கால அவகாசம்.\n` +
          `4. **ஈட்டு / பிணை (Collateral):** கடனுக்கு உத்தரவாதமாக வைக்கும் நிலப்பட்டா அல்லது இயந்திரம்.\n` +
          `5. **முன்கூட்டியே முடித்தல் (Prepayment):** அறுவடைக்கு பின் கடனை முன்கூட்டியே அடைக்கும்போது விதிக்கப்படும் கட்டணம். (விவசாய கடன்களுக்கு RBI விதிப்படி இது இலவசம்).`,
        isRuleBasedDemo: true
      };
    }

    return {
      answer: `📖 **Key Agricultural Financial Terms Explained:**\n\n` +
        `1. **Principal:** The actual loan money you receive from the bank.\n` +
        `2. **Equated Monthly Installment (EMI):** Fixed monthly payment combining a portion of principal and scheduled interest.\n` +
        `3. **Moratorium / Grace Period:** Repayment holiday until harvest time, easing cash flow pressure during growing season.\n` +
        `4. **Collateral:** Assets (like land patta or machinery) pledged to secure the credit facility.\n` +
        `5. **Prepayment Penalty:** Fee charged if you pay off the loan before tenure. Under RBI guidelines, individual agri loans with floating rates cannot incur foreclosure fees.`,
      isRuleBasedDemo: true
    };
  }

  // Default / General Agricultural Query
  if (isTa) {
    return {
      answer: `வணக்கம் ${context.userName}! நான் உங்கள் Farm2Pay AI வேளாண் நிதி உதவியாளர்.\n\n` +
        `நான் உங்களுக்கு கீழ்க்கண்டவற்றில் உதவ முடியும்:\n` +
        `• உங்கள் பயிர்களுக்கு வந்த வியாபாரிகளின் விலை வாய்ப்புகளை ஒப்பிட்டு அதிக நிகர லாபத்தைக் கண்டறிதல்\n` +
        `• உழவு இயந்திரங்கள் மற்றும் டிராக்டர்களை குறைந்த வாடகையில் முன்பதிவு செய்தல்\n` +
        `• உங்கள் பண்ணை வரவு-செலவு மற்றும் பட்ஜெட் வரம்புகளைக் கண்காணித்தல்\n` +
        `• வங்கி மற்றும் கூட்டுறவு சங்கங்களின் கடன் வட்டி, EMI மற்றும் மறைமுக கட்டணங்களை ஆய்வு செய்தல்\n\n` +
        `என்னிடம் ஏதேனும் கேள்விகளைக் கேட்க கீழே உள்ள பரிந்துரைகளைத் தொடவும்.`,
      suggestedActions: [
        { label: 'எந்த கடன் செலவு குறைவு?', actionId: 'q_cheapest_loan' },
        { label: 'என் நிகர லாபம் எவ்வளவு?', actionId: 'q_net_profit' },
        { label: 'வியாபாரிகளின் விலையை ஒப்பிடு', actionId: 'q_compare_offers' }
      ],
      isRuleBasedDemo: true
    };
  }

  return {
    answer: `Hello ${context.userName}! I am your Farm2Pay AI Assistant.\n\n` +
      `I can help you analyze:\n` +
      `• **Crop Offers:** Compare buyer bids factoring in freight and APMC cess to see your true Net Proceeds.\n` +
      `• **Equipment Costs:** Estimate rental charges for tractors, tillers, and harvesters.\n` +
      `• **Farm Finances:** Audit seasonal income, expenses, and budget overruns.\n` +
      `• **Loan Audits:** Calculate true EMIs, uncover hidden upfront fees, and compare lending offers.\n\n` +
      `Click one of the suggested prompts below or ask any farm finance question!`,
    suggestedActions: [
      { label: 'Which loan costs less overall?', actionId: 'q_cheapest_loan' },
      { label: 'What is my current net farm profit?', actionId: 'q_net_profit' },
      { label: 'Compare my buyer offers by net proceeds', actionId: 'q_compare_offers' }
    ],
    isRuleBasedDemo: true
  };
}
