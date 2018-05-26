# simplest-mongodb
simplest project to handle mongodb 

## Usage

1. make mongodb instance
```javascript
const MongoDB = require('simplest-mongodb');
const ID = process.env.ID || "userId";
const PWD = process.env.PWD || "userPwd";
const PATH = process.env.PATH || "cluster-XXXX.mongodb.net";
const MONGODB_PATH = "mongodb+srv://" + ID + ":" + PWD + "@" + PATH + "/?useNewUrlParser=true";
const DB_NAME = "test";
const mongo = new MongoDB(MONGODB_PATH, DB_NAME);
```
2. get collection
```javascript
await mongo.getClient();
const collection = await mongo.getCollection('devices');
```
3. use CRUD function
```javascript
await mongo.insert(collection, [{type: "tv", price: 8873}, {
      type: "tablet",
      price: 85810,
      secondHand: {owner: "test"}
    }]);
```
4. close client
```javascript
mongo.close();
```

## Reference

[mongodb document](https://docs.mongodb.com/)