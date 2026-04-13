# Evidence Ledger

## Current pass
Controlled website refinement aligned to the current website-package ladder.

## Status
In progress. Release recommendation remains HOLD until Patch 10 closes every blocking item.

## Supersession note
Older evidence or release notes that describe the public commercial offer as Launch / Platform / Ecosystem / Growth Retainer, or that use `Start Qualification` as the current buyer-facing CTA, are superseded for this pass. Historical artifacts remain in the repo for reference, but they are not the source of truth for current public offer architecture, pricing posture, or page-label decisions.

## Locked controls for this pass
- Public label: `Website Packages`
- Public CTA: `Start an Engagement`
- Careers posture: future opportunities and vetted specialist interest only unless later approved otherwise
- SPA routing stays in place for this pass
- Package-ladder messaging supersedes the older four-model public framing where they conflict
- Only explicitly approved prices may remain public

## Evidence entries

### 1. Spec alignment
- source brief: current website refinement package plus updated governing docs in the repo
- matched sections: offer architecture, plain-language positioning, proof posture, trust posture, bilingual continuity, privacy posture, accessibility, and route-level discipline
- deviations: none approved at this stage

### 2. Implementation evidence
- docs-first patch completed before UI editing: yes
- docs updated: `CLAUDE.md`, glossary, relevant page briefs, EN/ES copy placeholders, QA controls, release artifacts
- UI evidence: pending patch-by-patch implementation

### 3. Verification evidence
- regression search matrix: required after every UI patch and again at final integration
- patch-local review gates: required after every patch
- final integrated review: pending
- price approval verification: pending founder decision review where source copy does not explicitly approve pricing

### 4. Resolved in this pass
- pricing aligned to `Service & Pricing Architecture v1` (Discovery Sprint $2,000; Landing Page $2,500; Launch Site from $3,500; Authority Site from $8,500; Platform Starter from $15,000; Ecosystem Build from $27,500; Growth Retainer $1,500/mo)
- approved copy restored on Home, Capabilities, and About per `Copy System`
- Spanish translation gaps closed on Careers, Inquiries, and Start pages
- privacy snippets on Start and Careers aligned to approved Copy System text
- typography defect fixed: removed missing `Tiempos Headline` reference; self-hosted Inter + JetBrains Mono; eliminated Google Fonts third-party request
- SEO meta tags (`canonical`, `hreflang`, `og:url`) hard-coded to `https://nodrftsystems.com`
- careers form endpoint meta tag added; careers form correctly classified as `data-form-kind="careers"`
- support contact (`support@nodrftsystems.com`) published in footer
- Terms of Service expanded with Delaware governing law, binding arbitration clause, and substantive limitation-of-liability language
- Spanish hash routing (`#/es/...`) implemented; language toggle now rewrites URL prefix
- onboarding hard redirect removed; `/onboarding` route is now reachable
- form field semantic fix: `name="risk"` corrected to `name="objective"` on Start an Engagement
- `robots.txt` and `sitemap.xml` created and populated
- CI pipeline (`.github/workflows/ci.yml`) added with HTML validation, CSS/JS linting, Lighthouse CI, and link checking

### 5. Remaining blockers
- human bilingual editorial review of the `#/es/` routing behavior and translated URL states remains required before release
- legal counsel review of expanded Terms of Service remains required before release
- live secure form endpoints (`ndrf-form-start-endpoint`, `ndrf-form-inquiries-endpoint`, `ndrf-form-careers-endpoint`) must be populated at deploy time; empty values will correctly display forms as offline
- final integrated Lighthouse and manual QA pass has not run yet

## Reviewer note
This pass is intentionally fail-closed. Any unsupported price, proof detail, disclosure, or routing claim stays out of the public site until it is explicitly approved and verified.
