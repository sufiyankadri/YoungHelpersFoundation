# Responsive UI and UX design system

Proposed original YHF system for approval. Implements blueprint §5/9/13 and supplements ui-ux-recommendations.md. Token values are design proposals; final logo/fonts/media require rights and brand approval D01. No IndiaZakat branding, assets, wording or code is reused.

## Foundations

| Token/foundation | Proposed value/behavior |
|---|---|
| Brand primary / hover | User-logo-aligned navy #0B4779 / #082F56, white text; updated during approved implementation |
| Primary surface / canvas | #FFFFFF / warm #FAF9F6 |
| Primary text / secondary | Navy #103658 / slate #536579 |
| Accent | Logo-inspired green #31852D; magenta #BA1F69 and gold #DCA315 used sparingly for decorative elements, never as a compliance seal |
| Border / focus | #CBD5E1 neutral border; focus #1D4ED8 two-layer outline |
| Error / warning / information | #B91C1C / #92400E / #1D4ED8 on respective light surfaces, always with text/icon |
| Type | Licensed/system sans stack for English, approved Devanagari font such as Noto Sans Devanagari subject to license review |
| Body / caption | 16–18 px / minimum 14 px; line height 1.5–1.7; Devanagari generous line height |
| Headings | Mobile 32/28/24/20; desktop 48/36/28/22 px; no essential text in images |
| Spacing scale | 4,8,12,16,24,32,48,64 px |
| Radius | Inputs 8 px, cards 12 px, dialog 16 px; restrained borders/shadows |
| Content width | Public max 1200 px, text max 72ch, forms max 720 px |
| Grid | 4 columns narrow, 8 tablet, 12 desktop; 16/24/32 px gutters |
| Breakpoint proposals | <600 narrow, 600–959 tablet, 960–1279 desktop, >=1280 wide |
| Motion | Short 120–180ms feedback; honor reduced motion, no auto-rotating essential messaging |
| Touch | Main interactive targets >=44×44 CSS px as YHF design target |

Check actual rendered text/background combinations before release; this table does not certify contrast. WCAG 2.2 AA is the target. Typical text contrast ≥4.5:1 and large text ≥3:1; controls/focus and graphical indicators require appropriate contrast and non-color cues. Test every status color on actual background.

## Component specification

| Component | Anatomy and states | Responsive/accessibility contract |
|---|---|---|
| Header/navigation | Brand, primary links, locale/account, Donate/Apply; active and focus state | Button-named Menu, expanded/control relationships, drawer Escape/focus return |
| Buttons | Primary, secondary, text, destructive; normal/hover/focus/disabled/busy | Action verbs; busy announces state; disabled explains unmet prerequisite |
| Cause card | Consented thumbnail, masked title/summary, program/fund/location, verified date, progress/amounts, actions | 1/2/3-column grid; full title wraps, no critical ellipsis |
| Funding summary | Goal/net raised/remaining/distributed, timestamp, eligible-fund explanation, Donate | INR Indian grouping; progress has text value, cap bar at 100 but show overfunding amount |
| Filter group | Search, Filters count, chips, sort, reset, result count | Mobile modal filter drawer; URL/query synchronized; clear/empty/error/loading states |
| Form field | Persistent label, optional marker, hint, control, linked error | Proper inputmode/autocomplete; paste allowed; no placeholder-only labels |
| Money input | Currency prefix, decimal validation, clear format, server-derived summary | Values converted precisely; no implicit support/default fees |
| Consent group | Separate processing, media/publicity, optional newsletter | No preselected marketing/publicity; current policy version and accessible links |
| Wizard | Step title/count, progress, draft status, Back/Save/Continue | One-column mobile, server autosave on explicit step/approved debounce; network failure preserves unsent state in memory |
| Upload | Category/why needed, accepted types/size, progress, scan, replace/remove draft | Keyboard file selection; quarantined never previewed; PDF has safe authorized download |
| Status badge | Text/icon + status + optional reason | No color-only distinction; eligibility badge requires valid review |
| Timeline | Event/date/actor-safe summary/next step | Chronological list with clear current stage; private internal notes separate |
| Data table | Caption, sortable headers, row actions, pagination/export | Mobile summary cards or labeled horizontal region for comparison-heavy finance tables |
| Tabs/disclosures | One selected tab, named panels or disclosure buttons | Unique IDs and keyboard controls; no simultaneous fake selected states |
| Dialog/drawer | Heading, content, explicit actions, close | Focus management, scroll containment; confirm unsaved changes; no keyboard trap |
| Alert/error summary | Severity/title/action, linked field errors | Alert for urgent error, status for save/success; focus first invalid input |
| Receipt/report | Accessible HTML with downloadable approved artifact | Amount/date/reference/disclosures, no raw PII in file name or URL |
| Empty/error/loading | Specific message, clear filters/retry/help | Avoid fake totals/cards; loading not an indefinite spinner |
| Approval panel | Policy/version, scope/amount/payee, prerequisites, decision/reason | Disabled states explain conflict/quorum/stale approval; high-impact confirmation shows exact payload |
| Notification | Minimal text, timestamp, secure link, read state | No beneficiary medical/identity preview in email/SMS |
| Chart/metric | Definition, period/as-of, meaningful unit and table alternative | Small-cohort suppression/public-safe data; avoid animated counters read as individual digits |

Component styles are SCSS tokens and theme maps; no application implementation is authorized yet. A component library choice remains D20; accessible native semantics first, approve dependencies after compatibility/license review.

## Localization and content

English/Hindi routes and CMS variants are first-class. Persist user language, set document lang and localize errors, statuses, navigation, date/currency and screen-reader labels. Hindi is left-to-right; avoid invented RTL behavior. Do not concatenate sentence fragments. Preserve filter/wizard state on language change. Untranslated required policy/consent blocks cannot silently display an unapproved fallback; show explicit approved fallback or withhold the affected action.

Use “Apply for Help”, “Save draft”, “Awaiting verification” and “Payment pending” with human-reviewed Hindi equivalents. Avoid guaranteed approval/time/medical outcomes. “Anonymous” explains public anonymity vs retained receipt/finance identity. A verification badge describes scope/date; it is not a universal Shariah/legal certification.

## Page composition and responsive behavior

Homepage: mission/actions → programs → featured verified cases → process → dated impact → updates/volunteer. At Phase 1, unavailable dynamic sections use approved informational content, not invented statistics.

Cause detail: desktop 8/4 story/summary; tablet stack; narrow summary before long narrative, reserved-space sticky Donate. Donate: short steps and visible itemized review; mobile single column; no public sensitive data. Applicant wizard: step progress plus guidance; sensitive upload links protected. Admin: desktop sidebar/worklist/detail; mobile drawer/full-page record; critical approvals require all evidence visible before confirm.

Test 320/390/768/1024/1440 widths, 200% zoom, browser text enlargement, landscape, on-screen keyboard and physical Android/iOS. Sticky actions include safe-area padding and cannot cover fields/errors. Do not define success only by absence of a horizontal scrollbar; hidden overflow can hide data.

## Design acceptance and handoff

Before build, approve tokens, information hierarchy, screen catalogue, bilingual sample forms, public privacy allowlist and disabled-feature states. During build, review original high-fidelity samples for P01/P05/P06/P07/A03/A08/M08/F07 plus shared components. Test keyboard, screen reader, contrast, reduced motion, long content and error/slow-network states; record findings in AC02/AC39.

REA link: reference mobilemenu/filter/detail supplied functional observations; mobile card loading/search remain unresolved. YHF's spacing/colors/typography/layout choices here are new proposals. No formal accessibility conformance is claimed until verification.

