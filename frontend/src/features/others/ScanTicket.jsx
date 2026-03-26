import { useState } from "react";
import QrScanner from "react-qr-scanner";

function ScanTicket() {
  const [result, setResult] = useState("");

  function handleScan(data) {
    if (data) {
      setResult(data.text);
      verifyTicket(data.text);
    }
  }

  function handleError(err) {
    console.error(err);
  }

  function verifyTicket(qrCode) {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/tickets/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ qr_code: qrCode })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || data.error);
      });
  }

  return (
    <div>
      <h2>Scan Ticket 🎟️</h2>

      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />

      <p>Scanned: {result}</p>
    </div>
  );
}

export default ScanTicket;