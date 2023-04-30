const mtg = require('mtgsdk')

mtg.card.find(3)
.then(result => {
    console.log(result.card.name) // "Black Lotus"
})

mtg.set.find('AER')
.then(result => {
    console.log(result.set.name) // "Aether Revolt"
})

card.all({ name: 'Squee', pageSize: 1 })
.on('data', card => {
    console.log(card.name)
})