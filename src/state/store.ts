import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice"
import errorReducer from "./errorSlice"

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        error: errorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>