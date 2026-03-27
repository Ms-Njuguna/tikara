import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav>
      <Link to="/">Events</Link> |{" "}
      <Link to="/my-tickets">My Tickets</Link> |{" "}

      {!user && (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link> |{" "}
        </>
      )}

      {user?.role === "organizer" && (
        <>
          <Link to="/create-event">Create Event</Link> |{" "}
        </>
      )}

      {user && (
        <button onClick={handleLogout}>
          Logout 🚪
        </button>
      )}
    </nav>
  );
}