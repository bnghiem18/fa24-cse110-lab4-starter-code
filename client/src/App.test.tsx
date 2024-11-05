import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AppProvider } from './context/AppContext';


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/My Budget Planner/i);
  expect(linkElement).toBeInTheDocument();
});

describe('Main Tests', () => {

  test('Adding multiple expenses', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test1" } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '50' } });
    fireEvent.click(screen.getByText(/save/i));
    const firstCost = screen.getByText(/spent so far: \$50/i);
    const firstRemaining = screen.getByText(/Remaining: \$950/i);
    expect(firstCost).toBeInTheDocument();
    expect(firstRemaining).toBeInTheDocument();


    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test2' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '100' } });
    fireEvent.click(screen.getByText(/save/i));
    const secondCost = screen.getByText(/spent so far: \$150/i);
    const secondRemaining = screen.getByText(/Remaining: \$850/i);
    expect(secondCost).toBeInTheDocument();
    expect(secondRemaining).toBeInTheDocument();

  });

  test('Deleting an Expense', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
  
    // Add expense
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test3' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '150' } });
    fireEvent.click(screen.getByText(/save/i));
    const thirdCost = screen.getByText(/spent so far: \$150/i);
    const thirdRemaining = screen.getByText(/Remaining: \$850/i);
    expect(thirdCost).toBeInTheDocument();
    expect(thirdRemaining).toBeInTheDocument();

    //formula verification before deletion
    const currentRemainingAdd = await screen.findByText(/Remaining: \$850/i); 
    const currentSpentAdd = screen.getByText(/Spent so far: \$150/i);
  
    expect(currentRemainingAdd).toBeInTheDocument();
    expect(currentSpentAdd).toBeInTheDocument();

   
    const remainingTextAdd = currentRemainingAdd.textContent; // "Remaining: $850"
    if (remainingTextAdd !== null) {
      const remainingNumber = parseFloat(remainingTextAdd.replace(/[^\d.-]/g, ''));
      expect(remainingNumber).toBe(850);
    } else {
      throw new Error("remainingTextDelete is null");
    }
    const spentTextAdd = currentSpentAdd.textContent;         // "Spent so far: $150" 
    if (spentTextAdd !== null) {
      const spentNumber = parseFloat(spentTextAdd.replace(/[^\d.-]/g, ''));
      expect(spentNumber).toBe(150);
  } else {
      throw new Error("spentText is null");
  }



    fireEvent.click(screen.getByTestId('delete-Test3'));

  
    expect(screen.queryByText('Test3')).not.toBeInTheDocument();
    const originalBalance = screen.getByText(/Remaining: \$1000/i);
    expect(originalBalance).toBeInTheDocument();


    //formula verification after deletion
    const currentRemainingDelete = await screen.findByText(/Remaining: \$1000/i); 
    const currentSpentDelete = screen.getByText(/Spent so far: \$0/i);
  
    expect(currentRemainingDelete).toBeInTheDocument();
    expect(currentSpentDelete).toBeInTheDocument();

   
    const remainingTextDelete = currentRemainingDelete.textContent; // "Remaining: $1000"
    if (remainingTextDelete !== null) {
      const remainingNumber = parseFloat(remainingTextDelete.replace(/[^\d.-]/g, ''));
      expect(remainingNumber).toBe(1000);
    } else {
      throw new Error("remainingTextDelete is null");
    }

    const spentTextDelete = currentSpentDelete.textContent;
    if (spentTextDelete !== null) {
        const spentNumber = parseFloat(spentTextDelete.replace(/[^\d.-]/g, ''));
        expect(spentNumber).toBe(0);
    } else {
        throw new Error("spentText is null");
    }

  });

  test('Budget Balance Verification', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
  
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test1" } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '50' } });
    fireEvent.click(screen.getByText(/save/i));
    const firstCost = screen.getByText(/spent so far: \$50/i);
    const firstRemaining = screen.getByText(/Remaining: \$950/i);
    expect(firstCost).toBeInTheDocument();
    expect(firstRemaining).toBeInTheDocument();


    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test2' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '100' } });
    fireEvent.click(screen.getByText(/save/i));
    const secondCost = screen.getByText(/spent so far: \$150/i);
    const secondRemaining = screen.getByText(/Remaining: \$850/i);
    expect(secondCost).toBeInTheDocument();
    expect(secondRemaining).toBeInTheDocument();
  
    const startBudget = 1000;
    const expectedSpent = 150; 
    const expectedRemaining = 850; 

    //formula verification
    const currentRemaining = await screen.findByText(/Remaining: \$850/i); 
    const currentSpent = screen.getByText(/Spent so far: \$150/i);
  
    expect(currentRemaining).toBeInTheDocument();
    expect(currentSpent).toBeInTheDocument();

   
    const remainingText = currentRemaining.textContent; // "Remaining: $850"
    
    if (remainingText !== null) {
      const remainingNumber = parseFloat(remainingText.replace(/[^\d.-]/g, ''));
      expect(remainingNumber).toBe(800);
    } else {
      throw new Error("remainingTextDelete is null");
    }
    
    const spentText = currentSpent.textContent;         // "Spent so far: $150" 
    if (spentText !== null) {
      const spentNumber = parseFloat(spentText.replace(/[^\d.-]/g, ''));
      expect(spentNumber).toBe(150);
  } else {
      throw new Error("spentText is null");
  }
  });
  

  test('Budget Balance Exceeded Verification', async () => {
    window.alert = jest.fn();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test4' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '10000' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(window.alert).toHaveBeenCalledWith("You have exceeded your budget!");
  });
});