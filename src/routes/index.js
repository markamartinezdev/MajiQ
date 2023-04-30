const express = require('express');
const router = express.Router();
const mgt = require('../game/cards.js')

const PORT = process.env.NODE_PORT ?? 3030
router.get("/room/:room", (req, res, next) => {
    res.render("room", { roomId: req.params.room, port: Number(process.env.NODE_PROD) ? '' : PORT });
});

// Create one item
router.post('/', async (req, res, next) => {
    try {
        res.json({ message: 'Create one item' });
    } catch (err) {
        next(err);
    }
});
// Get all items
router.get('/card', async (req, res, next) => {
    try {
        const searchTerm = req.query.searchTerm
        const result = await mgt.searchCard(searchTerm)
        res.json({ message: 'Got cards', data: result });
    } catch (err) {
        next(err);
    }
});
// Delete one item
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ message: `Delete one item ${id}` });
    } catch (err) {
        next(err);
    }
});
// Update one item
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ message: `Update one item ${id}` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;