"use client"

import { Button, Stack } from "react-bootstrap";
import { 
  PlusCircle, 
  Wallet, 
  CreditCard, 
  Clock, 
  ChartPie 
} from "lucide-react";
import Container from "react-bootstrap/Container";
import AddBudgetModal from "../components/AddBudgetModal/AddBudgetModal";
import AddExpenseModal from "../components/AddExpenseModal/AddExpenseModal";
import ViewExpensesModal from "../components/ViewExpensesModal/ViewExpensesModal";
import BudgetCard from "../components/BudgetCard/BudgetCard";
import UncategorizedBudgetCard from "../components/UncategorizedBudgetCard";
import TotalBudgetCard from "../components/TotalBudgetCard";
import { useEffect, useState } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext"

export default function Home() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<string | null>(null);
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState<string | undefined>();
  const { budgets, getBudgetExpenses } = useBudgets();
  const [timeLabel, setTimeLabel] = useState<string | undefined>();
  
  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setTimeLabel(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);

    return () => {
      clearInterval(timeIntervalId);
    };
  }, []);

  function openAddExpenseModal(budgetId: string | undefined) {
    setShowAddExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container className="py-8 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Wallet className="text-blue-500" />
              Financial System
            </h1>
            <p className="text-gray-500 mt-2">Track your budgets and expenses</p>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 bg-white shadow-md rounded-lg px-4 py-2">
            <Clock className="text-blue-500" />
            <span className="font-semibold text-gray-700">{timeLabel}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setShowAddBudgetModal(true)}
          >
            <PlusCircle /> Add Budget
          </Button>
          <Button 
            variant="outline-primary" 
            className="flex items-center gap-2"
            onClick={() => openAddExpenseModal("")}
          >
            <CreditCard /> Add Payment
          </Button>
        </div>

        {/* Budget Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {budgets.map((budget) => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount,
              0
            );
            return (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                onViewExpensesClick={() =>
                  setViewExpensesModalBudgetId(budget.id)
                }
                date={new Date()}
              />
            );
          })}
          
          <UncategorizedBudgetCard
            onAddExpenseClick={() => openAddExpenseModal("")}
            onViewExpensesClick={() =>
              setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
            }
          />
          <TotalBudgetCard />
        </div>
      </Container>

      {/* Modals */}
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId || ""}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId(null)}
      />

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-100">
        <p className="text-gray-600 flex items-center justify-center gap-2">
          Created with <ChartPie className="text-blue-500" /> by Majed El-Naser
        </p>
      </footer>
    </div>
  );
}
