import React, { useState, useContext } from "react";
import {AppContext} from "../../context/AppContext"
import { createExpense } from "../../utils/expense-utils";

const AddExpenseForm = () => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext); 

  const [name, setName] = useState("");
  const [cost, setCost] = useState<number | "">(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create new expense object
    const newExpense = {
      id: Math.random().toString(), // Generate a unique ID
      description: name,
      cost: Number(cost), // Convert cost to number
    };

    createExpense(newExpense);

    // Add the new expense to the existing expenses array
    setExpenses([...expenses, newExpense]);

    // Clear the form fields
    setName("");
    setCost(0);

    // Exercise: Add add new expense to expenses context array
    
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            value={name}
            data-testid=  "name-input"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="text"
            className="form-control"
            id="cost"
            data-testid=  "cost-input"
            value={cost}
            onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : "")}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3" data-testid = "save-expense"> 
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;
