# UI and UX recommendations for Young Helpers Foundation

Prepared 22 October 2026. This document proposes YHF design decisions based on [the blueprint](Young_Helpers_Foundation_Complete_Website_Blueprint.docx) and [public REA observations](reference-analysis.md). Recommendations are not observed IndiaZakat behavior or approved Foundation policy. No application code or design assets were created.

## Recommended direction

Build an original, calm teal/emerald and warm off-white identity as proposed in blueprint §5. Make helping, applying and understanding fund use easy before adding decorative content. Preserve the reference's useful cause progress, clear donation entry and process explanations, while designing for a small volunteer team and private beneficiary evidence.

## Prioritized recommendations

| Priority | Recommendation | Evidence or blueprint basis | Reviewable acceptance criterion |
|---|---|---|---|
| P0 | Separate Donate and Apply for Help as primary actions | Reference has long homepage; blueprint §5 requires both audiences | Both actions visible at 390 px near the start, with explicit destination and no ambiguous Raise terminology |
| P0 | Make optional support opt-in and totals explicit | Reference donate/total: INR 100 support prefilled, editable to zero | Cause/fund amount, optional support and total displayed together before checkout; support can be declined without friction |
| P0 | Explain fund eligibility before taking donor details | Reference exposes broad type choices; blueprint §6/§10 restrict funds | Ineligible combinations unavailable with plain explanation; approved fund choice survives navigation/retry |
| P0 | Protect beneficiary identity by design | Reference public narratives/attachments; blueprint §7 private KYC | Public preview contains only approved consented fields; documents require authorized private access |
| P0 | Distinguish payment pending from confirmed | Reference success branch only observed in source; blueprint §6/§10 | UI reflects server-confirmed status and reconciled receipt rules; timeout/retry does not imply failure or create duplicate posting |
| P0 | Provide accessible form errors and preserve input | Reference empty/malformed forms show inline errors; label inconsistencies observed | Correct label associations, error summary, focus on first invalid field, linked descriptions, retained values, server validation |
| P1 | Use compact mobile filters above results | Reference mobilelisting has a long category block before search/results | Search plus Filters control visible early; selected chips/count, clear-all and accessible drawer; results not buried under category catalog |
| P1 | Standardize cause cards and detail summaries | Reference cards/detail show goal/progress/type/time | Same fund/status vocabulary and amounts on card/detail/donate; readable remaining amount and as-of date |
| P1 | Use accessible navigation and tab state | Reference conflicting aria-selected and icon names | One selected tab, unique IDs, meaningful button names; drawer supports keyboard, focus return and Escape |
| P1 | Make application progress and assisted entry clear | Blueprint §7 drafts and six-step wizard | Applicants know current step, saved state, required evidence, next action and help route |
| P1 | Publish impact definitions and dates | Reference counters observable but unaudited; blueprint §15 | Distinguish collections, disbursements and outcomes; date and definition accompany aggregate reports |
| P2 | Add curated updates before comments/carousels | Reference comments and many testimonial entries; small YHF team | Assigned editor can publish consented progress updates; moderation workload has a named owner before public comments launch |

P0 means resolve before enabling the affected production journey; P1 means core launch UX; P2 means optional after operational readiness. These priorities supplement, not replace, blueprint §16 phases and release gates.

## Suggested public information hierarchy

Primary navigation: Programs, Explore Causes, Impact, About, Help/Contact; visible Donate and Apply for Help actions. Show language choice and account access without overwhelming the mobile header. Footer: verified organization details, contact/grievance route, privacy, terms, donation/refund policy and approved fund/Shariah information.

Homepage order: short mission and two primary actions; Rozgaar/Medical/Emergency explanation; a small set of verified causes; simple apply/verify/support/deliver process; reconciled impact with dates; recent consented outcomes; volunteer invitation. Use original licensed/consented media and editable text rather than embedding essential campaign information in images.

This is a proposed hierarchy. IndiaZakat's broad reference menu and category catalog do not set YHF's launch scope.

## Cause discovery and detail

Use program, city, approved fund eligibility and status filters; keep sorting separate from status. Preserve combinations in the URL so sharing/back navigation restores the same list. Define a stable default order and paginated results, with loading, retry, empty and end states. Do not infer “no results” from response byte length. Avoid location inference as a prerequisite; allow explicit city selection and all locations.

Cards should show an anonymized title, short purpose, program/location at safe granularity, verification state/date, goal/raised/remaining, meaningful status and Donate/View Details actions. Use Indian currency grouping consistently. Define whether raised means reconciled or another approved measure and label it accurately.

