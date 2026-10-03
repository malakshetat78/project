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
