import { formatCurrency, getRelativeDate } from '../../utils/helpers';
import { CATEGORIES } from '../../types';
import './TransactionList.css';

export default function TransactionList({ transactions, onDelete }) {
  const getCategoryColor = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#95A5A6';
  };

  const getCategoryIcon = (categoryName) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list empty">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-icon" style={{ backgroundColor: getCategoryColor(transaction.category) + '20' }}>
            <span className="icon-emoji">{getCategoryIcon(transaction.category)}</span>
          </div>
          <div className="transaction-details">
            <div className="transaction-header">
              <h3 className="transaction-description">{transaction.description}</h3>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="transaction-meta">
              <span className="transaction-category">{transaction.category}</span>
              <span className="transaction-date">{getRelativeDate(transaction.date)}</span>
            </div>
          </div>
          {onDelete && (
            <button
              className="transaction-delete"
              onClick={() => onDelete(transaction.id)}
              aria-label="Delete transaction"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

