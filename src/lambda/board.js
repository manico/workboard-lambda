import db from './utility/db';

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');
  const dbBoardDocs = await dbBoardCollection.find({}).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(dbBoardDocs),
  };
};
