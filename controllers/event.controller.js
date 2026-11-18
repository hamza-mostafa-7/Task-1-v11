
const Event = require('../models/event.model.js');

const getEvents = async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.isFree === 'true') {
            filter.isFree = true;
        } else if (req.query.isFree === 'false') {
            filter.isFree = false;
        }

        const events = await Event.find(filter);
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json(event);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An event with this title and date already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An event with this title and date already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUpcomingEvents = async (req, res) => {
    try {
        const events = await Event.find({
            date: { $gt: new Date() }
        }).sort({ date: 1 });

        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents
};
