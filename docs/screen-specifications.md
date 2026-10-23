# Screen specifications and textual designs

Proposed screen design, not implemented UI. Every route uses original YHF branding and en/hi locale prefix for public pages. IDs are stable traceability identifiers. P = proposal supplement; other content derives from blueprint §4–9,15, App A.

## Shared layouts and states

Public desktop: header [brand | Programs Causes Impact About Help | language | account | Donate]; content max 1200 px; footer policies/contact/governance. Mobile: [brand | language | Menu], primary actions beneath mission, accessible navigation drawer. User workspace: topbar [area | language | notifications | account], sidebar [authorized modules], main [heading/actions → summary → filters/form/detail → pagination]. Mobile sidebar becomes a drawer and tables show labeled record cards with a full-detail link.

Every list/detail has loading, empty, error/retry, permission denied/not found and stale data states. Every form has draft/dirty/saving/saved/invalid/submitting/success/conflict/network-loss states. Required labels, error summary with focus, field messages, confirmation for consequential actions, rowversion conflicts with reload/compare, and preserved nonsensitive input apply everywhere. Private forms do not persist KYC in browser storage; server drafts only. Money, dates, statuses and translated labels use shared formatters. PDF/download screens require access checks and accessible HTML alternatives.

## Public and shared account screens

| ID / route | Desktop content and interaction design | Mobile/validation and boundary |
|---|---|---|
| P01 / | Mission + Donate/Apply; three program tiles; featured verified cards; process; dated aggregates; updates; volunteer CTA | Single column; both CTAs early; no invented counters; features gated by delivery phase |
| P02 /about | Story/vision/mission, team/governance, registration evidence links with validity | Evidence-backed claims only; original copy |
| P03 /programs | Three program summaries → detail links | Stacked program cards |
| P04 /programs/{slug} | Purpose, approved eligibility, process, needed evidence, Apply/Donate | Hindi/English; later education hidden until approved |
| P05 /causes | Search; program/city/fund/status filters; sort; selected chips; paginated cards | Compact Filters drawer; URL restored; loading/empty/clear-all states |
| P06 /causes/{slug} | Story + funding summary; dated badge; goal/raised/remaining; milestones/updates; share; report/help | Stacked summary; sticky Donate reserves space; never reveal application ID/contact/KYC |
| P07 /donate | Step 1 fund/cause/amount, step 2 contact/consent, step 3 itemized review | Compatible funds only; support opt-in P; no unsupported tax promise |
| P08 /donations/{opaque}/status | Pending/confirmed/failed/refund status, server timestamp, retry/check and receipt link | Guest-session/owner access only; pending is distinct from failure |
| P09 /donate/manual | Fund/amount, bank guidance, transfer date/reference and private proof upload | Details only if approved manual giving enabled; acknowledgment says awaiting verification |
| P10 /apply | Eligibility/process, documents, privacy notice, assisted-help route, Start/Resume | No promise of approval; unavailable intake explains phase status |
| P11 /impact | Definitions/as-of, collection/distribution/program outcomes, monthly/annual report list/detail | Small-cell suppression P; responsive charts with data table |
| P12 /volunteer | Role description, skills/location/availability/contact/consent form | Spam prevention, minimum data, receipt/reference acknowledgment |
| P13 /stories and /news and /events | Search/list/date/program → post detail with consented media | One generic article layout; translated content and archived states |
| P14 /gallery and /gallery/{slug} | Consented gallery tiles, captions, accessible lightbox | Alt/caption; no inaccessible swipe-only control |
| P15 /contact | Verified contact, contact form and help options | No public message display; rate-limited acknowledgment |
| P16 /faq | Topic search and accessible disclosure panels | One or multiple expanded states, keyboard operable |
| P17 /policies/{slug} | Privacy/terms/refund/donation/Shariah, effective version and approved status | Unapproved policy not presented as final; version history |
| P18 /grievances | Complaint type, safe contact, case reference optional, consent; track by secret reference | Applicant complaint never publicly listed; anonymous policy D12 |
| P19 /newsletter/confirm and /unsubscribe | One-use opt-in/opt-out link, status, preference confirmation | Generic invalid/expired messages; no subscriber lookup |
| X01 /login | Email/phone, password, show password, reset/signup, generic error | No account enumeration; redirect only to allowlisted local paths |
| X02 /register | Name/contact/password, verification, terms, donor/applicant intent | No privileged-role selection; account verification required |
| X03 /account/verify | Code/link confirmation and rate-limited resend | Expired/retry states; no sensitive URL details |
| X04 /account/recovery and /reset | Generic request acknowledgment; token/password reset | One-use expiry; secure password rules |
| X05 /account/mfa | Enrollment QR/recovery codes, challenge/recovery | Privileged access blocked until complete; codes displayed once |
| X06 /account/security | Password change, sessions/revoke, MFA management and reauthentication | Identity verified for sensitive changes; audit |
| X07 /account/profile | Own contact, language, notification preferences, consent/correction request | Contact changes reverified; no silent identity merge |
| X08 /notifications | Own notifications list/detail, deep links and read state | No private story in notification previews |
| X09 /not-found and /unavailable | Safe unavailable/403/404/maintenance or feature-disabled explanation | No hidden resource details; return to safe page |

