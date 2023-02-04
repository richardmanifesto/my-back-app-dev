import {ActivityRecord} from "./ActivityRecord"

export type DataPage = {
  items      : Array<ActivityRecord>
  currentPage: number
  nextPage?  : number
}