import { u128 } from "near-sdk-as"
import {
  Context,
  ContractPromise,
  ContractPromiseBatch,
  PersistentVector,
} from "near-sdk-core"
import { LearningRequest, RequestState } from "./models"
import { ONE_NEAR } from "./utils"

@nearBindgen
export class Contract {
  private learningRequests: PersistentVector<LearningRequest> =
    new PersistentVector<LearningRequest>("LearningRequests")

  @mutateState()
  createLearningRequest(
    title: string,
    description: string,
    requestedAmount: u128,
    courseURL: string
  ): string {
    const poster = Context.predecessor

    //todo validate LearningRequest parameters
    const learningRequest = new LearningRequest(
      poster,
      title,
      description,
      courseURL,
      requestedAmount,
      RequestState.New
    )

    this.learningRequests.push(learningRequest)
    return "LearningRequest successfuly created"
  }

  getAllLearningRequests(): LearningRequest[] {
    const res: LearningRequest[] = []
    for (let i = 0; i < this.learningRequests.length; i++) {
      res.push(this.learningRequests[i])
    }
    return res
  }

  getAvailableLearningRequests(): LearningRequest[] {
    const res: LearningRequest[] = []
    for (let i = 0; i < this.learningRequests.length; i++) {
      if (this.learningRequests[i].status == RequestState.New)
        res.push(this.learningRequests[i])
    }
    return res
  }

  @mutateState()
  cancelLearningRequest(LearningRequestTitle: string): string {
    for (let i = 0; i < this.learningRequests.length; i++) {
      if (this.learningRequests[i].title == LearningRequestTitle) {
        this.learningRequests[i].status = RequestState.Cancelled
        return "success"
      }
    }
    return "not found"
  }

  @mutateState()
  clearLearningRequests(): string {
    for (let i = 0; i < this.learningRequests.length; i++) {
      this.learningRequests.pop()
    }
    return "cleared"
  }

  private generate_fee_message(): string {
    return "You have to deposite the amount of NEARs >= the LearningRequest amount"
  }

  supportLearningRequest(title: string): string {
    const supporter = Context.predecessor
    const deposit = Context.attachedDeposit

    for (let i = 0; i < this.learningRequests.length; i++) {
      if (this.learningRequests[i].title.includes(title)) {
        const request: LearningRequest = this.learningRequests[i]

        request.collectedAmount = u128.add(
          request.collectedAmount,
          u128.div(deposit, ONE_NEAR)
        )

        if (request.collectedAmount >= request.requestedAmount) {
          request.status = RequestState.Completed
          this.learningRequests.replace(i, request) // Update storage with the new request.

          ContractPromiseBatch.create(request.poster).transfer(
            u128.mul(this.learningRequests[i].collectedAmount, ONE_NEAR)
          )
          return "request Status Updated"
        }
        {
          this.learningRequests.replace(i, request) // Update storage with the new request.
          return "value added"
        }
      }
    }

    return "request not found"
  }
}