## Donor workspace

| ID / route | Content, actions and validations | Data boundary |
|---|---|---|
| D01 /donor | Own reconciled totals, pending items, supported-cause milestones and donate action | No global donor ranking/PII |
| D02 /donor/donations | Own filterable history by date/fund/cause/status; export own permitted fields | Pagination and explicit financial status |
| D03 /donor/donations/{id} | Amount/fund/cause, payment events summary, receipt, manual-reference status, request correction/refund | No raw webhook/signature/bank secrets |
| D04 /donor/receipts/{id} | Unique number/date/method/reference/fund/amount/tax disclosure; download | Owner only; void/replacement receipt chain shown |
| D05 /donor/preferences | Contact/consent, anonymity and language; claim guest donation link P | Verified linkage, no email-only claim |
| D06 /donor/refunds/{id?} | Request reason and amount; status/timeline/approved result | Cumulative cap and policy; no client-triggered money release |
| D07 /donor/impact/{cause} | Anonymized milestones for adopted livelihood/cause | Public-safe outcome projection only; no applicant contact |

## Applicant and assisted intake

| ID / route | Content and actions | Validation/behavior |
|---|---|---|
| A01 /applicant | Own drafts/submitted/status/next steps, Start and help | Priority labels do not promise timing |
| A02 /applicant/applications | Own applications with program/status/date | Search and pagination; no other households |
| A03 /applicant/applications/{id}/contact | Step 1 applicant/contact/location, guardian/delegate authority if applicable | Required contact verification; assisted operator/consent recorded |
| A04 .../household | Step 2 household reference/dependents/members | Minimum identifiers; member relationship and age-band P |
| A05 .../finances | Step 3 income/assets/liabilities, household circumstances | Nonnegative values, period/currency and unknown/not-applicable states |
| A06 .../need | Step 4 program/need/requested amount/urgency; program subform | Medical/emergency urgency rationale; policy-dependent fields |
| A07 .../documents | Step 5 quotes/medical/skill evidence; upload progress/scan state/replace | Size/type/scan checks; quarantined files unavailable |
| A08 .../review | Step 6 summary, declaration, processing/media choices, Submit | Full validation; missing evidence explanation; separate optional publication consent |
| A09 .../status | Private timeline/reason codes, next steps, requests and follow-up tasks | Applicant-safe decision wording; no committee confidential deliberations |
| A10 .../information-requests/{rid} | Requested corrections/documents and response deadline | Scope edits to requested fields; resubmit creates version |
| A11 .../appeals | Decision reason, appeal form/evidence and history | No invented appeal deadline; approved policy controls eligibility |
| A12 .../privacy | Contact/correction/consent/media withdrawal/data removal request | Explain required record retention; never promise ledger deletion |
| A13 .../delivery-followup | Acknowledge received aid/assets; outcome questionnaire/problems | No self-approval of disbursement; verifier labels unverified self-report |

A03–A08 are separate wizard screens with Save and continue/Back/Save and exit. A06 supports Emergency minimal first submission via approved exception checklist, then staged evidence completion; it does not bypass core verification/eligibility. Volunteer-assisted entry reuses these screens inside an assigned intake session and displays “recording on behalf of applicant,” source/date and witness fields.

## Volunteer and verifier workspace

| ID / route | Content and actions | Boundary |
|---|---|---|
| V01 /volunteer | Own onboarding/training, assigned queue, due visits/follow-ups | Only active assignments |
| V02 /volunteer/profile | Skills/location/availability, declarations and training status | No independent privilege elevation |
| V03 /volunteer/training | Required modules, attendance/completion evidence | Manager verifies completion |
| V04 /volunteer/assignments | Active/completed tasks, program/urgency/due filters | Unassigned case counts/identities hidden |
| V05 /volunteer/cases/{id} | Scoped case facts, checklist, safe contact and document viewer | Expiring assignment and purpose-limited files |
| V06 .../verification | Field visit/date/method, identity/income/dependents/assets/quotes/references/urgency checks | Evidence and recommendation; cannot set final approval |
| V07 /volunteer/intake/{id} | Assisted A03–A08 plus operator/source/witness | Delegation/assignment required, paper reference private |
| V08 /volunteer/activity | Time/task/evidence/activity log and correction trail | Own entries; submitted entries versioned |
| V09 /volunteer/followups/{id} | Delivery/30/90/180-day questionnaire, equipment/income/issues/next action | Self-reported vs verified marker mandatory |

