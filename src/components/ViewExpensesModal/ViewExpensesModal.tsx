import { Modal, Button, Stack } from "react-bootstrap";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../../contexts/BudgetsContext";
import { currencyFormatter } from "../../utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiX } from "react-icons/fi";
import "./ViewExpensesModal.css";

interface ViewExpensesModalProps {
  budgetId: string | null;
  handleClose: () => void;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
}
export default function ViewExpensesModal({ budgetId, handleClose }: ViewExpensesModalProps) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets();
  const expenses = budgetId ? getBudgetExpenses(budgetId) : [];
  const budget = UNCATEGORIZED_BUDGET_ID === budgetId
    ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
    : budgets.find(b => b.id === budgetId);

  const [timestamps, setTimestamps] = useState<{ [key: string]: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTimestamps = localStorage.getItem('timestamps');
      if (savedTimestamps) {
        setTimestamps(JSON.parse(savedTimestamps));
      }
    }
  }, []);

  useEffect(() => {
    const initialTimestamps = expenses.reduce((acc, expense) => {
      if (!timestamps[expense.id]) {
        acc[expense.id] = new Date().toLocaleString();
      }
      return acc;
    }, {} as { [key: string]: string });

    if (Object.keys(initialTimestamps).length > 0) {
      const newTimestamps = { ...timestamps, ...initialTimestamps };
      setTimestamps(newTimestamps);
      if (typeof window !== "undefined") {
        localStorage.setItem('timestamps', JSON.stringify(newTimestamps));
      }
    }
  }, [expenses, timestamps]);

  const handleDeleteExpense = (expense: Expense) => {
    deleteExpense(expense);
    const newTimestamps = { ...timestamps };
    delete newTimestamps[expense.id];
    setTimestamps(newTimestamps);
    setDeleteConfirm(null);
    if (typeof window !== "undefined") {
      localStorage.setItem('timestamps', JSON.stringify(newTimestamps));
    }
  };

  const handleDeleteBudget = () => {
    if (budget) {
      deleteBudget({ ...budget, max: 0 });
      handleClose();
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };
  return (
    <Modal 
      show={budgetId != null} 
      onHide={handleClose}
      className="expenses-modal"
      size="lg"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="w-100">
          <Stack direction="horizontal" gap={3} className="align-items-center">
            <div className="modal-title">
              <h2 className="mb-0">{budget?.name}</h2>
              <p className="text-muted mb-0">
                Total: {currencyFormatter.format(getTotalExpenses())}
              </p>
            </div>
            {budgetId !== UNCATEGORIZED_BUDGET_ID && (
              <Button 
                onClick={handleDeleteBudget} 
                variant="outline-danger"
                className="ms-auto delete-budget-btn"
              >
                <FiTrash2 /> Delete Budget
              </Button>
            )}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <AnimatePresence>
          {expenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted py-5"
            >
              No expenses to show
            </motion.div>
          ) : (
            <Stack direction="vertical" gap={2}>
              {expenses.map(expense => (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="expense-item"
                >
                  <Stack direction="horizontal" gap={3} className="align-items-center p-3">
                    <div className="expense-details">
                      <h4 className="mb-0">{expense.description}</h4>
                      <small className="text-muted">{timestamps[expense.id]}</small>
                    </div>
                    <div className="amount ms-auto">
                      {currencyFormatter.format(expense.amount)}
                    </div>
                    {deleteConfirm === expense.id ? (
                      <div className="delete-confirm">
                        <Button
                          onClick={() => handleDeleteExpense(expense)}
                          size="sm"
                          variant="danger"
                          className="me-2"
                        >
                          Confirm
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(null)}
                          size="sm"
                          variant="outline-secondary"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setDeleteConfirm(expense.id)}
                        size="sm"
                        variant="link"
                        className="delete-btn"
                      >
                        <FiX size={20} />
                      </Button>
                    )}
                  </Stack>
                </motion.div>
              ))}
            </Stack>
          )}
        </AnimatePresence>
      </Modal.Body>
    </Modal>
  );
}
