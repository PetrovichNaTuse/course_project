const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

exports.connect = (url, done) => {
    if(state.db) {
        return done();
    }
    const mongoClient = new MongoClient(url, { useNewParser: true });
    MongoClient.connect(url, (err, client) => {
        if(err) return done(err);
        state.db = client.db('car_auto');
        return done(err);
    });
};

exports.get = () => state.db;
