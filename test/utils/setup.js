const mongoose = require("mongoose");

const {
    MongoMemoryServer
} = require("mongodb-memory-server");

let mongoServer;

const connectTestDB = async () => {

    mongoServer =
        await MongoMemoryServer.create();

    const mongoUri =
        mongoServer.getUri();

    await mongoose.connect(mongoUri);
};

const closeTestDB = async () => {

    await mongoose.connection.dropDatabase();

    await mongoose.connection.close();

    await mongoServer.stop();
};

const clearTestDB = async () => {

    const collections =
        mongoose.connection.collections;

    for (const key in collections) {

        const collection =
            collections[key];

        await collection.deleteMany({});
    }
};

module.exports = {
    connectTestDB,
    closeTestDB,
    clearTestDB
};