# Move the existing application from Sites to GitHub-deployed Cloudflare Workers

Status: code/build preparation complete; destination account authorization, workbook migration, production deployment and public-browser acceptance are pending. Do not interpret earlier Sites acceptance results as testing a new Cloudflare URL.

## Architecture

GitHub Actions deploys the existing Vinext frontend and API together to Cloudflare Workers. The public application gets a real `workers.dev` URL (or an account-owned custom domain). `/api/workbook` is on that same origin. Runtime `BUCKET` binds the account-owned R2 bucket `icvsp-requirements-workbook`. The sole live key remains `workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx`.

The UI is unchanged. Existing synchronization logic and workbook preservation remain. No static replacement, cross-origin proxy to Sites, or separate requirements database is introduced.

## Account setup

1. Sign in to the destination Cloudflare account and enable R2 if required. Any billing/terms step must be completed by the account owner.
2. Provision the bucket `icvsp-requirements-workbook`. Keep it private; Worker bindings provide access.
3. Configure GitHub repository secret `CLOUDFLARE_API_TOKEN` and repository variable `CLOUDFLARE_ACCOUNT_ID`. Use an account-scoped token with only permissions needed to deploy this Worker and access its R2 bucket. Never paste the token in chat or commit it.
4. GitHub's `production` environment can enforce account-owner deployment approvals. Credentials are checked before deployment. No token is sent to the browser.

## Migrate current data once

The old platform-managed R2 bucket cannot be assumed accessible to an unrelated Cloudflare account. Preserve its latest workbook as bytes, including recycle metadata; the original attachment is not the current data.

1. Deploy the API migration guard to the existing backend, then set runtime `WORKBOOK_READ_ONLY=true` there. Do not pause the old backend until destination account access is ready. Confirm its uncached GET `/api/workbook` reports `sync.readOnly: true`; attempts to write return 423.
2. Before exposing the new backend, run `pnpm migrate:workbook <CURRENT_BACKEND_ORIGIN>` with destination credentials supplied securely as environment variables. This initialization script runs once outside normal deployments and saves.
3. It directly reads existing stored bytes, checks the source hash/version and eight-sheet/sixteen-field structure, copies to the same canonical key in the new bucket only if absent, and checks byte-for-byte equality. It refuses a different already-existing destination workbook. Source remains paused during the transfer. Destination must not have concurrent writers during initial migration.
4. Retain the old bucket/backups as read-only recovery snapshots during cutover. Do not delete them as part of migration. The live workbook's custom XML already contains current recycle/history data; no requirement schema is recreated.
5. Keep `WORKBOOK_READ_ONLY` unset on the new production backend. Ordinary releases never run migration or seed data.

## Deploy from this repository

Run **Deploy production to Cloudflare from GitHub** manually with the CRUD verification option enabled after initial migration. Subsequent pushes to `main` deploy automatically and perform public read checks.

Build command: `pnpm build:cloudflare`.

Deploy command: `pnpm deploy:cloudflare` (uses generated `dist/server/wrangler.json`, which has exactly one BUCKET binding).

The Actions summary records the actual public frontend and backend URLs. Optional Cloudflare Workers Builds can instead connect this exact GitHub repository using the same build command and `pnpm exec wrangler deploy --config dist/server/wrangler.json`; choose one deployment owner to avoid competing release pipelines.

## Required public acceptance

On the new actual URL, verify all existing records first. Use the unchanged UI to Add/Edit/Delete/Restore a disposable requirement; independently reread the production object's metadata and values after each action through the read-only verification page. Confirm different ETags/hashes, the same exact key, ID/field preservation, and another browser/session loading the result. Export must not be used to trigger saves.

The workflow's public acceptance script performs backend CRUD and fresh persisted reads; public UI/browser acceptance is an additional check, not a claim inferred from build success. Move disposable tests to Recycle Bin after verification. Direct the team to the new URL only after these checks pass, and leave the old backend read-only.

## Current blocker

The available browser is signed out of Cloudflare and of GitHub repository-secret settings. The connected GitHub app permits source pushes, but does not provide Cloudflare account authorization or secret-management operations. A new public URL and migration cannot be claimed until the account owner supplies that access securely.
