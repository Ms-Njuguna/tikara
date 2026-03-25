import { Link } from "react-router-dom";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <nav>
            <Link to="/">Events</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link> |{" "}
            {user?.is_organizer && <Link to="/create-event">Create Event</Link>}
        </nav>
    )
}