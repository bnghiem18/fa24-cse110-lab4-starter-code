import { Response } from 'express';

// Function to get the budget
export function getBudget(res: Response, budget: number) {
    res.status(200).send({ "data": budget });
}

// Function to update the budget
export function updateBudget(res: Response, body: any, budget: { amount: number }) {
    try {
        // Extract the new budget amount from the request body
        const { newAmount } = body;

        // Validate that newAmount is a positive number
        if (typeof newAmount !== "number" || newAmount < 0) {
            res.status(400).json({ error: "Invalid budget amount." });
            return;
        }

        // Update the budget amount
        budget.amount = newAmount;

        // Respond with the updated budget amount
        res.status(200).json({ amount: budget.amount });
    } catch (error) {
        // Send a 500 status code if an unexpected error occurs
        res.status(500).json({ error: "An error occurred while updating the budget." });
    }
}
