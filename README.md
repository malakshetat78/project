# ICVSP Requirements Management

Manage the existing ICVSP requirements through a web interface while keeping **one persistent Excel workbook per requirement set as the source of truth**.

- Source: https://github.com/malakshetat78/project
- Deployment target: Cloudflare Workers, deployed directly by GitHub Actions
- New public URL: pending destination Cloudflare account configuration and migration
- Frontend: React / Vinext
- Backend: same-origin `/api/workbook` running in a Cloudflare Worker
- Persistence: platform-managed Cloudflare R2, server-side binding `BUCKET`
- No requirements database, no browser-local requirements storage, and no Excel commits after user edits.

## Automatic synchronization

```text
UI → POST /api/workbook → read current .xlsx → validate version/action
   → preserve backup → conditionally replace the same .xlsx
   → reread exact R2 object → verify bytes and requirement fields → refreshed UI
```

The single live object is:

`workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`

The existing workbook was already migrated into the application's R2 storage during initial setup. The deployed app now reads that live object on every request and does not contain an embedded workbook or initialize from GitHub. The backend only reads the exact live key above; it never selects an alternate key or backup. If that object is missing, the backend reports that administrator setup is required instead of creating empty or invented requirements. Redeployment never resets the workbook. There is no new workbook per user or session.

No original workbook data is committed to this public repository. Tests use synthetic fixtures; the original file can be supplied privately through `ICVSP_TEST_WORKBOOK` for additional local verification.

The UI polls the workbook every 15 seconds and refreshes on browser focus. It keeps the version from when an edit started, so polling cannot silently overwrite another user's change. R2 conditional writes reject concurrent stale saves with HTTP 409 and preserve the draft. Opening another browser returns the same workbook.

Each successful save includes an R2 verification receipt: exact key, previous/new ETag, SHA-256, byte length, object upload time and read time. The backend compares the reread bytes and the affected record before reporting success. Failed writes, conditional-write conflicts, or failed verification preserve the form and show an error. The client requests uncached data; API and verification responses explicitly disable browser/CDN caching.

Add/Restore switches to Requirements and clears previous filters so the saved record is immediately visible. The success notice links to `/workbook-verification?id=<ID>`, a read-only page that independently gets the same R2 object and shows its hash, version and saved fields. The page has no write or export code.

**Export Excel is optional.** It reads the current stored workbook; it is not required to save or synchronize anything. The original ChatGPT attachment is an initialization source, not the live file. This deployment does not connect a desktop Excel window or OneDrive to R2: changes must reach the persistent workbook through the application/backend to appear in the UI.

## Existing workbook structure

The original workbook has eight sheets:

| Sheet | Purpose |
| --- | --- |
| How to use | Workbook instructions |
| V diagram | V-model illustration |
| Summary | Existing formula-based summary |
| V-Plan | Development and verification plan |
| Stakeholder needs | Needs identified by SN IDs |
| Requirements | 37 initial requirements: 23 FR and 14 NFR |
| Traceability | Stakeholder, component, module, and verification links |
| Test cases | Test and inspection evidence |

The 16 existing Requirements fields are: `ID`, `Type`, `Area`, `Requirement`, `Rationale`, `Source`, `Acceptance criterion`, `Priority`, `Verification method`, `Verification level`, `Status`, `Evidence`, `Owner (WP)`, `Jira key`, `Review`, `Review Comment`.

Forms and filters use those fields. Existing IDs cannot be renamed because they are referenced by other sheets. New IDs must be unique, including IDs in the Recycle Bin.

The supplied workbook has **no explicitly identified Recovery Requirement type or recovery-parent field**. The Recovery Requirements page reports that fact rather than inferring parents from resilience wording. Existing stakeholder and test links and IDs referenced in Review Comment are displayed as their actual kinds of relationship.

## Excel preservation and recycle bin

The backend edits the Excel Open XML package directly, preserving the original workbook and its supporting parts instead of rebuilding a spreadsheet from JSON.

