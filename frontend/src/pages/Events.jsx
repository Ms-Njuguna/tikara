import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const token = localStorage.getItem("token");

  function handleBuy(eventId) {
    fetch("http://127.0.0.1:8000/api/tickets/buy/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        event: eventId,
        ticket_type: "regular",
        price: 1000
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert("Ticket purchased 🎟️🔥");
      });
  }

  return (
    <div>
      <h2>All Events</h2>

      {events.map(event => (
        <div key={event.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.location}</p>

          <button onClick={() => handleBuy(event.id)}>
            Buy Ticket 🎟️
          </button>
        </div>
      ))}
    </div>
  );
}

export default Events;