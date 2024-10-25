import { useState } from "react"
import AddExpenses from "./components/AddExpenses"
import Dashboard from "./components/Dashboard"
import Navigation, { NavigationItem } from "./components/Navigation"
import { SCREENS } from "./constants/screens"
import NotificationModal from "./components/NotificationModal"

function App() {
	const [screen, setScreen] = useState(SCREENS.DASHBOARD)

	const handleNavSelection = (nav: NavigationItem) => {
		setScreen(nav)
	}

	return (
		<>
			<Navigation handleNavSelection={handleNavSelection} />
			{screen === SCREENS.DASHBOARD && <Dashboard />}
			{screen === SCREENS.ADD_EXPENSES && <AddExpenses />}

			<NotificationModal />
		</>
	)
}

export default App
