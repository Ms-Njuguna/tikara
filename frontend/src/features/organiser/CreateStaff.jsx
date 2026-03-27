import { useState } from "react";

function CreateStaff() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/auth/create-staff/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        return data;
      })
      .then(data => {
        alert("Staff created 🎉");

        // 🔥 reset form
        setUsername("");
        setPassword("");
      })
      .catch(err => {
        console.error(err);
        alert("Error creating staff ❌");
      });
  }

  return (
    <div>
      <h2>Create Staff 👨‍🔧</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Staff Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Create Staff</button>
      </form>
    </div>
  );
}

export default CreateStaff;