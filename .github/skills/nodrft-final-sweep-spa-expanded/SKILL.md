---
name: nodrft-final-sweep-spa-expanded
description: 'Expanded NoDrftSystems final sweep for release-ready SPA review. Use for structured multi-pass visual QA, technical QA, client-requirements verification, no-drift release polish, readability and hierarchy cleanup, responsive cleanup, and explicit issue logging before edits.'
argument-hint: 'Optional focus such as route set, viewport, release goal, or page cluster'
user-invocable: true
---

# NoDrftSystems Final Sweep Expanded

## Purpose

Use this skill when auditing and refining an already-built NoDrftSystems SPA or website before release.

The objective is not redesign.
The objective is to identify and correct the final layer of defects, inconsistencies, readability problems, hierarchy weaknesses, responsive issues, and polish gaps without introducing drift.

## When To Use

Load this skill when the task involves:

- final website sweep
- release polish
- visual QA
- readability cleanup
- hierarchy fixes
- responsive cleanup
- card sizing or alignment fixes
- overlap or overflow cleanup
- premium polish without redesign
- no-drift frontend review
- multi-pass release review

## Source-Of-Truth Rules

- Use the implemented SPA, actual route behavior, current codebase, repo guidance, and visible content logic as the source of truth.
- Do not assume Figma files or hidden design systems exist unless they are clearly present and relevant.
- Do not invent missing design intent.
- If design intent is ambiguous, infer conservatively from the strongest repeated patterns already implemented.
- Flag unresolved ambiguity explicitly instead of silently redesigning.
- Prefer current repo guidance files that exist in the workspace over older review fragments when they conflict.

## Repo-Specific Rules

- Preserve the hash-based SPA architecture and existing route structure.
- Keep page partials as partials. Do not add html, head, or body tags to files under pages.
- Preserve bilingual template discipline. Any edited visible text in templates must continue to use data-en and data-es attributes.
- If a legal page lacks Spanish translation, keep the documented exception explicit rather than inventing unapproved legal copy.
- Preserve accessibility behavior, including one h1 per page, correct labels, aria-live messaging, focus handling, and meaningful section headings.
- Do not imply runtime behaviors that the code does not support, especially around submissions, secure handling, follow-up promises, or staged-only flows.

## Operating Posture

Preserve the approved NoDrftSystems posture:

- premium
- structured
- commercially credible
- non-generic
- serious
- high-trust
- modern but restrained

Do not convert the product into a generic startup template.

## Primary Objectives

Find and fix issues such as:

- inconsistent card sizing
- overlap and overflow
- broken spacing rhythm
- weak heading and subheading hierarchy
- crowded sections
- visual fatigue
- inconsistent typography scaling
- poor scanability
- weak CTA visibility
- responsive defects
- alignment inconsistency
- unfinished-feeling frontend details
- missing but justified restrained polish

## Hard Constraints

Do not:

- perform uncontrolled rewrites
- invent new offers, sections, or business claims
- flatten brand differentiation
- insert generic startup copy
- add decorative clutter
- over-animate
- rely on nonexistent design files
- remove strategically important content just to simplify layout
- make speculative design decisions without evidence from the build
- break router, i18n, metadata, or form behavior while polishing UI

## Review Sequence

Follow this order.

### Phase 1 - Audit Before Changing

Inspect first. Review:

1. route structure
2. page-by-page hierarchy
3. section spacing
4. card and component consistency
5. heading scale system
6. paragraph width and readability
7. CTA clarity
8. breakpoint behavior
9. image, illustration, and animation usage
10. visual fatigue points
11. credibility-killing defects
12. consistency with repo guidance and existing brand posture

Also verify the edited areas still respect:

- bilingual markup rules
- accessible heading order
- page-partial architecture
- truthful runtime behavior

### Phase 2 - Structured Issue Log

Before broad edits, produce a concise issue log grouped into:

- Critical visual defects
- Hierarchy and readability defects
- Responsive and layout defects
- Polish and consistency defects
- Optional uplift opportunities

For each issue include:

- what is wrong
- where it appears
- why it matters
- defect type: defect, weak implementation, or optional refinement
- priority: Critical, Important, or Nice-to-have

### Phase 3 - Surgical Fixes

Apply direct code fixes.
Prefer surgical corrections over broad rewrites.

Fix in this priority order:

1. overlap, overflow, and layout breakage
2. heading and text hierarchy
3. spacing and component consistency
4. responsive behavior
5. readability and fatigue reduction
6. restrained polish improvements
7. selective image, graphic, or motion treatment only if clearly justified

When editing, keep the current implementation language and component vocabulary intact unless a change is required to fix a real defect.

### Phase 4 - Self-QA

After edits, verify:

- no overlapping elements
- no cramped sections
- no inconsistent repeated cards where consistency is expected
- headings clearly stronger than subheadings
- body text is readable
- section order remains logical
- CTAs remain visible and meaningful
- no generic filler introduced
- mobile and tablet remain usable
- no obvious console or render regressions in edited regions
- no broken interactions in edited regions
- no lost data-en or data-es attributes in touched template content

## Evaluation Standards

### 1. Visual Hierarchy

- Title, heading, subheading, support text, and CTA levels must be clearly distinct.
- Avoid equal-weight text blocks.

### 2. Spacing Rhythm

- Spacing must feel systematic and deliberate.
- Adjacent sections should not feel compressed or erratic.

### 3. Readability

- Reduce dense walls of text.
- Improve scanability while preserving precision and trust.

### 4. Component Consistency

- Repeated modules should feel systemized.
- Normalize internal spacing, padding, alignment, radius, and balance when needed.

### 5. Responsive Quality

- Desktop, tablet, and mobile must all hold.
- No collisions, clipping, overflow, or broken grids.

### 6. Motion And Imagery

- If visual lift is needed, keep it restrained and premium.
- Avoid gimmicks, random illustrations, or pasted-in aesthetics.

### 7. Brand Fit

- The result must feel serious, contemporary, controlled, and commercially credible.
- It must not feel like a default template.

### 8. Source Discipline

- Do not fabricate hidden approvals or missing design systems.
- Flag ambiguity instead of pretending certainty.

### 9. Technical Truthfulness

- Route behavior, metadata handling, language switching, and form runtime behavior must remain truthful after edits.
- Do not improve copy in a way that overstates what the implementation actually does.

## Output Format

Return work in this format.

### A. Audit Summary

Brief summary of overall condition.

### B. Issue Log

Grouped by:

- Critical
- Important
- Nice-to-have

### C. Changes Applied

List actual fixes by page, section, or component.

### D. QA Result

State:

- what was verified
- what improved
- remaining concerns
- anything needing human review

### E. Open Ambiguities

List areas where design intent was not fully verifiable and explain the conservative handling.

Do not claim completion unless the implementation was actually reviewed after edits.

## Acceptance Criteria

The sweep is only acceptable if:

- layout defects are eliminated or explicitly documented if blocked
- hierarchy is improved
- scanability improves
- visual fatigue is reduced
- code quality is not degraded
- NoDrftSystems positioning is preserved
- no drift is introduced
- unresolved ambiguity is explicitly flagged