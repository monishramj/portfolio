# portfolio 💼

This is my personal portfolio website (or, I suppose, the source code for it)!
Built with React + Vite and three.js stack to showcase my work in my own style.

## Local preview

```sh
npm install
npm run dev
```

Open the Vite URL. The left panel holds the name and navigation; the right panel shows the TV, framed around its screen with the original dawn environment. Channel arrows browse the original bio and seven projects. GitHub activity and contact use the same right panel. Selection is saved in the URL, and `#/projects` opens the first project.

## Checks

```sh
npm run lint
npm run build
# With Vite running locally and Google Chrome installed:
npx playwright test tests/portfolio.spec.js --reporter=line --workers=1
```

The calendar uses public contribution data and links to GitHub if the service is unavailable. The interactive TV loads in a separate bundle and falls back to a regular image if it cannot load. See [the experience architecture](docs/tv-experience.md).
