# REST API contracts

Proposed contract for approval; no controllers or executable OpenAPI generated. Base /api; JSON camelCase. Blueprint §12 representative paths preserved. Group labels API-A through API-L are traceability anchors. Authorization names resolve in architecture-and-security.md; database entities resolve in database-schema.md.

## Common contract

IDs are opaque UUID strings, dates ISO 8601 UTC, date-only YYYY-MM-DD, money fixed two-decimal strings with currency INR. No floating-point client amount is authoritative. Request strings are trimmed/length-bounded and localized content sanitized; enum values are documented codes. Private fields are accepted only by an allowlisted DTO. “Summary” responses never include credentials, document object keys, full IDs or internal notes.

GET collections accept page>=1, pageSize 1–100 (default 20), whitelisted sort, direction and documented filters; return {items,total,page,pageSize,asOfUtc}. Public cause default sort publishedAt desc,id; public cursor alternative can be added only as a reviewed version. Empty returns 200 with items=[]; filters combine with AND, search within sanitized title/summary/location. GET details return resource + version ETag; private responses Cache-Control:no-store, public responses allow ETag revalidation of published projection.

POST creates 201 + Location + {id,status,version}; transition commands return 200 with updated summary; worker-dependent acceptance returns 202 {operationId,status,pollUrl}. PUT is full replacement of the named editable resource, not arbitrary entity mutation. Upload initiation is 201, completion 202 until scan. DELETE only withdraws a permitted draft/link; never deletes financial or submitted evidence history.

If-Match required for PUT/transition commands on mutable state (428 if missing, 412 if stale). Idempotency-Key required for creation/submission/payment/manual transfer/release/refund/posting/approval commands; same actor+route+key/body returns original result, different body 409. Keys are proposed valid for at least 24h; permanent provider/effect IDs prevent repeats after key expiry. Approval bodies bind current subject version/hash.

Errors use application/problem+json: {type,title,status,code,detail,traceId,errors:{field:[message]}}. Codes include validation_failed (422), unauthenticated (401), forbidden (403), not_found (404), transition_not_allowed (409), insufficient_available (409), restriction_conflict (409), approval_required (409), approval_stale (409), idempotency_conflict (409), concurrency_conflict (412), payload_too_large (413), unsupported_media (415), rate_limited (429 with Retry-After), dependency_unavailable (503). Malformed JSON 400. Do not include sensitive field values. Private unauthorized identity lookup is 404; known forbidden action 403. Domain failures never partially commit a ledger/state update.

Cookie-authenticated unsafe calls need anti-forgery header; anonymous forms use origin checks, abuse limits and purpose-bound short-lived form token. Webhook is CSRF-exempt and provider-signature authenticated, never user-cookie authorized. File and report downloads reauthorize at request time. Signed one-use claim links do not bypass subject verification.

## Payload dictionary

Shared writable inputs below enumerate approved fields. Suffix ? means optional. IDs/string lengths/types follow the named database fields; all amounts string decimal(18,2), max positive configured limit D07. Client cannot write CreatedBy/approved totals/posted flags/role IDs through profile DTOs.

