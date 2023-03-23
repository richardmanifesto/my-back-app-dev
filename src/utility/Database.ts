import { config, DynamoDB } from 'aws-sdk'
// import exportConfig from "../aws-exports"

/**
 * Generate a database connection.
 *
 * @constructor
 */
export const DatabaseConnection = (): Promise<DynamoDB> => {
  return new Promise((resolve, reject) => {
    // const configSettings = {
    //   region: process.AWS_REGION
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

    // console.log("exportConfig", exportConfig)
    console.log("env", process.env)

    resolve(new DynamoDB())
  })
}