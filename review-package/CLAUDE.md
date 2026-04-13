# NoDrftSystems - Codex Project Context

## Project Overview

Marketing website for **NoDrftSystems**, a premium website and digital-build firm with a structured public package ladder.

- Public entry message: website and digital-build packages buyers can purchase now
- Upper-tier progression: broader platform and systems capability
- Release status for this refinement pass: `HOLD` until final integrated review

**Live URL:** TBD  
**Dev:** Run a local server from the project root and open `http://localhost:8000/`

---

## Controlled Refinement Supersession

For the current controlled refinement pass, the repo must treat the following decisions as active source of truth:

- Public label changes from `Capabilities` to `Website Packages`
- Route slug remains `#/capabilities`
- Public CTA changes from `Start Qualification` to `Start an Engagement`
- Route slug remains `#/start`
- Careers changes from applicant-flow expectations to `future opportunities + vetted specialist interest only`
- Current SPA routing remains in place for this pass
- Website-package ladder messaging supersedes the older four-model public framing wherever they conflict
- Only prices explicitly approved in the current source-of-truth copy may remain public

If older docs, notes, or page text conflict with the refinement package, follow the updated docs in `docs/page-briefs/`, `docs/copy/`, `docs/glossary.md`, and `docs/qa/` before touching UI files.

---

## Architecture

**Type:** Static SPA (Single-Page Application)  
**Routing:** Hash-based (`#/page`) via `src/js/router.js`  
**i18n:** Attribute-driven EN/ES toggle via `src/js/i18n.js`  
**No build step required** - plain HTML/CSS/JS, no bundler.

### File Layout

```text
index.html              # GitHub-friendly shell entry at repo root
src/index.html          # Backward-compatible redirect to the repo-root shell
src/css/styles.css      # Full design system
src/js/router.js        # Hash router, loads page partials into #app
src/js/i18n.js          # EN/ES content switcher (data-en / data-es)
src/js/main.js          # Entry point - wires router + i18n
pages/*.html            # Page content partials (no <html>/<head>/<body>)
docs/page-briefs/*      # Page-level source guidance for implementation
docs/copy/en/*          # EN source-copy guardrails
docs/copy/es/*          # ES source-copy guardrails
docs/qa/*               # QA and release-gate artifacts
```

---

## Bilingual Strategy

All user-facing text lives in `data-en` and `data-es` HTML attributes on the element that displays it. The `i18n.js` module reads the active language from `<html lang="">` and updates all matching elements.

**Pattern:**
```html
<h1 data-en="Website packages for serious buyers." data-es="Paquetes web para compradores serios."></h1>
```

- Default language: English (`lang="en"`)
- Language preference persisted in `localStorage` key `ndrf-lang`
- `<html lang="">` updated on toggle for screen reader correctness
- Spanish copy should preserve meaning and buyer tone, not literal word-for-word translation

---

## Pages

| Route | File | Public label (EN) |
|-------|------|-------------------|
| `#/` or `#/home` | `pages/home.html` | Home |
| `#/capabilities` | `pages/capabilities.html` | Website Packages |
| `#/insights` | `pages/insights.html` | Insights |
| `#/engagements` | `pages/engagements.html` | Selected Engagements |
| `#/about` | `pages/about.html` | About |
| `#/start` | `pages/start.html` | Start an Engagement |
| `#/careers` | `pages/careers.html` | Careers |
| `#/inquiries` | `pages/inquiries.html` | Inquiries |
| `#/onboarding` | `pages/onboarding.html` | Client Onboarding |
| `#/privacy` | `pages/privacy.html` | Privacy Policy |
| `#/terms` | `pages/terms.html` | Terms of Service |

---

## Forms

Public forms remain client-side in this repository, and live submission URLs resolve from shell meta tags in `index.html`:

- `ndrf-form-start-endpoint`
- `ndrf-form-inquiries-endpoint`
- `ndrf-form-onboarding-endpoint`

Runtime behavior:
1. `preventDefault()`
2. Validate required fields
3. Resolve the live submit URL from shell config
4. On `localhost`, `127.0.0.1`, or `file://`, show preview-only success if no live endpoint is configured
5. On non-local environments, fail closed when no live endpoint exists

Public copy must describe only the mode the runtime actually supports. Do not imply live intake, secure handling, or reserved follow-up beyond the implemented workflow.

---

## SEO

- `<title>` and `<meta name="description">` updated on each route change via `router.js`
- `hreflang` behavior must remain truthful to the current SPA locale strategy
- Open Graph tags in `<head>` must align to the current page purpose
- Metadata should describe website packages and buyer routing before broader systems capability

---

## Accessibility Checklist

- All inputs have `<label for="...">` or `aria-label`
- Form success messages use `aria-live="polite"`
- Mobile nav toggle uses `aria-expanded` + `aria-controls`
- Language toggle uses `aria-label`
- Skip-to-content link is first focusable element in shell
- Route changes should land focus on the page heading

---

## Do Not

- Do not put `<html>`, `<head>`, or `<body>` in page partials
- Do not hardcode English-only strings - always use `data-en` / `data-es`
- Do not expose business plan details, internal prompts, internal scoring logic, or proprietary operating methods
- Do not publish unapproved prices anywhere in public UI, metadata, selectors, helper text, badges, or alt text
- Do not publish quantitative proof, client names, or overexposed case-study detail unless explicitly approved
- Do not route applicants through public buyer intake
- Do not add dependencies without updating this file
