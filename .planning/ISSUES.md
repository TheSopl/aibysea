# Deferred Issues

Issues logged during development for future consideration.

## Open Issues

### ISS-001: Call Logs page too cluttered - needs minimalistic redesign
- **Logged:** 2026-01-27 (Phase 18-01)
- **Priority:** Medium
- **Description:** Call Logs page has too much information displayed, feels overwhelming
- **Suggested improvements:**
  - Collapse filters behind expandable "Filter" button
  - Simplify call list items (hide agent name, show only essential info)
  - Clean up detail panel with fewer sections, more whitespace
  - Remove sentiment emoji, simplify status badges
- **Status:** Open

## Resolved Issues

### ISS-002: Dashboard cards uneven sizing on iPad Air (~820px)
- **Logged:** 2026-01-27 (Phase 18-01)
- **Resolved:** 2026-01-27
- **Fix:** Added `min-w-0` to service cards to prevent content from expanding grid cells
- **Commit:** 81b5b79
