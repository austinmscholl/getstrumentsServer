const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const Booking = sequelize.import('../models/booking');
const validateSession = require('../middleware/validate-session');

// Create a booking
router.post('/', validateSession, async (req, res) => {
    try {
        const bookingRequest = {
            from: req.body.booking.from,
            to: req.body.booking.to,
            itemId: req.body.booking.itemId,
            renterId: req.user.id
        };

        const booking = await Booking.create(bookingRequest);
        res.status(201).json({
            booking: booking,
            message: 'Booking successfully created'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all bookings
router.get('/', validateSession, async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bookings by renter ID
router.get('/:renterId', validateSession, async (req, res) => {
    try {
        const bookings = await Booking.findAll({ where: { renterId: req.params.renterId }});
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update booking by ID
router.put('/:id', validateSession, async (req, res) => {
    try {
        const updated = await Booking.update(req.body.booking, { where: { id: req.params.id, renterId: req.user.id }});
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Booking not found or not authorized' });
        }
        res.status(200).json({ message: 'Booking successfully updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete booking by ID
router.delete('/:id', validateSession, async (req, res) => {
    try {
        const deleted = await Booking.destroy({ where: { id: req.params.id, renterId: req.user.id }});
        if (deleted === 0) {
            return res.status(404).json({ error: 'Booking not found or not authorized' });
        }
        res.status(200).json({ message: 'Booking successfully deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
