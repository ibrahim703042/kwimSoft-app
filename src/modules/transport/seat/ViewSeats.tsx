import { useParams } from "react-router-dom";


export default function ViewSeats() {

    const { id } = useParams();

    return (
        <div>
            <div className="bg-white rounded-md border">
                <h1>View detail {id}</h1>
            </div>
        </div>
    )
}
