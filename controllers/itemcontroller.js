const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const Item = sequelize.import('../models/item');
const validateSession = require('../middleware/validate-session');

// Create an item
router.post('/', validateSession, async (req, res) => {
    try {
        const itemFromRequest = {
            type: req.body.item.type,
            brand: req.body.item.brand,
            model: req.body.item.model,
            notes: req.body.item.notes,
            location: req.body.item.location,
            owner: req.user.id,
            availability: req.body.item.availability,
            rating: req.body.item.rating
        };

        const item = await Item.create(itemFromRequest);
        res.status(201).json({
            item: item,
            message: 'Item successfully created'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all items for the authenticated user
router.get('/', validateSession, async (req, res) => {
    try {
        const items = await Item.findAll({ where: { owner: req.user.id }});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get items by type
router.get('/rent/:type', validateSession, async (req, res) => {
    try {
        const items = await Item.findAll({ where: { type: req.params.type }});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get item by ID
router.get('/:id', validateSession, async (req, res) => {
    try {
        const item = await Item.findOne({ where: { id: req.params.id }});
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update item by ID
router.put('/:id', validateSession, async (req, res) => {
    try {
        const updated = await Item.update(req.body.item, { where: { id: req.params.id, owner: req.user.id }});
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Item not found or not authorized' });
        }
        res.status(200).json({ message: 'Item successfully updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete item by ID
router.delete('/:id', validateSession, async (req, res) => {
    try {
        const deleted = await Item.destroy({ where: { id: req.params.id, owner: req.user.id }});
        if (deleted === 0) {
            return res.status(404).json({ error: 'Item not found or not authorized' });
        }
        res.status(200).json({ message: 'Item successfully deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
