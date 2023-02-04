import {MongoClient, Collection, InsertOneResult, ObjectId} from "mongodb"
import {UserRecord, UserRoleType} from "../../src/types/UserRecord";
import {ActivityRecord, ActivityRecordValues} from "../../src/types/ActivityRecord"


/**
 * Determine whether the database is empty of all configuration items at this point
 */
export async function isItEmpty(configCollection: Collection<UserRecord>) {
  const items = await configCollection.find().toArray()
  return items === null || items.length === 0
}

export const mongoClientGet = async (): Promise<MongoClient> => {
  const uri = process.env.MONGO_URI

  if (uri === undefined) {
    throw Error("Where is URI?")
  }

 return await MongoClient.connect(uri)
}

export const mongoClientClose = async (client: MongoClient) => {
  await client.close()
}

/**
 * Add an activity record to the DB
 *
 * @param {string} configCollection
 *   The DB collection
 * @param {string} userId
 *   The id of the user the activity is associated with
 * @param {string} date
 *   The activity date
 * @param {ActivityRecordValues} values
 *   The activity values
 */
export async function addAnActivityRecord(
  configCollection: Collection<ActivityRecord>,
  userId          : ObjectId,
  date            : string,
  values          : ActivityRecordValues,
): Promise<InsertOneResult> {
  return await configCollection.insertOne({
    userId: userId,
    date  : date,
    values: values
  })
}

/**
 * Add a user record to the DB
 *
 * @param {string} configCollection
 *   The DB collection
 * @param {string} first_name
 *   The user's first name
 * @param {string} last_name
 *   The user's last name
 * @param {string} email
 *   The user's email address
 * @param {string} ailment_description
 *   The user's ailment description
 * @param {string} role
 *   The user's role
 * @param {string} dob
 */
export async function addAUserRecord(
  configCollection: Collection<UserRecord>,
  first_name         : string,
  last_name          : string,
  email              : string,
  ailment_description: string = "",
  role               : UserRoleType = "user",
  dob                : string = ""
): Promise<InsertOneResult> {
  return await configCollection.insertOne({
    first_name         : first_name,
    last_name          : last_name,
    email_address      : email,
    ailment_description: ailment_description,
    role               : role,
    date_of_birth      : dob
  })
}

/**
 * Wait function.
 *
 * @param {number} time
 *   The number of milliseconds to wait for.
 */
export function wait(time: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}