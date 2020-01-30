import db from './utility/db';
import response from './utility/response';

const getIdFromEvent = (event) => {
  const query = event.queryStringParameters;
  const queryId = query.id || query._id || data.id || data._id;

  return queryId ? db.getIdBinary(queryId) : null;
};

const createTask = async (event, payload) => {
  const data = payload.data;

  const dbConnection = await db.connect();
  const dbTaskCollection = dbConnection.collection('task');

  const dbTaskDocResult = await dbTaskCollection
    .insertOne({
      name: data.name,
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      actionResult: dbTaskDocResult,
    }),
  }
};

const readTask = async (event) => {
  const dbConnection = await db.connect();
  const dbTaskCollection = dbConnection.collection('task');

  const dbTaskDoc = await dbTaskCollection
    .findOne({
      _id: getIdFromEvent(event),
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify(dbTaskDoc),
  };
};

const updateTask = async (event, payload) => {
  const data = payload.data;

  const dbConnection = await db.connect();
  const dbTaskCollection = dbConnection.collection('task');

  const dbTaskDocResult = await dbTaskCollection
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
      actionResult: dbTaskDocResult,
    }),
  }
};

const deleteTask = async (event) => {
  const dbConnection = await db.connect();
  const dbTaskCollection = dbConnection.collection('task');

  const dbTaskDocResult = await dbTaskCollection
    .deleteOne({
      _id: getIdFromEvent(event),
    });

  return {
    statusCode: 200,
    headers: response.getCommonHeaders(),
    body: JSON.stringify({
      actionResult: dbTaskDocResult,
    }),
  }
};

const executePostAction = {
  create: createTask,
  update: updateTask,
  delete: deleteTask,
};

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const method = event.httpMethod;

  if (method === 'GET') {
    return readTask(event);
  }

  const payload = JSON.parse(event.body);
  const payloadActions = Object.keys(executePostAction);

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
