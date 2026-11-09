# Original YHF Category and Explore delivery

Updated 9 November 2026 (Asia/Calcutta). User-approved public-experience update. The primary mission remains helping unemployed people build a livelihood, supported by a voluntary INR 100/month request. English is the current implementation language.

## Evidence versus proposals

| Public reference | Evidence available | Original YHF decision |
|---|---|---|
| [IndiaZakat homepage](https://indiazakat.com/) | Indexed text identifies categories and Trending/Featured/Latest collections; user supplied homepage/category screenshots. | Separate programme understanding from discovery. |
| [IndiaZakat Causes](https://indiazakat.com/Causes) | Indexed text includes categories, cause/location search and selection controls. Live filter interactions not verified. | Combined filters, reset, pagination and shareable query state. |
| [Advisory Board](https://indiazakat.com/About/AdvisoryBoard), [Council](https://indiazakat.com/About/OurCouncil), [Legal/Financial Team](https://www.indiazakat.com/About/LegalAndFinancialTeam) | Indexed public pages separate these roles. | Original disclosure pages; no borrowed people or credentials. |
| [Our Process](https://indiazakat.com/About/OurProcess) | Indexed entry identifies an approval-process page; its interactions were not verified. | Explain the YHF blueprint's proposed review/delivery process. |
| [Calculator](https://indiazakat.com/ZakatCalculator) | Indexed content shows asset values, deductions and calculation explanations. | A narrower private worksheet with an entered reviewed threshold and visible workings, no assumed current rates. |
| [Zakat Center India](https://zakatcenterindia.org/) | Indexed text distinguishes livelihood support and other programme areas. | Lead with the user's confirmed livelihood mission and explain each programme's purpose. |
| [ZCI impact](https://zakatcenterindia.org/zakat-impact/) | Indexed material identifies public impact/reporting information. | No actual dashboard figures until approved evidence exists. |

Direct homepage requests failed with timeout/502 responses. The supplied individual Donate URL, LiveDashboard and AuditPage could not be read through the browsing tool. No runtime checkout, validation, mobile interaction or frontend architecture is asserted from failed requests. No authentication, payment submission or private-document access was attempted. Incidental document links in search results were not opened. This session adds no new REA evidence.

YHF's three-category scope, query navigation, programme guides, editorial Featured selection and sample-activity Trending are implementation decisions, not observed reference rules. No reference code, images, logo, biographies or appeal text were copied.

## Sitemap and journey

All query URLs preserve the existing pathname, including /YoungHelpersFoundation/ on GitHub Pages.

| Screen | Query / action |
|---|---|
| Home / carousel / monthly mission | Base URL; #monthly-mission |
| Programme directory | ?view=categories |
| Programme guide | ?view=category&category=rozgaar (also medical/emergency) |
| Explore | ?view=causes |
| Collections | ?view=causes&collection=trending / featured / latest |
| Filters | search, category, city, status, sort and page |
| Example detail | ?view=cause&slug=workshop-tools |
| Foundation information | ?view=info&page=about / advisory / council / legal / process |
| Reporting/resources | ?view=info&page=audit / dashboard / policies / faq / contact |
| Calculator | ?view=calculator |
| Volunteer/private-intake availability | ?view=volunteer / ?view=apply |

Journey: directory → guide → prefiltered Explore → example detail → contribution availability. Native back/forward restores state; invalid values are normalised; unknown slugs show a useful not-found screen. Skip navigation preserves the query.

## Implemented

- Original YHF navy/green composition and supplied header/footer logo. Existing project imagery remains explicitly illustrative.
- Compact grouped navigation with mobile accordions, ArrowDown entry, Escape/focus return and outside-click closure.
- Three controllable banner slides: mission, Rozgaar and volunteering. Autoplay is opt-in; manual controls, focus/entry pause, dynamic reduced-motion handling, visibility pause and cleanup.
- Rozgaar-first programme directory and substantive Medical/Emergency guides. No new Education/Orphan/Scholarship category.
- All/Trending/Featured/Latest collections; combined text/programme/city/example-status filters, sorting, reset, empty state and six-result pagination.
- Eight clearly labelled examples. Trending uses sample activity; Featured an editorial example flag; Latest fixed example publication dates. These are not real popularity, fundraising or impact.
- Detail story/support/updates views, sample budgets, related examples and copy-link sharing. No beneficiary names, contact, KYC or medical records.
- About, Process, Advisory, Council, Legal/Finance, Audit, Dashboard, Policy, FAQ and Contact pages with honest missing-disclosure states.
- Exact-paise planning arithmetic, invalid-value checks, user-entered reviewed Nisab, visible workings and explicit lunar-year review. A simple 2.5% illustration, not a comprehensive ruling or live-price tool.
- Payment simulation, fake receipt generation and seeded donor history removed from the public flow. Contribution availability replaces checkout; no automatic fund choice or recurring mandate.
- Applications and volunteering show actual availability rather than fake submissions. The INR 100 panel is review only.

## Coverage and limits

This is a public frontend delivery in D:/YoungHelpersFoundation, not completion of the original backend. Historical E: SQL Server/auth/CMS claims must not be treated as verified current features.

Partial blueprint coverage: R01/R03/R04/R06 public programme experience; R07 discovery; R08 detail presentation; R09 reporting availability; R11 information; R16 privacy/payment boundaries. Broader acceptance still needs real data, CMS, authentication, SQL Server, private storage/scanning, committee/fund/disbursement workflows and notifications.

Required foundation inputs: approved copy/media rights; actual team roles and profile consent; audit reports and reconciled metric definitions; INR 100 fund classification; qualified legal/tax/Shariah decisions; payment-provider onboarding. Monthly intent does not authorise automatic debits.

Browser/device/screen-reader/zoom review remains unverified: there is no supported interactive browser runtime in the current tool set. No screenshot, WCAG conformance or complete end-to-end financial test claim is made. The catalogue is not connected to unaudited backend endpoints.

## Validation

Final frontend suite: 54 tests passed across nine files. Deployment evidence is recorded in the session/status log. Tests cover filtering/order, URL restore, pagination, category/detail flow, missing records, disclosure boundaries, payment-capture blocking, currency arithmetic, mission review, keyboard navigation and carousel behavior.

The GitHub Pages base-path production build passed at 289.63 kB raw / 74.67 kB estimated transfer. Common colors were checked arithmetically: primary white-on-green 5.57:1; supporting text on dark surface 6.67:1. Selected light labels were darkened. These checks are not a whole-site accessibility audit.

CI now runs frontend tests before Pages deployment with the locally tested Node 24.16 runtime. Backend build artifacts, local databases and .cache backups are excluded from the source delivery.