| Shape | Request fields | Response additions |
|---|---|---|
| Credentials | identifier:string<=254,password:string | requiresMfa,challengeId?; session cookie only after full authentication |
| Registration | name<=200,email?<=254,phone?<=20,password,language(en/hi),intent(donor/applicant),termsVersion,consent | verificationRequired; generic existing-account response |
| Profile | name,contactEmail?,phone?,language,notificationPreferences | verified flags; no role grants |
| DonationIntent | fundId,causeId?,amount,currency,donorContact{name,email?,phone?,countryCode,address?},anonymous,policyVersion,processingConsent,supportIntent?{fundId,amount,consent} | session capability separate, eligible types and server total |
| Order | donationIntentIds:UUID[],method(online),returnPath | orderId,total,currency,expiresAt,providerPublicCheckoutParameters; no private key |
| ManualTransfer | donationIntentId,transferDate,reference,proofDocumentId? | pendingVerification and reference |
| DraftApplication | applicant{name,contact,locationId,guardianAuthority?},household{reference?,members[]},finances{income?,assets?,liabilities?,basis,items[]},programId,requestedAmount,currency,need,urgency,programDetails,assistedSource? | caseNumber,status,completion,version; draft allows incomplete fields |
| SubmitApplication | snapshotVersion,declaration,processingConsent{policyVersion,method,witness?},publicationConsent? | submitted revision,submittedAt,nextStep |
| UploadInit | ownerType,ownerId,category,fileName,mimeType,byteLength | documentId,shortLivedUploadUrl,allowedHeaders,expiresAt; private/quarantined |
| UploadComplete | documentId,digest | scanStatus; server verifies actual size/signature/storage digest |
| InformationRequest | fields:string[],reason,dueAt? | requestId,status |
| Verification | assignmentId,method,visitAt?,checks[{code,outcome,evidenceDocumentId?,reason?}],recommendation,notes,policyVersion | submittedAt,readiness; no final approval |
| Eligibility | fundId,policyVersion,criterionResults[],eligibleAmount,payeeMethod,tamlikEvidenceId?,expiresAt?,outcome,reason | reviewer,reviewId; server policy gate |
| Decision | meetingCaseId,policyVersion,outcome,approvedAmount,fundLimits[{fundId,eligibilityReviewId,amount}],reasonCode,applicantReason,internalReason?,conditions? | recorded quorum/conflicts/authority,decisionId |
| Publication | causeVersion,consentIds,reviewChecklist{consent,redaction,verification,policy},publicRevision | publisher,time; server recomputes eligibility |
| Allocation | donationId,applicationId,fundId,amount,restrictionChangeId? | remainingRestricted,allocationId |
| Commitment | allocationId?,applicationId,fundId,decisionFundLimitId,amount | reservationId,availableAfter |
| ReleaseRequest | applicationId,fundId,commitmentId,decisionId,payeeId,payeeVersion,amount,purpose,evidenceIds[] | requestId,approvalState |
| ActionApproval | subjectVersion,payloadHash,outcome,reason,policyVersion | approver,approvedAt,expiresAt |
| RefundRequest | donationId,amount,reason | status,remainingRefundable; no immediate gateway refund |
| JournalProposal | effectiveDate,currency,reason,sourceType,sourceId,lines[{accountId,fundId,donationId?,applicationId?,causeId?,debit,credit,cashFlowClass}] | balanceValidation,proposalId,approvalState |
| ReconciliationImport | bankAccountId,periodStart,periodEnd,statementDocumentId,format | operationId,duplicates,totals,validationIssues |
| ReconciliationMatch | bankLineId,targetType,targetId,amount | remainingBankAmount,remainingTargetAmount |
| PublicCause | none/read-only | slug,title,summary,publicLocation,program,eligibleFunds,goal,raised,remaining,status,verificationDate,updates,publicMedia,asOfUtc; no internal application ID |
| CauseDraft | applicationId,slug,translations[{language,title,summary,story,publicLocation,seo}],goal,endDate?,fundReviewIds[],mediaIds[] | moderation status,version |
| PageRevision | slug,language,title,sections[{type,sortOrder,content}],seo | revision/status; validated block schemas |
| PublicForm | type,contact{name?,email?,phone?,language},message?,skills?,availability?,locationId?,consent,formToken | opaque acknowledgment, no identity echo |
| Livelihood | skill,demand,plan,baselineIncome?,equipment[],quotes[],training[],opportunities[] | approved budget read-only, milestones |
| Handover | disbursementId,date,ownershipEvidenceId,deliveryEvidenceId,acknowledgmentId,methodPolicyId | followup schedule |
| FollowUp | scheduledDay?,performedAt,equipmentInUse?,businessActive?,income?,incomeBand?,evidenceClass,obstacles?,nextAction?,evidenceId? | actor,verification class and next due |
| Medical | category,hospital,doctor?,urgency,schemeExploration,discount?,estimates[{amount,covered,eligibleBalance,documentId,validUntil?}],stage | eligible/approved/released totals server-calculated |
| Emergency | crisisType,crisisDate,supportType,proofId?,expeditionReason,outstandingEvidence[],followupDue? | checklist readiness and priority |
| Volunteer | contact,skills[],locationId?,availability,consent | onboarding/training/status, no permission grant |

## API-A identity and accounts

