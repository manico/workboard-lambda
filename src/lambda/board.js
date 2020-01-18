import db from './utility/db';
import response from './utility/response';

const getBoard = async (event) => {
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
    headers: response.getCommonHeaders(),
    body: JSON.stringify(dbBoardDoc),
  };
};

const updateBoard = async (event, payload) => {
  const data = payload.data;
  const query = event.queryStringParameters;
  const queryId = query.id || query._id || data.id || data._id;

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDocResult = await dbBoardCollection
    .update({
      _id: db.getIdBinary(queryId),
    }, {
      $set: {
        name: data.name,
      },
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      actionResult: dbBoardDocResult,
    }),
  }
};

const executePostAction = {
  update: updateBoard,
};

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const method = event.httpMethod;

  if (method === 'GET') {
    return getBoard(event);
  }

  const payload = JSON.parse(event.body);
  const payloadActions = ['delete', 'update', 'create'];

  if (payloadActions.indexOf(payload.action) < 0) {
    return {
      statusCode: 400,
      headers: response.getCommonHeaders(),
      body: JSON.stringify({
        message: 'Missing action property.',
        details: [
          {
            name: 'allowedActions',
            value: payloadActions,
          },
        ],
      }),
    };
  }

  return executePostAction[payload.action](event, payload);
}
