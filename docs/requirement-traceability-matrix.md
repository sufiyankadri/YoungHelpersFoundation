# Requirement traceability matrix

Version 1.0, proposed for approval. Primary source: Word blueprint §1–20 and Appendices A/B. Every catalogue ID R01–R68 has a row below; P elaborations are marked in the requirements source. Screen IDs refer to screen-specifications.md, API letters to API-A…API-L in rest-api-contracts.md, AC IDs to development-roadmap.md. Database names refer to database-schema.md. Phase numbers are blueprint delivery phases, not this planning exercise. Cross-cutting controls begin at the listed phase and remain mandatory later.

No row is “implemented” or “verified in YHF.” Status for all rows: **Specified; implementation and acceptance pending approval**. REA evidence only supplements public interaction choices; none establishes YHF controls.

| Requirement | Primary source | Module | Screens | Data / architecture | API group | First phase | Acceptance |
|---|---|---|---|---|---|---|---|
| R01 | B §1–2 | Mission/scope | P01/P03 | CMS.Programs; System.ReportSnapshots | B/L | 0 | AC01 |
| R02 | B §1,3,6,8 | Launch exclusions | P03/P07/S03 | System.Settings; CMS.Programs | B/K | 0 | AC01 |
| R03 | B §5 | Bilingual/accessibility/SEO | P01–P19/X01–X09 | CMS.* translations/revisions | B/J | 1 | AC02 |
| R04 | B §5 | Home | P01 | CMS.Pages/PageSections; Cause.Causes | B/J | 1 | AC03 |
| R05 | B §5,14 | About | P02 | CMS.Pages; Workflow.PolicyVersions | B/J | 1 | AC03 |
| R06 | B §5,8 | Programs | P03/P04 | CMS.Programs/ProgramTranslations | B/J | 1 | AC03 |
| R07 | B §5,12 + P | Discovery | P05 | Cause.Causes/CauseTranslations/CauseFunds | B | 4 | AC04 |
| R08 | B §3,5 | Cause detail | P06/M10–M12 | Cause.*; CMS.PublicationReviews | B/F | 4 | AC04 |
| R09 | B §3,5,15 | Public impact | P11/O05 | CMS.PublicReports; System.ReportSnapshots | B/L | 1 | AC05 |
| R10 | B §5,9 | Media/content | P13/P14/C03/C04 | CMS.Posts/Galleries/MediaAssets | B/J | 1 | AC06 |
| R11 | B §5,9,14 | Help/policies | P15–P18/C05 | CMS.Pages/FAQs; System.Grievances | B/I/J | 1 | AC07 |
| R12 | B §9 | Public forms | P12/P15/P18/P19/O02/O03 | System.Inquiries/NewsletterSubscriptions/Grievances; Volunteer.Profiles | B/I | 1 | AC07 |
| R13 | B §9 | CMS sections | C01 | CMS.Pages/PageRevisions/PageSections | J | 1 | AC06 |
| R14 | B §9 | CMS publishing | C01–C05 | CMS.Banners/Menus/ContentRevisions/PublicationReviews | J | 1 | AC06 |
| R15 | B §4,13–14 | Roles/scope | X01–X09/S01/S02 | Auth.*; Workflow.CaseAssignments | A/K | 1 | AC08 |
| R16 | B §14 + P session design | Authentication | X01–X07/S01 | Auth.Users/Sessions/UserMfaFactors/AccountTokens | A/K | 1 | AC08 |
| R17 | B §4,7,18 | Separation | M08/F07/F09/S04 | Workflow.ConflictDeclarations/ActionApprovals; System.AuditLogs | E/G/K | 2 | AC09 |
| R18 | B §4,6,15 | Donor self-service | D01–D07 | Donor.*; Auth.UserPreferences | C | 3 | AC10 |
| R19 | B §6 | Donation intent | P07 | Donor.Donations/PaymentOrders/PaymentOrderItems | C | 3 | AC11 |
| R20 | B §6 | Payment states | P08/D03/F02 | Donor.PaymentAttempts/PaymentEvents/DonationStatusHistory | C/G | 3 | AC12 |
| R21 | B §6,12 | Webhook/receipt | P08/D04/F02 | System.WebhookInbox/OutboxMessages; Donor.Receipts | C/G | 3 | AC12 |
| R22 | B §6,14 | Fees/claims | P07/F05/F10 | Finance.Settlements/SettlementItems/LedgerLines | C/G | 3 | AC13 |
| R23 | B §6,8,10 | Restrictions | P07/F06/D07 | Donor.RestrictionChanges; Finance.Allocations/Commitments | C/G | 3 | AC14 |
| R24 | B §6 | Manual giving | P09/F03 | Donor.ManualTransfers; Finance.BankStatementLines | C/G | 3 | AC15 |
| R25 | B §6, App A | Receipt fields | D04 | Donor.Receipts; Finance.LedgerTransactions | C/G | 3 | AC10 |
| R26 | B §6,10,17 | Reversals | D06/F09/F04 | Donor.Refunds/Chargebacks; Finance.LedgerTransactions | C/G | 3 | AC16 |
| R27 | B §10 | Ledger | F01/F04 | Finance.Funds/LedgerAccounts/LedgerTransactions/LedgerLines | G | 3 | AC13 |
| R28 | B §10–11 | Reserve/release | F06–F08 | Finance.Allocations/Commitments/DisbursementRequests/Disbursements | G | 3 | AC14 |
| R29 | B §10 | Reconciliation | F03/F05 | Finance.BankReconciliations/BankStatementLines/ReconciliationMatches | G | 3 | AC15 |
| R30 | B §10,15 | Finance reports | F01/F10/O05 | Finance.PeriodCloses; System.ReportSnapshots | G/L | 3 | AC17 |
| R31 | B §7 | Intake steps | A03–A08/V07 | Beneficiary.Applications/Households/HouseholdFinances/ApplicationDocuments | D | 2 | AC18 |
| R32 | B §3,7 | Draft/assisted/status | A01/A02/A09/A10/V07 | Beneficiary.ApplicationSnapshots/InformationRequests; Auth.Delegations | D/E | 2 | AC18 |
| R33 | B §7,11,14 | Private evidence | A07/C04/V05/S05 | System.Documents/DocumentAccessGrants; Beneficiary.Consents | D/I | 2 | AC19 |
| R34 | B §7 | Case transitions | A09/A11/M02/M09 | Workflow.StatusHistory/Decisions/Appeals | D/E | 2 | AC20 |
| R35 | B §7 | Duplicate review | M04 | Beneficiary.DuplicateReviews; System.Documents | E | 2 | AC21 |
| R36 | B §7 | Verification | V04–V06/M03/M05 | Workflow.CaseAssignments/Verifications/VerificationChecks | E | 2 | AC22 |
| R37 | B §7,14 | Eligibility | M06 | Workflow.EligibilityReviews/PolicyVersions/DecisionFundLimits | E | 2 | AC22 |
| R38 | B §7 | Committee | M07/M08/M09 | Workflow.CommitteeMeetings/CommitteeMembers/ConflictDeclarations/Votes/Decisions | E | 2 | AC23 |
| R39 | B §7,9 | Publication | M10/M11 | CMS.PublicationReviews; Cause.Causes/CauseFunds | F | 4 | AC24 |
| R40 | B §3,7,10–11 | Disbursement | F07/F08/G02/G05/G06 | Finance.DisbursementRequests/Disbursements/DisbursementAttempts/Payees | G/H | 4 | AC25 |
| R41 | B §7–8 | Expedition | A06/M05/G04/G06 | Beneficiary.Applications; Emergency.Cases | D/E/H | 2 | AC26 |
| R42 | B §8 | Rozgaar plan | G01/G02 | Rozgaar.LivelihoodPlans/EquipmentItems/VendorQuotes/AssetHandovers | H | 4 | AC27 |
| R43 | B §2,8 | Skills/opportunity | G01/V09 | Rozgaar.TrainingRecords/Opportunities | H | 4 | AC27 |
| R44 | B §1–2,8,15 | Follow-ups | G03/V09/A13 | Rozgaar.LivelihoodFollowUps; System.OutboxMessages | H | 4 | AC28 |
| R45 | B §8 | Medical | G04/G05 | Medical.*; Workflow.EligibilityReviews | H | 4 | AC29 |
| R46 | B §8 | Emergency | G06/A06/A13 | Emergency.Cases/FollowUps | H | 4 | AC26 |
| R47 | B §8 | Adopt a Rozgaar | P06/D07/F06 | Cause.Causes; Donor.Donations/RestrictionChanges | B/C/G/H | 4 | AC14 |
| R48 | B §3–4,9 | Volunteers | P12/V01–V09/O01 | Volunteer.*; Workflow.CaseAssignments | B/I | 1 | AC30 |
| R49 | B §11,13 | Reliable notifications | X08/O04/S06 | System.Notifications/NotificationTemplates/WebhookInbox/OutboxMessages | A/K | 1 | AC31 |
| R50 | B §15 | Dashboards | P11/D01/M01/F01/G03/G05/O05/S04 | System.ReportSnapshots; Finance/Program projections | G/L | 1 | AC17 |
| R51 | B §11 | SQL invariants | S06/F04 | All schema + constraints/locking | All | 1 | AC32 |
| R52 | B §12 | API conventions | All forms/lists | System.IdempotencyRecords; RowVersion | All | 1 | AC33 |
| R53 | B §13 + user technology | Angular architecture | All shells/screens | Public DTOs/private projections | All | 1 | AC34 |
| R54 | B §13 + user technology | Clean Architecture | All commands | Domain + SQL stores | All | 1 | AC34 |
| R55 | B §13–14,17 | Environments/recovery | S06 | System.OperationChecks; storage/key backups | K | 1 | AC35 |
| R56 | B §14,17–18 | Privacy lifecycle | A12/S05 | Beneficiary.Consents; System.PrivacyRequests/RetentionHolds/AuditLogs | D/I/K | 1 | AC19 |
| R57 | B §14 | Provider/card control | P07/F02/S03 | Donor.PaymentOrders/PaymentEvents; System.Settings | C/K | 3 | AC36 |
| R58 | B §14 | Legal/tax/source gates | P02/P07/P17/S03 | Workflow.PolicyApprovals; System.Settings | B/C/E/K | 0 | AC36 |
| R59 | B §14,19 | Shariah gates | P04/M06/F07/S02 | Workflow.PolicyVersions/PolicyApprovals/EligibilityReviews | E/G | 0 | AC36 |
| R60 | B §18 | Operating cadence | M01/F01/O05/S06 | System.OperationChecks; Finance.PeriodCloses | I/L | 5 | AC37 |
| R61 | B §18 | Owners/staffing | O01/S01/S02 | Auth.UserRoles; Workflow.ActionApprovals | I/K | 0 | AC09 |
| R62 | B §18 | SOPs | O03/S05/S06 | System.OperationChecks/Documents | I/K | 5 | AC37 |
| R63 | B §16,19 | Delivery gates | S03/S06 | System.Settings/OperationChecks; Workflow.PolicyApprovals | K | 0 | AC38 |
| R64 | B §17 | UX/security UAT | All surfaces | Synthetic fixtures; audit/evidence | All | 5 | AC39 |
| R65 | B §17 | Finance/governance UAT | F03–F10/M06–M09 | Synthetic ledger/decision evidence | E/G | 5 | AC40 |
| R66 | B §16–18 | Hardening/launch | S06 | System.OperationChecks | K | 5 | AC35 |
| R67 | B App A | App A registers | D04/A08/V06/M08/F07/G03/F10 | Receipt/intake/verification/decision/release/followup/close tables | C–L | 2 | AC41 |
| R68 | B §3, App B + user | Source discipline | P01–P19/C01–C05 | CMS rights/consent/revision metadata | B/J | 0 | AC42 |