| Method/path | Auth | Input → output |
|---|---|---|
| GET /auth/csrf | public | → anti-forgery token, no-store |
| POST /auth/register | public/rate limit | Registration → 202 verification acknowledgment |
| POST /auth/verify; POST /auth/resend-verification | public token | token/code or identifier → generic result |
| POST /auth/login | public/rate limit | Credentials → session/MFA challenge |
| POST /auth/mfa/challenge | challenge token | challengeId,code → session |
| POST /auth/password/forgot; POST /auth/password/reset | public/token | identifier or token,newPassword → generic 202/200 |
| POST /auth/refresh; POST /auth/logout | session+CSRF | renew tracked session / revoke, no raw refresh token |
| GET /auth/me | authenticated | → profile, permissions, scoped navigation, MFA state |
| GET /account/sessions; DELETE /account/sessions/{id} | own | → list / revoke |
| POST /account/password | own+reauth | currentPassword,newPassword → changed+other sessions revoked |
| POST /account/mfa/enroll; POST /account/mfa/confirm; POST /account/mfa/recovery-codes | own+reauth | enroll/challenge → protected enrollment or one-time codes |
| GET /account/profile; PUT /account/profile | own | Profile; changed contact requires verification |
| GET /notifications; POST /notifications/{id}/read | own | → own list/read |

## API-B public CMS, discovery and forms

| Method/path | Input / output and gate |
|---|---|
| GET /public/pages/{slug}?language=en | Published page sections/SEO only |
| GET /public/menus/{code}; GET /public/banners | locale and current time → published menu/banner |
| GET /public/programs; GET /public/programs/{code} | Approved descriptions/intake availability |
| GET /public/causes; GET /public/causes/{slug} | q,cityId,program,fund,status,sort,page/pageSize → PublicCause summaries/detail |
| GET /public/causes/{slug}/updates | Only published masked updates |
| GET /public/posts; GET /public/posts/{slug} | type/story/news/event/testimonial, language, page; sanitized content |
| GET /public/galleries; GET /public/galleries/{slug} | Published media derivatives only |
| GET /public/faqs | topic,q,language → approved FAQs |
| GET /public/policies/{code} | approved effective version + disclosures; no draft policies |
| GET /public/impact; GET /public/reports | period/program → suppressed aggregate/signed approved report |
| GET /public/locations | parentId,kind,q → reference names, no applicant location lookup |
| GET /public/forms/config | form type → allowed fields, version/form token, enabled state |
| POST /public/contact; POST /public/volunteers; POST /public/grievances | PublicForm → 202 acknowledgment; abuse limits |
| POST /public/newsletter; POST /public/newsletter/confirm; POST /public/newsletter/unsubscribe | contact/consent or opaque one-use token → generic result |

No anonymous GET that reveals whether someone donated/applied/subscribed. Grievance tracking uses a secret capability with rate limits or authenticated subject, never reference-number enumeration.

## API-C donation and donor contracts

| Method/path | Auth and shape |
|---|---|
| GET /donations/options?causeSlug= | public → approved funds/minimum/allowed methods/disclosure; no implied compliance |
| POST /donations/intents | donor or approved guest session; DonationIntent → validated intent(s), itemized total |
| POST /donations/orders | session owner; Order → 201 provider order, or 202 uncertain creation |
| GET /donations/{id}/status | owner/session capability → normalized status/reconciledAt/receipt availability |
| POST /donations/manual-transfers | owner/session; ManualTransfer → 202 pending |
| POST /payments/webhook | provider signature/raw bounded bytes → verified persisted 202; invalid signature 400/401; no effect |
| POST /donations/guest-claims | authenticated verified user + one-use claim token → ownership association, audited |
| GET /donors/me/donations; GET /donors/me/donations/{id} | own summary/detail |
| GET /donors/me/receipts; GET /donors/me/receipts/{id}/download | own ledger-backed receipt |
| PUT /donors/me/preferences | own language/notifications/public anonymity defaults; no payment relabel |
| GET /donors/me/impact | own cause-supported public-safe milestones |
| POST /donors/me/refunds; GET /donors/me/refunds/{id} | own RefundRequest → requested/status; policy gate |

No browser endpoint may mark a donation Captured/Reconciled or issue a tax certificate.

## API-D intake, files and privacy

