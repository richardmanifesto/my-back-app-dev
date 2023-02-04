import {ObjectId} from "mongodb"

export type ActivityRecordValues = {
  [key: string]: number | string
}

/**
 * The activity record type.
 */
export type ActivityRecord = {
  _id?            : ObjectId
  userId?         : ObjectId
  date            : string
  hasStoredRemote?: boolean
  values          : ActivityRecordValues
}

/**
 * The activity record type.
 */
export type ActivityUpdateRecord = {
  _id?            : ObjectId
  userId?         : ObjectId
  date?           : string
  hasStoredRemote?: boolean
  values?         : ActivityRecordValues
}