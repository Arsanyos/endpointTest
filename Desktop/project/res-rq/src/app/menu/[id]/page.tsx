

function MenuItem({ params }: { params: { id: string } }) {
    return <div className="h-[300px] w-[200px] bg-red-300">{params.id}</div>
}
export default MenuItem