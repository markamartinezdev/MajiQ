require('dotenv').config()
const express = require('express');
const router = express.Router();
const mgt = require('../game/cards.js')

const PORT = process.env.NODE_PORT ?? 3030
router.get("/room/:room", (req, res, next) => {
    console.log(Number(process.env.NODE_PROD), Number(process.env.NODE_PROD) ? '' : PORT)
    res.render("room", { roomId: req.params.room, port: Number(process.env.NODE_PROD) ? '' : PORT });
});

// Update game
router.post('/updateGameState', async (req, res, next) => {
    try {
        const gameState = req.body.gameState
        const playerId = req.body.playerId
        res.json({ message: 'Saved game' });
    } catch (err) {
        next(err);
    }
});
/**
 * Add player to game
 */
router.post('/addPlayer', async () => {
    try {
        const player = req.body.player
        mgt.addPlayer(player)
        res.json({ message: 'addedPlayer' });
    } catch (err) {
        next(err);
    }
})
// Search card
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