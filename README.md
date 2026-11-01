# Luce Portfolio

A single-page portfolio for Luce: prop firm trader, macro and geopolitical analyst, developer, and Universitas Amikom Yogyakarta student.

## Local preview

No build step is required. Open `index.html` in a browser, or serve the folder with any static server.

```bash
npx serve .
```

## Publish on GitHub Pages

1. Update `hello@luce.dev` in `index.html` with Luce's preferred email address.
2. Create a GitHub repository and push this project to its `main` branch.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy-pages.yml`) deploys automatically on every push to `main`.

The deployed site will be available at `https://<github-username>.github.io/<repository-name>/`.
