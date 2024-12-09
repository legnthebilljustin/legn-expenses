import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
    uid: string | null
}

const STORAGE_KEY = {
    UID: "uid"
}

const initialState: AuthState = {
    uid: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUid(state, action: PayloadAction<string>) {
            state.uid = action.payload
            localStorage.setItem(STORAGE_KEY.UID, action.payload)
        },
        clearUser(state) {
            state.uid = null
            localStorage.clear()
        }
    }
})

export const { setUid, clearUser } = authSlice.actions

export default authSlice.reducer