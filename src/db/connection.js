
var cassandra = require('cassandra-driver');
var async = require('async');

var authProvider = new cassandra.auth.PlainTextAuthProvider('scylla', process.env.NODE_SCYLLA_PW)

async function connect() {
    const cluster = new cassandra.Client({
        contactPoints: [process.env.NODE_SCYLLA_NODE_1, process.env.NODE_SCYLLA_NODE_2, process.env.NODE_SCYLLA_NODE_3],
        localDataCenter: 'DC1',
        keyspace: 'majiq',
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


