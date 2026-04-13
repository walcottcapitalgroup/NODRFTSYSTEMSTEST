---
description: 'Run the expanded NoDrftSystems final sweep with explicit scope arguments. Use for route-specific, viewport-specific, or release-scoped no-drift audits that should follow the expanded final-sweep skill.'
name: 'NoDrft Expanded Sweep'
argument-hint: 'Scope arguments such as routes, viewports, defect focus, or release context'
agent: 'agent'
---

Use the `nodrft-final-sweep-spa-expanded` skill in [the expanded skill definition](../skills/nodrft-final-sweep-spa-expanded/SKILL.md).

Treat the prompt arguments as the explicit sweep scope.

Interpret the supplied scope text conservatively and normalize it into these buckets when possible:

- routes or pages to review
- viewport targets such as mobile, tablet, or desktop
- defect focus such as hierarchy, spacing, responsive issues, card consistency, or polish
- release context, blockers, or constraints

If no scope arguments are supplied, default to a full-site expanded sweep.

Required workflow:

1. Load and follow the expanded skill.
2. Audit the current implementation before editing.
3. Produce the structured issue log before broad edits.
4. Apply only justified surgical fixes.
5. Run self-QA on the edited areas and report any remaining ambiguities.

Guardrails:

- The implemented SPA and repo guidance are the source of truth.
- No drift. No generic redesign.
- Preserve hash-route behavior, page-partial structure, bilingual template rules, accessibility requirements, and truthful runtime behavior.
- If the scope arguments are ambiguous, state the assumption and continue conservatively instead of redesigning.

Example scope arguments:

- `routes=capabilities,start viewport=mobile,tablet focus=hierarchy,spacing`
- `home + capabilities, mobile only, fix overlap and card consistency`
- `full release sweep, prioritize readability fatigue and CTA clarity`