import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type NotificationState = {
    message: string
    isOpen: boolean
}

const initialState: NotificationState = {
    message: "",
    isOpen: false
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        openNotification: state => {
            state.isOpen = true
        },
        closeNotification: state => {
            state.isOpen = false
            state.message = ""
        },
        setNotificationMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        } 
    }
})

export const { openNotification, closeNotification, setNotificationMessage } = notificationSlice.actions

export default notificationSlice.reducer