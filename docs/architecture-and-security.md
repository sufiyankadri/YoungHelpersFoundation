# Architecture, authentication and authorization

Proposed design for approval. Primary basis: blueprint §4,11–14,17–18; R15–17, R49, R51–59. No infrastructure or application has been created.

## System structure

A modular monolith fits the initial 3–5 volunteer operation. Angular 22 + TypeScript + SCSS supplies route areas core/shared/public/donor/applicant/volunteer/admin. Admin includes scoped case manager, committee, reviewer, finance, auditor and CMS workspaces. Standalone components, lazy feature routes, typed reactive forms, signals for local UI state, HTTP interceptors, centralized Problem Details handling and locale services are the baseline.

Public CMS/cause pages use server rendering or prerendering with hydration as selected at setup; private pages are browser-rendered, noindexed and never cached by shared intermediaries. Public API DTOs are explicit allowlists. No private entity is serialized to public routes.

| Project/layer | Responsibility | Allowed dependencies |
|---|---|---|
| YHF.Domain | Fund, donation, application, decision and disbursement invariants; value objects and domain events | No EF/HTTP/UI dependencies |
| YHF.Application | Commands/queries, DTO validation, authorization interfaces, use cases, transaction boundaries | Domain |
| YHF.Infrastructure | EF Core 10 SQL Server repositories, Identity, private objects/scanning, gateways, email/SMS, audit/outbox | Application + Domain |
| YHF.Api | Version-neutral /api browser endpoints initially, controllers/middleware, cookies, policy handlers, health/OpenAPI | Application; Infrastructure only for composition |
| YHF.Worker | Outbox/inbox processing, notifications, scan scheduling, settlement polling, follow-up scheduling | Application + Infrastructure |
| YHF.Tests | Domain, SQL integration, auth isolation, contract and browser/UAT suites | Relevant layers |

Proposed EF Core 10 is the chosen persistence option from the blueprint's EF Core-or-Dapper allowance. Dapper is not required initially. Folder layout after approval: frontend/src/app/{core,shared,public,donor,applicant,volunteer,admin}; backend/{YHF.Api,YHF.Application,YHF.Domain,YHF.Infrastructure,YHF.Worker,YHF.Tests}; database/{migrations,seed}; docs/. Migrations are reviewed artifacts, never automatic destructive production startup work.

Use synchronous database transactions for atomic state/ledger changes. Save domain state + audit + outbox in one transaction. Workers use leases, retry/backoff and dead-letter review. No exactly-once network claim: at-least-once delivery plus idempotent handlers. Never keep database transactions open while calling gateways or sending email.

## Deployment and reliability

Same-origin HTTPS reverse proxy serves Angular and /api; private SQL Server, private object storage, API and worker are separate deployable processes. CDN only caches approved public media/pages. Database and objects are inaccessible directly from browsers except short-lived authorized URLs. Payment webhook reaches a narrowly scoped API endpoint with signature validation. No card data passes through YHF persistence.

Local/staging/production have independent DBs, buckets, gateway accounts, signing keys and notification credentials. Use synthetic staging records; no production KYC copy. Secrets use platform secret storage, not CMS settings or Git. Persist/protect .NET data-protection keys across instances with a restricted key store. Separate migration identity from runtime DB identity.

Structured logs carry correlation/action IDs, not stories, document bodies, tokens, PAN, full phone/email or gateway secrets. Health endpoints expose liveness anonymously and dependency readiness only to operators. Monitor payment inbox age, unreconciled items, failed jobs, scanning failures, urgent cases, backup age and privileged sign-ins.

Proposed objectives for approval: RPO ≤24 hours, RTO ≤8 hours for initial launch; daily encrypted backups plus transaction-log strategy if host supports tighter RPO; monthly restoration sample and prelaunch full restoration. Include private objects, encryption/data-protection keys and audit storage in recovery. Capacity/performance target: agree expected case/donor volume (D18), then load-test representative data. Do not infer suitability solely from team size.

## Authentication design

P: ASP.NET Core Identity manages local accounts, hashed passwords, MFA recovery and lockout. Prefer secure HttpOnly SameSite=Lax host-only session cookies for the same-origin web client; Secure always in staging/production. Session record and security stamp support revoke-all/revoke-device. Unsafe cookie-authenticated API calls require an anti-forgery header/token and validated Origin; CORS is deny-by-default. Refresh endpoint renews a valid tracked session with CSRF protection; it does not exchange a browser localStorage token. RefreshTokens table is reserved for any later approved non-cookie client; token hashes only, disabled at launch.

Privileged users must enroll TOTP MFA before protected access. P: 20-minute privileged idle timeout/8-hour absolute session, 30-minute standard idle/24-hour absolute session; sensitive action reauthentication within five minutes. Thresholds are D19 approval items, not established policy. Rate-limit login/recovery/MFA, use generic responses, protect against credential stuffing and throttle public forms. Reset/verification tokens are one-use, time-limited and never logged. No seeded default administrator password.

Public signup grants only donor/applicant baseline capability after verification; applicants can receive assisted accounts via invitation. Volunteers/committee/finance/admin roles require reviewed assignment with expiry. Role changes revoke sessions or force security-stamp revalidation. MFA reset needs an independent identity recovery process with audit, never a direct “disable MFA” self-service privilege escalation.

