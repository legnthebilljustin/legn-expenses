export default function Unauthorized() {
    return (
        <div className="pt-32 flex flex-col items-center justify-center dark">
            <i className='bx bxs-invader bx-lg'></i>
            <p className="mt-2 text-red-400">Unauthorized Access</p>
            <div className="text-sm mt-8">You do not possess the necessary permissions to access this resource.</div>
        </div>
    )
}