| Method/path | Auth | Shape |
|---|---|---|
| POST /applications | applicant or assigned assisted intake | DraftApplication → draft case |
| GET /applications; GET /applications/{id} | own/delegate/scoped staff | own/scoped paged list/private DTO |
| PUT /applications/{id}/draft | own/assisted, editable state | DraftApplication → version/completion |
| POST /applications/{id}/submit | own/assisted | SubmitApplication → Submitted |
| GET /applications/{id}/status-history | own/scoped | applicant-safe timeline or staff projection |
| GET /applications/{id}/information-requests | own/scoped | requests |
| POST /applications/{id}/information-responses | own/assisted | requestId,response,evidenceIds,revision → resubmission |
| POST /applications/{id}/appeals; GET /applications/{id}/appeals | own | originalDecisionId,reason,evidenceIds → appeal |
| POST /documents/uploads; POST /documents/{id}/complete | owner/scoped | UploadInit/UploadComplete |
| GET /documents/{id}/status; GET /documents/{id}/download | owner/scoped, scan clean | no object key; short-lived download or stream |
| DELETE /applications/{id}/draft-documents/{linkId} | owner editable draft | withdraw link; object retention reviewed |
| POST /privacy/requests; GET /privacy/requests/{id} | verified own | type,resource,reason → status |
| POST /consents/{id}/withdraw | own verified subject | reason,purpose → withdrawal workflow; no automatic financial deletion |

## API-E case operations and governance

| Method/path | Permission | Input/result |
|---|---|---|
| GET /cases; GET /cases/{id} | scoped case.read | filters → private summary/detail |
| POST /cases/{id}/assign; POST /cases/{id}/assignments/{aid}/end | case.assign | userId,type,starts/ends,due,reason → assignment |
| POST /cases/{id}/information-requests | case.manage | InformationRequest |
| POST /cases/{id}/document-review | case.manage | checks,reason,outcome → readiness |
| POST /cases/{id}/verify; GET /cases/{id}/verifications | assigned verifier | Verification / history |
| POST /cases/{id}/eligibility; GET /cases/{id}/eligibility | designated reviewer | Eligibility / history |
| GET /cases/{id}/readiness | scoped staff | server-computed unmet conditions |
| GET /duplicates; GET /duplicates/{id}; POST /duplicates/{id}/decide | duplicate.review | outcome,survivorId?,reason,approval → manual result |
| POST /committee/meetings; PUT /committee/meetings/{id}; GET /committee/meetings | committee.manage/read | dates,members,policy,agenda → meeting |
| POST /committee/meetings/{id}/attendance | committee.manage | present member IDs → quorum candidate count |
| POST /committee/meeting-cases/{id}/conflicts | member own | declaration,reason → recusal |
| POST /committee/meeting-cases/{id}/votes | eligible member | vote,amount?,conditions,reason → immutable vote |
| POST /cases/{id}/decisions | authorized committee recorder | Decision → independently validated outcome |
| POST /appeals/{id}/assign; POST /appeals/{id}/resolve | appeal.review | reviewer or newDecisionId,reason → linked resolution |
| POST /cases/{id}/funding; POST /cases/{id}/delivery; POST /cases/{id}/followup; POST /cases/{id}/close | scoped case.manage | evidence/conditions/decision IDs → guarded transition, never raw status patch |
| GET /policies; GET /policies/{id}; POST /policies; POST /policies/{id}/approve | policy.read/propose/designated approver | version/evidence → immutable effective policy |

Deferred/rejected are Decision outcomes. MoreInfoRequired/resubmit and appeals use named commands above; no unrestricted status API.

## API-F causes and publication

| Method/path | Permission | Contract |
|---|---|---|
| GET /admin/causes; GET /admin/causes/{id}; POST /admin/causes; PUT /admin/causes/{id} | cause.prepare | CauseDraft; case must eligible/approved for preparation rules |
| POST /cases/{id}/publish | cause.publish | Publication + causeId; current approved case, consent and reviewed public projection |
| POST /admin/causes/{id}/pause; POST /admin/causes/{id}/complete; POST /admin/causes/{id}/archive | cause.publish | reason; no reallocation side effect |
| GET /admin/causes/{id}/preview | cause.prepare/publish | noindexed private preview |
| GET/POST /admin/causes/{id}/updates; PUT /admin/cause-updates/{id}; POST .../{id}/publish | cause.update/publish | milestone,translations,consents,media IDs; moderation required |

## API-G finance and disbursement

