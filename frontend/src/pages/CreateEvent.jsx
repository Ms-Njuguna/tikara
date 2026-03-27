import { useState } from "react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("physical");

  const [tickets, setTickets] = useState([]);

  const token = localStorage.getItem("token");

  function addTicket() {
    setTickets([
      ...tickets,
      { name: "regular", price: "", quantity: "", group_size: "" }
    ]);
  }

  function updateTicket(index, field, value) {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  }

  function handleSubmit(e) {
        e.preventDefault();

        // 🔥 CLEAN + FORMAT TICKETS BEFORE SENDING
        const cleanedTickets = tickets.map(ticket => {
          return {
              name: ticket.name,
              price: Number(ticket.price),
              quantity: Number(ticket.quantity),

              // ONLY include group_size if it's a group ticket
              ...(ticket.name === "group" && {
                 group_size: Number(ticket.group_size)
                })
            };
        });

        // 🔥 OPTIONAL VALIDATION (prevents dumb errors)
        if (!title || !description || !date || !endTime) {
            alert("Please fill all event fields 😤");
            return;
        }

        if (new Date(endTime) <= new Date(date)) {
          alert("End time must be after start time ⏰");
          return;
        }

        if (cleanedTickets.length === 0) {
            alert("Add at least one ticket type 🎟️");
            return;
        }

        const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:8000/api/events/create/", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
               title,
               description,
               date: new Date(date).toISOString(), // 🔥 FIXED DATE
               end_time: new Date(endTime).toISOString(),
               location,
               event_type: eventType,
               ticket_types: cleanedTickets
            })
        })
        .then(async res => {
            const data = await res.json();

            console.log("RESPONSE:", data);

            if (!res.ok) {
                throw new Error(JSON.stringify(data));
            }

            return data;
        })
        .then(data => {
            alert("Event created 🎉🔥");

           // 🔥 RESET FORM AFTER SUCCESS
           setTitle("");
           setDescription("");
           setDate("");
           setLocation("");
           setTickets([]);
        })
        .catch(err => {
           console.error(err);
           alert("Error creating event ❌");
        });
    }

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" onChange={e => setDescription(e.target.value)} />
        <input type="datetime-local" onChange={e => setDate(e.target.value)} />
        <input type="datetime-local" placeholder="End Time" onChange={e => setEndTime(e.target.value)} />
        <input placeholder="Location" onChange={e => setLocation(e.target.value)} />

        <select onChange={e => setEventType(e.target.value)}>
          <option value="physical">Physical</option>
          <option value="virtual">Virtual</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <h3>Ticket Types 🎟️</h3>

        {tickets.map((ticket, index) => (
          <div key={index}>
            <select onChange={e => updateTicket(index, "name", e.target.value)}>
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
              <option value="vvip">VVIP</option>
              <option value="earlybird">Earlybird</option>
              <option value="group">Group</option>
            </select>

            <input
              placeholder="Price"
              onChange={e => updateTicket(index, "price", e.target.value)}
            />

            <input
              placeholder="Quantity"
              onChange={e => updateTicket(index, "quantity", e.target.value)}
            />

            {ticket.name === "group" && (
              <input
                placeholder="Group Size (4-10)"
                onChange={e => updateTicket(index, "group_size", e.target.value)}
              />
            )}
          </div>
        ))}

        <button type="button" onClick={addTicket}>
          Add Ticket Type ➕
        </button>

        <br /><br />

        <button type="submit">Create Event 🚀</button>
      </form>
    </div>
  );
}

export default CreateEvent;