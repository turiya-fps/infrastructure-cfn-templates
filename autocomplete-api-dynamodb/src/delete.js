const {
  DynamoDBClient,
  DeleteTableCommand,
} = require("@aws-sdk/client-dynamodb");
const ddbConfig = require("../config/ddb");
const template = require("../template.json");

const docClient = new DynamoDBClient(ddbConfig);

Object.keys(template.Resources).forEach((key) => {
  const Resource = template.Resources[key];
  if (Resource.Type === "AWS::DynamoDB::Table") {
    docClient
      .send(
        new DeleteTableCommand({ TableName: `${key}-dev` })
      )
      .catch((error) => {
        console.log(error);
      });
  }
});
