/**
 * The possible record types.
 */
export const UserRoleTypes = [
  "user",
  "admin"
]

/**
 * The possible record types enum.
 */
export type UserRoleType = typeof UserRoleTypes[number]

/**
 * UserRecord.
 */
export type UserRecord = {
  id?                : string
  first_name         : string
  last_name          : string
  email_address      : string
  ailment_description: string
  user_role          : UserRoleType
  date_of_birth      : string
  password?          : string
}

/**
 * UserUpdateRecord.
 */
export type UserUpdateRecord = {
  first_name?         : string
  last_name?          : string
  email_address?      : string
  ailment_description?: string
  date_of_birth?      : string
  user_role?          : UserRoleType
  password?           : string
}