import dayjs from 'dayjs';

export const formatDate = (value) => (value ? dayjs(value).format('DD MMM YYYY') : '—');

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    value
  );
};

export const daysUntil = (value) => {
  if (!value) return null;
  return dayjs(value).startOf('day').diff(dayjs().startOf('day'), 'day');
};

export const roleLabel = (role) => (role || '').replace('ROLE_', '');

export const initialsOf = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
