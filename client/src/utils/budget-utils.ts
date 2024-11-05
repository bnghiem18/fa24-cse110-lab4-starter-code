import { API_BASE_URL } from "../constants/constants";

// Function to get budget from the backend. Method: GET
export const fetchBudget = async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/budget`);
    if (!response.ok) {
    	throw new Error('Failed to fetch budget');
	}

    let budget = response.json().then((jsonResponse) => {
    	console.log("data in fetchBudget", jsonResponse);
    	return jsonResponse.data;
	});

    console.log("response in fetchBudget", budget);
	return budget;
};

export const updateBudget = async (budget: number): Promise<number> => {
    try {
        const response = await fetch("/api/budget", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newAmount: budget }),
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error("Failed to update the budget.");
        }

        // Parse and return the updated budget amount
        const data = await response.json();
        return data.amount;
    } catch (error) {
        console.error("Error updating budget:", error);
        throw error;
    }
};