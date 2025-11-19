import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { dummyTransactions } from '../../data/dummyData';
import {
  formatCurrency,
  calculateTotalByType,
  calculateMonthlyTotals,
  calculateSavingsRate,
  getTopSpendingCategory,
  calculateAverageDailySpend,
} from '../../utils/helpers';
import TransactionList from '../TransactionList/TransactionList';
import TransactionModal from '../TransactionModal/TransactionModal';
import './Dashboard.css';

export default function Dashboard() {
  const [transactions, setTransactions] = useLocalStorage('transactions', dummyTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t =>
        t.id === transactionData.id ? transactionData : t
      ));
    } else {
      setTransactions([transactionData, ...transactions]);
    }
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const monthlyTotals = calculateMonthlyTotals(transactions);
  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpenses = calculateTotalByType(transactions, 'expense');
  const balance = totalIncome - totalExpenses;
  const savingsRate = calculateSavingsRate(monthlyTotals.income, monthlyTotals.expenses);
  const topCategory = getTopSpendingCategory(transactions);
  const avgDailySpend = calculateAverageDailySpend(transactions);

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="btn-add" onClick={handleAddTransaction}>
          + Add Transaction
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card balance">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Balance</h3>
            <p className="card-amount">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="summary-card income">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Monthly Income</h3>
            <p className="card-amount positive">{formatCurrency(monthlyTotals.income)}</p>
          </div>
        </div>

        <div className="summary-card expenses">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <h3>Monthly Expenses</h3>
            <p className="card-amount negative">{formatCurrency(monthlyTotals.expenses)}</p>
          </div>
        </div>

        <div className="summary-card savings">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Savings Rate</h3>
            <p className="card-amount">{savingsRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Top Spending Category</h4>
          <p className="stat-value">
            {topCategory ? (
              <>
                <span className="stat-category">{topCategory.category}</span>
                <span className="stat-amount">{formatCurrency(topCategory.amount)}</span>
              </>
            ) : (
              'No data'
            )}
          </p>
        </div>

        <div className="stat-card">
          <h4>Average Daily Spend</h4>
          <p className="stat-value">{formatCurrency(avgDailySpend)}</p>
        </div>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <TransactionList
          transactions={recentTransactions}
          onDelete={handleDeleteTransaction}
        />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
}

