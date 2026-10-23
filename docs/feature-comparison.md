# YHF blueprint and IndiaZakat feature comparison

Prepared 22 October 2026. Basis: [YHF complete blueprint](Young_Helpers_Foundation_Complete_Website_Blueprint.docx), version 1.0 (20 October 2026), and [REA reference analysis](reference-analysis.md). This is requirements analysis only; no implementation has started.

## How to read the comparison

“Observed” means runtime or delivered-source evidence from the bounded public inspection. “Unknown” means not established, not absent. “Proposed” means YHF blueprint scope or an analyst recommendation. Evidence aliases resolve to exact REA IDs in the reference analysis. Public policy/marketing claims do not verify operational controls.

| Feature | IndiaZakat evidence | YHF blueprint requirement | Recommended treatment |
|---|---|---|---|
| Homepage | Observed hero/carousel, aggregate counters, trending/featured/latest sections, trust links, process explanation and volunteering (home) | §5 mission, Donate/Apply, verified causes, impact, updates | Adapt hierarchy; make Donate and Apply for Help immediately visible |
| Navigation | Observed desktop menus, login/signup/search and mobile drawer (home, mobilemenu) | §5 full public sitemap, bilingual presentation | Use a smaller primary menu with Programs, Causes, Impact, About; persistent key actions |
| Programs | Observed many category options (listing) | §2, §5, §8 launch Rozgaar, Medical, Emergency; education later if approved | Retain Foundation program scope; do not import every reference category |
| Discovery | Observed search/category/type/city controls and one successful Healthcare selection (listing, filter) | §5 search, city, program, fund eligibility, status, sorting | Adapt; add explicit fund eligibility/status. Combined filters, URL persistence and empty states require YHF specifications |
| Pagination | Observed Load More affordance; source appends HTML with fetch-count increments (listing) | §12 server pagination | Define stable pagination, loading/error/end states and accessible announcements |
| Cause cards | Observed fund label, title, summary, organizer/location, time, goal/raised, donate/share (home, listing) | §3, §5 curated verified cards and remaining amount | Adapt with original design; show remaining amount and dated verification |
| Cause detail | Observed story, progress, eligibility, tabs, organizer, comments, share and report affordances (detail) | §5 anonymized narrative, verification, timeline, updates, donate/share | Adapt funding clarity; keep KYC private. Public comments are optional additional scope |
| Cause verification | Observed eligibility and verification claims; private process unknown | §4, §7 assigned verifier, Shariah/committee reviews, approval/publication separation | Implement from YHF governance rules; do not infer reference equivalence |
| Donor entry | Observed public donation form without login (donate) | §6 donation details/consent and donor dashboard | Consider guest donation plus optional account link, subject to receipt/identity policy |
| Fund selection | Observed source options Zakat, Sadqua, Bank Interest, General Donation (donate) | §6, §10 separate approved funds and donor restrictions | Define YHF's own approved vocabulary and eligibility; Bank Interest is not automatically a YHF fund |
| Donation amount/support | Observed minimum INR 50, default separate INR 100 support, editable to zero and recalculated total (invaliddonate, total) | §6 amount/fund/fees and truthful claims | Set own minimum; explicit optional support choice and itemized total, avoiding surprise defaults |
| Donor data | Observed name/email/mobile/address selections, PAN prompt, comment, anonymity (donate) | §6 contact/consent and applicable receipt disclosures | Minimize collection; distinguish public anonymity from finance identity; conditional tax fields |
| Payment integration | Razorpay and bank-transfer branches observed in delivered source; execution untested | §6 signed webhook, reconciliation, statuses, reversals, receipts | Build and test independently in sandbox; reference frontend cannot validate finance integrity |
| Manual transfer | Source contains bank/date/reference branch, not exercised | §6 manual UPI/NEFT finance verification | Keep Pending until reconciled; no confirmation based on screenshots alone |
| Receipts/donor dashboard | Not exercised; private access excluded | §6, §15 own receipts/history/progress | Blueprint scope; no claim of reference parity |
| Applicant intake | Public how-to headings and raise/promote/withdraw guidance; full intake untested (how, home) | §7 six-step intake, drafts, private evidence, status tracking | Design for applicants and assisted entry; no automatic public publication |
| Approvals/disbursement | Public FAQ topics only; operational screens unknown | §7–§10 quorum, conflicts, ceilings, partial release, payee approval | Retain as core YHF controls, not discoverable reference features |
| Livelihood outcomes | Category and narratives observed; operational tracking unknown | §8, §15 tools, ownership transfer, baseline, 30/90/180-day follow-up | YHF-specific priority; allocate volunteer work and define verified/self-reported metrics |
| Volunteer | Observed explanatory page and external registration links (volunteer) | §4, §9 join form, skills/availability/consent, assignment | Prefer integrated accessible intake with acknowledgment and private assignment workflow |
| Public forms | Observed incomplete signup/donation errors and malformed signup errors (invalidsignup, invaliddonate, malformed) | §9, §12 contact, volunteer, newsletter, grievance, DTO validation | Shared accessible validation contract; server checks in addition to browser checks |
| CMS | Dynamic page/cause content observed; admin tooling unknown | §9 bilingual sections, scheduled banners, preview, revisions, consent | Implement blueprint CMS requirements; do not infer editor capabilities from public HTML |
| Transparency | Observed counters/dashboard link and claims, not audited accounting | §10, §15 reconciled aggregates, reports, opening/closing and commitments | Publish definitions and as-of dates; keep internal finance views role-limited |
| Accessibility/mobile | Observed narrow layouts/drawer; conflicting tab states, icon labels, long mobile category block (filter, mobilemenu, mobilelisting) | §5 WCAG 2.2 AA target, mobile-first, keyboard, Hindi/English | Use as improvement opportunities; conduct formal YHF accessibility testing |
| Frontend/backend | Observed jQuery/Bootstrap/Select2, HTML forms/partials; MVC-style server rendering inferred | §13 Angular 22, .NET 10, SQL Server/private files | Keep independent architecture; validate versions/support during implementation, not by reference imitation |
| Privacy/security | Public form and tracking scripts observable; private controls unknown | §4, §7, §14 API authorization, MFA, encryption, uploads, retention | Follow blueprint; no audit finding about inaccessible reference controls |
| Policy/compliance | Public labels/claims and policy links observed, policy validity unverified | §14, §19 evidence-based legal/tax/Shariah release gates | Adopt no reference fee/tax/eligibility claim as YHF policy |

