# Module requirements

Status: Proposed baseline for approval. B = original blueprint requirement; P = design elaboration. Source section numbers refer to the Word blueprint. Requirements below are mandatory within their delivery phase unless explicitly later/non-goal. Acceptance IDs resolve in the roadmap; screen IDs resolve in the screen specifications.

## Mission and launch boundaries

YHF serves donors, verified beneficiaries and volunteers under “Aaj Madad, Kal Khud-Mukhtari”, initially with 3–5 volunteers. Preserve Zakat Ek Jagah, Ek Zakat → Ek Rozgaar, Zindagi Bachao, Emergency Assistance, Skill Se Rozgaar, Adopt a Rozgaar, verification, separate funds, transparency and Khud-Mukhtari. Success means verified support, transparent fund balances, shorter processing time and livelihoods sustained at 30/90/180 days.

No launch multi-NGO marketplace, public KYC, AI eligibility decisions, loans, ERP or mobile apps. Education is a later approved category. One-time giving first; recurring only after operational readiness. Illustrative budget allocations in blueprint §10 are not targets or automatic allocation rules.

## Requirements catalogue

| ID | Module and requirement | Basis | Acceptance |
|---|---|---|---|
| R01 | Mission, named program pillars, initial team scale and outcome definitions preserved | B §1–2 | AC01 |
| R02 | Launch exclusions and later education/recurring scope enforced by configuration and navigation | B §1,3,6,8 | AC01 |
| R03 | Original responsive bilingual English/Hindi site, accessible keyboard UX, SEO/sitemap/Open Graph, optimized media | B §5 | AC02 |
| R04 | Home: mission, Donate/Apply, verified featured causes, categories, impact, updates and volunteer CTA | B §5 | AC03 |
| R05 | About: story, mission, team, governance and only evidenced registration information | B §5,14 | AC03 |
| R06 | Program pages explain Rozgaar/Medical/Emergency eligibility and process | B §5,8 | AC03 |
| R07 | Cause search, city/program/fund/status filters, sorting and server pagination; URL persistence/clear states | B §5,12 + P | AC04 |
| R08 | Cause detail: masked consented story, current verification badge, goal/raised/remaining, timeline, donate/share and updates | B §3,5 | AC04 |
| R09 | Public impact/distribution/outcomes and monthly/annual reports use reconciled aggregates | B §3,5,15 | AC05 |
| R10 | Stories/news/gallery/events and media require written consent, alt text, compression and archive | B §5,9 | AC06 |
| R11 | Contact, FAQs, grievance, privacy, terms, donation/refund and approved Shariah pages | B §5,9,14 | AC07 |
| R12 | Contact/volunteer/newsletter/grievance forms validate and prevent spam; newsletter is opt-in | B §9 | AC07 |
| R13 | CMS reusable hero/rich text/cards/FAQ/counters/CTA/media/testimonial sections | B §9 | AC06 |
| R14 | Banners/scheduling, menus/footer, multilingual content, SEO fields, drafts/preview/publish/unpublish/revisions | B §9 | AC06 |
| R15 | Secure accounts, API-enforced roles, ownership and assigned-case scope; route guards only aid UX | B §4,13–14 | AC08 |
| R16 | Password hashing, privileged MFA, session revocation, rate limits/lockout, secure cookies/CSRF and CSP | B §14 + P session design | AC08 |
| R17 | Separation of duties for verification, committee decisions, finance releases and auditable super-admin actions | B §4,7,18 | AC09 |
| R18 | Donor own history/receipts/preferences and anonymized cause milestones | B §4,6,15 | AC10 |
| R19 | General/pooled or cause-linked donation selects approved fund, amount, contact, consent and gateway | B §6 | AC11 |
| R20 | Created/Pending/Authorized/Captured/Failed/Reconciled/PartiallyRefunded/Refunded tracked without trusting redirect | B §6 | AC12 |
| R21 | Signed webhook validation, deduplication, reconciliation then ledger-backed receipt; retry safely | B §6,12 | AC12 |
| R22 | Fees recorded separately; no unsupported 100% pass-through/tax statements | B §6,14 | AC13 |
| R23 | Cause restrictions, eligibility, excess/shortfall and approved reallocation consent preserved | B §6,8,10 | AC14 |
| R24 | Manual UPI/NEFT reference upload, finance verification and bank reconciliation; image is not confirmation | B §6 | AC15 |
| R25 | Unique receipt number, amount/date/method/fund/reference and valid applicable tax disclosures | B §6, App A | AC10 |
| R26 | Refunds/partial refunds/chargebacks and corrections use approved audited reversals, never delete posted entries | B §6,10,17 | AC16 |
| R27 | Double-entry-style immutable ledger; balanced entries, fund dimension and separate Zakat/non-Zakat rules | B §10 | AC13 |
| R28 | Restricted allocations, commitments, fund/available balances, payee verification and partial disbursements | B §10–11 | AC14 |
| R29 | Import bank statements, match settlements/manual transfers, track unmatched and opening/closing balances | B §10 | AC15 |
| R30 | Finance reports: collections/fund, disbursement/category, pending approvals, receipts, fees, unmatched payments | B §10,15 | AC17 |
| R31 | Six-step intake: contact, household, finances, program/need, evidence, declaration/consent | B §7 | AC18 |
| R32 | Save/resume draft, volunteer-assisted offline intake, applicant own status and reasoned information requests | B §3,7 | AC18 |
| R33 | Private scanned document uploads; minimum identifiers; no full Aadhaar by default; masked public narrative | B §7,11,14 | AC19 |
| R34 | Complete case lifecycle, reason codes, history, rejected/deferred handling and appeal/re-review | B §7 | AC20 |
| R35 | Duplicate indicators: phone, normalized name, household reference, document fingerprint; human merge review | B §7 | AC21 |
| R36 | Assign verifier and checklist identity/income/dependents/assets/quotes/references/urgency/program need | B §7 | AC22 |
| R37 | Shariah eligibility review under a versioned approved policy, fund restrictions and exceptions | B §7,14 | AC22 |
| R38 | Committee quorum, conflicts, votes/comments, approval ceiling, recorded reason/conditions and appeals | B §7 | AC23 |
| R39 | Case approval separate from public cause moderation; some approved cases remain private | B §7,9 | AC24 |
| R40 | Disbursement request/approval/release/payment proof/delivery acknowledgment; partial releases capped | B §3,7,10–11 | AC25 |
| R41 | Medical urgent fast-track and Emergency expedition shorten queues but keep eligibility/approval checks | B §7–8 | AC26 |
| R42 | Rozgaar: skill, plan/local demand/tools, practical 1–2 quotes, amount/vendor, ownership handover/baseline | B §8 | AC27 |
| R43 | Skill Se Rozgaar: training, tools, first customer/market connection, equipment use and obstacles | B §2,8 | AC27 |
| R44 | Follow-ups at 30/90/180 days with earnings, evidence classification, sustained business and next actions | B §1–2,8,15 | AC28 |
| R45 | Medical: treatment/estimate/urgency/scheme or discount exploration/eligible balance/authorization/payee/invoices/follow-up | B §8 | AC29 |
| R46 | Emergency: minimal crisis form/proof/support type, expedited verification, acknowledgment and short follow-up | B §8 | AC26 |
| R47 | Adopt a Rozgaar: restricted cause or pool, anonymized milestones, consented excess/shortfall treatment | B §8 | AC14 |
| R48 | Volunteer application/skills/availability/consent, assignment, training and activity log | B §3–4,9 | AC30 |
| R49 | Notifications/templates, transactional email/SMS and reliable background outbox/inbox | B §11,13 | AC31 |
| R50 | Dashboards public/donor/admin/finance/Rozgaar/Medical/audit exactly scoped and defined | B §15 | AC17 |
| R51 | SQL money/UTC/FKs/checks/unique IDs/concurrency/encryption and private object metadata model | B §11 | AC32 |
| R52 | Validated DTOs, policy authorization, Problem Details, optimistic concurrency, pagination/idempotency/audit context | B §12 | AC33 |
| R53 | Angular standalone/lazy routes/typed reactive forms/signals/interceptors/i18n/SCSS/responsive tables | B §13 + user technology | AC34 |
| R54 | .NET 10 Clean Architecture domain/application/API/infrastructure, SQL persistence/migrations and integration tests | B §13 + user technology | AC34 |
| R55 | Local/staging/production separated; secrets outside Git; monitoring, backup/recovery and rollback | B §13–14,17 | AC35 |
| R56 | Least privilege, encryption, log redaction, retention, consent withdrawal, correction/data removal and breach response | B §14,17–18 | AC19 |
| R57 | Merchant onboarding/KYC, permitted donation categories and no stored card data | B §14 | AC36 |
| R58 | Verify registration/PAN/bank/12AB/80G; no unsupported foreign contributions; legal/FCRA review | B §14 | AC36 |
| R59 | Written Mufti approval for mustahiq/tamlik/vendor payments/training/admin/timing/loans/fund restrictions | B §14,19 | AC36 |
| R60 | Daily urgent/payment/review/security queue, weekly committee/reconciliation/content/follow-up, monthly close/reports/recovery | B §18 | AC37 |
| R61 | Accountable program/verification/finance/CMS/Shariah owners; staffing overlap cannot bypass approvals | B §18 | AC09 |
| R62 | SOPs: correction, emergency, rejected appeal, incident, refund, complaint and removal | B §18 | AC37 |
| R63 | Blueprint phases 0–5, approval register, CMS/offline-first and reconciled finance before gateway | B §16,19 | AC38 |
| R64 | Responsive/i18n/accessibility/SEO/performance UAT, isolation, upload, duplicate and consent tests | B §17 | AC39 |
| R65 | Gateway timeout/duplicate/refund/chargeback/settlement, fund caps, quorum/override/reversal/audit UAT | B §17 | AC40 |
| R66 | Recovery/rollback/alerts/training and critical-defect closure before launch | B §16–18 | AC35 |
| R67 | Receipt/intake/verification/committee/disbursement/follow-up/monthly-finance registers contain App A fields | B App A | AC41 |
| R68 | Retain source attribution; no imported reference policy/fee/branding; distinguish observation and assumption | B §3, App B + user | AC42 |

