// ScanTicket.jsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function ScanTicket() {
  const [status, setStatus] = useState(""); // success / error / warning
  const [scannerRunning, setScannerRunning] = useState(false);
  const html5QrCodeRef = useRef(null);

  const hasScannedRef = useRef(false);
  const successAudio = useRef(null);
  const errorAudio = useRef(null);

  const [flash, setFlash] = useState("");

  function startScanner() {
    if (scannerRunning) return;

    hasScannedRef.current = false; // 🔥 reset lock

    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear();
    }

    html5QrCodeRef.current = new Html5Qrcode("reader");

    html5QrCodeRef.current
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        if (hasScannedRef.current) return;

        hasScannedRef.current = true;

        console.log("SCANNED:", decodedText);

        stopScanner(); // ✅ STOP immediately
        verifyTicket(decodedText);
      },
      (errorMessage) => {
        console.log("Scan error:", errorMessage);
      }
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

  async function verifyTicket(scannedValue) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/api/tickets/scan/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qr_code: scannedValue, // ✅ THIS MUST MATCH BACKEND FIELD
        }),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        errorAudio.current?.play();
        navigator.vibrate?.(300); // 🔥 vibration
        throw new Error(data.detail || "Scan failed");
      }

      // SUCCESS
      successAudio.current?.play();
      navigator.vibrate?.([100, 50, 100]);

      // SUCCESS
      setFlash("success");
      setTimeout(() => setFlash(""), 500);

      // ERROR
      setFlash("error");
      setTimeout(() => setFlash(""), 500);

      setStatus(data.status);
    } catch (err) {
      console.error("Scan error:", err);
      setStatus("error");
    }
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div>
      {flash && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:
              flash === "success"
              ? "rgba(0,255,0,0.3)"
              : "rgba(255,0,0,0.3)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <h2>Scan Ticket 🎟️</h2>
      <div id="reader" style={{ width: "300px", margin: "20px 0" }}></div>
      <button onClick={startScanner} disabled={scannerRunning}>Turn Camera On</button>
      <button onClick={stopScanner} disabled={!scannerRunning} style={{ marginLeft: "10px" }}>Turn Camera Off</button>
      <div style={{ marginTop: "20px" }}>
        {status === "success" && <p style={{ color: "green" }}>✅ Valid Entry</p>}
        {status === "error" && <p style={{ color: "red" }}>❌ Invalid Ticket</p>}
        {status === "warning" && <p style={{ color: "orange" }}>⚠️ Already Used</p>}
      </div>
      <audio ref={successAudio} src="/sounds/success.mp3" />
      <audio ref={errorAudio} src="/sounds/error.mp3" />
    </div>
  );
}

export default ScanTicket;