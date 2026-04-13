# Staging Sweep Runbook

Use this runbook only when a real staging or production URL exists.

## Required inputs

- Staging URL
- Shell config proof for `ndrf-site-origin`, `ndrf-form-start-endpoint`, and `ndrf-form-inquiries-endpoint`
- One safe synthetic payload for Start an Engagement
- One safe synthetic payload for Inquiries
- Reviewer name and test date

## Sweep order

1. Core Web Vitals and network shape
2. SSL / TLS verification
3. Schema and AI-readable structure validation
4. Accessibility and keyboard audit
5. Synthetic submits
6. Pricing, proof, and label regression checks

## 1. Core Web Vitals and network shape

- Open the staging URL in Chrome with mobile throttling enabled.
- Record LCP, INP, CLS, and TBT from DevTools Performance.
- Inspect any available runtime metrics and save emitted navigation/resource events if the shell exposes them.
- Record whether third-party requests exist beyond approved dependencies.
- Confirm the shell and representative `pages/*.html` fragments all return HTTP 200 from the same host.

## 2. SSL / TLS verification

- Run SSL Labs or equivalent against the staging hostname.
- Record TLS version support, HSTS, weak cipher findings, and final grade.
- Block release if the grade is below the required standard or if HSTS / TLS posture is missing.

## 3. Schema and AI-readable structure validation

- Validate the rendered page in a schema validator or equivalent tool.
- Confirm `Organization`, `WebSite`, current-page, and breadcrumb data render correctly where supported.
- Confirm one `h1` per page, no skipped heading levels, and clean plain-text extraction for home, Website Packages, about, and Start an Engagement.

## 4. Accessibility and keyboard audit

- Run Axe on home, Website Packages, about, Start an Engagement, inquiries, engagements, and careers.
- Verify route changes move focus to the page `h1`.
- Verify mobile nav traps focus only while open and returns focus to the toggle on close.
- Verify `prefers-reduced-motion` disables non-essential transitions.

## 5. Synthetic submits

- Submit a safe payload through the live Start an Engagement route.
- Submit a safe payload through the live Inquiries route.
- Confirm success appears only after a non-error server response.
- Confirm submitted records reconcile to the intended inbox, CRM, or workflow.
- Confirm failure states remain visible when the endpoint rejects the request.

## 6. Pricing, proof, and label regression checks

- Confirm `Website Packages` is the public label while `#/capabilities` remains the slug.
- Confirm `Start an Engagement` is the public CTA while `#/start` remains the slug.
- Confirm no unapproved prices appear in UI, metadata, schema, or alt text.
- Confirm no unsupported proof metrics, durations, or client names remain public.
- Confirm Careers has no public applicant form unless explicitly approved.

## Evidence to record

- Date / reviewer
- URL tested
- CWV values
- SSL result
- Schema validation result
- Accessibility result summary
- Synthetic submit proof and destination proof
- Pricing / proof regression findings
- Remaining blockers

## Automatic block conditions

- No staging URL exists
- `ndrf-site-origin` is empty or mismatched
- Public form endpoint config is empty or miswired
- Shell loads but page fragments fail
- Synthetic submits do not reconcile
- Any critical accessibility violation remains open
- Any guessed price or unsupported proof claim remains live
