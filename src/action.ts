import * as core from "@actions/core";
import * as github from "@actions/github";

export async function run(): Promise<void> {
  const token = core.getInput("token", {required: true});

  const octokit = github.getOctokit(token);
  await octokit.rest.repos.createDeployment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: core.getInput("ref") || github.context.sha,
    task: core.getInput("task") || "deploy",
    environment: core.getInput("environment") || "production",
    description: core.getInput("description") || "",
  });
}
