export const DynamoUserTable = {
  TableName : "users",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits : 1,
    WriteCapacityUnits: 1
  }
}

// const tt = {
//     TableName: "keys",
//     KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 1,
//       WriteCapacityUnits: 1,
//     },
//     data: [
//       {
//         id: "50",
//         value: { name: "already exists" },
//       },
//     ],
//   }}

export const DynamoUserActionsTable = {
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

export const DynamoActivityTable = {
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

export const DynamoSessionTable = {
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