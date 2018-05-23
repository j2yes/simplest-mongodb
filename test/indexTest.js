const MongoDB = require('../index');
const ID = process.env.ID || "userId";
const PWD = process.env.PWD || "userPwd";
const PATH = process.env.PATH || "cluster-XXXX.mongodb.net";
const MONGODB_PATH = "mongodb+srv://" + ID + ":" + PWD + "@" + PATH + "/?retryWrites=true&useNewUrlParser=true";
const DB_NAME = "test";
const mongo = new MongoDB(MONGODB_PATH, DB_NAME);

describe('test mongodb', function () {
  //with --exit mocha options
  it('#test connection', async function () {
    this.timeout(10000);
    await mongo.getClient();
  });

  it('#test insert', async function () {
    const collection = await mongo.getCollection('devices');
    await mongo.insert(collection, [{type: "tv", price: 8873}, {
      type: "tablet",
      price: 8581,
      secondHand: {owner: "test"}
    }]);
  });

  it('#test find', async function () {
    const collection = await mongo.getCollection('devices');
    const options = [
      {
        field: 'type',
        value: 'tablet'
      },
      {
        field: 'price',
        operator: mongo.COMPARISON_OPERATORS.greaterThan,
        value: 50000
      }
    ];
    const filter = await mongo.makeFilter(options);
    const result = await mongo.find(collection, filter);
  });
});