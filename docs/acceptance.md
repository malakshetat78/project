# Acceptance checks — 2026-10-03

Application: https://icvsp-requirements.khaledshetat4.chatgpt.site/

| Check | Result | Evidence |
| --- | --- | --- |
| Read | PASS | Public UI loaded 37 original active requirements, 23 FR and 14 NFR; workbook data matched the supplied original records. |
| Add | PASS | Added disposable `TEST-UI-SYNC-20261003` through the public form. Retrieved saved Excel bytes from the API and parsed the new active row (38 active records). |
| Edit | PASS | Edited description and Status through the UI. Parsed the persisted Excel row and verified both changed values. |
| Delete | PASS | Used UI Delete and confirmation. Persisted Excel had 37 active rows and retained the test ID, edited values and original row XML in its registered custom XML recycle part. |
| Restore | PASS | Restored through Recycle Bin. Persisted Excel returned the exact same ID and all edited values (38 active records). |
| Fresh session | PASS | Opened a new application session/tab without signing in to ChatGPT. It independently loaded and displayed the restored record and edited status. |

After testing, the disposable test record was moved back to the Recycle Bin. The final UI has **37 original active requirements**. The pre-existing deleted `NFR-15` item was retained throughout; no user-created item was purged.

The restored workbook was independently parsed and compared with all 37 original requirement field objects. All matched; eight sheets and sixteen fields remained, and every XML/relationship part validated. Saved workbook exports were used only as read-only verification evidence, never as a download/replacement synchronization workflow.

Automated checks also passed against both synthetic fixtures (used in public CI) and the original workbook supplied privately through `ICVSP_TEST_WORKBOOK`: five tests cover structure, serialized CRUD/restoration, formatting/supporting-part preservation, invalid/duplicate IDs and formula range extension. TypeScript and the production build passed.

GitHub CI: https://github.com/malakshetat78/project/actions/runs/37122363050 — success.

Scope: the current release is a public collaborative editor; visitors can edit as well as view. The fresh-session check used another application session in the available browser, not a separate physical computer. An independent terminal HTTP request was denied by the execution environment (403); live UI requests and browser workbook downloads succeeded.

## Persistence investigation and retest — 2026-10-03

The reported export-dependent save could not be reproduced in this investigation. A pre-update Add, without clicking Export, was independently found in the canonical R2 object (uploaded 12:41:36 UTC). The user-created NFR-16 record was already visible in the initial fresh-session load. This does not establish what caused the user's earlier observation.

Confirmed UI visibility defect: Add retained the current page/search/filters, which could hide the saved record. Add and Restore now switch to Requirements, clear filters, and show the affected ID. Storage writes were already separate from Export; the backend now additionally verifies exact persisted bytes, the affected fields, and the saved ETag before returning a success receipt. Browser/CDN caching is explicitly disabled. Alternate-key fallback was removed.

All four below were performed through the deployed public UI. Export was never clicked. After each save, a separate browser tab made a new server request to `/workbook-verification?id=TEST-R2-LIVE-20261003`. That read-only handler calls `BUCKET.get(WORKBOOK_KEY)`, parses those bytes, and displays object metadata; it has no write, export, or client-state path.

Live key for every operation: `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`.

| Action | R2 uploaded time (Cairo, UTC+3) | ETag | Persisted result |
| --- | --- | --- | --- |
| Add | 15:48:16.092 | `a53f9bc28588df979d39169048921986` | Active row exists; description saved; Status Planned |
| Edit | 15:48:44.550 | `edd018e7839e39f448866a881a0800b5` | Description changed; Status Partial |
| Delete | 15:49:15.816 | `a640cb808d179a072b2576fce4cbe853` | Active row absent; all 16 values recoverable inside workbook |
| Restore | 15:49:40.214 | `a3632b029a611654bc75fe4f052bceeb` | Same ID and all edited values active again |

Each operation changed both the ETag and SHA-256. Eight original sheets and sixteen fields remained. Full readback evidence for the disposable record is in `docs/persistence-evidence.json`. The server also checks the reread workbook byte-for-byte against the bytes written.

A new named application session loaded the restored record and edited status without signing in or exporting. Disposable test records were subsequently moved to the Recycle Bin; the existing user-created record was retained.

Automated checks: all eight tests passed, including awaited writes to only the canonical live key, separate readback, stale versions, conditional conflicts, thrown R2 failures, simulated lost writes and missing live objects. TypeScript and production build passed. No direct R2 administration/list API is available in this environment; actual production verification used the deployed Worker's direct R2 binding reads, not a mocked bucket, local workbook, export, or UI state.
