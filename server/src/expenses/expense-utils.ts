import exp from "constants";
import { Expense } from "../types";
import { Request, Response } from "express";

export function createExpenseServer(req: Request, res: Response, expenses: Expense[]) {
    const { id, cost, description } = req.body;

    if (!description || !id || !cost) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const newExpense: Expense = {
        id: id,
        description,
        cost,
    };

    expenses.push(newExpense);
    res.status(201).send(newExpense);
}

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    
    const { id, cost, description } = req.params;

    if(!id) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const index = expenses.findIndex((expense) => expense.id === id);

    if(index < 0) {
        return res.status(404).send({error: "Couldn't find expense"});
    }
    
    const deletedExpense = expenses[index]
    expenses.splice(index, 1);
    
    res.status(200).send(deletedExpense);
}

export function getExpenses(req: Request, res: Response, expenses: Expense[]) {
    res.status(200).send({ "data": expenses });
}