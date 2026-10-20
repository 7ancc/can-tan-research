# V5.1 — approved release candidate

Date: 2026-10-20. Branch: `feature/v5-1-integration`.
Baseline: `7dd6b9bb0f81c02d0b46ef39b1c5a223961519fc`.
The user approved publishing the reviewed V5.1 on20 October, together with a single-line Methods summary and the latest visiting-research CV. Publication proceeds through a PR and the existing GitHub Actions workflow.

## Requested exceptions

- **Education preserved:** original stylesheet, school-card markup, logos, course grids, grades, ranks and seven education honours remain. The recommendation-selection distinction moves from the Shandong master's card to Guangdong Ocean University's undergraduate card. The same correction applies to the full Education page. Home keeps4 master's courses and8 selected undergraduate courses; full Education keeps4+12.
- **Fonts preserved:** original `--font` and `--serif` tokens remain byte-identical in `assets/styles.css`. Existing data numerals retain bold Times New Roman. No new font assets, Google Fonts or global font replacement.
- **Awards single line:** `Selected Honours & Awards.` is a single line at1440px and1024px. It wraps naturally on390px and320px, with no horizontal overflow.

## Homepage integration

The generator assembles the page from existing sections and records, with a dedicated V5.1 integration module. The concept document was not copied over the production index.

- Hero research positioning and introduction follow V5, retaining the real portrait and original destinations.
- Statistics correctly show3 peer-reviewed publications and2 submitted first-author manuscripts.
- About uses the confirmed researcher qualities, with two clickable In Practice links per card; repeated ranking/award claims are omitted.
- Publications separate Published Research(3) and Submitted Manuscripts(2); author roles and existing DOI/legal PDF destinations remain accurate. The Chinese article's published PDF verifies Tan Can as first author and Wen Mingming as second/corresponding author.
- Nine selected projects retain3/4/2 tabs, keyboard controls, focus-query deep links, real images and project routes. All18 full project entries remain available. The default-risk terminology and all-projects link label are corrected.
- Contribution, task-oriented methods, four selected awards, additional experience and visiting-research contact sections follow the reference's structure.
- Existing SEO/canonical URLs, responsive navigation, media viewer, expanded research materials and CV are retained.

## Maintainable source

The publication repository now contains the real Python generator and its modules. The separate local `research-v4-merged-local` source was updated too. The reference handoff is not required at build time.

Primary edits:

| Files | Purpose |
| --- | --- |
| `scripts/v5_1_integration.py` | V5.1 section composition, curated copy and minimal Education correction |
| `assets/v5-1.css` | Homepage-only visual integration and responsive layout; no school-card selectors |
| `scripts/build.py` | V5.1 hook and repository `site-config.json` support |
| `projects.json` | Corporate default-risk project title |
| `index.html`, `education.html`, `research.html`, `project-credit.html` | Regenerated output; other22 HTML pages unchanged |
| `content/full-project-fragments.json`, `assets/full-project.js` | Rebuilt full-project title; only the credit fragment changes, exactly in that title |
| `scripts/merge_content.py`, `scripts/profile_polish.py`, `scripts/reference_refinement.py`, `scripts/build-full-projects.cjs`, `scripts/generated-sha256.json` | Retained build pipeline now tracked with the export |
| `site-config.json`, `package.json`, `README.md` | Reproducible build, optional browser tooling and maintenance instructions |
| `scripts/verify-static.py`, `scripts/verify-v5-1.py`, `scripts/verify-v5-1.cjs`, `tests/` | Build reproducibility, content/preservation and browser acceptance checks |
| `.gitignore` | Ignore local review screenshots |

`.github/workflows/pages.yml` is unchanged. The unrelated `7ancc/7ancc.github.io` repository was not edited.

## Checks actually performed

- `npm run build:projects` in the original generator: passed.
- Python generation and `python3 scripts/build.py --check`: passed in both source and publication checkout.
- `python3 scripts/verify-static.py`: passed26 pages and1,473 local resource/link/anchor checks, plus source reproducibility and V5.1 assertions.
- `python3 scripts/verify-merge.py` in the original generator: passed26 pages,18 projects,22 detailed source records,75 honours and520 preserved original media files; both original source directories' hashes unchanged.
- Additional preservation assertions cover550 existing media/style/interaction assets, including the exact original stylesheet and current CV.
- Browser checks at1440,1024,768,390,320px: no horizontal overflow, desktop Awards single line, mobile navigation and keyboard tabs working, Education computed styles match pre-edit baseline.
- Actual navigation checks cover9 selected project links,2 manuscript details, all9 header destinations,18-project index, Experience, Achievements, PDF responses and expanded-material figure viewer.
- `git diff --check`: passed.
- No TypeScript or Lint command exists; these were not reported as passed.