Guest giving (P, D06) uses a short-lived opaque donation-session cookie. Status lookup uses that session or signed emailed claim link; sequential IDs and email matching alone never grant access. If guest checkout is not approved, enforce authenticated donation entry without weakening finance controls.

Identity supports users in more than one role, but conflict rules compare real actor IDs across roles. A role switch does not make one person independent.

## Role permission matrix

Legend: Own = own data, Assigned = active explicitly assigned case, Scoped = designated review/program/period, All = authorized operational scope; dash = no grant. Each cell grants named capabilities, not all CRUD.

| Role | Grants | Denials/conditions |
|---|---|---|
| Visitor | public.read, public.forms.submit, donation.start if enabled | No private status/KYC/PII |
| Donor | donor.own.read, receipt.own.download, preference.own.write, refund.own.request | No other donor identity or case file |
| Applicant/Case Raiser | application.own.draft/submit/read, document.own.upload, appeal.own.submit | No verification/approval; delegates need recorded authority |
| Volunteer | volunteer.own.read/write, assisted-intake Assigned, activity.own.write | No general applicant directory or blanket KYC |
| Verifier | case.assigned.read, document.assigned.read, verification.assigned.submit | Cannot solely approve own verified case |
| Cause Manager | case.scoped.read, request-info, assign, prepare narrative/update, readiness coordination | No final eligibility, committee vote by default or posting |
| Committee Member | committee.scoped.read/vote, release.approve within authority | Must declare conflicts, quorum and ceiling; no own-request approval |
| Finance Officer | finance.read, reconcile, journal.prepare/post authorized entries, disbursement.prepare/execute | Cannot approve own release/refund/adjustment; no story publishing |
| Foundation Admin | operations.read, case.manage/assign, cms.edit/publish if granted, volunteer.manage, reports.scoped | No implicit ledger release or policy approval |
| Super Admin | identity.manage, roles.manage, settings.manage, propose policies, audit security | No silent posted edits, no automatic finance/Shariah authority |
| Auditor | audit.read, financial-evidence.read, report.audit | Read-only, scoped sensitive access; exports audited |
| Shariah Reviewer | eligibility.scoped.review, policy.shariah.approve when designated | No bank execution or legal approval |
| CMS Editor (P sub-role) | cms.edit/media.prepare/preview | Publishing separately granted |
| Authorized Approver (P capability) | release/refund/adjustment.approve within recorded ceiling | Assigned to committee/designated independent person, never global admin default |

P: splitting Volunteer/Verifier and Auditor/Shariah Reviewer refines the combined blueprint labels; both preserve original roles. CMS editor and approval capability are permission bundles, not extra business authority. Approval-role owners/ceilings/quorum must be recorded in D03/D10.

## Resource and action authorization

Each API evaluates authenticated principal + permission + resource ownership/assignment + status + authority ceiling + conflicts + approved policy version. Collection queries apply the same filters before counting/paging. File, report, export, background job and download authorization is checked independently. Return 404 for inaccessible private resource identities, 403 for forbidden known actions, with no revealing counts. Stale policy/assignment revokes actions even if a route guard is cached.

A verifier who also holds committee membership is excluded from the decisive approval quorum for that case (P stricter rule); a finance preparer cannot approve their own release/refund/adjustment. Approvals bind amount/fund/payee/case and version; any material change invalidates approval. Two accounts belonging to one person cannot satisfy independence. Conflict declarations and exceptions are audit events; emergency priority never bypasses these checks.

## Security and privacy controls

Classify public content; internal workflow; confidential donor/applicant; restricted KYC/medical/bank secrets. Encrypt database volumes/backups and highly sensitive columns with managed keys. Normalize-search private identifiers via keyed HMAC fingerprints rather than public hashes; restrict match results to human duplicate reviewers. Do not collect full Aadhaar by default. Document bytes stay private with malware quarantine, MIME/signature checks, bounded size, allowed extensions and random keys; proposed limit 10 MB/file, PDF/JPEG/PNG only pending D15. Remove metadata on approved public derivatives. Never enable private object listing or expose storage keys through public DTOs.

Record purpose/version/time/method of consent, assisted consent witness and guardian/authority where necessary. Processing consent and media publication are distinct. Withdrawal unpublishes affected public media/content promptly, marks a retention/legal-hold review, and does not erase required accounting evidence. Applicants may request correction, appeal or complaint without publishing their case.

Audit records are append-only, redacted and external integrity-checkpointed; privileged read/export is logged. Runtime DB accounts cannot update/delete posted ledger rows or audit rows. Infrastructure operators are a residual trust boundary: monitored break-glass, key separation, backups and reconciliation are required; do not claim technical immutability against all administrators.

## Official technical references

Reviewed 22 October 2026. The Angular compatibility table lists Angular 22.0.x with TypeScript >=6.0 <6.1 and supported Node ranges; pin compatible patch versions at setup, not unverified latest versions. [Angular compatibility](https://angular.dev/reference/versions).

Identity provides account functionality; the cookie/session and role design above is a YHF proposal. [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0).

Ownership and assignments require resource checks beyond route attributes. [Resource-based authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resource-based?view=aspnetcore-10.0).

Use rowversion edit conflicts, with explicit stronger locks for money aggregates. [EF Core concurrency](https://learn.microsoft.com/en-us/ef/core/saving/concurrency), [SQL Server transaction locking](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide).

