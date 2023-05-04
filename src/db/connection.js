
require('dotenv').config()
const { MongoClient } = rquire('mongodb')

async function connectToCluster() {
    let mongoClient;
    const uri = `mongodb+srv://${process.env.NODE_DB_USER}:${process.env.NODE_DB_PASSWORD}@${process.env.NODE_DB_URL}/test?retryWrites=true&w=majority"`;
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();
    }
}

module.exports = {
    connectToCluster
}