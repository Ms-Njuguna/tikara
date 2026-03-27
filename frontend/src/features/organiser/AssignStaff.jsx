import { useEffect, useState } from "react";

function AssignStaff() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  function handleAssign(e) {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/events/${eventId}/assign-staff/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Assigned 🎉");
        setUsername("");
      });
  }

  return (
    <div>
      <h2>Assign Staff to Event 👨‍🔧</h2>

      <form onSubmit={handleAssign}>
        <select onChange={e => setEventId(e.target.value)}>
          <option>Select Event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Staff Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <button type="submit">Assign Staff</button>
      </form>
    </div>
  );
}

export default AssignStaff;