## Module boundaries and operating rules

Public CMS owns presentation and publication; Casework owns private applications and verification; Governance owns policy/committee evidence; Donations owns payer intent and gateway events; Finance owns postings, restrictions, settlement and disbursement; Program Delivery owns outcomes; Volunteer owns people/training/assignments; Identity owns access; System owns notifications, audit and retention. Cause publication is a separate public projection of a case, not permission to expose case records.

Financial and eligibility authority resides in the API/domain. Administrators cannot edit totals, eligibility or state by changing a UI field. All actions record actor, time, reason, policy/version, relevant resource version and correlation ID. Draft validation allows partial input; submission applies full program-specific rules. Notifications contain minimal identifying content and links to authenticated records.

Public metrics must distinguish received/reconciled/distributed/committed; medical outcomes cannot imply treatment success without evidence. Reports include period, scope, calculation version and as-of time. KPI targets, processing SLAs and financial thresholds remain D decisions.

## REA use

Verified supplementary observations: public cause summary/filter UI, public donation entry and incomplete-form messages, narrow-screen layouts (aliases listing/filter/detail/donate/invaliddonate/mobilemenu). Reference search and mobile card loading remain inconclusive; private accounting/security/compliance remains unknown. All workflows below are YHF designs grounded in the blueprint, not reconstructions of IndiaZakat internals.

