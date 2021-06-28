import * as core from "@actions/core";
import * as github from "@actions/github";

export async function run(): Promise<void> {
  try {
    const token = core.getInput("token", {required: true});
    // Required contexts (ie passed checks) need to exclude the current check, since it's incomplete
    const requiredContextsStr = core.getInput("requiredContexts");
    const requiredContexts: string[] = requiredContextsStr ? JSON.parse(requiredContextsStr) : [];

    const octokit = github.getOctokit(token);
    await octokit.rest.repos.createDeployment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: core.getInput("ref") || github.context.sha,
      task: core.getInput("task") || "deploy",
      environment: core.getInput("environment") || "production",
      description: core.getInput("description") || "",
      required_contexts: requiredContexts,
    });
  } catch (e) {
    core.setFailed(e);
  }
}
