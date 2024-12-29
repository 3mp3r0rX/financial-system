import React from 'react';
import { PlusCircle, Eye, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import './BudgetCard.css';

interface BudgetCardProps {
  name: string;
  amount: number;
  max?: number;
  gray?: boolean;
  hideButtons?: boolean;
  onAddExpenseClick: () => void;
  onViewExpensesClick: () => void;
  date?: Date;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpenseClick,
  onViewExpensesClick,
  date,
}) => {
  const remaining = max ? max - amount : 0;
  const progressPercentage = max ? (amount / max) * 100 : 0;
  const isOverBudget = max ? amount > max : false;
  
  const getProgressColor = (amount: number, max: number) => {
    const ratio = amount / max;
    if (ratio < 0.5) return 'progress-safe';
    if (ratio < 0.75) return 'progress-warning';
    return 'progress-danger';
  };

  const cardClasses = [
    'budget-card',
    isOverBudget ? 'over-budget' : gray ? 'gray-card' : 'default-card'
  ].join(' ');

  return (
    <motion.div 
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="title-section">
          <h3 className="card-title">{name}</h3>
          {date && (
            <span className="last-update">
              Updated: {new Date(date).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="amount-section">
          <div className="main-amount">
            <DollarSign className="dollar-icon" />
            <span className="amount-value">{amount.toFixed(2)}</span>
            {max && (
              <span className="max-amount">/ ${max.toFixed(2)}</span>
            )}
          </div>
          {max && (
            <motion.div 
              className={`remaining-amount ${remaining < 0 ? 'negative' : 'positive'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {remaining < 0 ? (
                <TrendingUp className="trend-icon" />
              ) : (
                <TrendingDown className="trend-icon" />
              )}
              <span>
                {remaining < 0 ? 'Over by: ' : 'Remaining: '}
                ${Math.abs(remaining).toFixed(2)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {max && (
        <div className="progress-section">
          <div className="progress-bar-container">
            <motion.div
              className={`progress-bar ${getProgressColor(amount, max)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="progress-stats">
            <span className="progress-percentage">
              {progressPercentage.toFixed(1)}% used
            </span>
            <span className="progress-amount">
              ${amount.toFixed(2)} spent
            </span>
          </div>
        </div>
      )}

      {!hideButtons && (
        <motion.div 
          className="card-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onAddExpenseClick}
            className="action-button add-button"
          >
            <PlusCircle className="button-icon" />
            <span>Add Payment</span>
          </button>
          <button
            onClick={onViewExpensesClick}
            className="action-button view-button"
          >
            <Eye className="button-icon" />
            <span>View Details</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BudgetCard;