Detail should place the funding summary, eligibility explanation and primary action near the story. Show milestones and consented updates, a report/help route and what happens after funding. Keep documents private unless a specific redacted publication is authorized. Share canonical URLs and original summaries; do not put private medical or household details in social previews.

A mobile sticky Donate control can help, as observed in mobiledetail. Reserve space so it never hides content, errors or keyboard focus; account for safe areas and the on-screen keyboard.

## Donation flow

Proposed sequence: choose cause or pooled fund → compatible fund and amount → minimum necessary donor details and consent → itemized review → payment gateway → pending/confirmed result and receipt/history link.

Keep the cause identity visible during the flow. Explain optional operating support and its fund treatment separately from cause restrictions. Avoid automatic tax-benefit promises; use approved disclosures and collect tax fields conditionally. Explain that public anonymity does not necessarily remove finance/receipt identity requirements.

Use unambiguous button labels: Continue, Review Donation and Proceed to Payment. Disable repeated submission while an order is being created and show a recoverable pending state when status is uncertain. The backend remains authoritative for amounts, eligible funds, order state and receipts. A return URL or frontend success callback alone must not be presented as proof of completed accounting.

The above payment controls are blueprint requirements/recommendations; IndiaZakat's backend was not inspected. Validate all success, failed, cancelled, timeout, duplicate event, refund and manual-transfer states in the authorized YHF sandbox before production.

## Forms and applicant experience

Use persistent labels, concise examples, required/optional markers and input modes suitable for email, phone and money. Accept pasted values and validate canonical values; keypress restrictions alone are insufficient. Give precise errors matching field names, and do not reveal account existence unnecessarily.

Apply for Help should explain eligibility, evidence needs, expected review steps and assistance channels before asking for sensitive information. Divide the blueprint's six steps into manageable screens, with save-and-return, upload status, reasoned requests for more information and a clear submission acknowledgment. Public cause publication must require its own consent and approval.

Volunteer intake should capture skills, location, availability, consent and preferred tasks with an acknowledgment and realistic next step. Keep contact, newsletter and grievance purposes separate; marketing consent should be optional. Use accessible spam controls and rate limiting without relying solely on an image CAPTCHA. These are proposed YHF form requirements; external reference form validation was not studied.

## Responsive and accessibility acceptance plan

Test 320, 390, 768, 1024 and 1440 px, landscape, 200% zoom, keyboard-only use, reduced motion and representative physical Android/iOS devices. The reference inspection covered only narrow desktop Chromium and cannot certify these.

Check:
- No unintended horizontal scrolling; long Hindi/English text wraps; language changes preserve task state.
- At least 44 × 44 CSS px primary touch targets as a design target; adequate spacing and visible focus.
- Drawer/submenus announce state, trap focus appropriately when modal and return focus on close.
- Tabs have unique IDs, a single selected state and correct keyboard behavior.
- Errors are linked to fields and announced; status/progress has text equivalents; color carries no unique meaning.
- Sticky actions do not cover content, focused controls or validation messages.
- Images have appropriate alternatives and no sensitive information hidden only visually.
- Fund/amount and primary actions remain understandable at mobile width and zoom.

Use WCAG 2.2 AA as the blueprint's verification target; the list above is an acceptance plan, not a conformance claim.

## Frontend architecture implications

Implement reusable YHF components for navigation, cause cards, filters, funding summaries, status badges, money inputs, consent, uploads and error summaries. Follow the blueprint's proposed typed Angular forms, i18n and route structure once technology choices are confirmed. Keep public DTOs separate from private operational data.

Prefer structured paginated API results and explicit empty/error states to parsing returned HTML size. Load only needed animation/UI code; avoid duplicate dependency tags and global plugin initialization on pages without matching elements. Use route metadata and original Open Graph content for shareable public causes. Measure real page performance before setting budgets or claiming improvements.

The reference's jQuery/Bootstrap and MVC-style behavior is useful evidence about how its public interface works; it does not require YHF to reproduce that implementation. Avoid nonessential tracking on sensitive applicant/payment journeys until purpose, consent and retention are defined.

## Decisions and follow-up before implementation

Foundation/program owners should approve program language, eligibility explanation, public narrative fields, media consent and publication rules. Finance and qualified policy reviewers should settle fund compatibility, optional support, minimum amounts, donor-source restrictions, receipt/tax wording and shortfall/excess treatment. Technical/design owners should approve navigation, mobile filter behavior, validation messages and test criteria.

Resolve the reference's unsettled search/mobile-loading questions if those behaviors remain important to design review. They are not blockers to specifying better YHF behavior. Do not infer private operational parity from reference pages. Coding remains outside this task.

