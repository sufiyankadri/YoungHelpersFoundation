# IndiaZakat public reference analysis

Review date: 22 October 2026 (Asia/Calcutta). Target: https://indiazakat.com/. Purpose: inform Young Helpers Foundation (YHF) before development.

## Method and evidence boundaries

Connected REA MCP 6.7.0 performed declared browser scenarios in temporary, unsigned-in Chrome profiles (Chromium 155.0.8059.85). Desktop captures used 1440 × 1000 or 1440 × 844; mobile captures used a 390 × 844 viewport at scale 1. DOM, accessibility trees, selected screenshots, and homepage network metadata were inspected. Mobile means desktop Chromium with a narrow viewport, not a physical phone or mobile browser engine. Reduced motion and blocked service workers were capture defaults.

Labels throughout:
- **Observed runtime:** returned UI, screenshot, URL, error or network metadata.
- **Observed source:** delivered DOM/inline JavaScript; proves code presence, not that every branch ran.
- **Inference:** interpretation supported by observations.
- **Unknown:** not established within this inspection.
- **Recommendation:** a proposed YHF decision, not IndiaZakat behavior.

No authentication bypass, account creation, private document access, valid form submission, payment order initiation or payment occurred. Invalid signup and donation buttons were exercised with required fields absent; malformed signup input was deliberately invalid. No comments, reports, emails or external registration forms were submitted. Public cause attachments and beneficiary-list links were not opened. Screenshots were viewed for analysis; no logos, images, templates or proprietary code were copied into the project.

REA browser processes reported terminated-owned-process cleanup. No native binary session was opened. Schema-validation failures before execution produced no behavioral evidence. An initial mobile menu selector matched two elements; the corrected header-scoped selector succeeded (mobilemenu).

Source comparison: [YHF blueprint](Young_Helpers_Foundation_Complete_Website_Blueprint.docx), version 1.0, 20 October 2026. All paragraph and table text was read from its OOXML. Section references below are document section numbers, not inferred page numbers. No blueprint edits were made.

## 1. Homepage layout and navigation

**Observed runtime/source — home, mobilemenu**

The desktop header places the brand left and navigation right: Home, About Us, How It Works, Category, Explore, Blogs, Login, Sign Up and a search icon. About and Explore contain nested links in delivered DOM. About includes organization, governance, audit/process and live-dashboard destinations. Explore includes Zakat calculator, volunteer, reports and educational resources.

The homepage sequence captured was:
1. Campaign image carousel with previous/next controls and a linked campaign.
2. Four aggregate counters: collections, causes, donations and members; a live-dashboard link.
3. Trending cause cards.
4. Trust/benefit links, including verification, disbursement, payment and compliance claims.
5. Participation CTA and a three-part process explanation: raise, promote, withdraw.
6. Successful/featured/latest cause sections.
7. Program/category explanations, volunteer invitation and testimonials.
8. Footer with organizational context; later captures expose policy/library/contact links.

Cause cards expose title, summary, fund label, organizer, city/state, days remaining, percentage, raised/goal, share and donate controls. Homepage claims are statements by the site; this inspection did not verify compliance, verification quality, accounting totals or pass-through claims.

**Inference:** the homepage combines fundraising, education and organizational trust, but its long sequence may delay primary actions on small screens. Animated/lazy content means short snapshots do not prove that an absent card or footer section is permanently missing.

**Unknown:** every carousel slide, all dropdown interactions, global search relevance, dashboard calculation and CMS authoring workflow.

