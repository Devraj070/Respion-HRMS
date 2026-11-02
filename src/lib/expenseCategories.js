// Expense categories and their sub categories (shared by UI and API)
export const EXPENSE_CATEGORIES = {
    travel: {
        label: "Travel",
        subCategories: ["Bus", "Train", "Flight", "Taxi / Cab", "Fuel", "Toll & Parking"],
    },
    food: {
        label: "Food & Dining",
        subCategories: ["Breakfast", "Lunch", "Dinner", "Snacks & Tea"],
    },
    office: {
        label: "Office Supplies",
        subCategories: ["Stationery", "Printing", "Equipment", "Courier"],
    },
    client: {
        label: "Client Meeting",
        subCategories: ["Client Lunch", "Client Gift", "Travel to Client"],
    },
    other: {
        label: "Other",
        subCategories: [],
    },
};

export const getSubCategories = (category) => EXPENSE_CATEGORIES[category]?.subCategories || [];
