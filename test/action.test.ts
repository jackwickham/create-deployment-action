import nock from "nock";
import * as core from "@actions/core";
import * as github from "@actions/github";
import {run} from "../src/action";

describe("action", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    expect(nock.pendingMocks()).toEqual([]);
    expect(nock.isDone()).toBe(true);
  });

  test("Creates deployment", async () => {
    jest.spyOn(core, "getInput").mockImplementation((input) => (input === "token" ? "token" : ""));
    jest.spyOn(github.context, "repo", "get").mockReturnValue({owner: "user", repo: "repo"});
    github.context.sha = "sha";

    nock("https://api.github.com")
      .post("/repos/user/repo/deployments", (body) => {
        expect(body).toEqual({
          ref: "sha",
          task: "deploy",
          environment: "production",
          description: "",
        });
        return true;
      })
      .reply(201, {id: 1});

    await run();
  });
});
