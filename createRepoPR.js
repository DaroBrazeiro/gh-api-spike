import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración

// const SOURCE_ORG_NAME = "ueno-tecnologia-org";
const SOURCE_REPO_OWNER = "DaroBrazeiro";
const SOURCE_REPO_NAME = "test-empty-template";
const DEST_REPO_OWNER = "DaroBrazeiro";
const DEST_REPO_NAME = "repo-2";
const NEW_BRANCH_NAME = "development";
const MAIN_BRANCH_NAME = "main";
const COMMIT_MESSAGE = "Copiar código desde el repositorio de origen";
const PR_TITLE = "Copiar código a nuevo repositorio";
const PR_BODY = "Este PR copia el código desde el repositorio de origen.";

// Inicializar Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function createRepoAndPR() {
  try {
      const sourceRepoUrl = `https://github.com/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}.git`;
      const destRepoUrl = `https://github.com/${DEST_REPO_OWNER}/${DEST_REPO_NAME}.git`;
      const tempDir = path.join(__dirname, 'temp-repo');
      await simpleGit().clone(sourceRepoUrl, tempDir);
      const git = simpleGit(tempDir);
      await git.removeRemote('origin');
      await git.addRemote('origin', destRepoUrl);
      await git.fetch('origin');
      await git.rebase(['origin/main']);
      await git.checkoutLocalBranch("development");
      await git.rebase(['origin/development']);
      await git.pull('origin', "development");
      await git.add('.');
      await git.commit(COMMIT_MESSAGE);
      await git.push(['-u', 'origin', "development"]);

      const prResponse = await octokit.pulls.create({
        owner: DEST_REPO_OWNER,
        repo: DEST_REPO_NAME,
        title: PR_TITLE,
        head: NEW_BRANCH_NAME,
        base: MAIN_BRANCH_NAME,
        body: PR_BODY,
      });

      console.log("@@@ prResponse", prResponse.data.errors)
  } catch (error) {
    if (error.status === 422) {
      console.log("error", error)
    } else if (error.status === 401) {
      console.error('Error: Token de autenticación inválido o permisos insuficientes.');
    } else {
      console.error('Error al crear el repositorio o el Pull Request:', error);
      // fs.rm("./temp-repo", { recursive: true });
    }
  }
}

createRepoAndPR();