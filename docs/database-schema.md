# SQL Server database schema

Proposed complete relational design for approval; no DDL or migration executed. Blueprint §11 inventory is preserved and expanded to support its workflow, finance, security and operational requirements. Names below are SQL schema.Table names. Database version/edition, hosting, encryption-key custody and retention remain D decisions.

## Dictionary notation and universal columns

Every entity has Id uniqueidentifier PK (server-generated, nonsequential API exposure prohibited where sensitive); table-qualified references below point to that Id. “→Table” means an indexed FK to Table.Id. Composite/junction keys explicitly replace Id where stated. “?” means NULL; all other listed columns are NOT NULL. Alternate or natural uniqueness is marked U. No unlisted field is required to infer a financial state.

Types: id = uniqueidentifier; txt(n) = nvarchar(n); text = nvarchar(max); code = varchar(50); money = decimal(18,2); qty = decimal(18,3); utc = datetime2(7) UTC; day = date; flag = bit; hash = binary(32); json = nvarchar(max) with ISJSON check. Currency = char(3), INR launch-only. Language = varchar(10), en/hi at launch. Masked fingerprint = keyed HMAC, not unsalted identifier hash. Encrypted values = varbinary(max), with key-version metadata.

Mutable entities additionally have CreatedAtUtc utc default SYSUTCDATETIME, CreatedBy id?→Auth.Users, UpdatedAtUtc utc?, UpdatedBy id?→Auth.Users, RowVersion rowversion. CreatedBy NULL only for documented unauthenticated/system creation, with Audit actor type. IsActive flag default 1 only for reference/configuration tables and accounts; do not soft-delete money/history. Append-only evidence/event tables have CreatedAtUtc, CreatedBy? and immutable payload; no Updated/RowVersion unless a separate processing-state row is specified.

All FKs use NO ACTION for deletion. Privacy removal anonymizes only approved personal columns and deletes eligible objects via retention workflow, retaining references and accounting/audit evidence. Full PAN/phone/address/medical narrative are encrypted or in restricted encrypted documents; search uses authorized normalized/HMAC projections. Application roles never receive unrestricted SQL access.

## Reference and identity

| Table | Specific columns | Keys/rules |
|---|---|---|
| Reference.Locations | ParentId?→Locations, Kind code, NameEn txt(150), NameHi txt(150)?, CountryCode char(2), ExternalCode txt(30)? | Index ParentId/Kind; city/district/state hierarchy |
| Reference.ReasonCodes | Area code, Code code, LabelEn txt(200), LabelHi txt(200)?, IsActive flag | U(Area,Code) |
| Reference.StatusCodes | Area code, Code code, Terminal flag | U(Area,Code); allowed vocabularies below |
| Auth.Users | EmailEncrypted varbinary(max)?, NormalizedEmailHash hash?, PhoneEncrypted varbinary(max)?, PhoneHash hash?, DisplayNameEncrypted varbinary(max), PasswordHash txt(1000), Status code, EmailConfirmed flag, PhoneConfirmed flag, SecurityStamp txt(100), LockoutEndUtc utc?, AccessFailedCount int, MfaRequired flag | Filtered U email hash when nonnull; phone sharing not automatically unique; verified login identifier required |
| Auth.Roles | Code code U, Name txt(100), IsPrivileged flag, IsActive flag | No role implies all permissions |
| Auth.Permissions | Code varchar(100) U, Description txt(300), IsActive flag | Action/resource permission vocabulary |
| Auth.UserRoles | UserId→Users, RoleId→Roles, ScopeCode code, StartsAtUtc utc, EndsAtUtc utc?, GrantedBy→Users | U(UserId,RoleId,ScopeCode,StartsAtUtc); scope may identify program; separate case assignments for case access |
| Auth.RolePermissions | RoleId→Roles, PermissionId→Permissions | PK(RoleId,PermissionId), no extra Id |
| Auth.Sessions | UserId→Users, SessionTokenHash hash U, CreatedAtUtc utc, LastSeenAtUtc utc, IdleExpiresAtUtc utc, AbsoluteExpiresAtUtc utc, RevokedAtUtc utc?, MfaAtUtc utc?, DeviceLabel txt(150)?, IpHash hash? | No raw session token |
| Auth.RefreshTokens | UserId→Users, SessionId→Sessions, TokenHash hash U, FamilyId id, ExpiresAtUtc utc, UsedAtUtc utc?, RevokedAtUtc utc?, ReplacedById?→RefreshTokens | Disabled for launch cookie flow |
| Auth.UserMfaFactors | UserId→Users, FactorType code, SecretEncrypted varbinary(max), VerifiedAtUtc utc?, KeyVersion int | Restricted decryption |
| Auth.RecoveryCodes | UserId→Users, CodeHash hash U, UsedAtUtc utc? | Append creation + one-use consumption audit |
| Auth.AccountTokens | UserId→Users, Purpose code, TokenHash hash U, ExpiresAtUtc utc, ConsumedAtUtc utc? | One-use verification/reset/invitation token |
| Auth.UserPreferences | UserId→Users U, Language varchar(10), EmailNotifications flag, SmsNotifications flag | Marketing consent separate |
| Auth.Delegations | PrincipalApplicantId→Beneficiary.Applicants, DelegateUserId→Users, Purpose code, AuthorityDocumentId?→System.Documents, StartsAtUtc utc, EndsAtUtc utc?, RevokedAtUtc utc? | Ownership delegation, not blanket role |

Identity model adapts ASP.NET Core Identity stores and normalizer; avoid a second parallel credential database. Provider-required implementation columns must be reviewed in the Identity migration; encrypted/HMAC identifier mapping is custom infrastructure, never weakening password/token protections.

## CMS and public content

