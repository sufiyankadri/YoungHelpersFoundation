# Decision and approval register

Version 1.0 | 22 October 2026 | All entries Open unless explicitly marked. The blueprint is proposed requirements, not approved legal/tax/Shariah policy. Technical-plan approval does not resolve the entries below.

Evidence must include accountable person, date, written artifact/version, scope, conditions and expiry/review date. System policy approvals and release flags reference that evidence. An unsupported flag cannot enable restricted production operations.

| ID | Decision required | Owner / required evidence | Proposed safe behavior until decided | Blocks |
|---|---|---|---|---|
| D01 | Brand/logo/domain; English/Hindi approved content and translators | Foundation + content owner; rights and copy sign-off | Original draft tokens/copy only; no invented marks | Public launch |
| D02 | Registration/legal entity/PAN/bank ownership, 12AB/80G applicability; ledger chart and bank segregation | Foundation + qualified accountant/legal adviser; verified documents/accounting policy | No registration/tax claims or unapproved collection | Finance production/claims |
| D03 | Named team/roles, independent approvers, quorum, ceilings/conflicts and emergency authority | Foundation committee + governance lead; signed authority matrix | Block decision/release lacking independence; no admin override bypass | Governance/release |
| D04 | Gateway fees, tax on fees, refunds/chargebacks, operating support, administrative/training costs | Finance + Mufti/legal as applicable; written per-fund rules | No Zakat fee/admin deduction; support not preselected; no assumed subsidy | Gateway/postings |
| D05 | Pools vs restricted causes, excess/shortfall/failed purpose, allocation timing/reallocation consent | Committee + Mufti + legal; donor restriction policy | Preserve earmarks, hold unresolved funds; pause overfunded acceptance if no rule | Donations/allocations |
| D06 | Guest checkout/account claim, donor contact/identity and public anonymity | Foundation + finance/privacy advisers | Plan guest capability as proposal; require sign-off before enabling | Donor UX/API |
| D07 | Minimum/maximum gift/case/release, urgency SLAs and approval ceilings | Program/finance/governance; threshold schedule | No hard-coded IndiaZakat INR 50 minimum; disable unsafe unconfigured limits | Production validation |
| D08 | Gateway/provider merchant onboarding/KYC, allowed methods/categories and bank details | Finance + provider; contracts/sandbox/production credentials | Manual approved ledger first, gateway flag off | Payment launch |
| D09 | Refund rights/timeframes, fee return, settlement differences, disputed spent funds, accounting period treatment | Legal + finance; signed SOP/accounting treatment | Requests accepted for review, no automatic refund or cross-fund rescue | Refund/dispute execution |
| D10 | Mustahiq criteria, tamlik/ownership, beneficiary/vendor/hospital methods, grants vs loans and exceptions | Qualified Mufti/Shariah reviewer; signed versioned rules | No Zakat eligibility certification/payment without current written rule; grants baseline, loans excluded | Zakat intake/release/public claims |
| D11 | Review/appeal deadlines, rejection/deferred/cancellation/deceased/unreachable handling, evidence exceptions | Committee + program/privacy reviewers | Reasoned pause/re-review, no silent deletion/skip | Case closure/appeals |
| D12 | Who may publish; narrative/media allowlist, consent/guardian authority, complaint anonymity | Foundation + privacy/legal; consent/redaction/publication policy | Private by default, no public KYC; lack of publication consent does not imply approval denial | Public causes/media |
| D13 | Foreign contribution/source checks, NRI handling and FCRA review; gateway blocking capability | Qualified legal adviser + provider + finance; written allowed-source procedure | Do not accept unsupported foreign contributions; country dropdown alone insufficient | Production collection |
| D14 | Data retention/erasure, legal holds, backup expiry, medical/KYC access and applicant corrections | Privacy/legal + finance; category-specific schedule | No invented statutory periods; minimum collection, private access, removal reviewed | Data lifecycle/launch |
| D15 | Upload types/size/scanner/storage/data residency/provider and scanning outage behavior | Technical + privacy/program owner; architecture/vendor approval | Proposed PDF/JPEG/PNG ≤10 MB; quarantine fail-closed; no full Aadhaar default | Evidence upload production |
| D16 | Start date for 30/90/180-day follow-ups, earnings evidence, sustained-livelihood definition, emergency follow-up timing | Program Lead; outcome dictionary | Plan dates from handover/start approval, label self-report/verification; no fabricated impact | Program metrics/closure |
| D17 | Hosting/SQL edition/licensing, residency, backups/key custody, recovery/on-call/SLA and provider contracts | Technical + Foundation; cost/risk/restore sign-off | Local/staging synthetic only; proposed RPO 24h/RTO 8h | Production infrastructure |
| D18 | Volume, performance, report suppression threshold, notification channels and consent | Program/technical/privacy; load profile/KPI policy | No artificial public counters; proposed small-cell suppression threshold reviewed | Performance/report publication |
| D19 | Session durations, lockout/rate limits, MFA/recovery policy and privileged reauth | Security owner + Foundation; threat model/recovery drill | Proposed cookie/MFA controls, least privilege; no privileged default accounts | Auth production |
| D20 | EF Core choice, SSR/prerender hosting, UI library/font rights, compatible exact package versions | Technical lead; architecture decision record | Proposed EF Core 10, same-origin cookie auth, Angular 22 strict TS/SCSS; pin after approval | Setup/build |
| D21 | Whether public comments, recurring giving, extra funds/categories and education are ever added | Foundation + relevant reviewers; separate scope approval | Excluded/later; no reference-site feature implied | Optional extensions only |

## Known assumptions to approve

- Modular monolith, EF Core 10, same-origin server-session cookies and separate worker are technical proposals within the mandated stack.
- CMS Editor and Authorized Approver are permission bundles refining original roles; Volunteer/Verifier and Auditor/Shariah are separated for least privilege.
- One gateway order can contain separately restricted donation items for optional support; every donation still has one fund and optional cause.
- Public raised means reconciled net donation principal, while distributions and commitments are separate. Metric definitions require finance approval.
- Schema expands the blueprint to record emergency follow-ups, policy versions, vote/conflict evidence, training and privacy requests; it does not add a marketplace or AI eligibility.
- RPO/RTO, file size, touch target and session-duration proposals are operational/design targets, not external legal requirements.

## Approval record template

Record ID; item/scope; version/hash; decision Approved/Approved with conditions/Rejected; accountable approver; role/authority; approval date; evidence link; expiry/review date; conditions; modules/flags released. Do not enter an approval merely because this plan was presented or a role was assigned.

Current record: planning pack prepared; **user approval pending**. Foundation, finance, legal and Shariah decisions remain Open. No application implementation, deployment or live financial operation is authorized by this document itself.

