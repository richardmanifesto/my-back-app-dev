import { config, DynamoDB } from 'aws-sdk'
import {config as awsConfigSettings }from "@root/aws-exports"

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
    // if (typeof process.env.AWS_REGION !== 'undefined') {
    //   // @ts-ignore
    //   configSettings.endpoint = process.env.AWS_ENDPOINT
    // }

    console.log("DatabaseConnection", awsConfigSettings)

    config.update(awsConfigSettings)
    resolve(new DynamoDB())
  })
}