## Blueprint clarifications before coding

These are **recommendations**, not newly approved requirements.

1. **Discovery contract (§5, §12):** separate program, fund eligibility, lifecycle status and sorting; specify combination semantics, URL parameters, default order, city fallback, reset and empty/error behavior. Search should retain filters consistently for Enter and button actions.
2. **Fund compatibility (§6, §10):** specify which funds each cause accepts, how optional operating support is funded, and how excess/shortfall/reallocation consent works. A global fund selector must not allow an ineligible cause/fund combination.
3. **Donation identity (§6, §14):** decide guest checkout, account linking, public anonymity, minimum amount, permitted donor sources, required contact/address data and when tax information is necessary. No legal determination is made here.
4. **Content privacy (§5, §7, §9):** create a public-field allowlist, media consent/redaction checklist, verification badge meaning/expiry and preview-before-publish gate. Keep private case approval distinct from publication.
5. **Interaction scope (§5, §9):** decide whether comments, reporting and recurring donation belong at launch. For 3–5 volunteers, moderated updates plus a private grievance channel reduce workload.
6. **Outcome definitions (§8, §15):** distinguish pledged, captured, reconciled, committed, disbursed and delivered. Define “livelihood sustained” and how income changes are evidenced.
7. **Delivery dependencies (§16):** public causes appear in phase 4 after donations/finance in phase 3, while phase 1 is CMS. Specify phase-by-phase public CTA behavior and use pooled/manual records only where authorized; avoid presenting an unavailable payment path.
8. **Approval register (§19):** name owners and decisions for brand/languages, written fund policies, privacy/publication, legal claims, bank/gateway and separation of duties. This analysis does not resolve those approvals.

## Scope priorities

- **Launch foundation:** original bilingual public shell/CMS; responsive causes; accessible contact/volunteer/grievance forms; private applicant intake; verification and committee workflow; approved-fund handling; manual reconciliation before live gateway; audit and receipts.
- **Program delivery:** authorized disbursements, ownership handover, medical evidence and 30/90/180-day livelihood follow-ups as the blueprint phases permit.
- **Later or optional:** public comments, large carousel/testimonial systems, broad category catalog, recurring contributions and marketplace functions. Blueprint §1 explicitly excludes an open multi-NGO marketplace at launch.

## Evidence limits

Neither the blueprint's earlier IndiaZakat observations nor this public review proves reference accounting, KYC security, Shariah compliance, tax eligibility, role isolation or admin capability. The blueprint is the YHF proposal; current public observations are bounded references. No architectural or policy decision should be treated as approved solely because it appears on IndiaZakat.

