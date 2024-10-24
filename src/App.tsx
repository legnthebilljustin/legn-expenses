import { useState } from "react"
import AddExpenses from "./components/AddExpenses"
import Dashboard from "./components/Dashboard"
import Navigation from "./components/Navigation"

const ScreensEnums = {
	DASHBOARD: "Dashboard",
	ADD_EXPENSES: "AddExpenses"
}

const Screens = {
	[ScreensEnums.DASHBOARD]: Dashboard,
	[ScreensEnums.ADD_EXPENSES]: AddExpenses
}

function App() {
	const [screen, setScreen] = useState(ScreensEnums.DASHBOARD)

	return (
		<>
			<Navigation />
			{/* {screen === ScreensEnums.DASHBOARD && <Dashboard />}
			{screen === ScreensEnums.ADD_EXPENSES && <AddExpenses />} */}
		</>
	)
}

export default App
