# mobile-design showcase

Interactive fictional product cases that show what [`mobile-design`](https://github.com/RubenGlez/mobile-design) 1.0 does in each of its six modes. The skill works with any stack; the cases show design decisions, not framework code.

## Cases

- **Shape, Kiln**: a one-line request for a ceramics studio app becomes a confirmed brief, with three questions and an assumed answer for each.
- **Design, Solace**: a bank transfer built around a settlement line that never calls pending a success, in light and dark.
- **Critique, Relay**: a generic-looking support queue reviewed with first impression, specificity, P0–P3 findings with rule IDs, and the rebuilt screen.
- **Refine, Levain**: one bake screen in its original, quieter, bolder, and distilled versions.
- **Harden, Trailguard**: an Android ride log through no signal, location off, low battery, and the app being closed mid-ride.
- **Adapt, Maison North**: a checkout across iOS and Android, English, German, and Arabic (RTL), phone and tablet.

The showcase is deliberately separate from the installed skill so executable demos, videos, and visual assets do not add weight to users' skill installations.

## Distribution material

Use the ready-to-adapt copy in [`distribution/launch-kit.md`](distribution/launch-kit.md) when sharing the showcase. Feedback and ideas for future cases belong in [GitHub Issues](https://github.com/RubenGlez/mobile-design-showcase/issues/new/choose).

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser.

## Deployment

Pushing to `main` deploys the static showcase to GitHub Pages through `.github/workflows/deploy-pages.yml`.

The concepts are fictional and are not production products.
