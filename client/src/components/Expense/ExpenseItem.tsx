import { Expense } from "../../types/types";
import {AppContext} from "../../context/AppContext"
import React, { useContext } from "react";
import { deleteExpense } from "../../utils/expense-utils";


const ExpenseItem = (currentExpense: Expense) => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext); 
  
  const handleDeleteExpense = (currentExpense: Expense) => {
    // Exercise: Remove expense from expenses context array
    const updatedExpenses = expenses.filter(expense => expense.id !== currentExpense.id);
    deleteExpense(currentExpense.id);
    // Update the expenses state in context
    setExpenses(updatedExpenses);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div   data-testid=  "name-input"> {currentExpense.description}</div>
      <div>${currentExpense.cost}</div>
      <div>
        <button data-testid={`delete-${currentExpense.description}`} onClick={() => handleDeleteExpense(currentExpense)}>x</button>
      </div>
    </li>
  );
};

export default ExpenseItem;
