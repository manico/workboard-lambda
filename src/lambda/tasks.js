import db from './utility/db';
import response from './utility/response';

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const query = event.queryStringParameters;
  const queryLimit = query.limit ? Number(query.limit) : 100;
  const queryOffset = query.offset ? Number(query.offset) : 0;
  const queryBoard = query.boardId || 0;
  const queryColumn = query.columnName;

  const queryFind = {
    boardId: db.getIdBinary(queryBoard),
  };

  if (queryColumn) {
    queryFind.columnName = queryColumn;
  }

  if (query.name) {
    queryFind.name = {
      $regex: query.name,
      $options: 'i',
    };
  }

  console.log(queryFind);

  const dbConnection = await db.connect();
  const dbTaskCollection = dbConnection.collection('task');

  const dbTaskDocs = await dbTaskCollection
    .find(queryFind)
    .skip(queryOffset)
    .limit(queryLimit)
    .toArray();

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      data: dbTaskDocs,
      pagination: {
        limit: queryLimit,
        offset: queryOffset,
      },
    }),
  };
}
