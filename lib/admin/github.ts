/**
 * Commits a file straight to `main` via the GitHub Contents API. Used only
 * in production (Vercel's filesystem is read-only there); locally the
 * caller writes to disk instead. A push to `main` is what Vercel is
 * already watching, so this is the same "push and it redeploys" flow used
 * throughout this project, just triggered from a form instead of `git push`.
 */

interface CommitFileOptions {
  /** Repo-relative path, e.g. "content-overrides.json" or "public/images/foo.jpg". */
  filePath: string;
  /** Raw file bytes. */
  content: Uint8Array;
  message: string;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export async function commitFileToGitHub({ filePath, content, message }: CommitFileOptions): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error("GitHub commit is not configured (GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME).");
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Need the current file's sha to update it; a 404 means it doesn't exist yet.
  let sha: string | undefined;
  const existing = await fetch(apiUrl, { headers });
  if (existing.ok) {
    const data = (await existing.json()) as { sha: string };
    sha = data.sha;
  } else if (existing.status !== 404) {
    throw new Error(`GitHub lookup for ${filePath} failed: ${existing.status} ${await existing.text()}`);
  }

  const put = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: bytesToBase64(content),
      branch: "main",
      ...(sha ? { sha } : {}),
    }),
  });

  if (!put.ok) {
    throw new Error(`GitHub commit for ${filePath} failed: ${put.status} ${await put.text()}`);
  }
}

/** True when running on Vercel, where the filesystem can't be written to. */
export function isProductionHost(): boolean {
  return !!process.env.VERCEL;
}
