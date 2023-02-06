import {UserRecord} from "../../src/types/UserRecord"

export const TestUsers: Array<UserRecord> = [
  {
    first_name         : "First",
    last_name          : "Test",
    email_address      : "test@test.com",
    user_role          : "user",
    ailment_description: "",
    date_of_birth      : "1970-01-01"
  },
  {
    first_name         : "Second",
    last_name          : "Test-two",
    email_address      : "secon-testd@test.com",
    user_role          : "admin",
    ailment_description: "I have a bad back",
    date_of_birth      : "1970-02-01"
  }
]