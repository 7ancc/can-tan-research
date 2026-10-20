# Can Tan — Academic Profile

Independent academic website covering AI, finance and empirical research.

Website: https://7ancc.github.io/can-tan-research/

This repository publishes only this project site. It does not replace or deploy the separate `7ancc.github.io` repository or its homepage.

## Contents

- 26 static HTML pages, including 18 complete project pages.
- Research publications, methods, education, experience and original records.
- Local photographs, figures, project documents and the current Academic CV PDF.
- Precompiled project interactions; no Node installation is needed to serve the site.

## Deployment

GitHub Actions validates the static files and deploys pushes to `main` to GitHub Pages. Pull requests run validation without deployment. The workflow uses the `github-pages` environment of this repository only.

Check locally with `python3 scripts/verify-static.py`. For preview, run `python3 -m http.server 8000` and open http://127.0.0.1:8000/.

## V5.1 source and local review

This repository now includes the actual generator: `scripts/build.py`, its integration modules, `projects.json`, the existing `content/` records and `site-config.json`. `scripts/v5_1_integration.py` contains the homepage integration and the minimal Education fact correction; `assets/v5-1.css` is scoped to the homepage. `assets/styles.css` retains the original font tokens and school-card styles.

Edit these sources, then run `python3 scripts/build.py` and `python3 scripts/verify-static.py`. Direct edits to generated HTML are guarded against accidental overwrite. The original local `research-v4-merged-local` generator has also been updated to V5.1, so a new export from that source preserves this version.

For browser acceptance checks, install the optional development dependencies and run `npm run test:browser` against a local server at port8000. Set `PORTFOLIO_TEST_BASE_URL` for another preview address. Screenshots are written to ignored `qa-artifacts/v5-1/`, or the `PORTFOLIO_QA_OUTPUT` directory.

Full project components and precompiled resources remain unchanged apart from the corrected corporate default-risk title. To rebuild components after editing them, use `npm run build:projects`, then regenerate HTML. Normal homepage edits require only Python. No TypeScript/Lint command is currently configured.

V5.1 preserves the original font system and Education design, with research evidence links, grouped publications, focused skills and selected awards. Publish changes through a PR to this repository; its workflow validates PRs and publishes merges to main. Never change `7ancc/7ancc.github.io`.

Academic facts and original materials belong to their respective authors. Uploaded supporting records are retained with their corresponding research projects.
