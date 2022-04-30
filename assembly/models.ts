import { u128 } from "near-sdk-as"
import { AccountId } from "./utils"
export enum RequestState {
  New,
  InProgress,
  Completed,
  Cancelled,
}
@nearBindgen
export class LearningRequest {
  public poster: AccountId //accountId = string
  public description: string
  public title: string
  public courseURL: string
  public requestedAmount: u128 //Money = u128
  public status: RequestState //todo consider enum types 0-available 1-completed
  public collectedAmount: u128 //todo consider enum types 0-available 1-completed

  constructor(
    poster: AccountId,
    title: AccountId,
    detailedJobDescription: string,
    courseURL: string,
    requestedAmount: u128,
    status: RequestState = RequestState.New
  ) {
    this.poster = poster
    this.title = title
    this.description = detailedJobDescription
    this.courseURL = courseURL
    this.requestedAmount = requestedAmount
    this.collectedAmount = u128.Zero
    this.status = status
  }
}

@nearBindgen
export class SubmitLearningRequestArgs {
  work: string
  jobTitle: string
  submitter: string
}

@nearBindgen
export class Nothing {}
