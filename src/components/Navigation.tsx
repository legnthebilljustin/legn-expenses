import { Button } from "@nextui-org/react"
import { useState } from "react"

const navigationItems = [
    "Dashboard", "Add Expenses"
] as const

type NavigationItem = typeof navigationItems[number]

export default function Navigation() {
    const [selected, setSelected] = useState<NavigationItem>()

    const selectNav = (selectedNav: NavigationItem) => {
        setSelected(selectedNav)
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