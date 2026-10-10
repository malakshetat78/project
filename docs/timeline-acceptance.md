# Timeline and traceability acceptance — 10 October 2026

The existing application was updated in place. No requirement rows were changed during timeline verification.

## Live sources

- ICVSP: `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx` — 37 active, 7 deleted, 16 fields, 8 sheets.
- Security: `workbook/ICVSP_Security_V-Cycle.xlsx` — 37 active, 1 deleted, 14 fields, 10 sheets.
- Schedule: `workbook/GNATT CHART.xlsx` — 67 actual tasks, 12 source fields, 5 original sheets.

The supplied schedule was imported once with SHA-256 `73261674755e89ba5c99b879286aace6beae0e1f6a0b3879cb8a0963fcb85a56`. Workbook files and credentials are not committed to GitHub.

## Actual public-application test

Task C1 was temporarily edited through the UI: start 2026-10-07, end 2026-10-20, progress 55%, status Blocked, dependencies P6/P7/AI1, and explicit links to ICVSP NFR-10 and Security FR-SEC-03. An independent GET of the same R2 object verified all changes. Edited SHA-256: `3012261734e458082e63e3cdd532070d5c7b6a6c2ca5464ddd1f03de24e7dc6f`.

A fresh application session showed those persisted values. Both requirement links opened their correct source records. Security FR-SEC-03's existing ICVSP NFR-10 relationship and SEC-T-03 test-case details were checked. ICVSP FR-01's recorded stakeholder, component and module references were checked. Missing references are displayed as missing rather than fabricated.

C1 was restored to its original start 2026-10-06, end 2026-10-18, 45% progress, In Progress status, P6/P7 dependencies, and no additional explicit links. All original task field values matched the source after independent read-back. Final schedule SHA-256: `86f7750970fe23de9630109e66a5f0c019dd45c42dda804c3d12f61b169d1a1f`. Its bytes differ from the initial upload because workbook activity metadata and formula caches were updated; the original project task values were restored.

ICVSP remained byte-identical: `248100897152517e4f12ebd17b28a0785e4bb0e6c1a36f2393c744a913ad0fac`.
Security remained byte-identical: `63e2713e582263a8301b53e8bbd13f9ad0602c5d674c88f571680d04313c7a5f`.

Weekly/monthly views, previous/next periods, Today, Fit project, workstream filtering, requirement searching/filtering/sorting, and the existing 16-/14-field Add forms were checked. No Export action was used to save anything.

## Automated validation

All 16 tests passed with both supplied workbook fixtures, including concurrent-write protection, requirement lifecycle regressions, actual-workbook preservation, invalid task dates/dependencies/progress, and explicit traceability matching. TypeScript and the production build passed. No existing recycle-bin records were purged during this work.

## Save flow

UI task edit → version-checked API → backup → conditional overwrite of `workbook/GNATT CHART.xlsx` → independent read-back and verification → UI refresh. Requirement saves continue to use their existing separate live workbook keys. Export remains optional.