## External links and remaining limitations

- PLOS DOI: redirects to the correct article, HTTP200.
- FRL DOI: resolves to Elsevier's linking hub, HTTP200. The complete final publisher article body was not independently audited.
- Chinese paper PDF and Academic CV: actual clicks request the correct PDF, HTTP200; bytes/signatures and preservation checked. The headless browser's native PDF load event times out, so visual PDF-viewer rendering is not claimed.
- ORCID: HTTP200.
- **Google Scholar userID `nFn48qkAAAAJ`: the user has explicitly reconfirmed the existing complete URL, which is retained unchanged.** This check environment returned HTTP404, including standard links without the old query options; external availability is therefore not claimed as verified.
- Mail button activation and mailto address checked without opening an email client or sending mail.

Intentional differences from the concept: preserve original Education and fonts; keep compact existing statistic numerals; retain the original contact/profile destinations; do not claim independent development of the team NLP model; show original professional/tool foundations without duplicating them; omit concept-only preview controls and placeholder imagery.

The mechanical scan's remaining warnings mainly concern deliberately retained V5 cards/kickers/badges and original Education label contrast. New small method labels were increased to11px and new section labels darkened; original Education styling was not changed in response to a design heuristic.

## Review locally

- Page: http://127.0.0.1:8000/
- Screenshot gallery: http://127.0.0.1:8000/qa-artifacts/v5-1/review.html

Review artifacts are ignored and not part of the publication package. User approval to publish was received on20 October. The independent original website remains outside the release scope.


## Local refinement — 20 October

This round changes only the homepage assembly and homepage-only stylesheet. Other25 HTML pages, original stylesheet/JavaScript/full-project assets, Hero, Education and Contact are unchanged against the pre-refinement snapshot.

- About: removed the explanatory subtitle; adopted the three supplied paragraphs; added six project/publication links in aligned In Practice footers; reduced the heading by approximately9%.
- Publications: removed the explanatory section subtitle; all five paper cards and their facts/destinations remain unchanged.
- Research: desktop title is one line. The direction summary is two explicit lines at desktop widths; tabs and cards remain unchanged.
- Contribution: three compact task cards now have Relevant Experience footers and direct credit/NLP/publication links, plus a brief contact anchor.
- Skills: two core capability cards, two complementary cards, three smaller tool modules, and a quiet Languages/Qualifications row. Causal implementation lists Stata only; the supplied project evidence does not establish Python implementation for that study. AI/automation tools are labelled Additional familiarity.
- Awards: removed the redundant closing sentence, enlarged award names, reduced section spacing, retained four consistent line icons and added a filled-circle hover/focus state. The complete archive link remains.
- Experience: its summary is two explicit desktop lines. Existing experience cards remain unchanged.

Actual files for this round: `scripts/v5_1_integration.py`, `assets/v5-1.css`, regenerated `index.html`, `scripts/generated-sha256.json`, both V5.1 verification scripts, and this review note. The generator module and CSS are synchronized with the separate editable source. Local screenshots/gallery are ignored review artifacts.

Browser assertions at1920/1440/1024px verify equal-height About/Contribution cards, aligned footer borders, single-line Research/Awards titles, and two-line Research/Awards/Experience descriptions. At768/390/320px content is responsive without horizontal overflow. New proof/capability links resolve locally, award-circle hover changes fill and contrast, and existing tab/navigation/project/PDF checks pass. Section screenshots hide the sticky header only for capture, so the header does not obscure a long captured section; the real navigation is unchanged.


## Final approved changes

- The Methods introduction is one line at1440/1024/768px and wraps naturally on390px; original fonts and content are unchanged.
- Replaced `assets/can-tan-academic-cv.pdf` with the user-supplied `CV-Tancan（访学）.pdf` (257,242 bytes, SHA-256 `13cd1afad28ebf6daba8874eb4753d341f06211afce6191c8a148cd7d475591c`). Existing CV links remain valid. The preservation fixture was updated only for this explicitly requested replacement.
- Final browser acceptance:1920/1440/1024/768/390/320px, no page errors,30 navigation/resource checks, original Education computed styles preserved.