Public sources: [Home](https://indiazakat.com/), [How It Works](https://indiazakat.com/HowItWorks).

## 2. Cause listing and filters

**Observed runtime — listing, filter, search**

[Causes](https://indiazakat.com/Causes) has a desktop category sidebar, search by cause/location, category select, type select, city select and Load More. Category choices include education, healthcare, livelihood, orphan support, relief, scholarship, women empowerment, poverty alleviation, Nikah, other and successfully completed. Type choices include trending, almost funded, newest, ending soon, featured, latest, successful and urgent; these are UI options, not verified ranking algorithms.

Clicking Healthcare changed the category select to Healthcare and replaced the visible mixed list with medical causes while remaining on /Causes. This establishes one working category-filter path. City/type combinations and Load More were not exhaustively exercised.

A deliberately unlikely search term was entered and the search button clicked. After two seconds the capture still contained cause cards rather than a confirmed empty state. **Unknown:** whether this was fallback behavior, relevance behavior or a race with initial asynchronous loading. It is not evidence that search is broken or that empty results work.

**Observed source — listing:** jQuery functions POST filter values including category, fetch count, type, city and title, then inject returned HTML. Load More code increments fetch count by 12 and appends results. The source detects an empty response using an exact HTML response length of 1072 and contains empty/end-of-results messages. That branch was not verified at runtime. Enter-search and button-search call signatures differ in the delivered source; filter persistence should not be assumed.

**Accessibility observation:** many category tabs expose aria-selected=true simultaneously, including after one category is chosen; repeated tab IDs also appear in DOM. This is an observed semantic inconsistency, not a full accessibility audit.

## 3. Cause detail

**Observed runtime — detail, mobiledetail**

Sample: [Support Higher Education](https://indiazakat.com/Campaign/24688/Support-Higher-Education).

The page exposes title, main image, raised/goal, percentage, days remaining, category and Zakat-eligibility label. About, Donations and Updates tabs show counts. The initial About content contains narrative and external report/list links, attachment area, read-more control, social sharing, existing comments and a comment form (name/email/message). Organizer identity, creation date, donation link, copy-link field, report-fundraiser text, FAQ/chat affordances and content disclaimer are present.

The sampled page showed 412 donations and zero updates at capture. These counts are transient UI values, not audited totals. The donation/update tabs were inventoried but their contents were not opened. No donor records were collected. Eligibility labels do not prove the underlying review workflow. Attachment privacy and moderation controls remain unknown.

**Inference:** clear funding progress and a persistent donation action support decision-making; YHF should combine these patterns with consented, masked stories and dated verification explanations. Public comments increase moderation and privacy work for a small volunteer team.

## 4. Donation journey without payment

**Observed runtime — donate, invaliddonate, total**

The cause/card donation link points to [the public donation form](https://indiazakat.com/Donate/24688/Support-Higher-Education); direct navigation opened it without login.

Visible fields: donation type, amount, support contribution, full name, email, mobile, country, state, district, PAN, optional comment, transfer mode and anonymous-donation checkbox. Country defaults to India; online card/wallet/UPI/net-banking mode is selected. The side summary repeats the cause goal/progress and organizer. A finance-policy link is present.

The initial donation amount is 0 and separate support amount is 100, yielding a displayed total of INR 100. Editing donation to 50 and support to 0 then tabbing out changed the displayed total to INR 50. This establishes that the support value is editable and the visible total updates; it does not establish final server billing behavior. No receipt or tax entitlement was verified.

**Observed source — donate:** type options are Zakat, Sadqua, Bank Interest and General Donation. These are IndiaZakat choices, not approved YHF funds. Delivered JavaScript contains a Razorpay checkout branch and a bank-transfer branch with transaction date, bank name and reference requirements. The online branch constructs order data and opens Razorpay after validation; its handler posts payment-related form data and navigates toward a thank-you route.

**Inference:** Razorpay is an intended integration. **Unknown:** actual checkout availability, order creation, gateway configuration, signature validation, webhook processing, settlement, receipts, refunds, foreign-source restrictions, idempotency and ledger integrity. Public frontend code cannot establish these controls.

Inspection stopped with incomplete local form data, before the order/checkout branch. No payment gateway was opened and no payment was attempted.

## 5. Public forms and validation

| Surface | Runtime exercise | Observed result | Limit |
|---|---|---|---|
| Donation | Click Donate Now with defaults and required fields empty | Inline errors for type, minimum INR 50, name, email, mobile, state and district; form remains visible | Client behavior only; no valid order submitted |
| Signup | Click Sign Up with empty fields | Name, email, mobile, password and agreement errors | Full-name field receives a user-name error; not all required-looking fields visibly produced errors |
| Signup | Enter invalid-email and 123, then click Sign Up | Invalid-email and minimum ten-digit mobile messages | No real identity, valid address, CAPTCHA answer or account was submitted |
| Cause comment | Inventory only | Name, email, message and submit control | No submission or validation claim |
| Volunteer | Read public page | Volunteer and internship registration links leave the page, including a Google Form link | External destination fields/validation not inspected |
| How It Works | Read initial FAQ state | Accordion headings cover raising, review, withdrawal, fees, limits, tax and donor questions | Policy statements and hidden answers were not independently verified |

Signup includes country, registered type, terms agreement and a CAPTCHA. **Observed source:** blur handlers and click validation are handwritten jQuery; a valid-looking email triggers an existence-check request. No valid email was entered and no account enumeration was performed. Donation markup includes data-val attributes, character limits and numeric-key handlers. Such hints do not prove server validation, safe paste handling, canonicalization or security.

Contact, grievance, newsletter, complete applicant intake, authenticated uploads, login recovery and external volunteer-form behavior were not tested. Their absence from this sample does not prove the site lacks them. Public workflow descriptions do not constitute observation of private operational screens.

Sources: [Signup](https://indiazakat.com/UserSignUp), [Volunteer](https://indiazakat.com/Explore/VolunteerWithUs), [How It Works](https://indiazakat.com/HowItWorks).

## 6. Mobile responsiveness

**Observed screenshot/runtime — mobilemenu, mobilelisting, mobiledetail, mobiledonate**

At 390 × 844:
- Desktop links collapse to hamburger and search icons beside the logo. Clicking the header hamburger opens a dark left navigation drawer with links, submenu arrows, contact/social links, close icon and shaded background.
- Homepage counters stack vertically below the hero, taking substantial height before causes.
- Cause-list category navigation becomes a long full-width block above search and selects; filters/results fall below the first viewport. Search placeholder text is visibly truncated.
- Cause detail stacks image and funding summary. Three tabs fit compactly, and a fixed bottom Donate Now strip overlays the lower content area in the initial screenshot.
- Donation fields form a readable single column with the support amount and explanation near the top; later fields and summary require scrolling.

The initial viewports show adaptation; they do not establish full-page freedom from horizontal overflow, zoom support, drawer focus trapping, Escape handling, keyboard order, bottom safe-area behavior or accessible contrast. The menu's icon-only trigger has a glyph-based accessible name in captured trees.

Mobile listing captures did not expose cards during the short load window, while desktop captures did. Cause visibility on mobile therefore remains a follow-up, not a confirmed defect. Physical Android/iOS, tablet, landscape, slow-network, 200% zoom and screen-reader checks remain unperformed.

## 7. Observable JavaScript and architecture

**Observed source/network — home, listing, donate, signup**

- Delivered pages contain substantial HTML and inline jQuery handlers; jQuery 3.5.1 and Bootstrap bundle paths are present. Select2 and multiple carousel/animation/image plugins are referenced, alongside custom zakat and responsive styles.
- Root-relative controller-like routes coexist with AJAX HTML replacement and standard POST forms.
- Response header names include x-aspnet-version and x-aspnetmvc-version on a homepage CMS request. Header values were not retained.
- Homepage traffic includes a POST to /CMS/gNotifyPopup. Script/traffic references include Google Tag Manager/Analytics and Meta tracking.
- Listing source includes a synchronous third-party reverse-geocoding request and passes region/city values to cause fetching. That source presence does not prove successful location determination or permission behavior in all sessions.
- Some delivered script tags contain literal ~/ paths alongside root-relative paths. Duplicate references and inline debugger statements are present. Their presence alone does not prove duplicate execution or a visible failure.
- Homepage execution reported a jQuery image-zoom error about an empty selector. This is one runtime error in the sampled environment; the homepage still rendered.

**Inference:** behavior is consistent with a server-rendered ASP.NET MVC-style application enhanced by jQuery and HTML partials, rather than evidence of an Angular SPA. This does not identify an exact backend version, database, host, private service design or every frontend module. Referenced libraries may be unused, and a captured bundle is not proof every module executed. No source maps, repository or private endpoints were accessed.

YHF's Angular/.NET architecture in blueprint §13 is a proposed independent implementation. Reference behavior should inform requirements, not determine framework choice or encourage code copying.

## Coverage and unresolved questions

| Requested study | Status | Boundary |
|---|---|---|
| Homepage/navigation | Answered for sampled layout; partial interaction coverage | Drawer opened; not every dropdown or linked destination tested |
| Cause listing/filter/detail | Partial | One category applied, fields inventoried, one detail sampled; search empty state inconclusive |
| Donation journey | Answered through public pre-payment form | No order, checkout, success or receipt execution |
| Public forms/validation | Partial | Signup and incomplete donation runtime checks; other forms inventoried or untested |
| Mobile responsiveness | Partial | Four key surfaces at one narrow viewport; no physical-device/full accessibility certification |
| Frontend architecture | Partial | Delivered DOM/inline source and homepage network metadata; private architecture unknown |

Recommended later checks: settled search with positive/negative controls, combined filters and back-navigation persistence; Load More boundaries; mobile card loading; full keyboard/drawer/zoom checks; authorized sandbox-only donation success/failure/retry tests. Do not use real payment or private production records to close these gaps.

## REA evidence index

Aliases used above map to exact same-session Evidence IDs. Evidence scope includes public target content; source and runtime labels above constrain what can be concluded. Large raw results were parsed from complete tool-returned records in memory and only relevant fields reviewed; visible tool previews may be truncated. No raw proprietary DOM/scripts, images or beneficiary data were exported into the repository. IDs are session references, not durable public links.

| Alias | Evidence ID |
|---|---|
| home | ev_4a6f8f2d8a98367e354def14082b1908d0ac6b005f7428c40610a3d3d6bac648 |
| listing | ev_ae6795edfc477ecc61d634d1f03356218abd4c95ff441f841982e09f743e3bac |
| detail | ev_26a5423ab9e92dc2024c6ae544ee3fb5e5b3ba8054b7bfa39daa546ab8583248 |
| donate | ev_540515a8cf83a2b24213c77dbd2abe8ba3254d4009c9b46099a495cbe4dcbdfb |
| signup | ev_f3428c5cbb4289eeb50a9f98491e0daed1a5d5ca2b2d0ba6ff6f93e798ae4f86 |
| filter | ev_50ae769c042c09dd5bf4cba09f49abd7188c45020fc35808386c1dbda9f493fe |
| invalidsignup | ev_e076f63a970c0cb25b321937e7ab4d3226f227d00d57cf428597c99ca7d469c1 |
| invaliddonate | ev_4faf67efaf5729a755b2f684e8729d1c4ac21a4de854e1530cb664e931650f9c |
| mobilemenu | ev_5cc5c60b0192d12f31ca291ae28be77bde16fb0ab0afcd90db1515599e1af57b |
| mobilelisting | ev_a821f058c78797dca8a887135f1f5afc45dfe747d4cf499e735126db151bcba4 |
| mobiledetail | ev_ce907c6112179f2d7d8cd45e424479f3cfda51a4fa3b6b918cd81722b76c7a3a |
| mobiledonate | ev_66d80817cf8f13cad53c432f6f5eb965010e7af8f6b1d9374980913f45c986c3 |
| volunteer | ev_036ddb97762c6284543d80026d4ee227eb3550eb7493fd3cb474b063340fb728 |
| how | ev_ef1d2ce4a1ba448cefdd9d50e3b68604f8f786ff230fb908c39cc5de356396f5 |
| malformed | ev_32733fc8a8c8200b8f2bfacd2f4319d7d55348cc66e61c1ed34064dd17a900fd |
| search | ev_462ac5365d9096461070addb4d99762daaf9b255273bb87b1a8cfa714c7f9a88 |
| total | ev_3f15b2512e76991a42eb61721a80d7bb4523561c42d78964baf1b86495b27f89 |

This report retains the finding ledger and reproduction actions rather than a bulk asset/evidence bundle. Each successful scenario used a fresh profile and navigated to its documented public URL. Key selectors: Healthcare .btn_catg[data-categoryid='2']; signup .btnsignup; donation .btndonate; mobile menu header .mobile-nav__toggler. Search used #searchterm and .searchButton. Amount demonstration edited #DonationAmount and #GRATUITYAmount. All successful scenarios reported process cleanup.

