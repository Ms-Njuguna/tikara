import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/test/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1 class="text-3xl font-bold underline">TIKARA 🎟️</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;