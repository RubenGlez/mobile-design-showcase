# mobile-design showcase

Interactive fictional product cases that demonstrate what [`mobile-design`](https://github.com/RubenGlez/mobile-design) produces when mobile UI is treated as a product, accessibility, and runtime problem, not a static mockup exercise.

## Cases

- **Solace**: a transfer confirmation that protects confidence in an irreversible flow.
- **Trailguard**: a cycling safety flow with location, offline, and background-execution constraints.
- **Maison North**: a localized checkout that supports RTL and wider layouts.
- **Support queue audit**: a before/after design review with concrete issues and fixes.

The showcase is deliberately separate from the installed skill so executable demos, videos, and visual assets do not add weight to users' skill installations.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser.

## Deployment

Pushing to `main` deploys the static showcase to GitHub Pages through `.github/workflows/deploy-pages.yml`.

The concepts are fictional and are not production products.
