const express = require('express');
const router = express.Router();
const { events, users, getNextEventId } = require('../utils/database');
const { verifyToken, verifyOrganizer } = require('../middleware/auth');
const { isValidDate, isValidTime } = require('../utils/validators');
const { sendEventRegistrationEmail } = require('../utils/emailService');

// GET /events - Get all events
router.get('/', (req, res) => {
  try {
    const eventsList = events.map(event => ({
      ...event,
      participantCount: event.participants.length
    }));

    res.status(200).json({
      message: 'Events retrieved successfully',
      events: eventsList,
      total: eventsList.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /events/:id - Get event by ID
router.get('/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === parseInt(req.params.id));

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event retrieved successfully',
      event: {
        ...event,
        participantCount: event.participants.length
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /events - Create event (only for organizers)
router.post('/', verifyToken, verifyOrganizer, (req, res) => {
  try {
    const { name, description, date, time, location, maxParticipants } = req.body;

    // Validation
    if (!name || !date || !time) {
      return res.status(400).json({ message: 'Event name, date, and time are required' });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: 'Event date must be a valid future date' });
    }

    if (!isValidTime(time)) {
      return res.status(400).json({ message: 'Event time must be in HH:MM format' });
    }

    // Create new event
    const newEvent = {
      id: getNextEventId(),
      name,
      description: description || '',
      date,
      time,
      location: location || '',
      maxParticipants: maxParticipants || null,
      organizerId: req.user.id,
      organizer: req.user.name,
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.push(newEvent);

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        ...newEvent,
        participantCount: newEvent.participants.length
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /events/:id - Update event (only organizer of the event)
router.put('/:id', verifyToken, verifyOrganizer, (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify if user is the organizer
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the event organizer can update this event' });
    }

    const { name, description, date, time, location, maxParticipants } = req.body;

    // Validate date and time if provided
    if (date && !isValidDate(date)) {
      return res.status(400).json({ message: 'Event date must be a valid future date' });
    }

    if (time && !isValidTime(time)) {
      return res.status(400).json({ message: 'Event time must be in HH:MM format' });
    }

    // Update fields
    if (name) event.name = name;
    if (description !== undefined) event.description = description;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location !== undefined) event.location = location;
    if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
    event.updatedAt = new Date().toISOString();

    res.status(200).json({
      message: 'Event updated successfully',
      event: {
        ...event,
        participantCount: event.participants.length
      }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /events/:id - Delete event (only organizer of the event)
router.delete('/:id', verifyToken, verifyOrganizer, (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[eventIndex];

    // Verify if user is the organizer
    if (event.organizerId !== req.user.id) {
      return res.status(403).json({ message: 'Only the event organizer can delete this event' });
    }

    events.splice(eventIndex, 1);

    res.status(200).json({
      message: 'Event deleted successfully',
      deletedEvent: event
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /events/:id/register - Register user for event
router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already registered
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'User is already registered for this event' });
    }

    // Check if event is at max capacity
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is at maximum capacity' });
    }

    // Add participant to event
    event.participants.push(req.user.id);

    // Add event to user's registered events
    user.registeredEvents.push(eventId);

    // Send confirmation email asynchronously
    sendEventRegistrationEmail(user.email, user.name, event.name);

    res.status(201).json({
      message: 'Successfully registered for event. Confirmation email sent.',
      event: {
        ...event,
        participantCount: event.participants.length
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