| Table | Specific columns | Keys/rules |
|---|---|---|
| CMS.Pages | Slug txt(180), Language varchar(10), Title txt(200), Status code, PublishedRevisionId?→PageRevisions, SeoTitle txt(70)?, SeoDescription txt(170)?, CanonicalPath txt(300)?, OgMediaId?→MediaAssets | U(Slug,Language) |
| CMS.PageRevisions | PageId→Pages, RevisionNo int, Title txt(200), SeoJson json, ReviewStatus code | U(PageId,RevisionNo); immutable revision |
| CMS.PageSections | PageRevisionId→PageRevisions, SectionType code, SortOrder int, ContentJson json | U(PageRevisionId,SortOrder); schema-validated blocks, no arbitrary scripts |
| CMS.Banners | Code code U, StartsAtUtc utc, EndsAtUtc utc?, Status code, TargetPath txt(300), SortOrder int | end > start; translations below |
| CMS.BannerTranslations | BannerId→Banners, Language varchar(10), Heading txt(200), Body txt(500)?, MediaId?→MediaAssets, Alt txt(300)? | U(BannerId,Language) |
| CMS.Programs | Code code U, Status code, AllowsIntake flag, AllowsPublicCauses flag, SortOrder int | Rozgaar/Medical/Emergency; education disabled |
| CMS.ProgramTranslations | ProgramId→Programs, Language varchar(10), Name txt(100), Summary txt(1000), EligibilityText text, ProcessText text | U(ProgramId,Language) |
| CMS.Posts | Type code, Slug txt(180), Language varchar(10), Title txt(200), BodySanitized text, Status code, PublishedAtUtc utc?, EventStartsAtUtc utc?, EventEndsAtUtc utc?, LocationText txt(200)?, CoverMediaId?→MediaAssets, ConsentId?→Beneficiary.Consents, SeoJson json | U(Type,Slug,Language); story/news/event/testimonial; revisions retained below |
| CMS.ContentRevisions | ResourceType code, ResourceId id, RevisionNo int, SnapshotJson json, Action code | Append-only; U(ResourceType,ResourceId,RevisionNo); polymorphic resource checked in application |
| CMS.Galleries | Slug txt(180), Language varchar(10), Title txt(200), Status code | U(Slug,Language) |
| CMS.MediaAssets | DocumentId→System.Documents, PublicDerivativeId?→System.Documents, ConsentId?→Beneficiary.Consents, RightsBasis txt(300), Status code, AltEn txt(300), AltHi txt(300)?, CaptionEn txt(500)?, CaptionHi txt(500)? | Master private; derivative explicitly public-approved |
| CMS.GalleryItems | GalleryId→Galleries, MediaId→MediaAssets, SortOrder int | U(GalleryId,MediaId), U(GalleryId,SortOrder) |
| CMS.FAQs | Topic code, Language varchar(10), Question txt(500), AnswerSanitized text, Status code, SortOrder int | Index(Topic,Language,Status) |
| CMS.Menus | Code code, Language varchar(10), Status code | U(Code,Language) |
| CMS.MenuItems | MenuId→Menus, ParentId?→MenuItems, Label txt(100), TargetPath txt(300), SortOrder int | No cycles; parent must same menu |
| CMS.PublicationReviews | ResourceType code, ResourceId id, RevisionNo int, ConsentChecked flag, RedactionChecked flag, PolicyChecked flag, Outcome code, Reason txt(1000) | Append-only; actor/time inherited |
| CMS.PublicReports | PeriodStart day, PeriodEnd day, Type code, Language varchar(10), Title txt(200), DocumentId?→System.Documents, SnapshotId?→System.ReportSnapshots, Status code | Publication requires reviewed privacy-safe snapshot |

## Beneficiary and evidence

| Table | Specific columns | Keys/rules |
|---|---|---|
| Beneficiary.Applicants | UserId?→Auth.Users, NameEncrypted varbinary(max), NameFingerprint hash, PhoneEncrypted varbinary(max)?, PhoneFingerprint hash?, ContactEmailEncrypted varbinary(max)?, LocationId?→Reference.Locations, AddressEncrypted varbinary(max)?, GuardianNameEncrypted varbinary(max)?, GuardianAuthorityDocumentId?→System.Documents | Index fingerprints only for authorized duplicate review |
| Beneficiary.Households | HouseholdReference txt(60) U, LocationId?→Reference.Locations, AddressEncrypted varbinary(max)?, HouseholdFingerprint hash? | Shared household, application snapshots preserve history |
| Beneficiary.HouseholdMembers | HouseholdId→Households, ApplicantId?→Applicants, NameEncrypted varbinary(max)?, Relationship code, BirthYear smallint?, Dependent flag, DisabilityOrNeedEncrypted varbinary(max)? | Minimum data; no public access |
| Beneficiary.Applications | CaseNumber txt(40) U, ApplicantId→Applicants, HouseholdId→Households, ProgramId→CMS.Programs, Status code, RequestedAmount money, Currency char(3), NeedEncrypted varbinary(max), Urgency code, Source code, AssistedByUserId?→Auth.Users, OfflineReferenceEncrypted varbinary(max)?, SubmittedAtUtc utc?, ApprovedDecisionId?→Workflow.Decisions, ClosedAtUtc utc? | Index(Status,Urgency,ProgramId,SubmittedAtUtc); amount >=0 draft, >0 submit |
| Beneficiary.ApplicationSnapshots | ApplicationId→Applications, RevisionNo int, SnapshotEncrypted varbinary(max), SubmittedAtUtc utc, ConsentId→Consents | U(ApplicationId,RevisionNo); immutable submitted facts |
| Beneficiary.HouseholdFinances | ApplicationId→Applications U, MonthlyIncome money?, IncomeBasis code, AssetTotal money?, LiabilityTotal money?, NotesEncrypted varbinary(max)? | >=0 amounts; unknown permitted with reason |
| Beneficiary.FinancialItems | ApplicationId→Applications, Type code, DescriptionEncrypted varbinary(max), Amount money, Period code, EvidenceDocumentId?→System.Documents | Income/asset/liability evidence item |
| Beneficiary.ApplicationDocuments | ApplicationId→Applications, DocumentId→System.Documents, Category code, VerificationStatus code, RequiredReasonCode?→Reference.ReasonCodes, ReplacesId?→ApplicationDocuments | Document ownership checked; no raw object keys in public DTO |
| Beneficiary.Consents | ApplicantId?→Applicants, UserId?→Auth.Users, ContactSubjectId?→System.ContactSubjects, Purpose code, PolicyVersionId→Workflow.PolicyVersions, Granted flag, RecordedAtUtc utc, WithdrawnAtUtc utc?, Method code, WitnessUserId?→Auth.Users, EvidenceDocumentId?→System.Documents | At least one subject; purpose processing/publication/media/marketing; append history |
| Beneficiary.DuplicateReviews | ApplicantAId→Applicants, ApplicantBId→Applicants, IndicatorsJson json, Outcome code, SurvivorApplicantId?→Applicants, Reason txt(1000), ApprovedById?→Auth.Users | ordered pair A<B unique; no automatic merge; no merge of ledger identity |
| Beneficiary.InformationRequests | ApplicationId→Applications, RequestedById→Auth.Users, FieldsJson json, Reason txt(1000), DueAtUtc utc?, Status code | Applicant-safe text |
| Beneficiary.InformationResponses | RequestId→InformationRequests, ResponseEncrypted varbinary(max), ApplicationRevisionNo int, SubmittedAtUtc utc | Immutable response; documents linked via application |

