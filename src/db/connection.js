
var cassandra = require('cassandra-driver');
var async = require('async');
//THIS ISNT FUNCTIONAL!!! WE'VE MOVED TO MONGO DB... DON'T WASTE YOUR TIME :d
var authProvider = new cassandra.auth.PlainTextAuthProvider('scylla', process.env.NODE_SCYLLA_PW)

async function connect() {
    const cluster = new cassandra.Client({
        contactPoints: [process.env.NODE_SCYLLA_NODE_1, process.env.NODE_SCYLLA_NODE_2, process.env.NODE_SCYLLA_NODE_3],
        localDataCenter: process.env.NODE_SCYLLA_DATA_CENTER,
        keyspace: process.env.NODE_SCYLLA_NODE_KEYSPACE,
        authProvider
    })
    return cluster
}

async function createTabe() {
    const query = `
    CREATE TABLE IF NOT EXISTS games.game
    (
        game_id UUID,
        address TEXT,
        name    TEXT,
        PRIMARY KEY (game_id)
    );
    `
}


