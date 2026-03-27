import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  // 🔒 STAFF VIEW (LOCKED DOWN)
  if (user?.role === "staff") {
    return (
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    );
  }

  // 🌍 NORMAL USERS + ORGANIZERS
  return (
    <nav>
      <Link to="/">Events</Link> |{" "}

      {!user && <Link to="/login">Login</Link>} |{" "}
      {!user && <Link to="/register">Register</Link>} |{" "}

      {user && <Link to="/my-tickets">My Tickets</Link>} |{" "}

      {user?.role === "organizer" && (
        <>
          <Link to="/create-event">Create Event</Link> |{" "}
          <Link to="/create-staff">Create Staff</Link> |{" "}
          <Link to="/assign-staff">Assign Staff</Link> |{" "}
        </>
      )} |{" "}

      {user && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}