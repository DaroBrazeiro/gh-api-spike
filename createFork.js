import { Octokit } from "@octokit/rest";

// Configuración
const SOURCE_REPO_OWNER = "DaroBrazeiro";
const SOURCE_REPO_NAME = "repo-creator-test";
const DEST_REPO_OWNER = "DaroBrazeiro";
const DEST_REPO_NAME = "test-repo-5";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function createRepoFromTemplate() {
  try {
    const response = await octokit.repos.createUsingTemplate({
      template_owner: SOURCE_REPO_OWNER,
      template_repo: SOURCE_REPO_NAME,
      owner: DEST_REPO_OWNER,
      name: DEST_REPO_NAME,
      description: 'This is your first repository',
      include_all_branches: false,
      private: false,
    });

    console.log('Repository created successfully:', response.data);
  } catch (error) {
    console.error('Error creating repository', error);
  }
}

createRepoFromTemplate();