- All eight visible sheets and existing columns are retained.
- Existing row attributes, cell styles, drawings, shared strings, test information, and supporting content are preserved where technically possible.
- An edit changes only its targeted row/changed cells.
- Existing Summary formula ranges extend on additions; Excel is instructed to recalculate when opened. This app is not a general Excel formula engine.
- Deletes clear the active row without shifting other rows or destroying cross-sheet references.
- The original row XML, fields, ID, deletion time and workspace activity are stored in a registered Office custom XML part inside the **same workbook** (`customXml/icvsp-workspace.xml`). No requirement columns or visible sheets are added for deletion metadata.
- Restore returns the original row and ID. Missing information is never invented.
- A pre-write backup is stored at `workbook/backups/<timestamp>-<uuid>.xlsx`. These are recovery snapshots, not independent active workbooks. Configure lifecycle retention in your storage account if you operate your own deployment.

Editing/re-saving the workbook with an unrelated application may remove custom parts; keep backups before external transformations. The tested operating path is this application's API.

## Access model

The requested deployment is public. Public visitors can read and use the application's Add/Edit/Delete/Restore operations without a ChatGPT account. The application uses same-origin checks, input limits, Excel-safe text validation, unique IDs, and optimistic concurrency. **It is a public collaborative editor, not a permission-controlled team system.** If access should be limited to team editors, add authentication/authorization before sharing it beyond that audience.

No secrets are committed. Neither the client nor GitHub receives R2 storage credentials.

## Local setup

