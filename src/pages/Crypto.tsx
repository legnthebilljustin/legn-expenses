import { ReactNode, useState } from "react"
import { Tab, Tabs } from "@nextui-org/react"
import { CryptoDashboard, CryptoHoldings } from "@/features"

const CRYPTO_TABS = {
    DASHBOARD: "dashboard",
    HOLDINGS: "holdings"
} as const

type TabSelectionType = typeof CRYPTO_TABS[keyof typeof CRYPTO_TABS]

type TabItem = {
    key: TabSelectionType
    label: string
    icon: ReactNode
    component: ReactNode
}

export default function Crypto() {
    const [selected, setSelected] = useState<TabSelectionType>(CRYPTO_TABS.DASHBOARD)
    
    const tabs: TabItem[] = [
        {
            key: CRYPTO_TABS.DASHBOARD,
            label: "Dashboard",
            icon: <i className="bx bx-home-alt" />,
            component: <CryptoDashboard />
        },
        {
            key: CRYPTO_TABS.HOLDINGS,
            label: "Holdings",
            icon: <i className="bx bxs-bank" />,
            component: <CryptoHoldings />
        },
    ]

    const handleChange = (key: any) => {
        setSelected(key)
    }
    
    return (
        <Tabs aria-label="cryptoTabs" color="primary" selectedKey={selected} onSelectionChange={handleChange}>
            {tabs.map(({ key, label, icon, component}: TabItem) => (
                <Tab key={key}
                    title={
                        <div className="flex items-center space-x-2">
                            { icon } <span>{ label }</span>
                        </div>
                    }
                >
                    { component }
                </Tab>
            ))}
        </Tabs>
    )
}