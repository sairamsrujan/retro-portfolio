import { readFile, writeFile } from 'node:fs/promises';
const path = new URL('../public/content.json', import.meta.url);
const content = JSON.parse(await readFile(path, 'utf8'));
const username = content.profile.githubUsername;
const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github+json' } });
if (!response.ok) throw new Error(`GitHub returned ${response.status}; local content has not been changed.`);
const repos = await response.json();
// Keep the curated selection, order, display names and custom descriptions.
// Newly created repositories do not appear until you add them to content.json.
for (const project of content.projects) {
  const repo = repos.find(repo => repo.name === project.id);
  if (!repo) continue;
  project.github = repo.html_url;
  project.language = repo.language || project.language;
  project.tags = repo.topics?.length ? repo.topics.slice(0, 4) : project.tags;
  if (repo.homepage && /^https?:\/\//.test(repo.homepage)) project.demo = repo.homepage;
}
content.source.lastSynced = new Date().toISOString().slice(0, 10);
await writeFile(path, JSON.stringify(content, null, 2) + '\n');
await writeFile(new URL('../public/github-repos.json', import.meta.url), JSON.stringify(repos.map(r => ({ name: r.name, description: r.description, html_url: r.html_url, homepage: r.homepage, language: r.language, topics: r.topics, stargazers_count: r.stargazers_count })), null, 2) + '\n');
console.log(`Updated ${content.projects.length} curated projects. ${repos.length} repositories in the local snapshot.`);
