import { useBudgets } from "../contexts/BudgetsContext";

interface Expense {
  amount: number;

}

interface Budget {
  max: number;
 
}

export default function TotalBudgetCard() {
  const { expenses, budgets } = useBudgets();
  const amount = expenses.reduce((total: number, expense: Expense) => total + expense.amount, 0);
  const max = budgets.reduce((total: number, budget: Budget) => total + budget.max, 0);
  if (max === 0) return null;

}