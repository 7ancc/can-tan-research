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

The editable templates are maintained separately in the local `research-v4-merged-local` project. To update the export, run its builder with `PORTFOLIO_SITE_URL=https://7ancc.github.io/can-tan-research/` and `--output` pointing to this checkout. Review changes and publish through a pull request. Keep `.github/`, `scripts/`, this README and Git metadata intact.

Academic facts and original materials belong to their respective authors. Uploaded supporting records are retained with their corresponding research projects.
