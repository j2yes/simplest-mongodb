const MongoDB = require('../index');
const ID = process.env.ID || "userId";
const PWD = process.env.PWD || "userPwd";
const PATH = process.env.PATH || "cluster-XXXX.mongodb.net";
const MONGODB_PATH = "mongodb+srv://" + ID + ":" + PWD + "@" + PATH + "/?useNewUrlParser=true";
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
      price: 85810,
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

  it('#test update', async function () {
    const collection = await mongo.getCollection('devices');
    const filterOptions = [
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
    const filter = await mongo.makeFilter(filterOptions);
    const updateDataOptions = [
      {
        operator: mongo.FIELD_UPDATE_OPERATOR.increments,
        dataObject: {price: 10000}
      },
      {
        operator: mongo.FIELD_UPDATE_OPERATOR.sets,
        dataObject: {type: 'printer'}
      }
    ];
    const updateData = mongo.makeUpdateData(updateDataOptions);
    const result = await mongo.update(collection, filter, updateData);
  });

  it('#test upsert', async function () {
    const collection = await mongo.getCollection('devices');
    const filterOptions = [
      {
        field: 'type',
        value: 'printer'
      },
      {
        field: 'price',
        operator: mongo.COMPARISON_OPERATORS.greaterThan,
        value: 50000
      }
    ];
    const filter = await mongo.makeFilter(filterOptions);
    const updateDataOptions = [
      {
        operator: mongo.FIELD_UPDATE_OPERATOR.increments,
        dataObject: {price: 10000}
      },
      {
        operator: mongo.FIELD_UPDATE_OPERATOR.sets,
        dataObject: {os: 'android'}
      }
    ];
    const updateData = mongo.makeUpdateData(updateDataOptions);
    const result = await mongo.upsert(collection, filter, updateData);
  });

  it('#test count', async function () {
    const collection = await mongo.getCollection('devices');
    const filterOptions = [
      {
        field: 'os',
        value: 'android'
      }
    ];
    const filter = await mongo.makeFilter(filterOptions);
    const result = await mongo.count(collection, filter);
  });

  it('#test delete', async function () {
    const collection = await mongo.getCollection('devices');
    const filterOptions = [
      {
        field: 'type',
        value: 'tv'
      }
    ];
    const filter = await mongo.makeFilter(filterOptions);
    const result = await mongo.remove(collection, filter);
  });

  it('#test close', async function () {
    mongo.close();
  });
});