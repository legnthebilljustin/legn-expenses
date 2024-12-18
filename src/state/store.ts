import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import notificationReducer from "./notificationSlice"
import errorReducer from "./errorSlice"
import confirmationReducer from './confirmationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notification: notificationReducer,
        error: errorReducer,
        confirmation: confirmationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>