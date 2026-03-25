import { useState } from "react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("physical");

  const token = localStorage.getItem("token");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/events/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        date,
        location,
        event_type: eventType
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert("Event created 🎉");
      });
  }

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" onChange={e => setDescription(e.target.value)} />
        <input type="datetime-local" onChange={e => setDate(e.target.value)} />
        <input placeholder="Location" onChange={e => setLocation(e.target.value)} />

        <select onChange={e => setEventType(e.target.value)}>
          <option value="physical">Physical</option>
          <option value="virtual">Virtual</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <button type="submit">Create Event 🚀</button>
      </form>
    </div>
  );
}

export default CreateEvent;