## Workflow, committee and policies

| Table | Specific columns | Keys/rules |
|---|---|---|
| Workflow.PolicyVersions | PolicyCode code, VersionNo int, BodyDocumentId→System.Documents, EffectiveFromUtc utc?, EffectiveToUtc utc?, Status code | U(PolicyCode,VersionNo); approved version immutable |
| Workflow.PolicyApprovals | PolicyVersionId→PolicyVersions, ApprovalType code, ApproverId→Auth.Users, Outcome code, EvidenceDocumentId?→System.Documents, ApprovedAtUtc utc | legal/Shariah/finance approvals distinct |
| Workflow.CaseAssignments | ApplicationId→Beneficiary.Applications, UserId→Auth.Users, AssignmentType code, StartsAtUtc utc, EndsAtUtc utc?, DueAtUtc utc?, AssignedById→Auth.Users | Active uniqueness where single manager/verifier required; permissions expire |
| Workflow.Verifications | ApplicationId→Beneficiary.Applications, AssignmentId→CaseAssignments, Method code, VisitAtUtc utc?, Recommendation code, NotesEncrypted varbinary(max)?, SubmittedAtUtc utc?, PolicyVersionId→PolicyVersions | One submission version per verification; corrections new record |
| Workflow.VerificationChecks | VerificationId→Verifications, CheckCode code, Outcome code, EvidenceDocumentId?→System.Documents, ReasonEncrypted varbinary(max)? | U(VerificationId,CheckCode) |
| Workflow.EligibilityReviews | ApplicationId→Beneficiary.Applications, FundId→Finance.Funds, PolicyVersionId→PolicyVersions, ReviewerId→Auth.Users, EligibleAmount money, Outcome code, PermittedPayeeMethod code, TamlikEvidenceDocumentId?→System.Documents, ExpiresAtUtc utc?, ReasonEncrypted varbinary(max)? | >=0 amount; immutable review; newest approved effective review governs |
| Workflow.CommitteeMeetings | StartsAtUtc utc, Status code, PolicyVersionId→PolicyVersions, QuorumRequired int, ChairUserId→Auth.Users, MinutesDocumentId?→System.Documents | quorum >0; policy snapshot |
| Workflow.CommitteeMembers | MeetingId→CommitteeMeetings, UserId→Auth.Users, Present flag, AuthorityCeiling money, MembershipEvidenceId?→System.Documents | U(MeetingId,UserId) |
| Workflow.MeetingCases | MeetingId→CommitteeMeetings, ApplicationId→Beneficiary.Applications, ApplicationRevisionNo int, SortOrder int | U(MeetingId,ApplicationId) |
| Workflow.ConflictDeclarations | MeetingCaseId→MeetingCases, MemberId→CommitteeMembers, HasConflict flag, ReasonEncrypted varbinary(max)?, Recused flag | U(MeetingCaseId,MemberId); same meeting enforced |
| Workflow.Votes | MeetingCaseId→MeetingCases, MemberId→CommitteeMembers, Vote code, RecommendedAmount money?, Conditions text?, SubmittedAtUtc utc | U(MeetingCaseId,MemberId); immutable submitted vote |
| Workflow.Decisions | ApplicationId→Beneficiary.Applications, MeetingCaseId?→MeetingCases, PolicyVersionId→PolicyVersions, DecisionType code, Outcome code, ApprovedAmount money, ReasonCodeId→Reference.ReasonCodes, ApplicantReason txt(1500), InternalReasonEncrypted varbinary(max)?, Conditions text?, SupersedesId?→Decisions, DecidedAtUtc utc | Immutable; quorum/conflict/ceiling + amount checked transactionally |
| Workflow.DecisionFundLimits | DecisionId→Decisions, FundId→Finance.Funds, EligibleReviewId→EligibilityReviews, ApprovedAmount money | U(DecisionId,FundId); sum <= decision total; compatible fund |
| Workflow.StatusHistory | ApplicationId→Beneficiary.Applications, FromStatus code, ToStatus code, ReasonCodeId→Reference.ReasonCodes, CommentEncrypted varbinary(max)?, RelatedDecisionId?→Decisions, OccurredAtUtc utc | Append-only, query by ApplicationId/time |
| Workflow.Appeals | ApplicationId→Beneficiary.Applications, OriginalDecisionId→Decisions, ReasonEncrypted varbinary(max), EvidenceDocumentId?→System.Documents, Status code, AssignedReviewerId?→Auth.Users, ResolutionDecisionId?→Decisions | No destructive original decision update |
| Workflow.ActionApprovals | ActionType code, ResourceId id, ResourceVersion binary(8), PayloadHash hash, ApproverId→Auth.Users, PolicyVersionId→PolicyVersions, Amount money?, Outcome code, Reason txt(1000), ExpiresAtUtc utc? | Append-only; generic approval binds concrete action snapshot; subject existence/type checked in use case |

