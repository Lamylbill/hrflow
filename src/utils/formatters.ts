
/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string, includeYear = true): string => {
  if (!dateString) return "-";
  
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  
  if (includeYear) {
    options.year = "numeric";
  }
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};
