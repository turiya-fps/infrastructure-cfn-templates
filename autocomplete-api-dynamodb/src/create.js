const {
  DynamoDBClient,
  CreateTableCommand,
} = require("@aws-sdk/client-dynamodb");
const ddbConfig = require("../config/ddb");
const template = require("../template.json");

const docClient = new DynamoDBClient(ddbConfig);

Object.keys(template.Resources).forEach((key) => {
  const Resource = template.Resources[key];
  if (Resource.Type === "AWS::DynamoDB::Table") {
    const properties = { ...Resource.Properties, TableName: `${key}-dev` };
    docClient
      .send(new CreateTableCommand(properties))
      .catch((error) => {
        console.log(error);
      });
  }
});
