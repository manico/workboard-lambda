import { MongoClient } from 'mongodb';

const dbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}?retryWrites=true&w=majority`;

export async function handler(event, context) {
  const dbClient = new MongoClient(dbUri, { useNewUrlParser: true });

  await dbClient.connect();
  const dbBoardCollection = dbClient.db('workboard').collection('board');
  const dbBoardDocs = await dbBoardCollection.find({}).toArray();
  
  dbClient.close();

  return {
    statusCode: 200,
    body: JSON.stringify(dbBoardDocs),
  };
};
