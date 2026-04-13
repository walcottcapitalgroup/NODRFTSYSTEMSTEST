# Review Package Summary

Refreshed: 2026-04-13
Status: `HOLD`

## Overview
This repository and its `review-package/` copy are aligned for GitHub upload and deployment review.

The package now reflects the current website pass, including:
- updated public pages and shell files
- self-hosted font assets under `src/assets/fonts/`
- `robots.txt` and `sitemap.xml`
- GitHub Actions CI at `.github/workflows/ci.yml`

## Current Package Shape

### Root files (`10`)
- `.gitattributes`
- `.gitignore`
- `.nojekyll`
- `CLAUDE.md`
- `GITHUB-UPLOAD-PROTOCOL.md`
- `index.html`
- `RELEASE-EVIDENCE-LEDGER.md`
- `REVIEW-SUMMARY.md`
- `robots.txt`
- `sitemap.xml`

### GitHub workflows (`2`)
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-pages.yml`

### Pages (`11`)
- `pages/about.html`
- `pages/capabilities.html`
- `pages/careers.html`
- `pages/engagements.html`
- `pages/home.html`
- `pages/inquiries.html`
- `pages/insights.html`
- `pages/onboarding.html`
- `pages/privacy.html`
- `pages/start.html`
- `pages/terms.html`

### Source (`17`)
- `src/index.html`
- `src/css/styles.css`
- `src/js/i18n.js`
- `src/js/main.js`
- `src/js/router.js`
- `src/js/runtime-config.js`
- `src/js/telemetry.js`
- `src/assets/favicon.svg`
- `src/assets/logo-geometric.svg`
- `src/assets/logo-nodrft.svg`
- `src/assets/NoDrftSystems logo on dark background.png`
- `src/assets/og-image.svg`
- `src/assets/social-og.svg`
- `src/assets/fonts/InterVariable-Italic.woff2`
- `src/assets/fonts/InterVariable.woff2`
- `src/assets/fonts/JetBrainsMono-Medium.woff2`
- `src/assets/fonts/JetBrainsMono-Regular.woff2`

### QA docs (`8`)
- `qa-docs/accessibility-sweep-checklist.md`
- `qa-docs/ai-readable-structure-checklist.md`
- `qa-docs/conversion-friction-checklist.md`
- `qa-docs/release-readiness-checklist.md`
- `qa-docs/release-readiness-report.md`
- `qa-docs/staging-sweep-runbook.md`
- `qa-docs/structured-completion-report.md`
- `qa-docs/technical-credibility-checklist.md`

### Review docs (`1`)
- `review-docs/README.md`

## Verification Status
- `review-package/` matches the current root copies for `pages/`, `src/`, `qa-docs/`, workflows, and root-level GitHub handoff files
- `robots.txt`, `sitemap.xml`, and `.github/workflows/ci.yml` are included in the package
- repository support files `.gitignore` and `.gitattributes` are included in the package
- current package file count: `49`

## Release Notes Snapshot
- self-hosted Inter and JetBrains Mono font assets added
- public SEO support files created: `robots.txt` and `sitemap.xml`
- CI workflow added for validation, linting, link checks, and Lighthouse CI
- release evidence ledger updated with current blockers and resolved items

## Blocking Items
- bilingual human editorial review of `#/es/` routing behavior
- legal review of the expanded Terms of Service
- live secure form endpoints must be populated at deploy time
- final integrated Lighthouse and manual QA pass still pending

## Source of Truth
- upload process: `GITHUB-UPLOAD-PROTOCOL.md`
- release blockers and evidence: `RELEASE-EVIDENCE-LEDGER.md`
- supplemental review context: `review-docs/README.md`
