// In-memory data storage
let users = [];
let events = [];

// Counter for generating unique IDs
let userIdCounter = 1;
let eventIdCounter = 1;

// Get next user ID
const getNextUserId = () => {
  return userIdCounter++;
};

// Get next event ID
const getNextEventId = () => {
  return eventIdCounter++;
};

// Reset counters (useful for testing)
const resetCounters = () => {
  userIdCounter = 1;
  eventIdCounter = 1;
};

module.exports = {
  users,
  events,
  getNextUserId,
  getNextEventId,
  resetCounters
};
