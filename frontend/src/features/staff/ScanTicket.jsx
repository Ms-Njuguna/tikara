import { useState } from "react";
import QrScanner from "react-qr-scanner";

function ScanTicket() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");

  function handleScan(data) {
    if (data) {
      setResult(data.text);
      verifyTicket(data.text);
    }
  }

  function verifyTicket(qrCode) {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/tickets/scan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ qr_code: qrCode })
    })
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      });
  }

  return (
    <div>
      <h2>Scan Ticket 🎟️</h2>

      <QrScanner
        delay={300}
        onScan={handleScan}
        style={{ width: "300px" }}
      />

      {status === "success" && <p style={{ color: "green" }}>✅ Valid Entry</p>}
      {status === "error" && <p style={{ color: "red" }}>❌ Invalid Ticket</p>}
      {status === "warning" && <p style={{ color: "orange" }}>⚠️ Already Used</p>}
    </div>
  );
}

export default ScanTicket;