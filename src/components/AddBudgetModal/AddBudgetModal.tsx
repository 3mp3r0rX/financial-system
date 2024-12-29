import React, { useRef, FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { useBudgets } from "../../contexts/BudgetsContext";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, User, AlertCircle } from "lucide-react";
import "./AddBudgetModal.css";

interface AddBudgetModalProps {
  show: boolean;
  handleClose: () => void;
}

interface ValidationErrors {
  name?: string;
  amount?: string;
}
const AddBudgetModal: FC<AddBudgetModalProps> = ({ show, handleClose }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const { addBudget } = useBudgets();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!nameRef.current?.value.trim()) {
      newErrors.name = "Name is required";
    } else if (nameRef.current.value.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const amount = maxRef.current?.value;
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
      await addBudget({
        name: nameRef.current!.value.trim(),
        max: parseFloat(maxRef.current!.value),
        id: ""
      });
      
      handleClose();
    } catch (error) {
      console.error("Error adding budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      className="budget-modal"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="modal-content-wrapper">
          <div className="modal-header">
            <h2 className="modal-title">Add New Debt</h2>
            <button 
              className="close-button" 
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User className="input-icon" />
                Debtor Name
              </label>
              <div className="input-wrapper">
                <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter debtor name"
                  autoFocus
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="error-message"
                    >
                      <AlertCircle className="error-icon" />
                      {errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                <DollarSign className="input-icon" />
                Debt Amount
              </label>
              <div className="input-wrapper">
                <input
                  ref={maxRef}
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
                  'Add Debt'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Modal>
  );
};

export default AddBudgetModal;