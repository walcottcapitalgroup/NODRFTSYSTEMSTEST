---
name: nodrft-final-sweep-spa
description: 'Final SPA sweep for NoDrftSystems. Use for final website sweep, release polish, visual QA, readability cleanup, hierarchy fixes, responsive cleanup, card sizing and alignment fixes, overlap or overflow cleanup, and no-drift frontend review without redesign.'
argument-hint: 'Optional focus such as route, page, viewport, or release context'
user-invocable: true
---

# NoDrftSystems Final Sweep

## Purpose

Use this skill for the final corrective sweep on an already-implemented NoDrftSystems SPA or marketing site.

The objective is to tighten hierarchy, readability, spacing, consistency, responsive behavior, and release polish without introducing drift.

## Use When

- final website sweep
- release polish pass
- visual QA
- readability cleanup
- hierarchy fixes
- responsive cleanup
- card sizing or alignment fixes
- overlap or overflow cleanup
- premium polish without redesign
- no-drift frontend review

## Source Of Truth

- The implemented SPA, current route behavior, and visible repo state are the primary source of truth.
- Follow the repo guidance that actually exists in the workspace, especially CLAUDE.md, .claude/rules/style-guide.md, qa-docs, and release review artifacts.
- If a document mentioned elsewhere is missing, do not invent it. Fall back to the strongest repeated patterns in the shipped implementation.
- Preserve the current NoDrftSystems posture: premium, structured, commercially credible, serious, restrained.

## Repo-Specific Guardrails

- Preserve the current hash-routed SPA structure and route behavior.
- Keep page partials as partials. Do not add html, head, or body tags to page files.
- Preserve bilingual template rules. Any visible text you edit in shared page templates must continue to use data-en and data-es attributes.
- Keep accessibility requirements intact, including labels, aria-live regions, focus behavior, and meaningful headings.
- Do not imply live form behavior, secure handling, pricing, or offer details that the runtime and approved copy do not actually support.

## Procedure

### 1. Audit Before Changing

Inspect first. Review:

1. route structure
2. page-by-page hierarchy
3. section spacing rhythm
4. repeated card and component consistency
5. heading and paragraph scale
6. CTA visibility and clarity
7. breakpoint behavior
8. overlap, clipping, and overflow
9. visual fatigue points
10. defects that reduce trust or make the build feel unfinished

### 2. Log Issues Before Broad Edits

Group issues into:

- Critical
- Important
- Nice-to-have

For each issue, capture:

- what is wrong
- where it appears
- why it matters
- defect type: defect, weak implementation, or optional refinement
- priority

### 3. Apply Surgical Fixes

Fix in this order:

1. overlap, overflow, and layout breakage
2. heading and text hierarchy
3. spacing and component consistency
4. responsive behavior
5. readability and fatigue reduction
6. restrained polish improvements

Prefer direct corrections over broad rewrites.

### 4. Self-QA After Edits

Verify:

- no overlapping elements
- no obviously cramped sections
- repeated modules are consistent where consistency is expected
- headings read clearly above subheadings and body copy
- CTAs remain visible and meaningful
- mobile and tablet still hold
- no broken interactions in edited regions
- no generic filler or speculative copy was introduced

## Output Format

Return results in this structure:

### A. Audit Summary

Brief summary of overall condition.

### B. Issue Log

Grouped by Critical, Important, and Nice-to-have.

### C. Changes Applied

List the fixes actually made by page, section, or component.

### D. QA Result

State what was verified, what improved, and any remaining concerns.

### E. Open Ambiguities

Call out areas where design intent was not fully verifiable and explain the conservative handling.

## Hard Constraints

Do not:

- redesign the site
- invent missing design intent
- add generic SaaS copy or aesthetics
- introduce decorative clutter or excessive motion
- remove strategically important content just to simplify layout
- make speculative copy, pricing, offer, or credibility claims
- claim completion unless the edited implementation was reviewed after changes