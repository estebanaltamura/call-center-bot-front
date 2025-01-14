import React from 'react';

const Loader = () => {
  const spinnerStyles = {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTop: '4px solid #000',
    width: '36px',
    height: '36px',
    animation: 'spin 1s linear infinite',
  };

  const containerStyles = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles}></div>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
