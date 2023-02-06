const AWS = require("aws-sdk")

process.env.AWS_ACCESS_KEY_ID     = 1234
process.env.AWS_SECRET_ACCESS_KEY = 1234


// URI and other properties could be load by ENV Vars or by property file (.env)
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
})

const dynamodb = new AWS.DynamoDB()

const userTable = {
  TableName : "users",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id",            AttributeType: "S" },
    { AttributeName: "email_address", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits : 5,
    WriteCapacityUnits: 5
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "email_index",
      Projection: {
        ProjectionType: "ALL"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits : 5,
        WriteCapacityUnits: 5
      },
      KeySchema: [
        {
          KeyType      : "HASH",
          AttributeName: "email_address"
        }
      ]
    }
  ]
}

const userActionsTable = {
  TableName : "user_actions",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits : 5,
    WriteCapacityUnits: 5
  }
}

const activityTable = {
  TableName : "activity",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits : 5,
    WriteCapacityUnits: 5
  }
}

const sessionTable = {
  TableName : "sessions",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits : 5,
    WriteCapacityUnits: 5
  }
}

const tables = [
  userTable,
  userActionsTable,
  activityTable
]

tables.forEach(tables => {
  dynamodb.describeTable({TableName: tables.TableName}, (error, response) => {
    if (response) {
      dynamodb.deleteTable({TableName: tables.TableName}, () => {
        dynamodb.createTable(tables, console.log)
      })
    }
    else {
      dynamodb.createTable(tables, console.log)
    }
  })
})




// dynamodb.createTable(userActionsTable, console.log)
// dynamodb.createTable(sessionTable, console.log)
// dynamodb.createTable(activityTable, console.log)