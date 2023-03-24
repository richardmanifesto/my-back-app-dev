import { config, DynamoDB } from 'aws-sdk'
// import exportConfig from "../aws-exports"

/**
 * Generate a database connection.
 *
 * @constructor
 */
export const DatabaseConnection = (): Promise<DynamoDB> => {
  return new Promise((resolve, reject) => {
    const configSettings = {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
    //
    // if (process.env.AWS_ENDPOINT) {
    //   // @ts-ignore
    //   configSettings.endpoint = process.env.AWS_ENDPOINT
    // }
    //
    // // console.log("DatabaseConnection", config)
    //
    config.update(configSettings)

    // console.log("exportConfig", exportConfig)
    console.log("env", process.env)

    resolve(new DynamoDB())
  })
}