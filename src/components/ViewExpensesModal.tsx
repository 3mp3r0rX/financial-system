import { Modal, Button, Stack } from "react-bootstrap";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext";
import { currencyFormatter } from "../utils";
import { useState, useEffect } from "react";


interface ViewExpensesModalProps {
  budgetId: string | null;
  handleClose: () => void;
}

export default function ViewExpensesModal({ budgetId, handleClose }: ViewExpensesModalProps) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets();
  const expenses = budgetId ? getBudgetExpenses(budgetId) : [];
  const budget = UNCATEGORIZED_BUDGET_ID === budgetId
    ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
    : budgets.find(b => b.id === budgetId);

  const [timestamps, setTimestamps] = useState<{ [key: string]: string }>(() => {
    const savedTimestamps = localStorage.getItem('timestamps');
    return savedTimestamps ? JSON.parse(savedTimestamps) : {};
  });

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
      localStorage.setItem('timestamps', JSON.stringify(newTimestamps));
    }
  }, [expenses, timestamps]);

  const handleDeleteExpense = (expense: any) => {
    deleteExpense(expense);
    const newTimestamps = { ...timestamps };
    delete newTimestamps[expense.id];
    setTimestamps(newTimestamps);
    localStorage.setItem('timestamps', JSON.stringify(newTimestamps));
  };

  const handleDeleteBudget = () => {
    if (budget) {
      deleteBudget({ ...budget, max: 0 });
      handleClose();
    }
  };

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap={2}>
            <div>Payments - {budget?.name}</div>
            {budgetId !== UNCATEGORIZED_BUDGET_ID && (
              <Button onClick={handleDeleteBudget} variant="outline-danger">
                Delete
              </Button>
            )}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap={3}>
          {expenses.map(expense => (
            <Stack direction="horizontal" gap={2} key={expense.id}>
              <div className="me-auto fs-4">{expense.description}</div>
              <div className="fs-5">
                {currencyFormatter.format(expense.amount)}
              </div>
              <div className="fs-6 text-muted">
                {timestamps[expense.id]}
              </div>
              <Button
                onClick={() => handleDeleteExpense(expense)}
                size="sm"
                variant="outline-danger"
              >
                X
              </Button>
            </Stack>
          ))}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
