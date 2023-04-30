const mtg = require('mtgsdk')
const players = {}
async function searchCard(searchTerm) {
    const cards = await mtg.card.where({ name: searchTerm })
    return cards
}


function addPlayer(playerId, playerName) {
    players[playerId] = {
        score: 40,
        playerId,
        playerName
    }
}

module.exports = {
    searchCard,
    addPlayer
}