# GitHub Browser Upload Checklist

Date: April 13, 2026

Purpose: clean manual-upload checklist for the `NODRFTSYSTEMSTEST` GitHub repository when using the GitHub web interface instead of `git push`.

## Verified Facts

- The GitHub Pages workflow publishes from repository-root paths: `index.html`, `.nojekyll`, `pages/`, and `src/`.
- The review bundle is located at `C:\Users\nkwtr\Downloads\nOdRFTsYS\review-package`.
- The correct manual-upload action is to upload the contents of `review-package/` into the repository root.
- Do not upload `review-package` itself as a nested folder.

## Upload Checklist

1. Open the local folder `C:\Users\nkwtr\Downloads\nOdRFTsYS\review-package`.
2. Confirm these root-level items are present before upload:
   - `.github`
   - `.nojekyll`
   - `.gitattributes`
   - `.gitignore`
   - `index.html`
   - `pages`
   - `src`
   - `qa-docs`
   - `review-docs`
   - `CLAUDE.md`
   - `GITHUB-UPLOAD-PROTOCOL.md`
   - `RELEASE-EVIDENCE-LEDGER.md`
   - `REVIEW-SUMMARY.md`
   - `robots.txt`
   - `sitemap.xml`
3. In GitHub, open the repository root for `walcottcapitalgroup/NODRFTSYSTEMSTEST`.
4. Choose upload/replace files at the repository root, not inside a subfolder.
5. Drag in all contents from `review-package/`.
6. If GitHub shows a nested `review-package/` directory in the upload preview, stop and restart the upload correctly.
7. Verify these deployment-critical paths appear at repo root after upload:
   - `.github/workflows/deploy-pages.yml`
   - `.nojekyll`
   - `index.html`
   - `pages/capabilities.html`
   - `pages/home.html`
   - `pages/start.html`
   - `src/`
8. Verify these review-support paths are also present:
   - `review-docs/NoDrftSystems_Pricing_Summary_Sheet_2026.md`
   - `review-docs/GitHub_Browser_Upload_Checklist.md`
   - `RELEASE-EVIDENCE-LEDGER.md`
   - `GITHUB-UPLOAD-PROTOCOL.md`
9. In the GitHub upload diff, confirm the pricing changes are visible:
   - `Conversion Landing Page` shows `$2,500`
   - `Authority Website` shows `from $8,500`
   - `Platform Starter` shows `from $15,000`
   - `Ecosystem Build` shows `from $27,500`
   - `Growth` retainer shows `$1,500 / mo`
10. Commit the upload directly to `main` only if the diff matches the expected files and paths.
11. Wait for the GitHub Pages workflow to finish.
12. Recheck the live page at `https://walcottcapitalgroup.github.io/NODRFTSYSTEMSTEST/#/capabilities`.

## Do Not Do

- Do not upload the parent `review-package` folder itself.
- Do not omit hidden files like `.github` or `.nojekyll`.
- Do not upload only `pages/` without `src/`, `index.html`, and workflow files.
- Do not assume a successful file upload means Pages has already redeployed.

## Acceptance Criteria

- Repository root contains the refreshed deployment files.
- `review-docs` includes both the pricing summary sheet and this checklist.
- GitHub Pages deploy completes successfully.
- Live `/capabilities` page shows the revised public pricing.