## Blueprint section coverage

| Source | Coverage location and requirements |
|---|---|
| §1 Executive vision/non-goals | R01–R02, mission and phase boundaries |
| §2 Original program pillars | R01, R27, R42–R47; workflows preserve all ten pillars |
| §3 Reference adapt/avoid | R07–R09, R18, R31–R40, R48, R68; reference evidence remains supplementary |
| §4 Users/permissions | R15–R18, R32, R36–R40, R48, R61; architecture role/scope matrix |
| §5 Public sitemap/design | R03–R12; P01–P19, original responsive design system |
| §6 Donations | R18–R26, R57–R59; donation state/fees/manual/receipt/reversal workflows |
| §7 Intake/verification/approval | R31–R41; six steps, duplicate checks, privacy, committee, appeal and publication |
| §8 Programs | R41–R47; Rozgaar, Skill, Medical, Emergency, Adopt and ownership/outcomes |
| §9 CMS | R10–R14, R39, R48; reusable blocks/revisions/scheduling/media/forms |
| §10 Finance | R22–R30; balanced ledger/fund restriction/commitment/reconciliation; illustrative budget explicitly nonbinding |
| §11 Schema/key relationships | R21,R25,R27–R29,R31–R56; full dictionary and transactional invariants |
| §12 API | R21,R52; representative routes and expanded contracts |
| §13 Technology/structure | R49,R51–R55; mandated stack and Clean Architecture |
| §14 Security/privacy/legal/Shariah | R15–R17,R22,R33,R37,R56–R59; decision/release gates |
| §15 Reports/KPIs | R09,R18,R30,R44–R45,R50; scoped dashboard/report routes |
| §16 Phases | R63,R66; original phase ranges/exit criteria in roadmap |
| §17 UAT | R64–R66; AC39/40 plus functional/security/recovery catalogue |
| §18 Operations | R60–R62,R66; daily/weekly/monthly cadence, owners and seven SOPs |
| §19 Open decisions | R57–R63; D01–D21 register, no assumed approvals |
| §20 First 30 tasks | Roadmap maps original tasks 01–30 to phases; no task started |
| Appendix A Minimum registers | R67/AC41, database dictionary/workflows enumerate every listed field |
| Appendix B Source/assumption notes | R68/AC42, approval-pack authority and reference separation |

