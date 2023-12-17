"use client"

import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddBudgetModal from "../components/AddBudgetModal";
import AddExpenseModal from "../components/AddExpenseModal";
import ViewExpensesModal from "../components/ViewExpensesModal";
import BudgetCard from "../components/BudgetCard";
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
      setTimeLabel(new Date().toLocaleTimeString());
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
    <>
      <Container className="mb-2 text-2xl font-bold my-4 text-sky-500">
      <div style={{ position: "fixed", top: 5, left: 470 }}>{timeLabel}</div>
      <br />
        <Stack direction="horizontal" gap={2} className="mb-4">
          <h1 className="me-auto ">Financial System</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add In Debt
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => openAddExpenseModal("")}
          >
            Add Payment
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
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
      <p className="text-center align-bottom">Created by Majed El-Naser</p>
    </>
  );
}