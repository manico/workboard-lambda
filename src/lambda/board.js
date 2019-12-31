import { MongoClient } from 'mongodb';

const dbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}?retryWrites=true&w=majority`;

let dbCachedConnection = null;

const connectToDb = async () => {
  if (dbCachedConnection) {
    return dbCachedConnection;
  }

  const dbClient = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await dbClient.connect();

  dbCachedConnection = dbClient.db('workboard');

  return dbCachedConnection;
};

export async function handler(event, context) {
  const dbConnection = await connectToDb();
  const dbBoardCollection = dbConnection.collection('board');
  const dbBoardDocs = await dbBoardCollection.find({}).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(dbBoardDocs),
  };
};
