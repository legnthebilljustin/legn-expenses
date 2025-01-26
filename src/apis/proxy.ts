import axios from "axios";

export const fetchCryptoPricesAPI = async(cryptoCodes: string[]) => {
    if (cryptoCodes.length === 0) {
        throw new Error(JSON.stringify({ message: "Need atleast one symbol to use this method.", code: 400 }))
    }

    const symbols = cryptoCodes.join(',')
    const url = `https://legn-backend-proxy.onrender.com/proxy/get-crypto-price?symbols=${symbols}`
    
    try {
        const response = await axios.get(url)
        
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(JSON.stringify({ message: error.response.data, code: error.response.status }));
            } else {
                throw new Error(JSON.stringify({ message: "Unable to get crypto prices.", code: 422 }));
            }
        }

        throw new Error(JSON.stringify({ message: "An unexpected error occurred.", code: 500 }));
    }
} 