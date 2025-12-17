import React, { useState } from 'react';
import { Camera, ExternalLink, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DiseaseDetection = () => {
  const { t } = useLanguage();

  React.useEffect(() => {
    // Auto-redirect to the Plant Disease Scanner
    window.location.href = "/scan.html?ip=192.168.137.109";
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.2rem', color: '#666' }}>
      Redirecting to Plant Scanner...
    </div>
  );
};

export default DiseaseDetection;
