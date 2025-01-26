
import { NotificationModal, NavigationBar, ConfirmActionModal } from "./components"
import ErrorModal from "./components/shared/ErrorModal"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function App() {
	const navigate = useNavigate()

	useEffect(() => {
		const uid = localStorage.getItem("uid")
        
        if (uid) {
            navigate("/dashboard", { replace: true })
        }
		else {
			navigate("/login", { replace: true })
		}
	}, [])
	return (
		<main className="dark text-foreground">
			<NavigationBar />
			<div className="p-4">
				<Outlet />
			</div>

			<ConfirmActionModal />
			<NotificationModal />
			<ErrorModal />
		</main>
			
	)
}

export default App
