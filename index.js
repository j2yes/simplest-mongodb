const MongoClient = require('mongodb').MongoClient;

function MongoDB(MONGODB_PATH, DB_NAME) {
    this.MONGODB_PATH = MONGODB_PATH;
    this.DB_NAME = DB_NAME;
    this.client = null;
}

MongoDB.prototype.getClient = function() {
    let that = this;
    if(that.client) {
        return that.client;
    } else {
        return new Promise((resolve, reject) => {
            MongoClient.connect(that.MONGODB_PATH, function (err, client) {
                if (err) {
                    console.log('err getClient', err);
                    reject(err);
                } else {
                    console.log('success getClient', client.s.url);
                    that.client = client;
                    resolve(client);
                }
            });
        });
    }
};

MongoDB.prototype.getCollection = function(COLLECTION_NAME) {
    if(!this.client) {
        throw new Error('You MUST call getClient first');
    }
    const collection = this.client.db(this.DB_NAME).collection(COLLECTION_NAME);
    console.log('success getCollection', collection.s.name);
    return collection;
};

MongoDB.prototype.close = function() {
    if(this.client) {
        this.client.close();
    }
};

/**
 * insert data
 * @param collection
 * @param data
 * @returns {Promise<any>}
 * @example : insert(collection, [{type: "pad"}, {type: "phone"}])
 */
MongoDB.prototype.insert = function(collection, data) {
    return new Promise((resolve, reject) => {
        collection.insertMany(data, function (err, result) {
            if (err) {
                console.log('err insert', err);
                reject(err);
            } else {
                console.log("insertMany the following records");
                console.log(result);
                resolve(result);
            }
        });
    });
};

/**
 * find data
 * @param collection
 * @param data
 * @returns {Promise<any>}
 * @exampel : find(collection, {type: "computer"})
 */
MongoDB.prototype.find = function(collection, data) {
    return new Promise((resolve, reject) => {
        collection.find(data).toArray(function (err, docs) {
            if (err) {
                console.log('err find', err);
                reject(err);
            } else {
                console.log("Found the following records");
                console.log(docs);
                resolve(docs);
            }
        });
    });
};

module.exports = MongoDB;