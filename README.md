# Your portfolio

A 3D retro computer and interactive desktop inspired by [Joey de Ruiter's portfolio](https://joeyderuiter.me/). Built with vanilla JavaScript, Three.js, and Vite. No CMS, account, database, or paid API is required to edit or run it.

## Start locally

```sh
cd /Users/rsairamsrujankumar/Projects/PORTFOLIOS/XP/portfolio
npm install
npm run dev
```

Open the Local URL printed in the terminal. Use `npm run build` for production and `npm run preview` to check the build.

## Make content changes

**Edit `public/content.json`.** This is the single source for your name, introduction, projects, experience, skills, links, and resume. Refresh the browser to see content changes.

| What you want to change | Where in `public/content.json` |
| --- | --- |
| Name and title | `profile.name`, `profile.shortName`, `profile.role` |
| Intro and biography | `profile.welcome`, `profile.about` |
| Email | `profile.email` |
| LinkedIn | `profile.linkedin` |
| Photo | Add an image in `public/assets/`, set `profile.avatarUrl` to `/assets/photo.jpg` |
| Resume | Add your PDF in `public/assets/`, set `profile.resumeUrl` to `/assets/resume.pdf` |
| Projects | Add, remove, or reorder entries in `projects` |
| Career and education | Edit `experience` (title, organization, period, description, url) |
| Technologies | Edit the `skills` groups |
| Desktop color | `settings.desktopColor` |
| Skip 3D intro | Set `settings.showSceneOnLoad` to `false` |

Empty contact links and photographs are hidden automatically. The résumé app shows a truthful availability message until a file is configured. No education, job title, private email, location, or personal claims have been invented.

### Add a project

Copy an existing project object. Give `id` the repository name, set a display `name`, write the `description`, add `language` and `tags`, and set `github` and optionally `demo`. Icons available: `folder`, `search`, `brain`, `tag`, `graph`, `book`, `document`.

### Refresh from GitHub

```sh
npm run sync:github
```

This refreshes links, languages, tags, and the repository snapshot. It preserves your curated project selection, order, titles, and descriptions. It never publishes or overwrites your bio. Repositories are served from a local snapshot, so visitors are not subject to GitHub API limits.

## Change the design

- `src/style.css` — colors, window sizes, fonts, responsive layout.
- `src/scene.js` — reference scene models, baked textures, camera and display alignment.
- `src/main.js` — window manager, apps, terminal, sorting visualization, Snake.
- `public/assets/` — your own pictures and resume.

The scene models, baked textures, fonts and desktop icons are adapted from Joey de Ruiter’s Portfolio-next repository. See ATTRIBUTION.md for provenance. Reference fonts and scene assets are bundled locally.

## Deploy anywhere

Live portfolio: **https://sairamsrujan.github.io/retro-portfolio/**

GitHub Pages automatically builds and publishes every push to `main` using `.github/workflows/deploy.yml`. To update the website, edit `public/content.json` (or the design files), commit, and push. You can also edit the content file directly on GitHub. Deployment progress appears in the repository's **Actions** tab.

The Pages build uses `npm run build -- --base=/retro-portfolio/`. To preview that version locally, run `npm run preview -- --base=/retro-portfolio/` and open the `/retro-portfolio/` path. Local photo and résumé paths such as `/assets/resume.pdf` automatically use the correct site prefix.

For other static hosts, `npm run build` creates `dist/` using the root path by default. Upload its contents to your host. If you rename the GitHub repository, update the base path in the workflow and the URL above.

The Sites deployment is configured in `.openai/hosting.json`. Content changes require rebuilding and redeploying. The first deployed version is private to the owner.

## Before you share

Add your résumé, review your name and personal bio, add your contact links, and fill out your complete experience. Current project descriptions and internship details come from public GitHub repositories. The display name is your GitHub handle until you provide your preferred name.
