import React, { useState } from 'react';
import { Camera, ExternalLink, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DiseaseDetection = () => {
  const [ipAddress, setIpAddress] = useState('');
  const { t } = useLanguage();

  const handleConnect = () => {
    if (!ipAddress) {
      alert(t('enter_ip_alert'));
      return;
    }
    // Remove protocol if user pastes it by mistake
    const cleanIp = ipAddress.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Force absolute redirection to the public static file
    window.location.href = `/car.html?ip=${cleanIp}`;
  };

  return (
    <div className="disease-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <div className="pulse-ring" style={{ marginBottom: '2rem' }}>
          <Bot size={64} color="var(--color-primary)" />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>{t('agri_bot_title')}</h2>
          <p style={{ color: 'var(--color-text-light)' }}>{t('connect_bot_desc')}</p>
        </div>

        <div className="ip-input-container" style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder={t('bot_ip_placeholder')}
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '2px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />
        </div>

        <button 
          onClick={handleConnect}
          className="btn btn-primary"
          style={{ 
            fontSize: '1.2rem', 
            padding: '1rem 2.5rem', 
            borderRadius: '50px',
            boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)',
            width: '100%'
          }}
        >
          <ExternalLink size={24} style={{ marginRight: '10px' }} />
          {t('connect_bot')}
        </button>
        
        <p style={{ marginTop: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
          {t('bot_redirect_warning')}
        </p>
      </div>

    </div>
  );
};

export default DiseaseDetection;
