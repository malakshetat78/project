# ICVSP Requirements Management

Manage the existing ICVSP requirements through a web interface while keeping **one persistent Excel workbook as the source of truth**.

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
