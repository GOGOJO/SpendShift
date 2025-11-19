import { useState, useEffect } from 'react';
import { goalsAPI } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Goals.css';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.list();
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const targetAmount = parseFloat(newGoal.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount');
      return;
    }

    try {
      await goalsAPI.create({
        name: newGoal.name,
        target_amount: targetAmount,
        current_amount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category || 'Other',
      });
      setNewGoal({ name: '', targetAmount: '', deadline: '', category: '' });
      setIsAddingGoal(false);
      await loadGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      alert('Failed to create goal. Please try again.');
    }
  };

  const handleUpdateProgress = async (id, amount) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newAmount = Math.max(0, Math.min(goal.target_amount, goal.current_amount + amount));
    
    try {
      await goalsAPI.update(id, { current_amount: newAmount });
      await loadGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert('Failed to update goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.delete(id);
        await loadGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
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

      {loading ? (
        <div className="goals-empty">
          <p>Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="goals-empty">
          <p>No goals yet. Create your first financial goal to get started!</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const remaining = goal.target_amount - goal.current_amount;

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
                      {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
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

