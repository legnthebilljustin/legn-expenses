import { NotificationModal, NavigationBar } from "./components"
import ErrorModal from "./components/shared/ErrorModal"
import { Outlet } from "react-router-dom"

function App() {

	return (
		<main className="dark text-foreground">
			<NavigationBar />
			<div className="p-4">
				<Outlet />
			</div>

			<NotificationModal />
			<ErrorModal />
		</main>
			
	)
}

export default App
