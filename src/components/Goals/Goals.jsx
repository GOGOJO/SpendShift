import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { dummyGoals } from '../../data/dummyData';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Goals.css';

export default function Goals() {
  const [goals, setGoals] = useLocalStorage('goals', dummyGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: '',
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    const goal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name,
      targetAmount: targetAmount,
      currentAmount: 0,
      deadline: new Date(newGoal.deadline).toISOString(),
      category: newGoal.category || 'Other',
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', deadline: '', category: '' });
    setIsAddingGoal(false);
  };

  const handleUpdateProgress = (id, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newAmount = Math.max(0, Math.min(goal.targetAmount, goal.currentAmount + amount));
        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, (current / target) * 100);
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="goals">
      <div className="goals-header">
        <h2>Financial Goals</h2>
        <button className="btn-add" onClick={() => setIsAddingGoal(true)}>
          + Add Goal
        </button>
      </div>

      {isAddingGoal && (
        <div className="add-goal-form">
          <h3>Create New Goal</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goal-name">Goal Name *</label>
              <input
                type="text"
                id="goal-name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="form-input"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="goal-amount">Target Amount *</label>
              <input
                type="number"
                id="goal-amount"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                className="form-input"
                step="0.01"
                min="0.01"
                placeholder="5000"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goal-deadline">Deadline *</label>
              <input
                type="date"
                id="goal-deadline"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="goal-category">Category</label>
              <input
                type="text"
                id="goal-category"
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="form-input"
                placeholder="e.g., Savings, Travel"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => {
              setIsAddingGoal(false);
              setNewGoal({ name: '', targetAmount: '', deadline: '', category: '' });
            }}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleAddGoal}>
              Create Goal
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="goals-empty">
          <p>No goals yet. Create your first financial goal to get started!</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <div>
                    <h3 className="goal-name">{goal.name}</h3>
                    {goal.category && (
                      <span className="goal-category">{goal.category}</span>
                    )}
                  </div>
                  <button
                    className="goal-delete"
                    onClick={() => handleDeleteGoal(goal.id)}
                    aria-label="Delete goal"
                  >
                    ×
                  </button>
                </div>

                <div className="goal-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    <span className="progress-amount">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="progress-percentage">{progress.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="goal-info">
                  <div className="goal-stat">
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value">{formatCurrency(remaining)}</span>
                  </div>
                  <div className="goal-stat">
                    <span className="stat-label">Deadline</span>
                    <span className="stat-value">
                      {formatDate(goal.deadline)}
                      {daysLeft >= 0 && (
                        <span className="days-left"> ({daysLeft} days left)</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="goal-actions">
                  <button
                    className="btn-update"
                    onClick={() => {
                      const amount = prompt('Enter amount to add (negative to subtract):', '0');
                      const numAmount = parseFloat(amount);
                      if (!isNaN(numAmount)) {
                        handleUpdateProgress(goal.id, numAmount);
                      }
                    }}
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

