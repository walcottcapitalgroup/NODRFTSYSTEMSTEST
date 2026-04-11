# GitHub Upload Protocol

## Overview
This review package is the current handoff bundle for GitHub repository upload and deployment review.

It contains three groups of files:
- Deployment-critical files that the GitHub Pages workflow publishes
- Repository support files that should remain in version control
- Review and QA artifacts for release review

## Verified Deployment Source
The workflow at `.github/workflows/deploy-pages.yml` assembles `_site/` from these paths:
- `index.html`
- `.nojekyll`
- `pages/`
- `src/`

The workflow triggers on push to `main` when any of these change:
- `.github/workflows/deploy-pages.yml`
- `.nojekyll`
- `index.html`
- `pages/**`
- `src/**`

## Files Included in This Package

### Deployment-critical
- `index.html`
- `.nojekyll`
- `.github/workflows/deploy-pages.yml`
- `pages/`
- `src/`

### Repository support
- `.gitignore`
- `.gitattributes`

### Review and release support
- `CLAUDE.md`
- `RELEASE-EVIDENCE-LEDGER.md`
- `REVIEW-SUMMARY.md`
- `qa-docs/`
- `review-docs/`

## Recommended GitHub Upload Method
GitHub's documented path for existing local code is to create the remote repository without pre-populating it with a README, license, or `.gitignore`, then add the remote and push the local files.

Official references:
- [Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Recommended command flow:

```bash
git init -b main
git add .
git commit -m "Prepare GitHub review package"
git remote add origin <REMOTE-URL>
git push -u origin main
```

If the repository is already initialized locally, skip `git init`.

## Manual Upload Guardrails
If a manual browser upload is used instead of Git, verify that these hidden files and directories are preserved:
- `.github/workflows/deploy-pages.yml`
- `.nojekyll`
- `.gitignore`
- `.gitattributes`

Preserve the folder structure exactly. The deployment workflow depends on `pages/` and `src/` remaining at the repository root.

## Pre-Upload Checklist

### Content and trust checks
- [ ] Only approved public pricing is exposed
- [ ] No unsupported proof metrics or client names are present
- [ ] Public labels use `Website Packages` and `Start an Engagement`
- [ ] Careers remains future-opportunities-only unless explicitly changed

### Technical checks
- [ ] No page partial contains `<html>`, `<head>`, or `<body>`
- [ ] `pages/` and `src/` sit at repository root
- [ ] `index.html` and `.nojekyll` are at repository root
- [ ] `.github/workflows/deploy-pages.yml` is present
- [ ] Hidden files are included in the upload method being used

### Review package checks
- [ ] `pages/` in this package matches the workspace copy
- [ ] `src/` in this package matches the workspace copy
- [ ] `qa-docs/` in this package matches the workspace copy
- [ ] Review docs needed for GitHub handoff are present

## Current Package Status
- Last refreshed: 2026-04-11
- `pages/`, `src/`, and `qa-docs/` were copied from the workspace and hash-verified
- Repository support files `.gitignore` and `.gitattributes` are now included
- Supplemental review docs are now included under `review-docs/`
- Release recommendation remains `HOLD` until the blocking items in `RELEASE-EVIDENCE-LEDGER.md` are closed
