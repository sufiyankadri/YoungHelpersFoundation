# Module development roadmap and acceptance criteria

Proposed sequence after approval of the planning pack. Blueprint §16 phases and timing are preserved; this planning task has not started development. Indicative 15–22+ weeks for one developer and part-time reviewers, dependent on decisions/content/onboarding. Phase estimates below are original ranges, not a fixed delivery commitment.

## Dependency and module plan

| Delivery phase | Duration | Modules and order | Dependencies / exit evidence |
|---|---|---|---|
| 0 Decisions | 1–2 weeks | Charter, brand/content, scope, roles, state machine, fund rules, privacy/legal/Shariah register, architecture baseline | User plan approval; accountable owners; written critical policies and sign-off register |
| 1 CMS MVP | 3–4 weeks | Angular/.NET/SQL skeleton and CI; identity/security; public shell/programs; bilingual CMS/media/menu/banner/SEO; contact/volunteer/newsletter/grievance; basic approved reporting | Editors publish without deployment; access isolation; no production donor/case workflows falsely enabled |
| 2 Case management | 3–4 weeks | Six-step/draft/assisted intake; private uploads/scans; applicant status; duplicate review; verifier queue/checks; eligibility; committee/conflicts/quorum/appeals; volunteer training/activity | Full synthetic case from draft to decision with audit; rejected cannot publish; role and document isolation |
| 3 Donation and finance | 3–5 weeks | Accountant-reviewed chart/funds; manual ledger/reference matching; reconciliation; immutable postings/commitments; gateway sandbox; webhook/inbox/outbox; receipts/refunds/chargebacks; donor history | Sandbox matrix passes, balanced journals, no unexplained reconciliation variances; production gateway stays off until release gates |
| 4 Causes and programs | 3–4 weeks | Approved masked cause publication/cards/search/share/updates; cause-restricted giving; Rozgaar/Skill/Adopt program; Medical/Emergency; payees/releases/delivery/ownership/follow-up/reporting | Donation→fund→approval→release→delivery trace; 30-day tracking verified; follow-up scheduler for 90/180-day milestones |
| 5 Hardening and launch | 2–3 weeks | Accessibility/device/i18n/SEO/performance; security/UAT; restore/rollback/alerts; SOPs/staff training; legal/finance/Shariah sign-offs | Critical defects closed, recovery proven, owners trained and sign-offs recorded |

Security, accessibility, audit and reconciliation tests are continuous, not postponed to Phase 5. Program-specific intake fields are designed in Phase 2 even though detailed program delivery is Phase 4. Phase 3 may test pooled donations/manual records internally; public restricted causes/gateway need Phase 4 controls. A gateway existing in sandbox is not permission to collect live funds.

Phase 1 public Donate/Apply/Causes links show truthful availability/process information if their operational features are not yet enabled. No fabricated statistics or live-looking disabled checkout. Separate feature gates: cmsPublic, intake, causesPublic, manualDonation, gatewaySandbox, gatewayProduction, disbursementExecution, publicImpact. Flags require evidence-based release permissions.

## Module acceptance catalogue

All criteria require recorded evidence in staging using synthetic records, plus appropriate production configuration review. IDs map to requirements and RTM. “Prove” means test/report evidence, not developer assertion.