## Donations and gateway

| Table | Specific columns | Keys/rules |
|---|---|---|
| Donor.Donors | UserId?→Auth.Users, ContactSubjectId→System.ContactSubjects, NameEncrypted varbinary(max), EmailEncrypted varbinary(max)?, PhoneEncrypted varbinary(max)?, AddressEncrypted varbinary(max)?, LocationId?→Reference.Locations, PanEncrypted varbinary(max)?, TaxEvidenceId?→System.Documents | Filtered U UserId; guest donors separate until verified claim; contact subject links guest consent and notifications |
| Donor.DonationSessions | DonorId?→Donors, SessionHash hash U, ExpiresAtUtc utc, ClaimedByUserId?→Auth.Users, ClaimTokenHash hash? | Guest read capability; no raw token |
| Donor.Donations | DonorId→Donors, SessionId?→DonationSessions, FundId→Finance.Funds, CauseId?→Cause.Causes, Amount money, Currency char(3), Status code, IsAnonymous flag, RestrictionText txt(1000)?, PolicyVersionId→Workflow.PolicyVersions, ConsentId→Beneficiary.Consents, ReconciledAtUtc utc? | >0; one fund/cause per donation; DB composite compatibility rule below |
| Donor.PaymentOrders | Provider code, ExternalOrderId txt(150)?, DonationSessionId?→DonationSessions, OwnerUserId?→Auth.Users, TotalAmount money, Currency char(3), Status code, ExpiresAtUtc utc?, RequestKey txt(100) | Filtered U(Provider,ExternalOrderId); U(Provider,RequestKey) |
| Donor.PaymentOrderItems | PaymentOrderId→PaymentOrders, DonationId→Donations U, Amount money, Purpose code | U(OrderId,DonationId); item amount=donation; order sum exact |
| Donor.PaymentAttempts | PaymentOrderId→PaymentOrders, Provider code, ProviderPaymentId txt(150)?, Status code, AuthorizedAmount money?, CapturedAmount money?, FailureCode code?, CapturedAtUtc utc? | Filtered U(Provider,ProviderPaymentId); provider must match order; global payment uniqueness independent of event type |
| Donor.PaymentEvents | Provider code, ExternalEventId txt(150), PaymentAttemptId?→PaymentAttempts, InboxId→System.WebhookInbox, EventType code, Verified flag, OccurredAtUtc utc, NormalizedJson json | U(Provider,ExternalEventId); immutable evidence |
| Donor.DonationStatusHistory | DonationId→Donations, Status code, PaymentEventId?→PaymentEvents, ReasonCodeId?→Reference.ReasonCodes, OccurredAtUtc utc | Append-only; refund state distinct reconciliation marker |
| Donor.ManualTransfers | DonationId→Donations, TransferDate day, BankReferenceEncrypted varbinary(max), BankReferenceHash hash, ProofDocumentId?→System.Documents, Status code, VerifiedById?→Auth.Users, BankLineId?→Finance.BankStatementLines | Indexed fingerprint/amount/date; no automatic uniqueness rejects legitimate shared references |
| Donor.Receipts | DonationId→Donations, ReceiptNumber txt(60) U, IssuedAtUtc utc, Amount money, FundId→Finance.Funds, Method code, PaymentReferenceMasked txt(150), TaxStatus code, DisclosureVersionId→Workflow.PolicyVersions, DocumentId?→System.Documents, SupersedesReceiptId?→Receipts, Status code | Original issue once per reconciled donation; replacements void original via separate audited action, never erase |
| Donor.Refunds | DonationId→Donations, PaymentAttemptId?→PaymentAttempts, RequestedAmount money, Reason txt(1000), Status code, ApprovalId?→Workflow.ActionApprovals, ProviderRefundId txt(150)?, ReversalTransactionId?→Finance.LedgerTransactions | >0; filtered U provider refund; cumulative/refund+chargeback cap |
| Donor.Chargebacks | PaymentAttemptId→PaymentAttempts, ProviderDisputeId txt(150) U, Amount money, Status code, EvidenceDocumentId?→System.Documents, ReversalTransactionId?→Finance.LedgerTransactions | No double reversal with refund |
| Donor.RestrictionChanges | DonationId→Donations, OriginalTerms txt(1000), ProposedTerms txt(1000), ConsentId?→Beneficiary.Consents, ApprovalId?→Workflow.ActionApprovals, Status code | No fund conversion by changing display label |

## Finance and fund accounting

