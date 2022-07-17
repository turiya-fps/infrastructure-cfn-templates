module.exports = {
  apiVersion: "2012-08-10",
  httpOptions: { timeout: 3000 },
  maxRetries: 3,
  endpoint: `http://dynamodb:${process.env.DYNAMODB_PORT}`,
  region: "local",
  credentials: {
    accessKeyId: "xxxx",
    secretAccessKey: "xxxx",
  },
};
