import { CryptoWithPriceType } from "@/types/crypto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CryptoStateType = {
    cryptoList: CryptoWithPriceType[]
}

const initialState: CryptoStateType = {
    cryptoList: []
}

const cryptoSlice = createSlice({
    name: "crypto",
    initialState,
    reducers: {
        setCryptoList: (state, action: PayloadAction<CryptoWithPriceType[]>) => {
            if (action.payload.length > 0) {
                state.cryptoList = action.payload
            }
        },
        resetCryptoList: state => {
            state.cryptoList = []
        }
    }
})

export const { setCryptoList, resetCryptoList } = cryptoSlice.actions
export default cryptoSlice.reducer