| Table | Specific columns | Keys/rules |
|---|---|---|
| Finance.Funds | Code code U, FundType code, Name txt(100), PolicyVersionId→Workflow.PolicyVersions, RestrictionsJson json, Status code | Zakat/Sadaqah/General/other approved only; no auto-approval |
| Finance.FundProgramRules | FundId→Funds, ProgramId→CMS.Programs, PolicyVersionId→Workflow.PolicyVersions, IsPermitted flag, PayeeMethodsJson json | U(FundId,ProgramId,PolicyVersionId) |
| Finance.LedgerAccounts | Code code U, Name txt(150), AccountType code, NormalSide char(1), IsActive flag | Asset/liability/income/expense/fund-control mapping approved by accountant |
| Finance.LedgerTransactions | JournalNumber txt(60) U, PostedAtUtc utc, EffectiveDate day, Currency char(3), SourceType code, SourceId id, EffectKey txt(180) U, ReversesTransactionId?→LedgerTransactions, ApprovalId?→Workflow.ActionApprovals, NarrativeRedacted txt(500) | Only complete balanced posted journals stored; draft proposals below |
| Finance.LedgerLines | TransactionId→LedgerTransactions, LineNo int, AccountId→LedgerAccounts, FundId→Funds, DonationId?→Donor.Donations, ApplicationId?→Beneficiary.Applications, CauseId?→Cause.Causes, Debit money, Credit money, CashFlowClass code | U(TransactionId,LineNo); one side >0 and other=0; each transaction balanced per fund |
| Finance.JournalProposals | ProposedLinesJson json, Reason txt(1000), Status code, ApprovalId?→Workflow.ActionApprovals, PostedTransactionId?→LedgerTransactions | Strict typed line validation before posting; cannot edit posted proposal |
| Finance.Allocations | DonationId→Donor.Donations, ApplicationId→Beneficiary.Applications, FundId→Funds, Amount money, Status code, RestrictionChangeId?→Donor.RestrictionChanges | >0; fund=donation fund; original cause enforced |
| Finance.Commitments | ApplicationId→Beneficiary.Applications, FundId→Funds, AllocationId?→Allocations, DecisionFundLimitId→Workflow.DecisionFundLimits, ReservedAmount money, ConsumedAmount money, ReleasedAmount money, Status code | >=0; consumed+released<=reserved; avoid double counting allocation vs commitment |
| Finance.CommitmentMovements | CommitmentId→Commitments, MovementType code, Amount money, DisbursementId?→Disbursements, Reason txt(500) | Immutable reserve/consume/release evidence; totals reconciled |
| Finance.CommitmentSources | CommitmentId→Commitments, DonationId→Donor.Donations, AllocationId→Allocations, ReservedAmount money, ConsumedAmount money, ReleasedAmount money | U(CommitmentId,DonationId,AllocationId); source amounts tie to commitment and donor-restricted remaining balances; consumed+released<=reserved |
| Finance.FundHolds | FundId→Funds, DonationId?→Donor.Donations, Amount money, ReasonCodeId→Reference.ReasonCodes, SourceType code, SourceId id, StartsAtUtc utc, ReleasedAtUtc utc?, ReleaseApprovalId?→Workflow.ActionApprovals | >0; disputes/uncertain refunds; no double reservation of amount already committed; release audited |
| Finance.Payees | Type code, NameEncrypted varbinary(max), BankDetailsEncrypted varbinary(max), BankFingerprint hash, VerificationStatus code, VerificationDocumentId?→System.Documents, VerifiedById?→Auth.Users, VerifiedAtUtc utc?, Method code | Changes create new version for approved release payload |
| Finance.DisbursementRequests | ApplicationId→Beneficiary.Applications, FundId→Funds, CommitmentId→Commitments, DecisionId→Workflow.Decisions, PayeeId→Payees, PayeeVersion binary(8), Amount money, Purpose txt(500), Status code, ApprovalId?→Workflow.ActionApprovals | >0; approved policy method + independent approver |
| Finance.Disbursements | RequestId→DisbursementRequests, ProviderReference txt(150)?, Amount money, Status code, ExecutedAtUtc utc?, PaymentEvidenceId?→System.Documents, JournalId?→LedgerTransactions, DeliveryAcknowledgmentId?→System.Documents | Unique successful execution per request, retries as attempts below |
| Finance.DisbursementAttempts | DisbursementId→Disbursements, AttemptNo int, ExternalRequestKey txt(150) U, Status code, ExternalReference txt(150)?, ResultAtUtc utc? | U(DisbursementId,AttemptNo); uncertain external result locks repeat release |
| Finance.BankAccounts | Name txt(150), MaskedNumber txt(50), AccountDetailsEncrypted varbinary(max), Currency char(3), Status code | Actual legal banking segregation D02; ledger always fund-separated |
| Finance.BankReconciliations | BankAccountId→BankAccounts, PeriodStart day, PeriodEnd day, OpeningBalance money, ClosingBalance money, Status code, ApprovedById?→Auth.Users, StatementDocumentId→System.Documents | End>=start; no overlapping closed period for same bank |
| Finance.BankStatementLines | ReconciliationId→BankReconciliations, LineOrdinal int, BankTransactionId txt(150)?, Date day, Debit money, Credit money, ReferenceEncrypted varbinary(max), Fingerprint hash | U(ReconciliationId,LineOrdinal); fingerprint import dedupe with reviewed exceptions |
| Finance.Settlements | Provider code, ExternalSettlementId txt(150), BankAccountId→BankAccounts, Gross money, Fees money, TaxOnFees money, Net money, Currency char(3), Status code, StatementLineId?→BankStatementLines | U(Provider,ExternalSettlementId); gross-fees-tax=net |
| Finance.SettlementItems | SettlementId→Settlements, PaymentAttemptId→Donor.PaymentAttempts, Gross money, Fee money, Tax money, RefundAdjustment money | U(SettlementId,PaymentAttemptId); allocated totals tie |
| Finance.ReconciliationMatches | StatementLineId→BankStatementLines, SettlementId?→Settlements, ManualTransferId?→Donor.ManualTransfers, DisbursementId?→Disbursements, RefundId?→Donor.Refunds, Amount money, Status code | Exactly one target FK; split matches capped by line amount; per-target cumulative cap |
| Finance.PeriodCloses | PeriodStart day, PeriodEnd day, FundId→Funds, Opening money, Inflows money, Outflows money, Commitments money, Closing money, ApprovalId→Workflow.ActionApprovals, SnapshotId→System.ReportSnapshots | U(FundId,PeriodStart,PeriodEnd); immutable close; corrections reopen approved or next-period adjustment |

No authoritative mutable “fund balance” column. Read projections derive from posted cash-flow lines, excluding internal bank/clearing transfers. Reconciled inflow counts once. Available = net posted usable balance minus unconsumed active commitments and separately classified holds, without subtracting allocations twice. A donation may allocate to several eligible cases only when its restrictions allow it; a public cause restricts allocations to its application. Available bank liquidity and gateway clearing balances are distinct checks.

