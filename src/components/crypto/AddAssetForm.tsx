import { CRYPTO_ASSET_KEYS } from "@/constants/keys";
import { useCryptoAssetFormData } from "@/hooks";
import { openErrorModal } from "@/state/errorSlice";
import { RootState } from "@/state/store";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";

export default function AddAssetForm() {
    const { cryptoList } = useSelector((state: RootState) => state.crypto)
    const { uid } = useSelector((state: RootState) => state.auth)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const dispatch = useDispatch()

    const {
        isSubmittingForm,
        formData,
        handleInputChange,
        handleSelectionChange,
        handleDatePickerChange,
        selectedPurchaseDate,
        handleFormSubmit
    } = useCryptoAssetFormData(cryptoList)


    const handleSubmit = () => {
        if (uid && typeof uid === "string") {
            handleFormSubmit(uid)
            
        } else {
            dispatch(openErrorModal({
                message: "Cannot process asset submission due to invalid user id.",
                code: 400
            }))
            
        }
    }

    return (
        <>
            <Button onPress={onOpen} size="sm"
                color="primary"
                startContent={<i className='bx bxs-coin' />}
            >
                Add Asset
            </Button>
            <Modal hideCloseButton size="md" className="dark" isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="align-center">Add New Crypto Asset</ModalHeader>
                            <ModalBody>
                                <Select label="Select Asset"
                                    placeholder="Select asset..."
                                    onChange={handleSelectionChange}
                                    isDisabled={isSubmittingForm}
                                >
                                    {cryptoList.map((item) => (
                                        <SelectItem key={item.id} value={item.code} className="truncate">
                                            {item.code + " - " + item.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    
                                    <InputField name={CRYPTO_ASSET_KEYS.ENTRY_PRICE} 
                                        label="Entry Price (USD)"
                                        value={formData.entryPrice.toString()}
                                        onInputChange={handleInputChange}
                                        withSymbol={true} isDisabled={isSubmittingForm}
                                    />
                                    <InputField name={CRYPTO_ASSET_KEYS.QUANTITY} 
                                        label="Quantity"
                                        value={formData.quantity.toString()}
                                        onInputChange={handleInputChange}
                                        withSymbol={false} isDisabled={isSubmittingForm}
                                    />
                                    <InputField name={CRYPTO_ASSET_KEYS.COST} 
                                        label="Cost (USD)"
                                        value={formData.cost.toString()}
                                        onInputChange={handleInputChange}
                                        withSymbol={true} isDisabled={isSubmittingForm}
                                    />
                                    <InputField name={CRYPTO_ASSET_KEYS.FEE} 
                                        label="Fee (USD)"
                                        value={formData.fee.toString()}
                                        onInputChange={handleInputChange}
                                        withSymbol={true} isDisabled={isSubmittingForm}
                                    />
                                    <InputField name={CRYPTO_ASSET_KEYS.NET_COST} 
                                        label="Net Cost (USD)"
                                        value={formData.netCost.toString()}
                                        onInputChange={handleInputChange}
                                        withSymbol={true} isDisabled={isSubmittingForm}
                                    />
                                    <DatePicker label="Purchase Date" 
                                        value={selectedPurchaseDate}
                                        onChange={handleDatePickerChange}
                                        name={CRYPTO_ASSET_KEYS.PURCHASE_DATE}
                                        isDisabled={isSubmittingForm}
                                    />
                                </div>
                                
                            </ModalBody>
                            <ModalFooter>
                                <Button size="sm" color="danger" variant="light"        
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                    <Button size="sm" color="primary"
                                        isDisabled={isSubmittingForm}
                                        onPress={handleSubmit}
                                    >
                                        Add Asset
                                    </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

type CustomInputFieldType = {
    name: string
    label: string
    value: string
    onInputChange: Function
    withSymbol: boolean
    isDisabled: boolean
}

function InputField({ name, label, value, withSymbol, onInputChange, isDisabled }: CustomInputFieldType) {
    return (
        <Input isRequired
            type="number"
            startContent={ 
                withSymbol && <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            name={name}
            label={label}
            className="mb-2"
            value={value}
            placeholder="Enter value..."
            onChange={(event) => onInputChange(event)}
            isDisabled={isDisabled}
        />
    )
}