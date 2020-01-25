import db from './utility/db';
import response from './utility/response';

const getIdFromEvent = (event) => {
  const query = event.queryStringParameters;
  const queryId = query.id || query._id || data.id || data._id;

  return queryId ? db.getIdBinary(queryId) : null;
};

const createBoard = async (event, payload) => {
  const data = payload.data;

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDocResult = await dbBoardCollection
    .insertOne({
      name: data.name,
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      actionResult: dbBoardDocResult,
    }),
  }
};

const readBoard = async (event) => {
  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDoc = await dbBoardCollection
    .findOne({
      _id: getIdFromEvent(event),
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify(dbBoardDoc),
  };
};

const updateBoard = async (event, payload) => {
  const data = payload.data;

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDocResult = await dbBoardCollection
    .updateOne({
      _id: getIdFromEvent(event),
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

const deleteBoard = async (event) => {

  const dbConnection = await db.connect();
  const dbBoardCollection = dbConnection.collection('board');

  const dbBoardDocResult = await dbBoardCollection
    .deleteOne({
      _id: getIdFromEvent(event),
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
  create: createBoard,
  update: updateBoard,
  delete: deleteBoard,
};

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const method = event.httpMethod;

  if (method === 'GET') {
    return readBoard(event);
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
