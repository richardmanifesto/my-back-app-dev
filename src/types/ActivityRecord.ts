export type ActivityRecordValues = {
  [key: string]: string
}

/**
 * The activity record type.
 */
export type ActivityRecord = {
  id?             : string
  userId?         : string
  activity_date   : string
  hasStoredRemote?: boolean
  activity_values : ActivityRecordValues
}

/**
 * The activity record type.
 */
export type ActivityUpdateRecord = {
  id?             : string
  userId?         : string
  activity_date?  : string
  hasStoredRemote?: boolean
  activity_values?: ActivityRecordValues
}