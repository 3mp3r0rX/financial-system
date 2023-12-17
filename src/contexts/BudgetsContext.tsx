"use client"

import  { ReactNode, useContext } from "react";
import  { FC } from "react";
import { v4 as uuidV4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";
import React from "react";


interface Budget {
  id: string;
  name: string;
  max: number;
}

interface Expense {
  date: any;
  id: string;
  description: string;
  amount: number;
  budgetId: string;
}

interface BudgetsContextProps {
  budgets: Budget[];
  expenses: Expense[];
  getBudgetExpenses: (budgetId: string) => Expense[];
  addExpense: (expense: Expense) => void;
  addBudget: (budget: Budget) => void;
  deleteBudget: (budget: Budget) => void;
  deleteExpense: (expense: Expense) => void;
}

const initialValue: BudgetsContextProps = {
  budgets: [],
  expenses: [],
  getBudgetExpenses: (budgetId: string) => [],
  addExpense: (expense: Expense) => {},
  addBudget: (budget: Budget) => {},
  deleteBudget: (budget: Budget) => {},
  deleteExpense: (expense: Expense) => {},
};

const BudgetsContext = React.createContext<BudgetsContextProps>(initialValue);

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

export function useBudgets() {
  return useContext(BudgetsContext);
}

export const BudgetsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);

  function getBudgetExpenses(budgetId: string) {
    return expenses.filter((expense: { budgetId: string; }) => expense.budgetId === budgetId);
  }
  function addExpense({ description, amount, budgetId }: Expense) {
    setExpenses((prevExpenses: Expense[]) => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
    });
  }
  function addBudget({ name, max }: Budget) {
    setBudgets((prevBudgets: any[]) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  }
  function deleteBudget({ id }: Budget) {
    setExpenses((prevExpenses: any[]) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId !== id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });

    setBudgets((prevBudgets: any[]) => {
      return prevBudgets.filter((budget) => budget.id !== id);
    });
  }
  function deleteExpense({ id }: Expense) {
    
    setExpenses((prevExpenses: any[]) => {
      return prevExpenses.filter((expense) => expense.id !== id);
    });
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};