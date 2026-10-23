# Donation, fund accounting and case workflows

Proposed operational design for approval. Blueprint §6–10,14–18 is authoritative. None of these workflows asserts IndiaZakat private behavior or grants legal/tax/Shariah authority. Policy-dependent actions fail closed until the specified approved policy exists.

## Financial meanings and separation

Zakat, Sadaqah and General are separate fund dimensions, with explicit approved program/payee/expense rules. They remain separate even if legally permitted bank accounts are shared. Bank-account segregation is D02; it cannot substitute for ledger restriction tracking. Never relabel Zakat as Sadaqah/General to pay an expense. Other funds need an approved new policy; reference-site Bank Interest is not a launch fund.

Donation = one donor intent for one fund and optionally one cause. Optional operational support, if approved, creates a separate explicitly consented General/other-permitted-fund donation item. A gateway order can pay both items but preserves their separate amounts and restrictions. No support preselected (P). One-time launch only.

“Received/captured” is payment evidence, “reconciled” is matched settlement/bank evidence, “posted” is an immutable balanced journal, “committed” is reserved usable funding, “disbursed” is a verified payment out, and “delivered” is an acknowledged program benefit/ownership milestone. These are not interchangeable.

P: usable public raised amount = reconciled posted cause-linked inflows minus posted donation reversals; it is not reduced by normal disbursement. Show distributed separately. Goal remaining=max(goal-netRaised,0); overfunding reported separately and acceptance follows D05. Fund available is not total donations, nor gross bank cash. Public as-of dates and labels identify the definition.

## Donation state and processing

| Event | State/evidence | Permitted next action |
|---|---|---|
| Validated intent | Created, current fund/cause/policy and consent snapshot | Create one idempotent order |
| Order accepted or manual reference awaiting match | Pending | Return/poll status, no receipt |
| Signed authorized event | Authorized | Await capture; never post usable funds |
| Signed captured event | Captured, immutable verified event | Await settlement/reconciliation |
| Definitive failure without capture | Failed | New order attempt under same valid intent; preserve old attempt |
| Matched settlement/manual bank credit + validation | Reconciled with ReconciledAtUtc | Atomically post journal, receipt entitlement and outbox |
| Approved confirmed partial reversal | PartiallyRefunded | Retain original receipt/correction chain, cap further refunds |
| Approved confirmed full reversal | Refunded | Remaining refundable zero, cause/fund metrics reverse |

Out-of-order events are interpreted monotonically: late authorization/failure cannot downgrade known capture. Failed order followed by proved capture is investigated and processed once; do not discard money evidence because UI showed failed. Store payment state history independently of display status. ReconciledAtUtc remains after refund. Duplicate external events and duplicate effect keys never post twice.

1. API validates enabled payment feature, approved fund/cause compatibility, amount/minimum, donor-source restrictions, contact/consent and idempotency.
2. Reserve donation intent snapshot, commit DB record; create provider order with unique external request key outside the DB transaction.
3. If provider response is uncertain, mark pending creation and query provider with that key; do not blindly create another charge.
4. Browser checkout uses provider-hosted UI only. Return path displays pending until server verification; card credentials never touch YHF storage.
5. Webhook validates signature over exact bounded raw bytes with configured secret; persist receipt/digest and enqueue processing. Invalid signatures cannot change state.
6. Worker verifies currency, merchant/order/payment identity and amounts, deduplicates event/effect, and records capture. Alert unknown orders/mismatches.
7. Import provider settlement and bank evidence, match gross/fees/tax/refunds/net. Unmatched capture stays non-usable.
8. Reconciliation transaction locks donation/fund, posts approved journal, updates reconciliation marker, creates unique receipt and outbox atomically.
9. Receipt rendering/notification retries safely. A render/email failure does not lose the posting; donor can retrieve the issued receipt record.
10. Refunds/chargebacks use distinct approval/verification/reversal paths below.

