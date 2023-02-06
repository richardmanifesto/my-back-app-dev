/**
 * The possible record types.
 */
export const UserActionRecordTypes = [
  "account_verification",
  "password_reset"
] as const

/**
 * The possible record types enum.
 */
export type UserActionRecordType = typeof UserActionRecordTypes[number]

/**
 * The user action record.
 */
export type UserActionRecord = {
  id?    : string
  userId : string
  type   : UserActionRecordType
  created: string
}