/**
 * Data model definitions for SpendShift
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier
 * @property {string} date - ISO date string
 * @property {number} amount - Transaction amount (positive number)
 * @property {string} description - Transaction description
 * @property {string} category - Category name
 * @property {'income'|'expense'} type - Transaction type
 */

/**
 * @typedef {Object} Goal
 * @property {string} id - Unique identifier
 * @property {string} name - Goal name
 * @property {number} targetAmount - Target amount to save
 * @property {number} currentAmount - Current amount saved
 * @property {string} deadline - ISO date string for deadline
 * @property {string} category - Optional category filter
 */

/**
 * @typedef {Object} Category
 * @property {string} name - Category name
 * @property {string} color - Hex color code
 * @property {string} icon - Icon identifier or emoji
 */

// Category definitions for transactions

export const CATEGORIES = [
  { name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
  { name: 'Entertainment', color: '#95E1D3', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#F38181', icon: '💡' },
  { name: 'Shopping', color: '#AA96DA', icon: '🛍️' },
  { name: 'Healthcare', color: '#FCBAD3', icon: '🏥' },
  { name: 'Education', color: '#A8E6CF', icon: '📚' },
  { name: 'Travel', color: '#FFD93D', icon: '✈️' },
  { name: 'Income', color: '#6BCB77', icon: '💰' },
  { name: 'Other', color: '#95A5A6', icon: '📦' },
];

