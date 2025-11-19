import { CATEGORIES } from '../types/index';

/**
 * Generate dummy transaction data for the past 3 months
 */
function generateDummyTransactions() {
  const transactions = [];
  const now = new Date();
  const categories = CATEGORIES.filter(c => c.name !== 'Income');
  const incomeCategory = CATEGORIES.find(c => c.name === 'Income');

  // Generate expenses for the past 90 days
  const expenseDescriptions = {
    'Food & Dining': ['Starbucks', 'McDonald\'s', 'Pizza Hut', 'Grocery Store', 'Restaurant', 'Coffee Shop', 'Food Delivery'],
    'Transportation': ['Uber', 'Gas Station', 'Parking', 'Public Transit', 'Car Maintenance'],
    'Entertainment': ['Netflix', 'Movie Theater', 'Concert Tickets', 'Video Games', 'Streaming Service'],
    'Bills & Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance'],
    'Shopping': ['Amazon', 'Target', 'Clothing Store', 'Electronics', 'Online Purchase'],
    'Healthcare': ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Vitamins'],
    'Education': ['Online Course', 'Books', 'School Supplies'],
    'Travel': ['Hotel', 'Flight', 'Airbnb', 'Travel Booking'],
    'Other': ['ATM Withdrawal', 'Miscellaneous', 'Cash', 'Unknown']
  };

  // Generate random expenses
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descriptions = expenseDescriptions[category.name] || ['Expense'];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Vary amounts by category
    let amount;
    switch (category.name) {
      case 'Food & Dining':
        amount = Math.random() * 50 + 5; // $5-$55
        break;
      case 'Transportation':
        amount = Math.random() * 80 + 10; // $10-$90
        break;
      case 'Entertainment':
        amount = Math.random() * 40 + 8; // $8-$48
        break;
      case 'Bills & Utilities':
        amount = Math.random() * 200 + 30; // $30-$230
        break;
      case 'Shopping':
        amount = Math.random() * 150 + 20; // $20-$170
        break;
      default:
        amount = Math.random() * 100 + 10; // $10-$110
    }
    
    transactions.push({
      id: `expense-${i}`,
      date: date.toISOString(),
      amount: Math.round(amount * 100) / 100,
      description,
      category: category.name,
      type: 'expense'
    });
  }

  // Generate income transactions (salary, freelance, etc.)
  const incomeDescriptions = ['Salary', 'Freelance Work', 'Investment Return', 'Side Hustle', 'Bonus'];
  for (let i = 0; i < 6; i++) {
    const daysAgo = i * 15; // Every ~15 days
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const description = incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)];
    const amount = Math.random() * 2000 + 1000; // $1000-$3000
    
    transactions.push({
      id: `income-${i}`,
      date: date.toISOString(),
      amount: Math.round(amount * 100) / 100,
      description,
      category: incomeCategory.name,
      type: 'income'
    });
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const dummyTransactions = generateDummyTransactions();

const now = new Date();
export const dummyGoals = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: new Date(now.getFullYear(), now.getMonth() + 6, 1).toISOString(),
    category: 'Savings'
  },
  {
    id: 'goal-2',
    name: 'Vacation to Europe',
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: new Date(now.getFullYear() + 1, 5, 1).toISOString(),
    category: 'Travel'
  },
  {
    id: 'goal-3',
    name: 'New Laptop',
    targetAmount: 1500,
    currentAmount: 800,
    deadline: new Date(now.getFullYear(), now.getMonth() + 3, 15).toISOString(),
    category: 'Shopping'
  }
];

