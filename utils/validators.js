// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  return password.length >= 6;
};

// Validate event date
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && date > new Date();
};

// Validate event time format (HH:MM)
const isValidTime = (timeString) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidDate,
  isValidTime
};
