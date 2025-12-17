import React, { useState } from "react";
import { RefreshCw, ScanLine, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const SoilWater = () => {
  const { t } = useLanguage();

  React.useEffect(() => {
    // Auto-redirect to the Sensor/Car Dashboard
    // Defaulting IP to 192.168.137.109 if not set, but letting the HTML page handle defaults is better
    // passing the common default to ensure query param logic triggers
    window.location.href = "/car.html?ip=192.168.137.109"; 
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.2rem', color: '#666' }}>
      Redirecting to Sensor Dashboard...
    </div>
  );
};

export default SoilWater;
