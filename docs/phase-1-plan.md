# Young Helpers Foundation architecture and planning approval pack

Version 1.0 | 22 October 2026 | Status: Technical baseline approved for implementation by the user's “ok proceed” instruction. External business/legal/Shariah approvals remain separate.

Implementation progress is recorded in [implementation status](implementation-status.md); the original planning content below is retained as the approval baseline.

This pack specifies the complete portal before application implementation. The requested planning phase covers all modules; blueprint delivery Phase 1 remains the CMS MVP. Approval of this technical plan does not confer legal, tax, banking or Shariah approval, and does not enable live donations.

## Authority and scope

1. [Original Word blueprint](Young_Helpers_Foundation_Complete_Website_Blueprint.docx), version 1.0, 20 October 2026: primary requirements, all 20 sections and appendices A/B.
2. [Reference analysis](reference-analysis.md): bounded public REA observations and explicit unknowns.
3. [Feature comparison](feature-comparison.md) and [UX recommendations](ui-ux-recommendations.md): supplementary proposals.
4. Current user direction: Angular 22, TypeScript, SCSS, ASP.NET Core .NET 10 Web API, SQL Server, Clean Architecture and secure role-based authentication.

The source's two earlier Foundation proposals are cited by the blueprint but were not provided as separate files here; their details are represented only to the extent present in the primary blueprint. All four requested files were read completely. No IndiaZakat content, code, images or branding is part of this design.

In this pack, B means a blueprint requirement; P means a proposed elaboration needing approval; D means an unresolved decision in the decision register. REA observations are cited only by aliases linked to the existing evidence index, never used to claim private operational behavior.

## Documents to review

| Document | Contents |
|---|---|
| [Module requirements](module-requirements.md) | Stable requirement IDs, rules and module acceptance |
| [Architecture and security](architecture-and-security.md) | Layers, deployment, authentication, permissions and operational controls |
| [Screen specifications](screen-specifications.md) | All public, donor, applicant, volunteer, committee, finance and administration screens and states |
| [Database schema](database-schema.md) | Complete proposed SQL Server relational dictionary, keys, constraints and transactional rules |
| [REST API contracts](rest-api-contracts.md) | Routes, authorization, request/response shapes, validation and failure semantics |
| [Fund and case workflows](fund-and-case-workflows.md) | Donation, Zakat/Sadaqah, ledger, verification, decisions, disbursements and programs |
| [Responsive design system](responsive-design-system.md) | Original tokens, layout, component behavior, accessibility and localization |
| [Traceability matrix](requirement-traceability-matrix.md) | Every requirement mapped to source, screens, data, API, release phase and acceptance |
| [Roadmap and acceptance](development-roadmap.md) | Dependencies, blueprint phases, test catalogue and first 30 tasks |
| [Decision register](decision-register.md) | Business/legal/Shariah/technical questions, owners, affected gates and approval record |

## Architecture proposal in one view

Angular public/donor/applicant/volunteer/admin route areas → same-origin .NET 10 API → Application use cases → Domain invariants. Infrastructure supplies SQL Server, private file storage, payment adapter, notification adapter and outbox worker. Public CMS may be prerendered or server-rendered for SEO; authenticated pages remain private and uncached.

Use EF Core 10 for transactional persistence/migrations (P), ASP.NET Core Identity for users/MFA (P), secure server session cookies for this browser-only launch (P), SQL rowversion for edit concurrency and explicit serialized fund/approval locks for aggregate spending limits. No distributed microservice deployment is needed for 3–5 volunteers.

## Approval boundary

Please approve or amend the architecture, functional scope, textual screen designs, schema, APIs, role model, UX system and roadmap as one planning baseline. Detailed visual mockups and executable OpenAPI/DDL will be implementation deliverables after approval; this pack already specifies their intended content without writing application code.

Decision-register entries remain Open unless the Foundation supplies recorded approval/evidence. Technical plan approval may authorize gated development, but live financial/legal claims and restricted actions remain disabled until their specific release gates pass. No code, migrations, infrastructure or live service changes were made in this task.

## Planning review completed

The pack contains 68 requirement IDs, 68 matching traceability rows and 42 acceptance criteria. All blueprint sections 1–20, the original 30 task suggestions and Appendices A/B are mapped. Internal document links and requirement/acceptance coverage were checked. Schema review added globally scoped provider-payment uniqueness, guest consent ownership, explicit commitment funding sources and non-overlapping fund holds. These are design consistency checks; executable SQL, API, security and UI tests remain future implementation evidence.