## Public causes and program delivery

| Table | Specific columns | Keys/rules |
|---|---|---|
| Cause.Causes | ApplicationId→Beneficiary.Applications U, Slug txt(180) U, Goal money, Status code, EndDate day?, VerificationReviewId→Workflow.EligibilityReviews, PublishedAtUtc utc?, PublicationReviewId?→CMS.PublicationReviews | >0 goal; one case zero/one public cause; link private |
| Cause.CauseTranslations | CauseId→Causes, Language varchar(10), MaskedTitle txt(200), Summary txt(700), StorySanitized text, PublicLocation txt(150)?, SeoJson json | U(CauseId,Language); public allowlist only |
| Cause.CauseFunds | CauseId→Causes, FundId→Finance.Funds, EligibilityReviewId→Workflow.EligibilityReviews, Ceiling money | PK(CauseId,FundId); current review and ceiling |
| Cause.CauseUpdates | CauseId→Causes, Language varchar(10), Milestone code, Title txt(200), BodySanitized text, ConsentId?→Beneficiary.Consents, Status code, PublishedAtUtc utc? | moderation and revisions |
| Cause.CauseMedia | CauseId→Causes, MediaId→CMS.MediaAssets, SortOrder int | U(CauseId,MediaId) |
| Cause.CauseDonations | CauseId→Causes, DonationId→Donor.Donations U, LinkedAtUtc utc | Projection association, no duplicate financial amount; derived from donation CauseId |
| Rozgaar.LivelihoodPlans | ApplicationId→Beneficiary.Applications U, SkillEncrypted varbinary(max), DemandAssessmentEncrypted varbinary(max), PlanEncrypted varbinary(max), BaselineMonthlyIncome money?, ApprovedBudget money?, Status code | Approved budget references committee decision, not independent authority |
| Rozgaar.EquipmentItems | PlanId→LivelihoodPlans, Description txt(500), Quantity qty, EstimatedUnitCost money | >0 quantity, >=0 cost |
| Rozgaar.VendorQuotes | PlanId→LivelihoodPlans, EquipmentItemId?→EquipmentItems, PayeeId→Finance.Payees, QuoteDocumentId→System.Documents, Amount money, ValidUntil day?, Selected flag | Quote count policy with exception reason |
| Rozgaar.TrainingRecords | PlanId→LivelihoodPlans, Provider txt(200), Skill txt(200), StartsAt day?, CompletedAt day?, EvidenceDocumentId?→System.Documents, Outcome txt(500)? | Skill Se Rozgaar |
| Rozgaar.Opportunities | PlanId→LivelihoodPlans, Type code, ConnectedAt day, DescriptionEncrypted varbinary(max), EvidenceClass code | First customer/market connection |
| Rozgaar.AssetHandovers | PlanId→LivelihoodPlans, DisbursementId→Finance.Disbursements, HandoverDate day, OwnershipEvidenceId→System.Documents, DeliveryEvidenceId→System.Documents, RecipientAcknowledgmentId→System.Documents, MethodPolicyId→Workflow.PolicyVersions | Delivery/ownership evidence separate; no loan assumption |
| Rozgaar.LivelihoodFollowUps | PlanId→LivelihoodPlans, ScheduledDay smallint, DueAt day, PerformedAt day?, EquipmentInUse flag?, BusinessActive flag?, MonthlyIncome money?, IncomeBand code?, EvidenceClass code, ObstaclesEncrypted varbinary(max)?, NextAction txt(1000)?, EvidenceDocumentId?→System.Documents | U(PlanId,ScheduledDay); 30/90/180; self-reported vs verified |
| Medical.MedicalCases | ApplicationId→Beneficiary.Applications U, TreatmentCategory code, HospitalEncrypted varbinary(max), DoctorEncrypted varbinary(max)?, Urgency code, SchemeExplorationEncrypted varbinary(max)?, DiscountAmount money?, Stage code, AuthorizedMethod code? | Restricted health access |
| Medical.TreatmentEstimates | MedicalCaseId→MedicalCases, DocumentId→System.Documents, EstimateAmount money, EligibleBalance money, SchemeContribution money, OtherFunding money, ValidUntil day? | >=0; eligible<=estimate minus known covered amount; final policy review |
| Medical.MedicalInvoices | MedicalCaseId→MedicalCases, DisbursementId?→Finance.Disbursements, PayeeId→Finance.Payees, DocumentId→System.Documents, InvoiceNumberEncrypted varbinary(max), Fingerprint hash, Amount money, InvoiceDate day | duplicate review; no auto repeated payment |
| Medical.TreatmentFollowUps | MedicalCaseId→MedicalCases, DueAt day?, PerformedAt day?, Stage code, NotesEncrypted varbinary(max)?, EvidenceDocumentId?→System.Documents, NextAction txt(1000)? | No unverified health success claims |
| Emergency.Cases | ApplicationId→Beneficiary.Applications U, CrisisType code, CrisisDate day, ProofDocumentId?→System.Documents, SupportType code, ExpeditedReason txt(1000), ShortFollowUpDue day?, AcknowledgmentId?→System.Documents | Minimal intake with reasoned outstanding evidence |
| Emergency.FollowUps | EmergencyCaseId→Cases, PerformedAt day, OutcomeEncrypted varbinary(max), EvidenceDocumentId?→System.Documents, NextAction txt(1000)? | Required short follow-up per approved policy |
| Volunteer.Profiles | UserId?→Auth.Users, ApplicantContactId→System.ContactSubjects, Status code, LocationId?→Reference.Locations, Availability txt(500), ConsentId→Beneficiary.Consents | Approved account linkage unique |
| Volunteer.Skills | ProfileId→Profiles, SkillCode code, Notes txt(300)? | U(ProfileId,SkillCode) |
| Volunteer.TrainingModules | Code code U, Title txt(200), DocumentId?→System.Documents, RequiredForRole code?, IsActive flag | versioned training content |
| Volunteer.TrainingCompletions | ProfileId→Profiles, ModuleId→TrainingModules, CompletedAtUtc utc, VerifiedById?→Auth.Users, EvidenceDocumentId?→System.Documents | U(ProfileId,ModuleId,CompletedAtUtc) |
| Volunteer.ActivityLogs | ProfileId→Profiles, AssignmentId?→Workflow.CaseAssignments, ActivityAtUtc utc, Type code, Minutes int, NotesRedacted txt(1000), SupersedesId?→ActivityLogs | >=0 minutes; submitted log append-only |

