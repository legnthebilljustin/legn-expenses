import { Button } from "@nextui-org/react"
import { useState } from "react"
import { SCREENS } from "../constants/screens"

const navigationItems = [
    SCREENS.DASHBOARD, SCREENS.ADD_EXPENSES
] as const

export type NavigationItem = typeof navigationItems[number]

type Props = {
    handleNavSelection: (data: NavigationItem) => void
}

export default function Navigation({ handleNavSelection }: Props) {
    const [selected, setSelected] = useState<NavigationItem>()

    const selectNav = (selectedNav: NavigationItem) => {
        setSelected(selectedNav)
        handleNavSelection(selectedNav)
    }

    return (
        <div className="my-4">
            {navigationItems.map((nav: NavigationItem, index) => (
                <Button size="sm" className="mr-2"
                    variant={selected === nav ? undefined : "flat"}
                    color={selected === nav ? "primary" : "default"}
                    key={index}
                    onClick={() => selectNav(nav)}
                >
                    { nav }
                </Button>
            ))}
        </div>
    )
}