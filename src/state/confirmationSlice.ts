import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const CONFIRMATION_TYPES = {
    ACTION: "action",
    DELETE: "delete"
}

type ConfirmationState = {
    heading?: string
    message: string
    isOpen: boolean
    type: null | string
    actionConfirmed: boolean
}

export type OpenConfirmationActionPayload = {
    type: string
    message: string
    heading? :string
}

const initialState: ConfirmationState = {
    heading: "",
    message: "",
    isOpen: false,
    type: null,
    actionConfirmed: false
}

const confirmationSlice = createSlice({
    name: "confirmation",
    initialState,
    reducers: {
        openConfirmationModal: (state, action: PayloadAction<OpenConfirmationActionPayload>) => {
            state.type = action.payload?.type
            state.message = action.payload?.message
            state.heading = action.payload?.heading
            state.isOpen = true
        },
        closeConfirmationModal: state => {
            state.type = null
            state.actionConfirmed = false
            state.isOpen = false
        },
        confirmAction: state => {
            state.actionConfirmed = true
        }
    }
})

export const { openConfirmationModal, closeConfirmationModal, confirmAction } = confirmationSlice.actions

export default confirmationSlice.reducer