import { Button } from "@nextui-org/react"

export default function Navigation() {
    // just use a context api for this
    return (
        <div className="my-4">
            <Button color="primary" 
                variant="flat" size="sm" className="mx-2"
            >
                Dashboard
            </Button>
            <Button color="primary" size="sm">Add Expenses</Button>
        </div>
    )
}