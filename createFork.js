import { Octokit } from "@octokit/rest";

// Configuración
const GITHUB_TOKEN = "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";
const SOURCE_REPO_OWNER = "DaroBrazeiro";
const SOURCE_REPO_NAME = "repo-creator-test";
const DEST_REPO_OWNER = "DaroBrazeiro";
const DEST_REPO_NAME = "test-repo-5";
const BRANCH_NAME = "main";
const NEW_BRANCH_NAME = "copiar-codigo";
const COMMIT_MESSAGE = "mensaje que va en el commit";
const PR_TITLE = "titulo del PR";
const PR_BODY = "Body del PR";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

async function createRepoFromTemplate() {
  try {
    // Create a new repository using a template
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