
require('dotenv').config()
const mongoose = require('mongoose');

async function connectToCluster() {
    let mongoClient;
    const uri = `mongodb://${encodeURIComponent(process.env.NODE_DB_USER)}:${encodeURIComponent(process.env.NODE_DB_PASSWORD)}@${process.env.NODE_DB_URL}`;
    try {
        console.log('Connecting to MongoDB cluster...');
        mongoClient = await mongoose.connect(`mongodb://${(process.env.NODE_DB_URL)}/newCollection`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Successfully connected to MongoDB!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();
    }
}

async function createSchema() {
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    const BlogPost = new Schema({
        author: ObjectId,
        title: String,
        body: String,
        date: Date
    });
    return BlogPost
}

module.exports = {
    createSchema,
    connectToCluster
}