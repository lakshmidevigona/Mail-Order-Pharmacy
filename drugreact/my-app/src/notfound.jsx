
import { Link } from "react-router-dom";


export function NotFound() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <Link to="/">Home</Link>
        </div>
    )
}