## Supplemental REA observation mapping

| Evidence alias (exact ID in reference-analysis.md) | Verified observation used | YHF proposal and boundary |
|---|---|---|
| home/detail/listing/filter | Cause summaries, funding progress, category selection | R04/R07/R08 public discovery; no inference of reference finance integrity |
| donate/total/invaliddonate | Public pre-payment form, editable support/total, incomplete errors | R19/R22 and proposed opt-in support; minimum set by YHF D07 |
| signup/invalidsignup/malformed | Visible form fields and local validation messages | R12/R16/R52 accessible server-backed validation; no copied handlers |
| mobilemenu/mobilelisting/mobiledetail/mobiledonate | Drawer, narrow layouts, long category block, sticky action | R03/R07 responsive design improvements; no mobile conformance claim |
| how/volunteer | Public guidance and external volunteer registration links | R11/R32/R48 integrated YHF guidance/forms; no private workflow parity |
| search | Search outcome inconclusive | Specify positive/negative search tests AC04; do not replicate an unverified defect |

## Change control

Any approved addition/removal/change records requirement ID, blueprint basis or explicit elaboration, decision ID, affected screens/data/API/tests and phase. Re-run coverage checks and update the approval version. Features outside this matrix require new scoped approval. No silent reduction of blueprint requirements to fit a phase budget.

