type Environment = "development" | "production"

export const COLLECTIONS = {
    production: {
        EXPENSES: "expenses",
        OVERVIEW: "overview"
    },
    development: {
        EXPENSES: "expenses_testing",
        OVERVIEW: "overview_testing"
    }
}

const env = (process.env.NODE_ENV as Environment) || "development"

export default COLLECTIONS[env]
