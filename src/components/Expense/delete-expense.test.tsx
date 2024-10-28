import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AppContext } from "../../context/AppContext";
import { MyBudgetTracker } from "../../views/MyBudgetTracker";
import { Expense } from "../../types/types";

describe("Expense Deletion", () => {
  const initialBudget = 1000;
  let expenses: Expense[] = [];
  const mockSetExpenses = jest.fn(newExpenses => (expenses = newExpenses));

  const renderWithProvider = (expenseList = expenses) =>
    render(
      <AppContext.Provider value={{ expenses: expenseList, setExpenses: mockSetExpenses, budget: initialBudget }}>
        <MyBudgetTracker />
      </AppContext.Provider>
    );

  beforeEach(() => (expenses = []));
  beforeAll(() => jest.spyOn(window, "alert").mockImplementation(() => {}));

  test("Add and delete an expense", async () => {
    renderWithProvider();
    await act(async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Test Expense" } });
      fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 50 } });
      fireEvent.click(screen.getByTestId("save-expense"));
    });

    const addedExpense = mockSetExpenses.mock.calls[0][0]([]);
    renderWithProvider(addedExpense);
    await act(async () => fireEvent.click(screen.getByTestId(addedExpense[0].id)));
    expect(mockSetExpenses.mock.calls[1][0]([])).toHaveLength(0);
  });

  test("Add two expenses, delete one", async () => {
    renderWithProvider();
    await act(async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "First" } });
      fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 50 } });
      fireEvent.click(screen.getByTestId("save-expense"));
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Second" } });
      fireEvent.change(screen.getByTestId("cost-input"), { target: { value: 100 } });
      fireEvent.click(screen.getByTestId("save-expense"));
    });

    const updatedExpenses = mockSetExpenses.mock.calls[1][0]([]);
    renderWithProvider(updatedExpenses);
    await act(async () => fireEvent.click(screen.getByTestId(updatedExpenses[0].id)));
    expect(mockSetExpenses.mock.calls[2][0]([])).toEqual([updatedExpenses[1]]);
  });
});
