import { config, DynamoDB } from 'aws-sdk'

/**
 * Generate a database connection.
 *
 * @constructor
 */
export const DatabaseConnection = (): Promise<DynamoDB> => {
  return new Promise((resolve, reject) => {
    // const configSettings = {
    //   region: process.env.AWS_REGION
    // }
    //
    // if (process.env.AWS_ENDPOINT) {
    //   // @ts-ignore
    //   configSettings.endpoint = process.env.AWS_ENDPOINT
    // }
    //
    // // console.log("DatabaseConnection", config)
    //
    // config.update(configSettings)
    resolve(new DynamoDB())
  })
}