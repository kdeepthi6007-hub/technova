// Indian Rupee & Agricultural Number Formatters

/**
 * Formats a number into Indian Rupee representation (e.g. ₹1,25,000 or ₹2,450.50)
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  // Clean decimal precision
  const rounded = showDecimals ? Number(amount.toFixed(2)) : Math.round(amount);
  
  // Format with en-IN locale
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: showDecimals ? 2 : 0,
      minimumFractionDigits: showDecimals ? 2 : 0,
    }).format(rounded);
  } catch {
    return `₹${rounded.toLocaleString('en-IN')}`;
  }
}

/**
 * Formats large amounts into Lakhs or Crores for concise farmer dashboards
 */
export function formatINRAbbr(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} Lakh`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}k`;
  }
  return `${sign}₹${abs.toFixed(0)}`;
}

/**
 * Formats a standard ISO date string (YYYY-MM-DD) into readable Indian date
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats percentage with 1 or 2 decimals
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}
