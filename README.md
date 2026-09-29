# portfolio 💼

This is my personal portfolio website (or, I suppose, the source code for it)!
Built with React + Vite and three.js stack to showcase my work in my own style.

## Local preview

```sh
npm install
npm run dev
```

Open the Vite URL at `/portfolio/`. Projects, the expandable archive, and GitHub contributions share the homepage. The old `#/projects` route redirects to the work section.

## Checks

```sh
npm run lint
npm run build
# With Vite running locally and Google Chrome installed:
npx playwright test tests/portfolio.spec.js --reporter=line --workers=1
```

The calendar uses public contribution data and links to GitHub if the service is unavailable. The interactive TV loads in a separate bundle.
