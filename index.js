const MongoClient = require('mongodb').MongoClient;
const COMPARISON_OPERATORS = {
  equal: "$eq",
  greaterThan: "$gt",
  greaterThanOrEqual: "$gte",
  include: "$in",
  lessThan: "$lt",
  lessThanOrEqual: "$lte",
  notEqual: "$ne",
  exclude: "$nin"
};

function MongoDB(MONGODB_PATH, DB_NAME) {
  this.MONGODB_PATH = MONGODB_PATH;
  this.DB_NAME = DB_NAME;
  this.COMPARISON_OPERATORS = COMPARISON_OPERATORS;
  this.client = null;
}

MongoDB.prototype.getClient = function () {
  let that = this;
  if (that.client) {
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

MongoDB.prototype.getCollection = function (COLLECTION_NAME) {
  if (!this.client) {
    throw new Error('You MUST call getClient first');
  }
  const collection = this.client.db(this.DB_NAME).collection(COLLECTION_NAME);
  console.log('success getCollection', collection.s.name);
  return collection;
};

/**
 * make filter
 * @param options : [{field, operator, value}]
 */
MongoDB.prototype.makeFilter = function (options) {
  let filter = {};
  options.forEach(function (option) {
    filter[option.field] = option.operator ? {} : option.value;
    if (option.operator) {
      filter[option.field][option.operator] = option.value;
    }
  });
  return filter;
};

MongoDB.prototype.close = function () {
  if (this.client) {
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
MongoDB.prototype.insert = function (collection, data) {
  return new Promise((resolve, reject) => {
    const callback = function (err, result) {
      if (err) {
        console.log('err insert', err);
        reject(err);
      } else {
        console.log("insertMany the following records");
        console.log(result);
        resolve(result);
      }
    };
    if (Array.isArray(data)) {
      collection.insertMany(data, callback);
    } else {
      collection.insertOne(data, callback);
    }
  });
};

/**
 * find data
 * @param collection
 * @param filter
 * @returns {Promise<any>}
 * @exampel : find(collection, {type: "computer"})
 */
MongoDB.prototype.find = function (collection, filter) {
  return new Promise((resolve, reject) => {
    collection.find(filter).toArray(function (err, docs) {
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