| ID | Acceptance criterion |
|---|---|
| AC01 | Named mission/program pillars appear in scope/screens; launch excludes marketplace/public KYC/AI decisions/loans/ERP/mobile apps; later education/recurring disabled |
| AC02 | English/Hindi layouts and keyboard/screen-reader navigation pass agreed WCAG 2.2 AA checks at 320/390/768/1024/1440 px and 200% zoom; sitemap/meta/OG and optimized media verified |
| AC03 | Home/About/Programs content editable and approved; Donate/Apply routing truthful at each phase; registration/governance claims require linked evidence |
| AC04 | Search/combined filters/sort/pagination and URL restoration tested with positive/negative results; cards/detail agree goal/raised/remaining; expired verification blocks badge/new donations |
| AC05 | Public metrics tie to approved reconciled snapshot, dates/definitions visible; small cohorts/private identifiers suppressed; monthly/annual report publication reviewed |
| AC06 | Editor drafts/preview/revisions/scheduled bilingual sections/banners/menus and media archive work without deployment; revoked consent/unscanned assets cannot publish |
| AC07 | Contact/volunteer/newsletter/grievance and policy/FAQ flows validate, throttle, acknowledge safely; marketing opt-in separate; no account/contact enumeration |
| AC08 | Password/reset/verification/session/MFA/lockout/CSRF tests pass; donor cannot read another donor, applicant cannot read another case, revoked session loses privilege |
| AC09 | Same actor across roles/accounts cannot meet independence; verifier cannot solely approve own case; preparer cannot approve release/refund/adjustment; overrides audited and policy-bound |
| AC10 | Donor sees only own history/preferences/milestones; reconciled posting yields unique correctly disclosed receipt; repeat render/notification cannot duplicate issue |
| AC11 | Fund/cause eligibility, amount/limits/source/consent validated server-side; review total itemized; unsupported categories/methods blocked |
| AC12 | Valid/invalid/duplicate/out-of-order webhook and timeout/retry cases produce one financial effect; redirect alone never confirms; receipt only after reconciliation/posting |
| AC13 | Balanced per-fund journal and distinct fees verified; attempted posted UPDATE/DELETE/direct unbalanced insert denied; no Zakat-to-non-Zakat silent use |
| AC14 | Restricted donation cannot fund other purpose; available/commitments/source/decision ceilings cap concurrent reservations; excess/shortfall holds/approved consent tested |
| AC15 | Statement import deduplicates lines and ties opening/closing; manual screenshot without bank match stays pending; settlement gross-fee-tax-net reconciles |
| AC16 | Full/partial refund, duplicate refund event, chargeback after refund and corrections preserve original evidence and never reverse principal twice; approval required |
| AC17 | All blueprint dashboards/report widgets tested by role/period/program with source tie-outs: public, donor, admin, finance, Rozgaar, Medical, audit |
| AC18 | All six steps save/resume/submit, assisted operator/consent captured, incomplete drafts allowed but invalid final submission blocked, MoreInfo requests round-trip with versions |
| AC19 | File signature/type/size/quarantine/scan/auth/expiry tested; public DTO no PII; log redaction, consent withdrawal/correction/removal/legal hold and retention jobs verified |
| AC20 | Every blueprint case state and re-entry/appeal path has actor/reason/history; invalid transitions rejected; submitted facts frozen; partial deliveries do not close whole case |
| AC21 | Phone/name/household/document candidates restricted; human accept/dismiss/merge preserves identities/history; no automatic adverse decision |
| AC22 | Assigned verifier completes mandatory evidence/checks; approved current policy and designated reviewer determine fund eligibility/method; unassigned reviewer/file access denied |
| AC23 | Quorum/attendance/conflicts/ceilings/conditions enforced; missing quorum blocks; recusal removes vote; decision/application revision mismatch invalidates outcome |
| AC24 | Rejected/unapproved/no-consent/unverified case cannot publish; approved private case can receive authorized aid without a public cause |
| AC25 | Partial release uses verified payee/current version and independent approval; concurrent releases stay under cap; uncertain provider result cannot cause duplicate payment; delivery separate |
| AC26 | Emergency minimal intake and urgent Medical queue work with reasoned outstanding evidence; no core eligibility/approval/fund bypass; short follow-up/acknowledgment recorded |
| AC27 | Rozgaar records skill/demand/tools, practical quotes/exception, vendor, training, first opportunity, baseline, approved budget and ownership handover/evidence |
| AC28 | 30/90/180 due tasks created idempotently from approved anchor; income/business/equipment/obstacles/next steps recorded with self-reported/verified labels; overdue queue works |
| AC29 | Medical estimate/scheme/discount/other funding/eligible balance, approved payee method, invoice dedupe, treatment stage and follow-up tie to capped disbursement |
| AC30 | Volunteer joins with skills/availability/consent; onboarding/training/assignment/activity accessible only within authorized scope; role grant separate |
| AC31 | Transactional state+outbox atomicity, webhook inbox dedupe, worker lease/retry/dead-letter and email/SMS delivery recovery tested without duplicate effects |
| AC32 | FK/unique/CHECK/money precision/UTC/rowversion/private storage and concurrency constraints verified against SQL Server, not an in-memory substitute |
| AC33 | DTO contracts, pagination, Problem Details, missing/stale If-Match, idempotency replay/mismatch and policy-scoped queries pass contract tests |
| AC34 | Layer dependency rules, standalone lazy routes/typed forms/signals/i18n/SCSS, SQL migrations and API integration suite verified; no infrastructure dependency in Domain |
| AC35 | Restore database+objects+keys successfully; rollback rehearsal, dependency/failed-job/security/backup alerts and training sign-off pass; agreed RPO/RTO measured |
| AC36 | Registration/PAN/bank/tax/foreign-source/provider and written Shariah evidence reviewed by accountable qualified owners; no restricted feature or claim enabled without gate |
| AC37 | Daily/weekly/monthly queues and App A monthly close demonstrated; all seven SOPs rehearsed with named program/verification/finance/CMS/Shariah owners |
| AC38 | Phase gates evidence approved before feature enablement; CMS/offline/manual precede production gateway; no implication plan approval settles policy decisions |
| AC39 | UAT covers device/locales/accessibility/SEO/performance, role isolation, duplicate submit, uploads, private docs, withdrawal and retention with defects/evidence |
| AC40 | UAT covers payment success/failure/timeout/duplicate/refund/chargeback/settlement, restriction/overspend, quorum/conflict/override/reversal/audit and concurrency |
| AC41 | Each App A register exports essential fields with correct scope, unique references and evidence; no unmasked beneficiary data in public exports |
| AC42 | Every implementation change traces to primary blueprint/approved elaboration; no copied reference code/assets/claims; observation vs assumption preserved |