## System operations and privacy

| Table | Specific columns | Keys/rules |
|---|---|---|
| System.Documents | ObjectKey txt(500) U, Classification code, OriginalNameEncrypted varbinary(max), MimeType txt(100), ByteLength bigint, Sha256 hash, ScanStatus code, KeyVersion int, UploadedById?→Auth.Users, ExpiresAtUtc utc?, DeletedAtUtc utc? | >0 bytes; only explicit public derivatives public; no executable files |
| System.DocumentAccessGrants | DocumentId→Documents, UserId→Auth.Users, Purpose code, ExpiresAtUtc utc, RevokedAtUtc utc? | Additional explicit temporary grants; does not bypass case policy |
| System.ContactSubjects | NameEncrypted varbinary(max)?, EmailEncrypted varbinary(max)?, PhoneEncrypted varbinary(max)?, Language varchar(10) | Minimal public form subject; not login identity |
| System.Inquiries | ContactSubjectId→ContactSubjects, Type code, MessageEncrypted varbinary(max), Status code, AssignedToId?→Auth.Users, ResolvedAtUtc utc? | Contact queue |
| System.NewsletterSubscriptions | ContactSubjectId→ContactSubjects, EmailFingerprint hash U, Status code, ConsentId→Beneficiary.Consents, ConfirmTokenHash hash?, TokenExpiresAtUtc utc?, UnsubscribedAtUtc utc? | Double opt-in P |
| System.Grievances | ReferenceHash hash U, ContactSubjectId?→ContactSubjects, UserId?→Auth.Users, ApplicationId?→Beneficiary.Applications, Type code, DetailsEncrypted varbinary(max), Status code, AssignedToId?→Auth.Users, DueAtUtc utc?, ResolutionEncrypted varbinary(max)? | Includes beneficiary complaint/privacy escalation; conflict routing |
| System.PrivacyRequests | ApplicantId?→Beneficiary.Applicants, UserId?→Auth.Users, Type code, RequestedAtUtc utc, IdentityVerifiedAtUtc utc?, Status code, DecisionReason txt(1000)?, CompletedAtUtc utc? | At least one verified subject; contact intake may await identity verification |
| System.RetentionHolds | ResourceType code, ResourceId id, Reason txt(1000), AuthorityDocumentId?→Documents, StartsAtUtc utc, EndsAtUtc utc? | Checked before destruction |
| System.AuditLogs | ActorUserId?→Auth.Users, ActorType code, Action varchar(100), ResourceType code, ResourceId id?, CorrelationId id, OccurredAtUtc utc, BeforeRedactedJson json?, AfterRedactedJson json?, Reason txt(1000)?, IntegrityHash hash | Append-only; external checkpoints |
| System.Notifications | UserId?→Auth.Users, ContactSubjectId?→ContactSubjects, TemplateId→NotificationTemplates, Channel code, Status code, ProviderReference txt(150)?, ReadAtUtc utc?, SentAtUtc utc? | At least one recipient; minimal payload reference |
| System.NotificationTemplates | Code code, Language varchar(10), Channel code, Subject txt(200)?, BodySanitized text, Version int, Status code | U(Code,Language,Channel,Version) |
| System.Settings | Key varchar(150) U, ValueJson json, Classification code, ApprovalId?→Workflow.ActionApprovals | No raw secrets; secret-provider references only |
| System.WebhookInbox | Provider code, ExternalEventId txt(150), BodyDigest hash, EncryptedPayloadObjectId?→Documents, SignatureVerified flag, ReceivedAtUtc utc | U(Provider,ExternalEventId); immutable receipt; invalid rejected without effects |
| System.InboxProcessing | InboxId→WebhookInbox U, Status code, Attempts int, LeaseUntilUtc utc?, NextAttemptUtc utc?, ErrorCode code?, ProcessedAtUtc utc? | Lease concurrency, redacted errors |
| System.OutboxMessages | Type code, AggregateId id, PayloadEncrypted varbinary(max), CreatedAtUtc utc, DedupeKey txt(180) U | Immutable content |
| System.OutboxProcessing | OutboxId→OutboxMessages U, Status code, Attempts int, LeaseUntilUtc utc?, NextAttemptUtc utc?, DeliveredAtUtc utc?, ErrorCode code? | Retry/dead-letter |
| System.IdempotencyRecords | ActorScopeHash hash, Route code, Key txt(100), RequestDigest hash, ResourceId id?, ResponseStatus int?, ResponseEncrypted varbinary(max)?, ExpiresAtUtc utc, Status code | U(ActorScopeHash,Route,Key); mismatched body conflicts |
| System.ReportSnapshots | Type code, AsOfUtc utc, PeriodStart day, PeriodEnd day, CalculationVersion txt(30), ScopeJson json, ResultsJson json, ApprovalId?→Workflow.ActionApprovals | immutable, public-safe only when marked/published |
| System.OperationChecks | CheckType code, PeriodStart day?, EvidenceDocumentId?→Documents, Status code, OwnerUserId→Auth.Users, CompletedAtUtc utc?, NotesRedacted txt(1000)? | SOP/drill/launch/weekly/monthly checks |

## Enumerations and constraints

