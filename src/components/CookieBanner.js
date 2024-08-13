// CookieBanner.js
import { useState } from 'react';
import Cookies from 'js-cookie';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(!Cookies.get('cookiesAccepted'));

  const handleAccept = () => {
    Cookies.set('cookiesAccepted', 'true', { expires: 365 });
    setIsVisible(false);
  };

  const handleReject = () => {
    window.deleteAllCookies(); // Borra todas las cookies utilizando la función global
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={bannerStyle}>
      <p style={textStyle}>
        Este sitio utiliza cookies para almacenar tus tareas. Los datos que generes son únicamente de uso personal y no se enviarán a ningún servidor, no se compartirán con terceros, ni se efectuarán acciones comercializadoras.
      </p>
      <div style={buttonContainerStyle}>
        <button onClick={handleAccept} style={buttonStyle}>Aceptar</button>
        <button onClick={handleReject} style={buttonStyle}>Rechazar</button>
      </div>
    </div>
  );
}

const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px',
  zIndex: 1000,
};

const textStyle = {
  margin: '0 0 10px 0',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#555',
  color: '#fff',
};

export default CookieBanner;
