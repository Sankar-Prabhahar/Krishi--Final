import React, { useState } from "react";
import { RefreshCw, ScanLine, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const SoilWater = () => {
  const [ipAddress, setIpAddress] = useState("");
  const { t } = useLanguage();

  const handleScan = () => {
    if (!ipAddress) {
      alert(t("enter_ip_alert"));
      return;
    }
    // Remove protocol if user pastes it by mistake
<<<<<<< HEAD
    const cleanIp = ipAddress.replace(/^https?:\/\//, "").replace(/\/$/, "");

    // Force absolute redirection to the public static file
    window.location.href = `/scan.html?ip=${cleanIp}`;
=======
    const cleanIp = ipAddress.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Force absolute redirection with http://
    // This ensures it goes to the external device, not a relative path
    window.location.href = `/car.html`;
>>>>>>> 5774d07416e9a1f535ee7da21e1edd7310a80560
  };

  return (
    <div
      className="soil-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center", width: "100%", maxWidth: "400px" }}>
        <div className="pulse-ring" style={{ marginBottom: "2rem" }}>
          <ScanLine size={64} color="var(--color-primary)" />
        </div>

        <div className="ip-input-container" style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder={t("pi_ip_placeholder")}
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "2px solid var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.3s",
            }}
          />
        </div>

        <button
          onClick={handleScan}
          className="btn btn-primary"
          style={{
            fontSize: "1.2rem",
            padding: "1rem 2.5rem",
            borderRadius: "50px",
            boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.4)",
            width: "100%",
          }}
        >
          <ExternalLink size={24} style={{ marginRight: "10px" }} />
          {t("connect_scan")}
        </button>

        <p
          style={{
            marginTop: "1rem",
            color: "var(--color-text-light)",
            fontSize: "0.9rem",
          }}
        >
          {t("pi_network_warning")}
        </p>
      </div>
    </div>
  );
};

export default SoilWater;
