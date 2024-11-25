import { useState } from "react"
import { NotificationModal, Navigation } from "./components"
import { NavigationItem } from "./components/shared/Navigation"
import { SCREENS } from "./constants/screens"
import { Dashboard, Cards, Expenses } from "./pages"
import ErrorModal from "./components/shared/ErrorModal"

function App() {
	const [screen, setScreen] = useState(SCREENS.DASHBOARD)

	const handleNavSelection = (nav: NavigationItem) => {
		setScreen(nav)
	}

	return (
		<>
			<Navigation handleNavSelection={handleNavSelection} />
			{screen === SCREENS.DASHBOARD && <Dashboard />}
			{screen === SCREENS.EXPENSES && <Expenses />}
			{screen === SCREENS.CARDS && <Cards />}
			<NotificationModal />
			<ErrorModal />
		</>
	)
}

export default App
