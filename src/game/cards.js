const mtg = require('mtgsdk')

async function searchCard(searchTerm) {

    const cards = await mtg.card.where({ name: searchTerm })
    return cards

}

module.exports = {
    searchCard
}