Requires Node.js 24 and pnpm 11.25.0.

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
```

For a normal local checkout, set the portable execution profile and run the development server:

```bash
node --input-type=module -e "import fs from 'node:fs';fs.mkdirSync('.sites-runtime',{recursive:true});fs.writeFileSync('.sites-runtime/execution-profile.json',JSON.stringify({executionProfile:'portable'}))"
pnpm dev
```

See `scripts/execution-profile.mjs` for profile handling. In managed Sites environments the supervised preview sets the managed profile. Local development uses Miniflare's simulated R2 bucket; it is deliberately separate from production. Production workbook data does not become source code.

## GitHub-connected production deployment

The current application and UI are retained. The production target is a single Cloudflare Worker serving both the frontend and same-origin `/api/workbook`, with one persistent R2 workbook. It does not require ChatGPT Sites, Pages, a separate frontend/API origin, or an invented requirements database.

The code and deployment workflow are in `malakshetat78/project`. `.github/workflows/deploy-cloudflare.yml` deploys on pushes to `main` and manual dispatch, serializes deployments, runs tests/type checking, builds the Cloudflare target, deploys it, and checks the resulting public URL. Manual dispatch can run disposable live Add/Edit/Delete/Restore checks without Export. The public frontend/backend URLs appear in the Actions run summary after a successful deployment. No URL is claimed until a real deployment succeeds.

Configure these in GitHub repository settings:

| Setting | Location | Purpose |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Actions repository secret | Deploy the Worker and access its R2 bucket |
| `CLOUDFLARE_ACCOUNT_ID` | Actions repository variable | Destination account |

The production runtime uses only `BUCKET`, bound to `icvsp-requirements-workbook`. It needs no frontend token, application API key or database credentials. `APP_PUBLIC_URL` is derived from actual Wrangler output for acceptance checks. `.env.example` contains no real secrets.

```bash
pnpm build:cloudflare
pnpm deploy:cloudflare
pnpm verify:public https://ACTUAL_DEPLOYMENT_URL --crud
```

`build:cloudflare` selects the standalone Worker entrypoint, excludes Sites middleware/build plugins, and verifies exactly one production R2 binding in `dist/server/wrangler.json`. Deploy uses that generated configuration. This fixes the duplicate BUCKET binding produced by the previous optional configuration. Cloudflare compatibility is checked with Wrangler dry-run; CI builds this production target too.

## One-time workbook migration and cutover

The current live workbook is in a platform-managed R2 bucket. A Worker in your own Cloudflare account cannot automatically inherit that bucket's binding. Moving the complete backend out of Sites therefore requires a one-time migration of the **latest live workbook bytes**, preserving the exact object key, all sheets, formatting, relationships, deleted rows and history. Do not initialize from the original attachment: it may be older than the live data.

See [hosting migration](docs/hosting-migration.md). `pnpm migrate:workbook <CURRENT_BACKEND_ORIGIN>` automates the one-time transfer after source writes are paused. It checks source version/hash/structure, refuses to overwrite a different existing destination object, and verifies destination bytes. Temporary local bytes are removed. This is administrator setup only, never a user save workflow or repeated download/replacement.

After cutover, the new Worker alone writes `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`. Keep the old backend read-only to prevent two diverging writable workbooks. Ordinary code deployment never initializes, copies or overwrites requirement data. Workbook backups remain snapshots, not live session copies.

`.openai/hosting.json` is retained only to identify the old deployment during migration. The Cloudflare production build neither packages it nor depends on its project/bucket. The GitHub source is ready, but a destination-account login/configuration is required before the new public deployment and public browser acceptance can be completed.

## Tests

`pnpm test` verifies:

- The supplied workbook structure: eight sheets, 37 initial requirements and 16 fields. CI uses synthetic records with this structure; private local runs can use the original workbook.
- Add, edit, delete and restore persisted into serialized workbook bytes, then read by a new reader.
- XML validity, original styles and untouched supporting package parts.
- Duplicate/renamed IDs and invalid control characters rejected.
- Repeated additions extend existing Summary formula ranges.
- Storage saves overwrite only the canonical live key, independently reread stored bytes, and reject stale, failed, raced or unverified writes.
- Missing storage never falls back to an older workbook or backup.

`.github/workflows/ci.yml` runs tests, TypeScript checks and a production build for pushes/PRs. Browser acceptance results are documented in `docs/acceptance.md` after live testing. Test-only IDs start with `TEST-`; they are not project requirements.

### Permanent deletion

Recycle Bin entries remain indefinitely until a user restores them or explicitly confirms **Delete Permanently** / **Empty Recycle Bin**. Empty Recycle Bin confirms the total count, including entries hidden by filters. Permanent actions use the same API, conditional R2 overwrite and independent readback of `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`; Export is unrelated. A stale confirmation is rejected rather than deleting newly changed entries. Removed entries cannot be restored through the application. Supporting sheet references and historical safety backups are retained; this is not erasure from historical backups. No timed purge is implemented.

### Two independent Excel requirement sets

The selector separates **ICVSP Requirements** (existing 16 fields, 8 sheets) from **Security Requirements** (supplied 14 fields, 10 sheets). It is a UI/source selector, not a new Excel field or requirement Type value. FR/NFR/EXT values remain exactly as recorded.

- ICVSP live object: `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx` (unchanged).
- Security live object: `workbook/ICVSP_Security_V-Cycle.xlsx`.
- GET `/api/workbook?set=icvsp|security`; POST includes `set` and that workbook's version. Legacy requests without `set` continue to target ICVSP.
- Forms and filters come from the selected workbook's actual headers. Security uses Scope, Owner, Evidence / notes and Existing V-Cycle link; no Priority/Rationale fields are added to it.
- Recycle Bin and Empty Recycle Bin are scoped to the selected set. Confirmations identify the set. Dashboard displays active/deleted counts for each. IDs are unique within each source; operations never search the other source for an ID.
- Every mutation conditionally overwrites only the selected live key and independently reads it back before reporting success. Backups are under `workbook/backups/<set>/`; older ICVSP backups remain untouched. Export is optional.
- Security import is one-time setup via `/api/security-import`. It accepts only the SHA-256 fingerprint of the provided `ICVSP_Security_V-Cycle(2).xlsx`, saves its original bytes with an object-must-not-exist precondition, and verifies the stored hash. It refuses to replace an existing Security workbook. Payload/data are not committed or included in deployment archives.
- Security relationships display the existing Traceability, Test cases, Security goals, Threat model and Targets content; Existing V-Cycle link points to the matching ICVSP search. Recorded ranges such as FR-SEC-05..08 are expanded only for membership display, without modifying the source.
- No automatic purge is added. Permanent deletion removes a selected Recycle Bin entry from the selected live workbook, not historical backups or supporting references.

Run the private supplied-workbook integration check locally with `ICVSP_SECURITY_TEST_WORKBOOK=/secure/path/to/workbook.xlsx pnpm test`. CI uses synthetic content and never contains the private attachment.

### Project Timeline and traceability

The existing navigation now includes **Project Timeline**. It uses the supplied `GNATT CHART.xlsx` independently of both requirement workbooks. One live R2 object, `workbook/GNATT CHART.xlsx`, contains the original five sheets, 67 tasks and 12 source task fields. The weekly chart columns are formulas/layout, not extra task fields. Initialize once using the Timeline import control (or POST the exact supplied workbook bytes to `/api/timeline-import`); the fingerprint guard and conditional create refuse to overwrite an existing live timeline. Do not commit the attachment.

- Weekly/monthly views, previous/next, Today, Fit project, status/workstream/search filters and overdue highlighting use the actual schedule. Original Planned and Waiting for hardware statuses are preserved. Blank dates, progress, lead and links remain unset. A dependency does not imply a finish-to-start constraint; the workbook does not specify dependency types.
- Open a task for all source fields, predecessors, dependent tasks, notes and requirement links. Edit dates, completion percentage, actual fields and dependencies. IDs and Week formulas remain protected. Invalid dates, out-of-range progress, unknown dependencies, self links and dependency cycles are rejected.
- Exact requirement IDs already recorded in task/notes text are navigable. No task-name/area matching is used. Team-selected task-to-requirement links are stored in a registered custom XML part inside the same timeline workbook, without adding or renaming Excel columns. Each link identifies its requirement set; the backend validates active IDs. Missing/deleted requirement links remain visible but cannot open a nonexistent requirement.
- GET `/api/timeline` reads the live workbook and active requirement IDs. POST `{op:"edit", id, version, values, start, end, progress, links}` backs up the old timeline, awaits a conditional overwrite of the same key and independently GETs/compares the saved bytes before returning `receipt.verified=true`. `/timeline-verification?id=C1` independently reads persisted values and the object hash. Optional `?download=1` is export only.
- Unchanged package parts, task rows, styles, validations, conditional formatting, sheets and formulas are preserved. Existing Gantt/Week, Team and Jira Backlog formula caches are refreshed for affected values; Excel is instructed to fully recalculate on opening. Milestones/Lists remain unchanged. Original time-group headings reflect the supplied schedule; changed task dates are authoritative even if a task's physical row remains in its original section.
- Requirements now have natural sorting by actual fields and expandable stakeholder/component/module/test traceability. All original source fields remain available. Missing links are display diagnostics; they do not modify requirements or infer relationships.

Run full private-fixture checks with `ICVSP_GANTT_TEST_WORKBOOK='/secure/path/GNATT CHART.xlsx' ICVSP_SECURITY_TEST_WORKBOOK='/secure/path/security.xlsx' pnpm test`. CI uses synthetic content. No new environment variables, database or storage binding is required; the existing `BUCKET` binding and `WORKBOOK_READ_ONLY` setting cover all three live workbooks. R2 backups for the timeline are under `workbook/backups/timeline/`. When moving hosting, migrate the latest timeline object as well as the two latest requirement objects; never re-seed from the original attachment after editing.

## Relationship analysis and project planning

The graph, matrix and analysis pages read both original requirement workbooks. Explicit source IDs are labeled Recorded; deterministic, evidence-bearing semantic candidates remain Suggested until an administrator reviews them. Shared areas alone never establish dependencies. Conflict flags are scope/wording checks for human review, not definitive conclusions. Analysis does not change requirement status or verification fields. Review decisions are persisted; changed supporting source text triggers Needs Review.

`project/planning.json` in the existing R2 bucket stores team/member records, manually entered relationships, rejected/accepted reviews and activity. Conditional ETag writes, backups and independent read-back protect concurrent edits. It supplements the Excel files rather than becoming a replacement requirements database. All requirement statements and existing test cases remain in their original workbooks. No invented tests or relationships are seeded.

New tasks are appended to the existing Gantt sheet with unique user-entered IDs; original rows remain untouched. Additional task description/team/priority/parent/deliverable fields are registered custom XML metadata in that same workbook. Existing columns and styles are preserved. Task status, test result, and requirement verification remain separate. Team membership is explicitly entered; workstreams/majors are not silently treated as teams. Overlapping assignments and unspecified dependency timing are warnings, without automatic rescheduling.

### Authentication and permissions

Set `ADMIN_EMAILS` as a runtime secret containing the approved administrator account emails. This publication uses the existing Sites sign-in gateway and server-side authenticated identity helpers. Anonymous visitors have read access only. Administrators manage requirements, relationship reviews, teams, member-account mappings and task assignments. Members can update status/progress only on tasks whose primary-owner short name has been explicitly mapped to their authenticated email. Source names alone grant no permissions. Every write route enforces these checks; buttons are not the security boundary.

The current Site owner's authenticated account is configured as the initial administrator. Additional administrator emails must be configured explicitly. No email/password user database has been introduced. Public workbook export remains available as before. If migrating to independent hosting, implement a verified identity provider before enabling writes; the application deliberately rejects untrusted Sites identity headers on non-Sites hosts. Existing deployment code remains available, but identity migration is now a required cutover step.

Existing test cases are shown from the original workbook, including navigation back to their covered requirements. Test-case authoring is not provided: the existing source includes test cases and their original schema remains intact. Security analysis uses actual statements and evidence, not a claim that every listed security technology is implemented.

### Unified requirements insights and saved teams

The sidebar has one Requirements Insights entry and one readable table: requirement ID, statement, and links/review. Search and set selection are available; each row expands related requirements, evidence, test IDs and missing information. The former separate graph/matrix/overview screens are replaced by this single presentation at the user's request; backend relationship analysis and review decisions remain intact.

Team tasks are resolved from saved memberships in `project/planning.json` and the unchanged workbook Lead. An explicit task team takes precedence; otherwise only a unique matching owner membership yields a team. All 6, TBD, unknown or multi-team owners remain unassigned. This is a derived display association (`teamAssignment`), not an automatic workbook edit. Changing saved membership updates grouping on the next read; the original task metadata and Lead are preserved. Teams, Task Management and Gantt use the same resolver. No teams or accounts are seeded or renamed.

### Assigned task creation and recoverable task deletion

Administrators can open Add Task from Task Management, a team card, or an individual member card. The existing full task form opens with the selected team/member prefilled; assignments still require a real saved team and a valid owner. All writes use the existing timeline API and `workbook/GNATT CHART.xlsx`, independently reread and verified before success.

Delete Task requires confirmation. It is recoverable deletion: a deletion marker and timestamp live in the registered custom XML metadata inside the same workbook, preserving original task rows, IDs, fields, formatting and links. Active planning excludes deleted tasks; Gantt exposes Deleted tasks with Restore Task. Active dependents and children block deletion so their links are not silently altered; restore requires any archived predecessors/parent to be restored first. Archived IDs cannot be reused. No timed purge or permanent task deletion is added. Members retain their existing status/progress-only permissions; create/delete/restore require Admin. No native Excel rows are hidden or removed by task deletion, so an optional exported workbook still contains their original rows plus deletion metadata.
