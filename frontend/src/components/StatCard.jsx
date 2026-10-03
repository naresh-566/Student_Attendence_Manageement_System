import React from 'react';

const StatCard = ({
  title,
  value,
  icon = 'bi bi-graph-up',
  variant = 'primary',
  subtitle,
  badgeText,
  badgeVariant = 'secondary',
  onClick
}) => {
  return (
    <div 
      className={`stat-card ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <div className="stat-label text-uppercase mb-1">{title}</div>
          <div className="stat-value">{value}</div>
          {subtitle && (
            <div className="mt-2 text-muted small d-flex align-items-center gap-1">
              {badgeText && (
                <span className={`badge bg-${badgeVariant} text-white me-1`}>
                  {badgeText}
                </span>
              )}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
        <div className={`stat-icon ${variant}`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
