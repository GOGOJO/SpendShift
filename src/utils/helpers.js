/**
 * Utility functions for formatting and calculations
 */

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, includeTime = false) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get relative date string (Today, Yesterday, X days ago)
 * @param {string} dateString - ISO date string
 * @returns {string} Relative date string
 */
export function getRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
}

/**
 * Calculate total by transaction type
 * @param {Array} transactions - Array of transaction objects
 * @param {'income'|'expense'} type - Transaction type
 * @returns {number} Total amount
 */
export function calculateTotalByType(transactions, type) {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total by category
 * @param {Array} transactions - Array of transaction objects
 * @param {string} category - Category name
 * @returns {number} Total amount
 */
export function calculateTotalByCategory(transactions, category) {
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate monthly totals
 * @param {Array} transactions - Array of transaction objects
 * @param {Date} date - Reference date (defaults to current month)
 * @returns {Object} Object with income and expense totals
 */
export function calculateMonthlyTotals(transactions, date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthlyTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === year && tDate.getMonth() === month;
  });

  return {
    income: calculateTotalByType(monthlyTransactions, 'income'),
    expenses: calculateTotalByType(monthlyTransactions, 'expense'),
  };
}

/**
 * Calculate savings rate
 * @param {number} income - Total income
 * @param {number} expenses - Total expenses
 * @returns {number} Savings rate as percentage
 */
export function calculateSavingsRate(income, expenses) {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
}

/**
 * Get top spending category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object|null} Category name and total, or null
 */
export function getTopSpendingCategory(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};

  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  if (Object.keys(categoryTotals).length === 0) return null;

  const topCategory = Object.entries(categoryTotals).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return {
    category: topCategory[0],
    amount: topCategory[1],
  };
}

/**
 * Calculate average daily spend
 * @param {Array} transactions - Array of transaction objects
 * @param {number} days - Number of days to average over
 * @returns {number} Average daily spend
 */
export function calculateAverageDailySpend(transactions, days = 30) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recentExpenses = expenses.filter(t => new Date(t.date) >= cutoffDate);
  const total = recentExpenses.reduce((sum, t) => sum + t.amount, 0);

  return total / days;
}

