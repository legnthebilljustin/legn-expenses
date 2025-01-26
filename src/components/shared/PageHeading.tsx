export default function PageHeading({ heading }: { heading: string}) {
    return (
        <div className="text-center my-4 font-medium text-xl">
            { heading }
        </div>
    )
}