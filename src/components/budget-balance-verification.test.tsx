import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AppContext } from "../context/AppContext";
import { Expense } from "../types/types";
import { MyBudgetTracker } from "../views/MyBudgetTracker";

// Test suite for verifying budget calculation functionality
describe("Thorough budget calculation checks", () => {
    let expenses: Expense[] = [];
    const mockSetExpenses = jest.fn((newExpensesOrCallback) => {
        if (typeof newExpensesOrCallback === 'function') {
            expenses = newExpensesOrCallback(expenses);
        } else {
            expenses = newExpensesOrCallback;
        }
    });
    const BUDGET_START = 1000;

    // Function to render the main component with AppContext
    const renderApp = () => {
        return render(
            <AppContext.Provider
                value={{
                    expenses,
                    setExpenses: mockSetExpenses,
                    budget: BUDGET_START
                }}
            >
                <MyBudgetTracker />
            </AppContext.Provider>
        );
    };

    beforeEach(() => {
        expenses = [];
        mockSetExpenses.mockClear();
    });

    // Suppress alert popups in tests
    beforeAll(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    test("Add and remove one expense", async () => {
        const { rerender } = renderApp();

        // Add a new expense
        await act(async () => {
            fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test Expense" } });
            fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 50 } });
            fireEvent.click(screen.getByTestId("save-expense"));
        });

        // Update component after adding expense
        let updatedExpenses = mockSetExpenses.mock.calls[0][0]([]);
        rerender(
            <AppContext.Provider
                value={{
                    expenses: updatedExpenses,
                    setExpenses: mockSetExpenses,
                    budget: BUDGET_START
                }}
            >
                <MyBudgetTracker />
            </AppContext.Provider>
        );

        // Verify the new expense appears in the expenses list and DOM
        expect(updatedExpenses).toEqual(
            expect.arrayContaining([
                expect.objectContaining<Expense>({
                    id: expect.any(String),
                    name: "Test Expense",
                    cost: 50
                }),
            ])
        );
        const id = updatedExpenses[0].id;
        expect(screen.getByText("Test Expense")).toBeInTheDocument();
        expect(screen.getByText("$50")).toBeInTheDocument();
        expect(screen.getByTestId(id)).toBeInTheDocument();

        // Remove the expense
        await act(async () => {
            fireEvent.click(screen.getByTestId(id));
        });
        updatedExpenses = mockSetExpenses.mock.calls[1][0]([]);

        // Confirm expense is removed from list and DOM
        expect(updatedExpenses.length).toBe(0);
        expect(screen.queryByText("Test Expense")).not.toBeInTheDocument();
        expect(screen.queryByText("$50")).not.toBeInTheDocument();
    });

    test("Add two expenses, remove one", async () => {
        const { rerender } = renderApp();

        // Add first expense
        await act(async () => {
            fireEvent.change(screen.getByTestId("name-input"), { target: { value: "First test" } });
            fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 50 } });
            fireEvent.click(screen.getByTestId("save-expense"));
        });
        await waitFor(() => expect(mockSetExpenses).toHaveBeenCalled());
        let firstExpenses = mockSetExpenses.mock.calls[0][0]([]);

        // Rerender with first expense
        rerender(
            <AppContext.Provider
                value={{
                    expenses: firstExpenses,
                    setExpenses: mockSetExpenses,
                    budget: BUDGET_START
                }}
            >
                <MyBudgetTracker />
            </AppContext.Provider>
        );

        // Add second expense
        await act(async () => {
            fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Second test" } });
            fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 100 } });
            fireEvent.click(screen.getByTestId("save-expense"));
        });
        await waitFor(() => expect(mockSetExpenses).toHaveBeenCalledTimes(2));
        let finalExpenses = mockSetExpenses.mock.calls[1][0](firstExpenses);

        // Verify both expenses exist
        rerender(
            <AppContext.Provider
                value={{
                    expenses: finalExpenses,
                    setExpenses: mockSetExpenses,
                    budget: BUDGET_START
                }}
            >
                <MyBudgetTracker />
            </AppContext.Provider>
        );
        expect(finalExpenses).toEqual(
            expect.arrayContaining([
                expect.objectContaining<Expense>({ id: expect.any(String), name: "First test", cost: 50 }),
                expect.objectContaining<Expense>({ id: expect.any(String), name: "Second test", cost: 100 }),
            ])
        );
        expect(screen.getByText("First test")).toBeInTheDocument();
        expect(screen.getByText("$50")).toBeInTheDocument();
        expect(screen.getByText("Second test")).toBeInTheDocument();
        expect(screen.getByText("$100")).toBeInTheDocument();

        // Remove first expense
        const firstExpenseId = finalExpenses[0].id;
        await act(async () => {
            fireEvent.click(screen.getByTestId(firstExpenseId));
        });
        const afterRemovalExpenses = mockSetExpenses.mock.calls[2][0](finalExpenses);

        // Verify only second expense remains
        rerender(
            <AppContext.Provider
                value={{
                    expenses: afterRemovalExpenses,
                    setExpenses: mockSetExpenses,
                    budget: BUDGET_START
                }}
            >
                <MyBudgetTracker />
            </AppContext.Provider>
        );
        expect(afterRemovalExpenses.length).toBe(1);
        expect(afterRemovalExpenses).toEqual(
            expect.arrayContaining([
                expect.objectContaining<Expense>({ id: expect.any(String), name: "Second test", cost: 100 }),
            ])
        );
        expect(screen.queryByText("First test")).not.toBeInTheDocument();
        expect(screen.getByText("Second test")).toBeInTheDocument();
        expect(screen.getByText("$100")).toBeInTheDocument();
    });
});
