import {ObjectId} from "mongodb"
import {ActivityRecord} from "../../src/types/ActivityRecord"

export const TestActivities: Array<ActivityRecord> = [
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-19T00:0:00.00Z",
    values: {
      exercise_value: "Yes",
      exercise_notes: ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-20T00:0:00.00Z",
    values: {
      exercise_value: "Yes",
      exercise_notes: "Some activity notes",
      sleep_value   : 2,
      sleep_notes: ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-21T00:0:00.00Z",
    values: {
      exercise_value: "Yes",
      exercise_notes: "Some activity notes",
      sleep_value   : 2,
      sleep_notes: ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-22T00:0:00.00Z",
    values: {
      exercise_value: "No",
      exercise_notes: "Some activity notes",
      sleep_value   : 3,
      sleep_notes    : ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-24T00:0:00.00Z",
    values: {
      exercise_value: "No",
      exercise_notes: "Some activity notes",
      sleep_value   : 7,
      sleep_notes   : ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-25T00:0:00.00Z",
    values: {
      exercise_value: "No",
      exercise_notes: "Some activity notes",
      sleep_value   : 5,
      sleep_notes   : ""
    }
  },
  {
    userId: new ObjectId("63c7354e206df4f5128e765a"),
    date  : "2023-01-26T00:0:00.00Z",
    values: {
      exercise_value: "No",
      exercise_notes: "Some activity notes",
      sleep_value   : 9,
      sleep_notes   : ""
    }
  }
]
