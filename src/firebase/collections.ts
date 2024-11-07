type Environment = "development" | "production"

export const COLLECTIONS = {
    production: {
        EXPENSES: "expenses",
        OVERVIEW: "overview",
        CARDS: "cards"
    },
    development: {
        EXPENSES: "expenses_testing",
        OVERVIEW: "overview_testing",
        CARDS: "cards"
    }
}

const env = (process.env.NODE_ENV as Environment) || "development"

export default COLLECTIONS[env]
