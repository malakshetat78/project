# ICVSP Requirements Management

Manage the existing ICVSP requirements through a web interface while keeping **one persistent Excel workbook as the source of truth**.

- Source: https://github.com/malakshetat78/project
- Application: https://icvsp-requirements.khaledshetat4.chatgpt.site
- Frontend: React / Vinext
- Backend: same-origin `/api/workbook` running in a Cloudflare Worker
- Persistence: platform-managed Cloudflare R2, server-side binding `BUCKET`
- No requirements database, no browser-local requirements storage, and no Excel commits after user edits.

## Automatic synchronization

```text
UI → POST /api/workbook → read current .xlsx → validate version/action
   → preserve backup → conditionally replace the same .xlsx
   → reread persisted .xlsx → refreshed UI
```

The single live object is:

`workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`

The existing workbook was already migrated into the application's R2 storage during initial setup. The deployed app now reads that live object on every request and does not contain an embedded workbook or initialize from GitHub. An earlier `workbook/current.xlsx` object is migrated if present. If neither object exists, the backend reports that administrator setup is required instead of creating empty or invented requirements. Redeployment never resets the workbook. There is no new workbook per user or session.

No original workbook data is committed to this public repository. Tests use synthetic fixtures; the original file can be supplied privately through `ICVSP_TEST_WORKBOOK` for additional local verification.

The UI polls the workbook every 15 seconds and refreshes on browser focus. It keeps the version from when an edit started, so polling cannot silently overwrite another user's change. R2 conditional writes reject concurrent stale saves with HTTP 409 and preserve the draft. Opening another browser returns the same workbook.

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

## Current deployment (Sites)

`.openai/hosting.json` identifies the existing application and declares `r2: "BUCKET"`; no D1 database is used. Sites provisions and binds the persistent R2 storage and publishes the Worker and frontend together. Keep the same project ID and binding to retain the existing workbook. Public access is managed through the Site's public access setting.

GitHub is the canonical application source. The same tested files are supplied to Sites as the deployment snapshot. The Sites transport repository is generated hosting infrastructure; workbook writes never go to either repository. Source changes in GitHub must be deployed to update the running application; this is distinct from requirement edits, which take effect immediately without deployment.

## Optional deployment from GitHub to your own Cloudflare account

`wrangler.jsonc` and `.github/workflows/deploy-cloudflare.yml` deploy the same application to a Cloudflare account you control. They are an alternative deployment configuration, **not the current production environment**, and require account credentials you supply.

1. Create an R2 bucket named `icvsp-requirements-workbook`. Initialize it once from your existing Excel file (kept outside Git) using `pnpm exec wrangler r2 object put icvsp-requirements-workbook/workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx --file /secure/path/ICVSP_V-Cycle_Reviewed_Updated.xlsx --remote`. Use this only for an empty bucket; never overwrite an existing edited workbook during setup.
2. If moving an existing live deployment, migrate its current live object and backups once through your storage administration tools. Do not initialize over edited production data.
3. Add repository secret `CLOUDFLARE_API_TOKEN` (minimum required Workers/R2 permissions) and repository variable `CLOUDFLARE_ACCOUNT_ID`. Never commit either.
4. Run the **Deploy to your Cloudflare account (optional)** workflow manually. It tests, builds, and deploys `dist/server/index.js` and `dist/client` using the same `BUCKET` binding.
5. Keep the bucket/key unchanged for subsequent releases.

`.env.example` documents those optional settings. The current Sites deployment requires no application `.env` secrets. GitHub Pages alone cannot host this Excel-writing backend.

## Tests

`pnpm test` verifies:

- The supplied workbook structure: eight sheets, 37 initial requirements and 16 fields. CI uses synthetic records with this structure; private local runs can use the original workbook.
- Add, edit, delete and restore persisted into serialized workbook bytes, then read by a new reader.
- XML validity, original styles and untouched supporting package parts.
- Duplicate/renamed IDs and invalid control characters rejected.
- Repeated additions extend existing Summary formula ranges.

`.github/workflows/ci.yml` runs tests, TypeScript checks and a production build for pushes/PRs. Browser acceptance results are documented in `docs/acceptance.md` after live testing. Test-only IDs start with `TEST-`; they are not project requirements.
