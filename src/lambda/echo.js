export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      workingDirectory: process.env.PWD,
      netlifyDev: process.env.NETLIFY_DEV,
      nodeEnv: process.env.NODE_ENV,
    }),
  };
};
