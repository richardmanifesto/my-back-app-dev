import {UserRoleType} from "@root/src/types/UserRecord"

export type Claim = {
  isTemporary: boolean
  userId     : string
  role       : UserRoleType
}