Manual UPI/NEFT: record reference/date/fund/amount and optional proof; finance validates actual bank statement line, duplicate reference and payer source, then matches/reconciles/posts. Screenshot alone never confirms receipt. Do not accept unmatched money as spendable; uncertain fund origin goes to an approved non-spendable suspense process, never automatically to Zakat.

## Ledger posting model

Chart of accounts and fee treatment require an accountant and qualified policy approval (D02/D04). Proposed account classes: bank asset, gateway clearing asset, restricted-fund income/control, program assistance expense, gateway-fee expense, refund/adjustment control and approved suspense. These are design examples, not a statutory accounting opinion.

Each journal has exact equal debit/credit sums **within each fund**, a unique source effect key, source evidence, actor/time and immutable lines. Every allocation/commitment/disbursement keeps donation/fund/case dimensions. No direct posted-row update/delete. SQL-controlled posting routine validates whole journals; application role has execute permission, not table mutation rights. Higher database operator access is monitored residual risk.

Illustrative INR examples, conditional on approved accounting policy:

| Operation | Proposed balanced entries | Restriction consequence |
|---|---|---|
| Reconciled Sadaqah bank donation 1,000 | Dr Bank/Sadaqah 1,000; Cr Sadaqah donation control 1,000 | Usable inflow 1,000, subject to donor earmark |
| Gateway reconciled gross 1,000, fee 20 funded permissibly by same fund | Dr Gateway clearing 1,000 / Cr donation control 1,000; then Dr Bank 980 + Dr fee expense 20 / Cr clearing 1,000, same fund | Inflow 1,000, fee outflow 20, available 980; policy may disallow for a particular fund |
| Eligible release 600 | Dr program assistance 600; Cr Bank 600, same fund/case | Net fund falls 600; consume commitment 600 atomically |
| Confirmed refund 200 | New reversing/correcting journal tied to original donation; Dr donation reversal/control 200; Cr Bank 200 | Restricted donation balance/public raised falls 200; original retained |

Gateway journals are posted only after reconciliation under this blueprint design, with effective capture/settlement dates and links as accounting approves; capture status alone does not create spendable balances. Internal clearing→bank transfer is not another inflow. Fees count once. If Zakat fees are not permitted, no Zakat expense may be booked. Resolve approved external/General subsidy method and cash attribution with reviewers before enabling that gateway flow; do not invent a cross-fund transfer to balance it. Suspense is a separately non-spendable account/fund arrangement requiring approval, not a loophole for unclassified Zakat.

Fund balance = posted inflows - posted outflows, excluding internal asset transfers. Available = usable fund balance - outstanding unconsumed commitments - valid holds. Allocation is earmarking, not another financial debit; do not subtract it and the same commitment twice. Restrictions can make an amount unavailable to a given case even when the fund aggregate is positive. Bank liquidity and clearing availability must both be checked.

## Allocation, reservation and release

1. Select reconciled source donations or an eligible pooled source.
2. Check immutable fund, donor restriction, cause/application match, current eligibility review, approved fund ceiling and written method policy.
3. Allocation records earmark amount. Commitment reserves within both source restrictions and case/fund approval; counters and append-only movement evidence change atomically.
4. Material approval change requires re-review. Pausing/ending a cause cannot silently move restricted funds.
5. Shortfall, excess, donor reallocation and abandoned purpose follow D05 with recorded consent/approval where required. Otherwise hold funds safely; no automatic redistribution.
6. Request partial disbursement against one commitment, one fund, current decision and verified payee version.
7. Independent authorized approver checks ceiling, conflicts, purpose/evidence and permitted recipient method. Approval binds amount/fund/case/payee/version/hash.
8. Execute with unique payment request key outside DB transaction after atomically marking funds in-flight. Unknown provider result → PendingConfirmation; never release reservation or retry as a second payment until status reconciled.
9. Confirm actual outgoing payment/bank evidence. Post journal and consume commitment in the same transaction; invalidate any remaining reservation only by explicit release.
10. Record delivery separately: hospital invoice/treatment status, equipment delivery/ownership handover, or emergency acknowledgment. Schedule program follow-up.

