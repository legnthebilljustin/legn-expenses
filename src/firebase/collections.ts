type Environment = "development" | "production"

export const COLLECTIONS = {
    production: {
        EXPENSES: "expenses",
        OVERVIEW: "overview",
        CARDS: "cards",
        USERS: "users"
    },
    development: {
        EXPENSES: "expenses_testing",
        OVERVIEW: "overview_testing",
        CARDS: "cards",
        USERS: "users"
    }
}

const env = (process.env.NODE_ENV as Environment) || "development"

export default COLLECTIONS[env]
