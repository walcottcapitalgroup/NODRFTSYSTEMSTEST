# Release Readiness Checklist

## Must all be true
- [ ] Task matched the current refinement package and approved governing docs.
- [ ] Docs-first supersession patch completed before UI edits began.
- [ ] Website Packages / Start an Engagement / Careers posture supersession note is present in the governing docs.
- [ ] Implementation is real.
- [ ] Regression search matrix ran after every patch on touched files.
- [ ] Patch-local review gates ran after every patch.
- [ ] Final integrated review ran across all touched routes and shell metadata.
- [ ] Only approved prices remain public.
- [ ] No unsupported proof metrics, durations, or named-client claims remain public.
- [ ] Careers has no public applicant form or application CTA unless explicitly approved.
- [ ] Workflow-specific privacy notices match the actual live behavior.
- [ ] EN/ES parity is preserved on all touched routes.
- [ ] Accessibility checks passed or accepted with documented risk.
- [ ] Metadata and structured data reflect the current public page labels and truth posture.
- [ ] Evidence ledger is current.
- [ ] Completion report is complete.
- [ ] Critical defects are resolved.
- [ ] Final anti-drift review passed.

## Automatic block conditions
- [ ] Any guessed price or inferred price framing.
- [ ] Any fake success state.
- [ ] Any unsupported trust, security, privacy, or compliance claim.
- [ ] Any unsupported public proof metric or named-client claim.
- [ ] Any fragment 404/403 or shell/partial version mismatch.
- [ ] Any empty or miswired public form endpoint outside localhost preview.
- [ ] Any critical bilingual parity defect.
- [ ] Any release-critical routing or metadata defect.
- [ ] Any unresolved critical issue.