Serialize checks across fund + donation restriction + case/fund approval + commitment. Example: decision cap 10,000, paid 6,000, pending release 3,000 → at most 1,000 further request capacity, even if fund has 50,000. Concurrent requests cannot both spend that 1,000. Approved but unexecuted requests count against reservation/cap.

## Refund, chargeback and correction

Donor/staff requests reason/amount; finance checks original funding/settlement, previous refunds/chargebacks, allocations/disbursements, available refundable sources and approved refund policy. Independent approver authorizes a specific payload. Provider request uses a stable refund key; confirmed outcome creates an immutable reversal once. Declined/uncertain refund never creates a false reversal.

If a chargeback is received, record verified dispute evidence, freeze exposed availability and reconcile provider/bank debit. Tie it to the same remaining-original-payment cap; a refund and chargeback cannot both reverse the same principal. Do not fabricate negative available Zakat cover from another fund. If funds have been spent, create an exception/liability handling case and get finance/policy direction.

Corrections: preserve original receipt/journal; request adjustment/reversal with reason and approval; post correction; issue void/replacement receipt where applicable. No posted deletion or “edit balance” UI. Refund fees and period treatment remain D04/D09; never assume fee return.

## Applicant case state machine

| Transition | Actor and prerequisites | Evidence/exception |
|---|---|---|
| Draft → Submitted | owner/authorized assisted operator, complete minimum program intake and consent | Freeze application revision; deduplicate submission |
| Submitted → DocumentReview | Case Manager | Scan-safe documents and completeness queue |
| DocumentReview → MoreInfoRequired | Case Manager | Field-specific request/reason; applicant response creates revision |
| MoreInfoRequired → DocumentReview | owner/assisted resubmission | Preserve original request/response |
| DocumentReview → VerificationAssigned | authorized assigner | Named active verifier and checklist/due date |
| VerificationAssigned → FieldVerified | assigned verifier | Completed checks/evidence/recommendation; supervisor quality check P |
| FieldVerified → ShariahReview | Case Manager/reviewer | Financial means and program need ready; versioned fund criteria |
| ShariahReview → CommitteeReview | designated reviewer | Eligibility per fund/method/amount and approved policy; return queries to MoreInfoRequired when needed |
| CommitteeReview → Approved / Rejected / Deferred | authorized committee decision recorder | Quorum, recusals, ceiling, reason and conditions; no self-approval |
| Deferred → DocumentReview or CommitteeReview | authorized manager on stated condition | Reasoned re-entry and new meeting where required |
| Rejected → re-review via Appeal | independent appeal review | New linked decision, never overwrite rejection |
| Approved → Funding | authorized manager | Approval current, conditions met; public cause optional |
| Funding → DisbursementApproved | authorized independent release approver | Reserved eligible funds/current decision/payee; release sub-state handles partial tranches |
| DisbursementApproved → Delivered | authorized program/finance evidence | Paid confirmed AND delivery/ownership or approved treatment evidence |
| Delivered → FollowUp → Closed | assigned program owner | Due outcomes recorded or reasoned approved exception; closure checklist |

State is a high-level case summary. Multiple partial releases use their own lifecycle while case remains in Funding/DisbursementApproved; one delivered tranche does not imply the whole case is closed. A new review changing amount/method/eligibility pauses new releases, preserves prior delivery and invalidates stale approvals.

No direct skip from draft/urgent flag to paid/published. Re-review, appeal and emergency changes always append reason/time/actor/history. Draft withdrawal, cancellation/deceased/unreachable handling require D11; until approved, pause and review rather than deleting history.

## Verification, duplicate review and committee

Identity, household income/dependents/assets, quote validity, references, urgency, other assistance and program need each receive outcome/evidence/reason. Volunteer recommendation is not Shariah approval. HMAC indicators produce restricted candidate pairs, not automatic denials/merges. Human reviewer confirms household relationships and preserves both source IDs/history; money records are never rewritten to hide a merge.

