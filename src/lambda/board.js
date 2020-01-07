import db from './utility/db';

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const query = event.queryStringParameters;
  const queryId = query.id || query._id;

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDoc = await dbBoardCollection
    .findOne({
      _id: db.getIdBinary(queryId),
    });

  return {
    statusCode: 200,
    body: JSON.stringify(dbBoardDoc),
  };
}
