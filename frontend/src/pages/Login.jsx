import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          // 🔥 CLEAR OLD SESSION FIRST
          localStorage.clear();

          // 🔥 SET NEW SESSION
          localStorage.setItem("token", data.access);
          localStorage.setItem("user", JSON.stringify(data.user));

          // 🔥 RESET FORM
          setUsername("");
          setPassword("");

          // 🔥 REDIRECT
          navigate("/");

          // 🔥 FORCE UI REFRESH (important for navbar)
          window.location.reload();
        } else {
          alert("Login failed 😢");
        }
      });
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;