import { useEffect, useState } from "react";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/tickets/my/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  return (
    <div>
      <h2>My Tickets 🎟️</h2>

      {tickets.map((ticket, i) => (
        <div key={i}>
          <h3>{ticket.event}</h3>
          <p>{ticket.ticket_type}</p>
          <p>QR: {ticket.qr_code}</p>
        </div>
      ))}
    </div>
  );
}

export default MyTickets;