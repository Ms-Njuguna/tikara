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
       .then(async res => {
            if (!res.ok) {
                const text = await res.text(); // catches HTML errors
                throw new Error(text);
            }
            return res.json();
        })
       .then(data => setTickets(data))
       .catch(err => {
            console.error("ERROR:", err);
        });
    }, []);

  return (
    <div>
      <h2>My Tickets 🎟️</h2>

      {tickets.map((ticket, i) => (
        <div key={i}>
          <h3>{ticket.event}</h3>
          <p>{ticket.ticket_type}</p>
          <img
              src={`http://127.0.0.1:8000/api/tickets/qr/${ticket.id}/`}
              alt="QR Code"
              width="150"
           />
        </div>
      ))}
    </div>
  );
}

export default MyTickets;