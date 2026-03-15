import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * AG Grid custom cell renderer for displaying cafe logo images.
 */
const CafeLogoCell = ({ value }) => {
  if (!value) {
    return (
      <div className="logo-cell">
        <div className="logo-placeholder">☕</div>
      </div>
    );
  }

  return (
    <div className="logo-cell">
      <img
        src={`${API_URL}/uploads/${value}`}
        alt="Cafe logo"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="logo-placeholder" style={{ display: 'none' }}>☕</div>
    </div>
  );
};

export default CafeLogoCell;
