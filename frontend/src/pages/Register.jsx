import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);

  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role: isOrganizer ? "organizer" : "user"
      })
    })
      .then(res => res.json())
      .then(data => {
        alert("User registered 🎉");

        // 🔥 RESET FORM
        setUsername("");
        setEmail("");
        setPassword("");
        setIsOrganizer(false);

        // 🔥 REDIRECT TO LOGIN
        navigate("/login");
      });
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isOrganizer}
            onChange={(e) => setIsOrganizer(e.target.checked)}
          />
          Register as Organizer
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;