| Method/path | Permission | Contract |
|---|---|---|
| GET /finance/funds; GET /finance/funds/{id}/balances | finance.read | asOf → posted/clearing/committed/available/restricted |
| POST /finance/funds; PUT /finance/funds/{id} | fund.configure + policy approval | code/type/policy/restrictions; cannot relabel posted money |
| GET /finance/donations; GET /finance/donations/{id} | finance.read | masked private finance detail/event evidence |
| POST /finance/manual-transfers/{id}/verify; POST .../{id}/reject | finance.reconcile | bankLineId or reason → verified/rejected; no screenshot-only confirmation |
| POST /finance/reconciliations/imports; GET /finance/reconciliations/{id} | finance.reconcile | ReconciliationImport/result |
| POST /finance/reconciliations/{id}/matches; POST .../complete | finance.reconcile | ReconciliationMatch / reason,totals → reconciled items or conflict |
| GET /finance/settlements; POST /finance/settlements/imports | finance.reconcile | provider exportDocumentId → validated settlement records |
| GET/POST /finance/allocations; POST /finance/allocations/{id}/release | allocation.manage | Allocation/reason; restriction/cap enforcement |
| POST /finance/restriction-changes; POST .../{id}/approve | allocation.manage / independent approval | proposed terms,donorConsentId,policy → approved change, never silent fund mixing |
| POST /finance/commitments; POST /finance/commitments/{id}/release | allocation.manage | Commitment/reason |
| GET /finance/holds; POST /finance/holds; POST /finance/holds/{id}/release | finance.read/prepare/independent approve | fundId,donationId?,amount,reasonCode,source; release needs approval; do not double-count committed amounts |
| GET/POST /finance/payees; PUT /finance/payees/{id}; POST .../{id}/verify | payee.manage/verify | encrypted bank/person details,evidence → version/verified method |
| GET /disbursements/requests; POST /disbursements/requests | finance.read/prepare | ReleaseRequest |
| POST /disbursements/{id}/approve; POST .../{id}/reject | independent release.approve | ActionApproval |
| POST /disbursements/{id}/execute; GET /disbursements/{id} | finance.execute/read | approvalId → 202 operation then Paid/PendingConfirmation |
| POST /disbursements/{id}/confirm | finance.reconcile | bankLine/evidence + external status; never trust self-reported paid alone |
| GET /finance/journals; POST /finance/journal-proposals | finance.read/prepare | JournalProposal |
| POST /finance/journal-proposals/{id}/approve; POST .../{id}/post | independent approver / finance.post | ActionApproval / approved ID → balanced immutable journal |
| POST /finance/journals/{id}/reversal-requests | finance.prepare | reason,correcting proposal → approval path, no DELETE |
| GET /finance/refunds; POST /finance/refunds/{id}/approve; POST .../{id}/execute | finance.read/independent approve/execute | ActionApproval → gateway refund/reversal under cap |
| POST /finance/period-closes; POST /finance/period-closes/{id}/approve | finance.prepare/independent approve | period,fund,snapshot/reconciliation evidence |
| GET /reports/reconciliation; GET /reports/finance | finance.report | filters → as-of totals/mismatches; async export for large report |

## API-H programs

| Method/path | Permission | Contract |
|---|---|---|
| GET /livelihood/{caseId}; PUT /livelihood/{caseId} | assigned/scoped program | Livelihood; cannot set approved budget |
| POST /livelihood/{caseId}/quotes; POST .../training; POST .../opportunities | program.manage | documented quote/training/opportunity fields |
| POST /livelihood/{caseId}/handovers | program.manage | Handover → due follow-ups |
| GET /livelihood/followups; POST /livelihood/{caseId}/followups | assigned/scoped | FollowUp → evidence-classed outcome |
| GET /medical/{caseId}; PUT /medical/{caseId} | restricted program | Medical |
| POST /medical/{caseId}/updates; POST .../invoices; POST .../followups | restricted program | stage/notes/evidence; invoice amount/payee/doc/date; FollowUp |
| GET /emergency/{caseId}; PUT /emergency/{caseId}; POST .../followups | assigned/scoped program | Emergency / short FollowUp |
| POST /applications/{id}/acknowledgments | own/authorized assisted | deliveryId,receivedDate,evidence?,statement → acknowledgment only |