## Test strategy and release evidence

Domain tests cover money arithmetic, restriction/transition policy and quorum/conflicts. SQL integration tests cover per-fund balance/atomicity, unique event IDs, simultaneous allocations/releases, rowversion and transaction rollbacks. Contract tests cover error semantics/auth/sanitization. Browser tests cover critical bilingual user journeys; human review covers usability, Hindi accuracy, consent language and assistive technology. Gateway tests use provider sandbox; production smoke tests never use a real charge without explicit later authorization.

UAT data: at least two donors/applicants and two household cases, separate restricted Zakat/Sadaqah/General funds, two eligible and one ineligible case, two independent approvers plus conflicts, split settlement/fee/refund, partial releases, failed scan, expired consent and overdue follow-up. Test same actor assigned several roles. No real beneficiary KYC in staging.

Evidence package: test run, screenshots where useful, SQL tie-out/report, migration review, policy approval IDs, restore timings, incident/rollback exercise, accessibility findings, staff attendance and unresolved-defect list. No critical/high finance, privacy or authorization defect may remain at launch; lower risks require named acceptance and expiry.

## Blueprint first 30 tasks mapped

| Original task | Planned delivery |
|---|---|
| 01 Finalize charter; 02 verify legal/Shariah; 03 approve sitemap; 04 role matrix | Phase 0, this pack + decision evidence |
| 05 case state machine; 06 fund types/restrictions; 07 UI tokens/components | Phase 0 specifications, implementation in relevant phases |
| 08 Angular workspace; 09 .NET solution; 10 SQL migrations; 11 CI; 12 auth/MFA | Phase 1 foundation |
| 13 shell/footer; 14 CMS pages; 15 banner/media admin; 16 program pages | Phase 1 CMS |
| 17 public listing; 18 cause detail | Phase 4 public causes; contract/component design now |
| 19 applicant wizard; 20 secure upload; 21 verifier queue; 22 eligibility; 23 committee | Phase 2 |
| 24 ledger; 25 manual reconciliation; 26 gateway sandbox; 27 donor receipts/history | Phase 3 |
| 28 disbursement; 29 follow-up | Phase 4, core finance contracts Phase 3 |
| 30 end-to-end UAT/launch | Continuous checks, final Phase 5 gate |

## Operations handover

Program Lead owns case/outcomes; Verification Lead assignments/evidence; Finance Officer reconciliation/close; CMS Admin approved bilingual content; Shariah Adviser fund/eligibility rule review. Foundation supplies independent authorized financial approver and security/technical on-call owner; one person can hold tasks but cannot satisfy conflicting approvals.

SOP deliverables: donation correction (original→approval→reversal); emergency (priority→minimum evidence→core review); rejected appeal (independent re-review); incident (contain→notify accountable owner→recover→review); refund (request→independent approve→confirm→reverse); beneficiary complaint (private triage/conflict routing); data removal (verify identity→retention/hold→execute permitted removal). Each includes owner, inputs, deadline policy, escalation, audit/evidence and recovery/exception path.

