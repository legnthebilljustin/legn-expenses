import axios from "axios"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const AUTHORIZATION_KEY = "Authorization"


const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : ""

const api = axios.create({
    baseURL: API_URL
})

const setAuthToken = async(user: any) => {
    if (user) {
        const token = await user.getIdToken()
        api.defaults.headers.common[AUTHORIZATION_KEY] = `Bearer ${token}`
    } else {
        delete api.defaults.headers.common[AUTHORIZATION_KEY]
    }
}

// listen for firebase auth state changes and update token

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
    setAuthToken(user)
})

api.interceptors.request.use(async (config) => {
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
        const token = await user.getIdToken()
        config.headers[AUTHORIZATION_KEY] = `Bearer ${token}`
    }

    return config
}, (error) => Promise.reject(error))




api.interceptors.response.use(
    (response) => response.data.data,
    async (error) => {
        const status = error.status

        if (status === 401 && window.location.pathname !== "/login") {
            // signOut requires an instance of Firebase auth object to properly log the user out
            await signOut(getAuth())
            localStorage.clear()
            location.replace("/401")
        }

        if (status === 403) {
            window.location.replace("/403")
        }

        return Promise.reject(error)
    }
)

export default api