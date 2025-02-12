import { postCryptoAsset } from "@/apis/crypto"
import { CryptoAssetFormData, CryptoHoldingSchema, FirestoreCryptoHoldingSchema } from "@/schema/cryptoHoldingSchema"
import { openErrorModal } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { CryptoWithPriceType } from "@/types/crypto"
import { isACalendarDate } from "@/utils/dates"
import { validateSchemaObject } from "@/utils/service"
import { CalendarDate } from "@nextui-org/react"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const initialState: CryptoAssetFormData = {
    purchaseDate: null,
    name: "",
    code: "",
    entryPrice: 0,
    quantity: 0,
    cost: 0,
    fee: 0,
    netCost: 0,
    isLiquidated: false
}

export const useCryptoAssetFormData = (cryptoList: CryptoWithPriceType[]) => {
    const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
    const [formData, setFormData] = useState<CryptoAssetFormData>(initialState)
    /**
     * nextUI DatePicker only accepts custom  CalendarDate.
     * assigning other types will return a typescript conversion type error
     * below state is only meant to show the DatePicker value without encountering errors
     * this will be parsed into a Date format that will be used in the formData
     */
    const [selectedPurchaseDate, setSelectedPurchaseDate] = useState<CalendarDate | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedPurchaseDate !== null) {
            const { year, month, day } = selectedPurchaseDate
            const finalDate = new Date(year, month - 1, day)

            setFormData((prevFormData) => ({
                ...prevFormData,
                purchaseDate: finalDate
            }))
        }
    }, [selectedPurchaseDate])

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: parseFloat(value)
        }))
        
    }, [cryptoList])

    const handleSelectionChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target

        const selected = cryptoList.find(crypto => crypto.id === value) || null

        if (selected !== null) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                code: selected.code,
                name: selected.name
            }))
        }
    }, [cryptoList])

    const handleDatePickerChange = useCallback((date: CalendarDate) => {
        if (!isACalendarDate(date)) {
            return 
        }

        return setSelectedPurchaseDate(date)
    }, [cryptoList])

    const handleFormSubmit = async(userUid: string) => {
        setIsSubmittingForm(true)

        try {
            const parsedData: FirestoreCryptoHoldingSchema = validateSchemaObject(CryptoHoldingSchema, formData)
            await postCryptoAsset(userUid, parsedData)
            dispatch(setNotificationMessage("New crypto asset have been added."))
            dispatch(openNotification())
            setFormData(initialState)
            
        } catch(error: any) {
            dispatch(openErrorModal({
                message: error.message || "Unable to add new asset.",
                code: 400
            }))
            
        } finally {
            setIsSubmittingForm(false)
        }
    }

    return {
        formData,
        isSubmittingForm,
        handleInputChange,
        handleSelectionChange,
        handleDatePickerChange,
        selectedPurchaseDate,
        handleFormSubmit
    }
}