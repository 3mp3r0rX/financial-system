import React, { useRef, FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../../contexts/BudgetsContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  FileText, 
  Calendar,
  AlertCircle, 
  Folder,
  X 
} from "lucide-react";
import "./AddExpenseModal.css";

interface AddExpenseModalProps {
  show: boolean;
  handleClose: () => void;
  defaultBudgetId: string;
}

interface ValidationErrors {
  description?: string;
  amount?: string;
}
const AddExpenseModal: FC<AddExpenseModalProps> = ({
  show,
  handleClose,
  defaultBudgetId,
}) => {
  const descriptionRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const budgetIdRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const { addExpense, budgets } = useBudgets();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!descriptionRef.current?.value.trim()) {
      newErrors.description = "Description is required";
    }

    const amount = amountRef.current?.value;
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await addExpense({
        description: descriptionRef.current!.value.trim(),
        amount: parseFloat(amountRef.current!.value),
        budgetId: budgetIdRef.current!.value,
        id: "",
        date: dateRef.current?.value ? new Date(dateRef.current.value) : new Date()
      });
      
      handleClose();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      className="expense-modal"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="modal-content-wrapper">
          <div className="modal-header">
            <h2 className="modal-title">Add New Payment</h2>
            <button 
              className="close-button" 
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FileText className="input-icon" />
                Description
              </label>
              <div className="input-wrapper">
                <input
                  ref={descriptionRef}
                  type="text"
                  id="description"
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  placeholder="Enter payment description"
                  autoFocus
                />
                <AnimatePresence>
                  {errors.description && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="error-message"
                    >
                      <AlertCircle className="error-icon" />
                      {errors.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="amount" className="form-label">
                  <DollarSign className="input-icon" />
                  Amount
                </label>
                <div className="input-wrapper">
                  <input
                    ref={amountRef}
                    type="number"
                    id="amount"
                    className={`form-input ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <AnimatePresence>
                    {errors.amount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="error-message"
                      >
                        <AlertCircle className="error-icon" />
                        {errors.amount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="form-group flex-1">
                <label htmlFor="date" className="form-label">
                  <Calendar className="input-icon" />
                  Date
                </label>
                <input
                  ref={dateRef}
                  type="date"
                  id="date"
                  className="form-input"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budgetId" className="form-label">
                <Folder className="input-icon" />
                Assign to Debt
              </label>
              <select
                ref={budgetIdRef}
                id="budgetId"
                className="form-select"
                defaultValue={defaultBudgetId}
              >
                <option value={UNCATEGORIZED_BUDGET_ID}>Uncategorized</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Adding...
                  </>
                ) : (
                  'Add Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Modal>
  );
};

export default AddExpenseModal;