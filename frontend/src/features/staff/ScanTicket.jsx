// ScanTicket.jsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function ScanTicket() {
  const [status, setStatus] = useState(""); // success / error / warning
  const [scannerRunning, setScannerRunning] = useState(false);
  const html5QrCodeRef = useRef(null);

  function startScanner() {
    if (scannerRunning) return;

    html5QrCodeRef.current = new Html5Qrcode("reader");

    html5QrCodeRef.current
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => verifyTicket(decodedText),
        (errorMessage) => {}
      )
      .then(() => setScannerRunning(true))
      .catch((err) => console.error(err));
  }

  function stopScanner() {
    if (!scannerRunning || !html5QrCodeRef.current) return;

    html5QrCodeRef.current.stop()
      .then(() => {
        setScannerRunning(false);
        html5QrCodeRef.current.clear();
      })
      .catch(err => console.error(err));
  }

  function verifyTicket(qrCode) {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/tickets/scan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qr_code: qrCode }),
    })
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);

        if (data.status === "success") {
          // auto-show warning if scanned again in a few seconds
          setTimeout(() => setStatus("warning"), 5000);
        }
      })
      .catch(err => {
        console.error(err);
        setStatus("error");
      });
  }

  useEffect(() => stopScanner, []);

  return (
    <div>
      <h2>Scan Ticket 🎟️</h2>
      <div id="reader" style={{ width: "300px", margin: "20px 0" }}></div>
      <button onClick={startScanner} disabled={scannerRunning}>Turn Camera On</button>
      <button onClick={stopScanner} disabled={!scannerRunning} style={{ marginLeft: "10px" }}>Turn Camera Off</button>
      <div style={{ marginTop: "20px" }}>
        {status === "success" && <p style={{ color: "green" }}>✅ Valid Entry</p>}
        {status === "error" && <p style={{ color: "red" }}>❌ Invalid Ticket</p>}
        {status === "warning" && <p style={{ color: "orange" }}>⚠️ Already Used</p>}
      </div>
    </div>
  );
}

export default ScanTicket;