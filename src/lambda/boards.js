import db from './utility/db';
import response from './utility/response';

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const query = event.queryStringParameters;
  const queryLimit = query.limit ? Number(query.limit) : 10;
  const queryOffset = query.offset ? Number(query.offset) : 0;
  const queryFind = {};

  if (query.name) {
    queryFind.name = {
      $regex: query.name,
      $options: 'i',
    };
  }

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDocs = await dbBoardCollection
    .find(queryFind)
    .skip(queryOffset)
    .limit(queryLimit)
    .toArray();

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      data: dbBoardDocs,
      pagination: {
        limit: queryLimit,
        offset: queryOffset,
      },
    }),
  };
}
