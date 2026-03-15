import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * AG Grid custom cell renderer for displaying days worked with a visual indicator.
 */
const DaysWorkedCell = ({ value }) => {
  const days = value || 0;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  let label = `${days} days`;
  if (years > 0) label = `${years}y ${months}m (${days}d)`;
  else if (months > 0) label = `${months}mo (${days}d)`;

  return (
    <span style={{ fontWeight: 500, color: days > 365 ? '#d98d28' : '#6f4e37' }}>
      {label}
    </span>
  );
};

export default DaysWorkedCell;