Meeting agenda binds application revision, review version and policy. Record attendance and per-case conflict declaration before votes. Recused/absent/ineligible members do not count toward quorum. Approval limits are effective configured ceilings and fund-specific approved amounts; total fund limits cannot exceed overall approved need. Conflicted verifier cannot supply the decisive approval. Store dissent, reason codes, conditions and applicant-safe explanation.

If quorum or independent approver unavailable in a 3–5 person team, the system blocks decision/release and escalates to the designated independent reviewer (D03); it cannot invent independence. Super Admin is not a substitute reviewer. Appeal deadline/grounds and emergency quorum are written-policy decisions, not hard-coded assumptions.

## Publication and beneficiary protection

Approved case → optional masked narrative draft → consent/rights check → current verification check → independent public review → publish. Public cause can reference its private case internally but API strips identity, case link, full address, contact, documents, bank and clinical details. Public badges expire/pause with review expiry; publication does not certify unreviewed facts.

Publication/media consent is separate from help processing. Refusal to publicize should not by itself deny help (P requiring D12 confirmation). Withdrawal unpublishes relevant public content and triggers privacy review; required finance/decision evidence remains under approved retention/legal holds. Donors see milestones, not beneficiary phone/identity.

## Program-specific case management

**Rozgaar / Ek Zakat → Ek Rozgaar / Skill Se Rozgaar:** intake skill/work history, local demand, proposed plan/tools, baseline income and requested amount. Seek practical 1–2 vendor quotes or document exception. Review suitability and eligible grant, vendor/payee method and training need. After approved release, record equipment delivery, ownership/tamlik evidence under approved policy, recipient acknowledgment and actual start date. Connect first customer/market and training completion. Follow-ups due at 30/90/180 days from actual handover/start rule (D16); record equipment use, active business, income band/value, self-reported/verified classification, obstacles and next action. Grants are baseline; loans remain excluded without written approval.

**Adopt a Rozgaar:** donor chooses eligible restricted cause or approved livelihood pool. Same financial restrictions apply. Show anonymous handover/training/business milestones, aggregate sustainability and optional approved story. Excess/shortfall policy and donor consent precede reallocations.

**Medical / Zindagi Bachao:** record treatment category, hospital/doctor estimate, urgency, scheme/discount exploration, other funding and eligible uncovered balance. Reconcile requested vs estimate vs approved vs released and prevent duplicate invoice funding. Hospital/vendor direct payment is enabled only under the written approved Shariah/payee method. Each tranche needs current authorization/payee evidence; collect invoices, treatment stage and limited follow-up. Urgent flag moves priority and deadlines; it cannot erase eligibility/committee controls or assert medical outcome.

**Emergency:** minimal staged contact/crisis/need/urgency/proof or reason for unavailable proof, amount/fund/declaration/consent. Expedited verifier and committee pathway uses approved minimum checklist; outstanding documents have owners/dates. Preserve eligible fund and payment controls. Record crisis support/delivery acknowledgment and short follow-up. Fast-track changes queue timing, not authorization.

## Reporting, registers and SOPs

App A minimum records are represented explicitly: receipt number/date/donor/fund/amount/method/reference/tax; intake case/program/contact/household/need/docs/consent; verifier/date/checks/evidence/eligibility; meeting/quorum/conflicts/decision/amount/conditions; release/case/fund/payee/amount/approval/bank/proof/delivery; livelihood date/asset/customers/income/problems/next step; monthly opening/received/spent/committed/closing/unmatched/reviewer.

Daily owner triages urgent cases, payment failures, verification and security alerts. Weekly committee/reconciliation/content/follow-up owners clear queues. Monthly finance closes by fund, publishes approved aggregates, reviews program outcomes and records backup restore spot-check. SOP links in operation checks cover donation correction, emergency, appeal, incident, refund, beneficiary complaint and removal. Full templates and staff walkthroughs are roadmap deliverables, with named accountable owners before launch.

