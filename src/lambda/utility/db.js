import { MongoClient } from 'mongodb';

const dbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}?retryWrites=true&w=majority`;

export default {
  connection: null,
  async connect() {
    if (this.connection) {
      return this.connection;
    }

    const dbClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await dbClient.connect();

    this.connection = dbClient.db('workboard');

    return this.connection;
  },
};
