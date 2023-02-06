import { config, DynamoDB } from 'aws-sdk'

/**
 * Generate a database connection.
 *
 * @constructor
 */
export const DatabaseConnection = (): Promise<DynamoDB> => {
  return new Promise((resolve, reject) => {
    const configSettings = {
      region: process.env.AWS_REGION
    }

    if (process.env.AWS_REGION) {
      // @ts-ignore
      configSettings.endpoint = process.env.AWS_ENDPOINT
    }

    console.log("DatabaseConnection", configSettings)
    console.log("process.env.AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID)
    console.log("process.env.AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY)

    config.update(configSettings)
    resolve(new DynamoDB())
  })
}