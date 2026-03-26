import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  function handleBuy(ticketTypeId) {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    fetch("http://127.0.0.1:8000/api/tickets/buy/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // 🔥 THIS LINE IS KEY
      },
      body: JSON.stringify({
        ticket_type: ticketTypeId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.error) {
        alert(data.error);
      } else {
        alert("Ticket purchased 🎟️🔥");
        window.location.reload();
      }
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

          <h4>Tickets 🎟️</h4>

          {event.ticket_types.map(ticket => (
            <div key={ticket.id} style={{ marginBottom: "10px" }}>
              <p>
                {ticket.name.toUpperCase()} - KES {ticket.price}
              </p>
              <p>Remaining: {ticket.quantity}</p>

              <button
                disabled={ticket.quantity === 0}
                onClick={() => handleBuy(ticket.id)}
              >
                {ticket.quantity === 0 ? "Sold Out ❌" : "Buy Ticket 🎟️"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Events;