import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ErrorState = {
    message: string | undefined
    code: number | undefined
    isOpen: boolean
}

export type ErrorPayloadType = {
    message: string
    code: number
}

const initialState: ErrorState = {
    message: undefined,
    code: undefined,
    isOpen: false
}

const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        openErrorModal: (state, action: PayloadAction<ErrorPayloadType>) => {
            const { message, code } = action.payload

            if (!message || !code) {
                throw new Error("Cannot display error notification due to missing keys.")
            }

            state.message = message
            state.code = code
            state.isOpen = true
        },
        closeErrorModal: state => {
            state.isOpen = false
            state.message = undefined
            state.code = undefined
        },
    }
})

export const { openErrorModal, closeErrorModal } = errorSlice.actions
export default errorSlice.reducer