## API-I volunteer and operational administration

| Method/path | Permission | Contract |
|---|---|---|
| GET/PUT /volunteers/me; GET /volunteers/me/assignments | own volunteer | Volunteer profile / assignments |
| GET /volunteers/me/training; POST /volunteers/me/activities | own | evidence/completion request or activity fields |
| GET /admin/volunteers; GET /admin/volunteers/{id}; POST .../{id}/onboard; POST .../{id}/training/verify | volunteer.manage | status,reason,evidence; grants require identity admin separately |
| GET /admin/inquiries; POST /admin/inquiries/{id}/resolve | inquiry.manage | responseStatus,redactedNote |
| GET /admin/grievances; GET /admin/grievances/{id}; POST .../assign; POST .../resolve | grievance.manage | owner/deadline or reason/resolution |
| GET /admin/privacy-requests; POST .../{id}/review; POST .../{id}/execute | data.steward | identity verification,retention/hold decision,evidence |
| GET /admin/operations; POST /admin/operation-checks | operations.manage | SOP/drill/check evidence; no host commands |

## API-J CMS

GET collection/detail, POST create and PUT editable draft apply to /admin/pages, /admin/banners, /admin/menus, /admin/posts, /admin/galleries, /admin/media, /admin/faqs and /admin/programs. Inputs are exactly their dictionary editable fields/translations, never public-approved flags set by client. Permission cms.edit; published content changes create revisions.

GET/POST /admin/public-reports and GET/PUT /admin/public-reports/{id} accept period/type/language/title/documentId or snapshotId and create a draft only. GET/POST /admin/training-modules and GET/PUT /admin/training-modules/{id} accept code/title/documentId/requiredForRole/status with volunteer.manage; completion verification remains API-I. Program quotes, training, opportunities, handovers, invoices and follow-ups support GET collection/detail under their parent case for scoped review; submitted corrections create a superseding record with reason rather than rewriting evidence.

Blueprint path PUT /admin/pages/{id} accepts PageRevision. GET /admin/pages/{id}/revisions and /preview expose authorized revision history/noindex preview. POST /admin/{resource}/{id}/publish, /unpublish and /archive require cms.publish + current revision and publication review. Cause publication uses API-F instead. POST /admin/public-reports/{id}/publish requires reviewed privacy-safe snapshot and report.publish; policies require designated policy approvers.

Banners validate end>start; links are approved paths/HTTPS targets; blocks reject executable HTML. Media references require clean scan, lawful rights, current consent and approved derivative. Menu parents cannot cycle.

## API-K identity, policies, audit and jobs

GET/POST /admin/users/invitations; GET /admin/users/{id}; POST /admin/users/{id}/status; PUT /admin/users/{id}/roles; GET /admin/roles; GET /admin/permissions; PUT /admin/roles/{id}/permissions require identity/roles.manage with reason, expiry and reauthentication. Reject self-escalation and invalid separation-of-duties changes.

GET/PUT /admin/settings/{key} require settings.manage; secret references only, financial gates bind approved evidence. GET /admin/audit and /admin/audit/{id} require audit.read; no mutation. GET /admin/jobs; POST /admin/jobs/{id}/retry requires operations.manage and safely retryable job. GET/POST/PUT /admin/notification-templates and POST .../{id}/publish require notification.manage; GET /admin/notifications/delivery uses redacted metadata.

## API-L reporting and exports

GET /reports/impact; GET /reports/operations; GET /reports/rozgaar; GET /reports/medical; GET /reports/audit return the exact dashboard widgets from blueprint §15 with role/program/period filtering. Public impact uses /public/impact only. POST /reports/exports accepts reportType,filters,format(csv/pdf),purpose; returns 202 jobId. GET /reports/exports/{id}/download rechecks scope and expiry, logs read and export, neutralizes spreadsheet formula injection in CSV. No arbitrary SQL/report field selection.

## Contract acceptance

OpenAPI generation after approval must enumerate every route family expansion and typed shape, never expose persistence entities. Contract tests cover malformed/oversized input, no cross-user paging/count leakage, missing/stale If-Match, duplicate/mismatched idempotency keys, invalid/duplicate webhook, private file URLs, unsupported fund/cause, concurrency limits and sanitized public outputs. Schema/status/screen changes update traceability in the same change review.

