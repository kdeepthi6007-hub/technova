// Marketplace Calculations: Crop Net Proceeds and Equipment Rental Cost

export interface CropNetProceedsResult {
  grossCropValue: number;
  transportCost: number;
  disclosedCharges: number;
  estimatedNetProceeds: number;
  netProceedsPerUnit: number;
  priceDeltaVsExpected?: number; // Difference compared to farmer's expected asking price
}

/**
 * Calculates estimated net proceeds for a buyer's offer on a crop listing:
 * Net proceeds = Accepted crop value - Estimated transport costs - Disclosed applicable charges.
 */
export function calculateNetCropProceeds(
  offeredPricePerUnit: number,
  quantity: number,
  transportCost: number = 0,
  disclosedCharges: number = 0,
  expectedPricePerUnit?: number
): CropNetProceedsResult {
  const safeQty = Math.max(0, Number(quantity) || 0);
  const safePrice = Math.max(0, Number(offeredPricePerUnit) || 0);
  const safeTransport = Math.max(0, Number(transportCost) || 0);
  const safeCharges = Math.max(0, Number(disclosedCharges) || 0);

  const grossCropValue = Number((safePrice * safeQty).toFixed(2));
  const estimatedNetProceeds = Math.max(0, Number((grossCropValue - safeTransport - safeCharges).toFixed(2)));
  const netProceedsPerUnit = safeQty > 0 ? Number((estimatedNetProceeds / safeQty).toFixed(2)) : 0;

  let priceDeltaVsExpected: number | undefined;
  if (expectedPricePerUnit !== undefined && expectedPricePerUnit > 0) {
    priceDeltaVsExpected = Number((netProceedsPerUnit - expectedPricePerUnit).toFixed(2));
  }

  return {
    grossCropValue,
    transportCost: safeTransport,
    disclosedCharges: safeCharges,
    estimatedNetProceeds,
    netProceedsPerUnit,
    priceDeltaVsExpected,
  };
}

export interface EquipmentRentalCostResult {
  baseRentalCost: number;
  additionalFees: number;
  depositAmount: number;
  totalEstimatedOutflow: number; // baseRentalCost + additionalFees + depositAmount
  netRentalExpense: number; // baseRentalCost + additionalFees (deposit is refundable)
}

/**
 * Calculates estimated equipment rental cost:
 * Rental cost = Rental rate * Billable rental duration + Disclosed fees.
 */
export function calculateEquipmentRentalCost(
  rentalRate: number,
  durationUnits: number,
  additionalFees: number = 0,
  depositAmount: number = 0
): EquipmentRentalCostResult {
  const safeRate = Math.max(0, Number(rentalRate) || 0);
  const safeDuration = Math.max(0, Number(durationUnits) || 0);
  const safeFees = Math.max(0, Number(additionalFees) || 0);
  const safeDeposit = Math.max(0, Number(depositAmount) || 0);

  const baseRentalCost = Number((safeRate * safeDuration).toFixed(2));
  const netRentalExpense = Number((baseRentalCost + safeFees).toFixed(2));
  const totalEstimatedOutflow = Number((netRentalExpense + safeDeposit).toFixed(2));

  return {
    baseRentalCost,
    additionalFees: safeFees,
    depositAmount: safeDeposit,
    totalEstimatedOutflow,
    netRentalExpense,
  };
}
