import { Contract } from "../index";

let jobContract : Contract

describe("Contract interface for JobChain", () => {

    it("List jobs", () => {
      expect(jobContract.getAllJobs().length).toBe(0)
    });
  })