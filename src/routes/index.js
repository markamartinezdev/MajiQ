const express = require('express');
const router = express.Router();

const PORT = process.env.NODE_PORT ?? 3030
router.get("/:room", (req, res, next) => {
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
router.get('/all, async (_, res, next) => {
    try {
        res.json({ message: 'Get all item' });
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