Reference.StatusCodes contains application: Draft, Submitted, DocumentReview, MoreInfoRequired, VerificationAssigned, FieldVerified, ShariahReview, CommitteeReview, Approved, Rejected, Deferred, Funding, DisbursementApproved, Delivered, FollowUp, Closed. Store “Cancelled” only as a separately approved P extension, not silently replacing blueprint states. Cause: Draft, InReview, Published, Paused, Completed, Archived. Donation uses all eight blueprint statuses; ReconciledAtUtc preserves reconciliation when a refund changes the display status. Disbursement: Draft, Submitted, Approved, Executing, PendingConfirmation, Paid, Failed, Cancelled. Workflow state transitions are command-controlled, not unrestricted status updates.

Codes have CHECK constraints or composite FK(area,code) through explicit status metadata; migration must choose one convention consistently. Money cannot be negative except signed report projections; ledger lines are nonnegative and single-sided. Currency/fund/approved eligibility are checked across related records. No cascading deletes on money, policy or evidence.

Additional controlled status vocabularies: CMS content Draft/InReview/Published/Unpublished/Archived; policy Draft/UnderReview/Approved/Retired; verification Draft/Submitted/Superseded; eligibility Pending/Eligible/Ineligible/MoreInfoRequired/Superseded; meeting Draft/Scheduled/InProgress/Concluded/Cancelled; vote Approve/Reject/Defer/Recuse; information request Open/Answered/Closed; appeal Submitted/Assigned/InReview/Resolved; allocation/commitment Active/PartiallyConsumed/Consumed/Released; manual transfer Pending/Verified/Rejected/Reconciled; refund Requested/Approved/Executing/PendingConfirmation/Completed/Rejected/Failed; chargeback Open/UnderReview/Won/Lost/Closed; reconciliation Draft/Imported/InReview/Completed; payee Pending/Verified/Rejected/Suspended; scan Pending/Clean/Rejected/Error; volunteer Applied/UnderReview/Onboarding/Active/Suspended/Inactive; inquiry/grievance/privacy Open/Assigned/InReview/AwaitingSubject/Resolved/Closed; inbox/outbox Pending/Leased/RetryDue/Completed/DeadLetter. Subject-specific outcome fields remain distinct from general processing Status. Program, reason, check, payee method, fund restriction and policy codes are versioned approved reference data, not unrestricted free text. All technical enums are part of the proposed baseline; business thresholds/allowed methods cannot be seeded as approved without the decision evidence.

Filtered unique indexes cover nullable external IDs and current active associations. All FK columns indexed; composite queue indexes on status/due/program/assignee and financial fund/date/source. Private text is not indexed into public full-text search. Public cause/post search uses only sanitized translations. Unique receipt/journal/case IDs use non-reusing database sequences mapped to display numbers, not MAX+1.

## Cross-row invariants and transaction strategy

SQL CHECK cannot enforce sum-of-lines balance or multi-row spending ceilings. Post journals through a controlled SQL posting routine (future implementation) with no direct runtime INSERT/UPDATE/DELETE to posted tables; validate header/items, per-fund debit=credit, allowed accounts/source and unique EffectKey, insert all lines/header + audit/outbox atomically. Deny posted-row mutation at DB permission/trigger level; reversals are new balanced journals. No draft/partial journal can enter reports.

Reserve/approve/execute/refund locks acquire fund, donation-restriction, decision-limit and commitment/application resource locks in a stable order under a serializable transaction or equivalent update/hold locks. Read committed snapshot alone is insufficient. Recheck current eligibility, remaining restricted amount, decision ceiling, total case releases, usable liquidity and existing in-flight releases inside that transaction. Commit reserved/consumed counters and movements together; external payment happens afterward with unique execution key. A failed/uncertain external call never frees money until confirmed safe.

One gateway order may contain multiple donation items solely to represent distinct fund/optional support intents; each donation remains exactly one fund and optional cause. Order sums match captured amounts before individual items reconcile. Provider payment identity is globally unique per provider in normalized processing; repeated event types cannot duplicate effects. Splits of fees/refunds/reconciliation are exact to two decimals using deterministic remainder allocation. Every commitment, including a pool, has explicit CommitmentSources tied to donation allocations so source restrictions and donation-to-delivery reporting remain enforceable. Holds reserve only amounts not already unavailable through commitments; report the non-overlapping held amount.

Receipt uniqueness includes one original receipt per DonationId (filtered unique index where SupersedesReceiptId is NULL), unique receipt numbers, and at most one active terminal replacement in a version chain enforced by the issue/void transaction. Refund, chargeback and disbursement provider references are unique within provider/account scope; never infer a globally unique provider identifier without that scope. Fund type and policy version cannot be changed retrospectively for posted donations; new policy versions apply prospectively with explicit re-review of affected active commitments.

Cause/donation compatibility uses (CauseId,FundId) FK into Cause.CauseFunds when CauseId nonnull; also recheck live eligibility/policy before accepting an order. CauseDonations is a rebuildable association, never a second amount source. Application approval/meeting/fund-limit links cannot reference another case. Submitted snapshots freeze review facts; edits create revisions and invalidate affected downstream approvals.

## Reporting and retention

Views/projections: PublicCauseProgress, PublicImpact, OwnDonations, FundBalances, RestrictedAvailable, UnmatchedBankLines, PendingApprovals, ProgramOutcomes and AuditExceptions. Build only from authorized sources; materialized caches are rebuildable and nonauthoritative. Monthly finance register ties opening + inflows - outflows = closing and available = closing - open commitments, with bank/clearing differences explained.

Retain finance/approval evidence under approved statutory and policy schedules (D14); do not invent retention periods. Separate private deletion jobs, legal holds, object deletion evidence and backup-expiry handling. Public report snapshots suppress identifying small cohorts and omit donor/applicant links. Restore exercises verify referential integrity, balanced journals, receipt uniqueness, object availability and outbox replay safety.