## Administration, governance and finance

Each row below is a screen or deliberate reusable list/detail family; child tabs are named to prevent implied hidden scope.

| ID / route | Design and key actions | Required permission/guards |
|---|---|---|
| M01 /admin | KPI tiles: pending reviews/urgent/active causes/donation trend; work queues | operations.read; scoped metrics |
| M02 /admin/cases | Search/status/program/assignee/urgency; case detail tabs profile, household, finances, evidence, history | case.scoped.read; private screen, no public serialization |
| M03 .../{id}/document-review | Scan status/checklist, request-more-info, assign verifier, evidence viewer | case.manage; all requests reasoned |
| M04 /admin/duplicates | Restricted candidate pairs with indicators, compare, link/dismiss/merge request | duplicate.review; manual approval, no automatic AI |
| M05 .../{id}/readiness | Verification completeness, information queries, urgency, assigned manager, action history | Cause Manager, no self-approval |
| M06 .../{id}/eligibility | Fund-by-fund criteria, evidence, tamlik/payee method, policy version and review decision | eligibility.review; signed policy current |
| M07 /admin/committee | Meetings/calendar/agenda and members/attendance/quorum | committee.manage; versioned membership |
| M08 .../meetings/{id}/case/{caseId} | Review pack, conflict declaration, vote/comment, ceiling, conditions; recorded outcome | eligible committee members; recusal and quorum enforced |
| M09 /admin/appeals/{id} | Original decision and new evidence, independent re-review assignment/outcome | authorized reviewer; preserved history |
| M10 /admin/causes | Draft/pending/published/paused/completed list; narrative/media/goal/fund/date editor | cause.prepare; unique case linkage |
| M11 .../{id}/publication | Side-by-side private/public allowlist preview, consent/redaction checklist, review/publish/unpublish | cause.publish; approved current case + verification |
| M12 .../{id}/updates | Milestone draft, sanitized media, preview/publish/archive | cause.update; consent and moderation |
| F01 /admin/finance | Fund balances/available/commitments, bank mismatches, fees and exceptions | finance.read |
| F02 /admin/donations | Search donor/payment/fund/cause/status; donation detail and event evidence | finance.read; masked identity by default |
| F03 /admin/manual-transfers/{id} | Proof/reference vs bank line, verify/reject/query and match | finance.reconcile; proof alone insufficient |
| F04 /admin/ledger | Journals/lines by fund/account/period, evidence, reversal/adjustment request | finance.read/prepare; no posted edit buttons |
| F05 /admin/reconciliations/{id} | Statement import preview, duplicate checks, settlement/manual match, variance and close | finance.reconcile; statement totals tie |
| F06 /admin/allocations | Donation restriction → eligible case, reserve/release/reallocate proposal with consent | allocation.manage; same fund/caps, independent exception approval |
| F07 /admin/disbursements/{id} | Case approval/eligible fund, amount/partial release, verified payee, proof/delivery | prepare/approve/execute separated |
| F08 /admin/payees/{id} | Vendor/hospital/beneficiary identity/bank verification, version, permitted method | payee.verify; change invalidates old approval |
| F09 /admin/refunds/{id} and /adjustments/{id} | Requested reason, original posting, proposed balancing reversal, approval and execution | independent approver; remaining refundable cap |
| F10 /admin/finance/reports | Fund/case/category/receipt/fee/unmatched/opening/closing report, export, as-of | report.finance; audited export |
| G01 /admin/rozgaar/{id} | Skill/demand/plan, tools/quotes/vendor, training/first opportunity, approved budget/baseline | program.manage; decision ceiling immutable |
| G02 .../{id}/handover | Delivery evidence, recipient/ownership transfer, acknowledgment, actual date | approved release + authorized tamlik method |
| G03 .../{id}/followups | 30/90/180-day due queue, income/equipment/customer/issues/evidence and next actions | assigned/program-scoped |
| G04 /admin/medical/{id} | Treatment/estimate/urgency/scheme/discount, eligible balance/authorization/payee | restricted health data |
| G05 .../{id}/invoices-followups | Invoice vs release, treatment stage, clinical follow-up limited to need | permission/purpose-limited |
| G06 /admin/emergency/{id} | Crisis proof/minimum checklist, expedition reason, fast queue, acknowledgment/short follow-up | core eligibility and approval still required |
| C01 /admin/pages/{id} | Page list; English/Hindi section editor, revision diff, draft preview/publish/unpublish | cms.edit/publish separated |
| C02 /admin/banners-menus | Scheduled banners and navigation/footer ordering/localization | future dates UTC-rendered locally, validated links |
| C03 /admin/content/{id} | News/story/event/gallery/testimonial editor, dates/media/consent/SEO/archive | consented publication only |
| C04 /admin/media/{id} | Quarantine scan/private master/public derivative/alt/caption/rights and consent linkage | public derivative explicitly approved |
| C05 /admin/faqs-programs | Approved program/eligibility copy and FAQ ordering/translations | policy wording requires recorded review |
| O01 /admin/volunteers/{id} | Applicant review/onboarding/skills/availability, training, assignments/activity | volunteer.manage; do not auto-grant verifier |
| O02 /admin/inquiries/{id} | Contact/newsletter opt-in queues, response status and suppression | no bulk contact export by default |
| O03 /admin/grievances/{id} | Complaint/appeal/privacy request, owner/deadline/reason/resolution | restricted grievance role; conflicts rerouted |
| O04 /admin/notifications | Template translations, preview, outbox/dead-letter retry and delivery state | notification.manage; no secret/PII body logs |
| O05 /admin/reports | Public approval preview, operational/Rozgaar/Medical/audit widgets and exports | permission-filtered, as-of/calculation definitions |
| S01 /admin/users/{id} | Users/status/invitations/roles/expiry/session revocation | identity.manage; MFA and audit |
| S02 /admin/roles-policies | Permissions/bundles, quorum/ceiling/conflict rules, versioned policy draft/approvals | roles.manage vs policy approval separated |
| S03 /admin/settings | Provider references, feature flags, approved organization disclosures and language | no editable secrets; dual approval for financial gates |
| S04 /admin/audit | Filter approvals/reversals/access/role changes/exceptions with evidence timeline | auditor scoped; append-only |
| S05 /admin/privacy | Retention/consent withdrawal/correction/removal/legal holds and action evidence | data steward; retain required financial evidence |
| S06 /admin/operations | Job failures/scan queue/security alerts/backup/restore drills/launch checklist/SOP register | operations.manage, no unsafe raw command UI |

## Main journeys and screen connections

Donor: P05 → P06 → P07 → gateway-owned checkout → P08 → D03/D04; manual alternative P09 → P08 pending. No checkout screen contains stored card data.

Applicant: P10 → X02/X01 → A01 → A03–A08 → A09 ↔ A10; negative outcome → A11; delivery → A13. Publicity consent is optional and independent of help eligibility.

Verification/approval: M02/M03 → V04/V05/V06 → M05/M06 → M07/M08 → M10/M11 only when publication is authorized. Approved private cases can proceed directly to F06/F07.

Delivery: F06 → F08/F07 → G02 or G05 or G06 → G03/V09/A13 → case closure. Donors see only D07/P06 sanitized milestones.

## Representative wireframes

These are textual layout specifications, with no borrowed imagery.

Public cause detail desktop:
- Header/navigation
- Breadcrumb → masked title
- Main 8-column story/media/timeline | 4-column sticky funding summary + eligible fund explanation + Donate
- Updates → public impact note → help/report → footer

Application wizard desktop:
- Title/reference/status + saved indicator
- Left six-step progress | center step fields + evidence guidance | right privacy/help note
- Back / Save and exit / Continue; final step replaces Continue with Submit
- Mobile: progress text “Step n of 6”, one column, actions remain visible without overlaying errors

Committee review desktop:
- Case reference/program/amount/verification-policy status
- Evidence summary | criterion checklist; conflict declaration before voting
- Quorum/ceiling panel, vote/conditions/reason, confirm decision; disabled with explanatory reasons when prerequisites fail

Finance release desktop:
- Case/fund/restriction/available/approved/unreleased summary
- Request amount/payee/version/evidence → independent approval record → execution result
- Action changes by role and status; material edits visibly invalidate prior approval

## Phase visibility

CMS Phase 1 exposes informational programs, volunteer/contact/grievance and reports that have real approved data. Donate/Apply/Causes destinations remain accessible information/availability pages until their operational modules are enabled; do not collect unavailable-service payments or imply case submission works. All final screens are specified now, but released only with the roadmap gates. Visual mockups and usability sessions follow approval of this textual baseline.

