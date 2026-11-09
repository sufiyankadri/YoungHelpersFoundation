import { Component, computed, inject } from '@angular/core';
import { CauseService } from '../../core/services/cause.service';
interface InfoPage {
  kicker: string;
  title: string;
  intro: string;
  status: string;
  sections: { title: string; body: string }[];
}
const PAGES: Record<string, InfoPage> = {
  about: {
    kicker: 'OUR FOUNDATION',
    title: 'One purpose. More opportunities to earn.',
    intro:
      'Young Helpers Foundation’s main mission is to help unemployed people in our city and nearby communities find a way to earn and stand on their own feet.',
    status: 'Mission supplied by the foundation; wider organisational disclosures are pending.',
    sections: [
      {
        title: 'Small contributions, shared possibility.',
        body: 'We invite voluntary support of ₹100 a month. People who wish to give more are welcome to do so according to their means. This request is not an automatic subscription.',
      },
      {
        title: 'Livelihoods at the heart.',
        body: 'Rozgaar is our primary focus: understanding skills, needs and practical opportunities. Medical and emergency programme information remains supporting context, not a promise of available assistance.',
      },
    ],
  },
  advisory: {
    kicker: 'PEOPLE & GUIDANCE',
    title: 'Advisory board',
    intro:
      'A place for the foundation to publish the role and remit of its appointed advisers, with their consent.',
    status: 'Appointments and public profiles have not been supplied for publication.',
    sections: [
      {
        title: 'What belongs here',
        body: 'Confirmed adviser names, approved biographies, areas of expertise, appointment dates and the scope of advice. An adviser’s presence must not imply blanket legal, tax or Shariah certification.',
      },
      {
        title: 'What we will not invent',
        body: 'No stock portraits, placeholder people or borrowed credentials are presented as foundation advisers.',
      },
    ],
  },
  council: {
    kicker: 'GOVERNANCE',
    title: 'Our council',
    intro: 'Clear responsibilities help a community mission operate with care and accountability.',
    status: 'Council membership and decision authority await foundation approval.',
    sections: [
      {
        title: 'Authority should be clear',
        body: 'The approved council roster should explain programme oversight, review responsibilities, terms and how conflicts are handled.',
      },
      {
        title: 'Independent review',
        body: 'Verification, committee decisions and financial releases need an approved authority matrix. Holding multiple roles must not bypass independence requirements.',
      },
    ],
  },
  legal: {
    kicker: 'LEGAL & FINANCE',
    title: 'People behind responsible decisions.',
    intro:
      'Legal, finance and Shariah responsibilities must be defined by the foundation and appropriate qualified reviewers.',
    status:
      'No registration, tax entitlement, adviser appointment or Shariah approval is asserted on this page.',
    sections: [
      {
        title: 'Disclosures to publish after review',
        body: 'The confirmed legal entity, applicable registration details, authorised public documents and the roles of appointed legal and financial reviewers.',
      },
      {
        title: 'Fund decisions stay separate',
        body: 'Zakat and non-Zakat funds require separate records and approved use rules. The ₹100/month mission has not been classified as a Zakat collection.',
      },
    ],
  },
  audit: {
    kicker: 'REPORTS & ACCOUNTABILITY',
    title: 'Evidence before a claim.',
    intro:
      'This is where approved financial reports, programme summaries and their reporting periods will be published.',
    status: 'No approved audit reports or reconciled public financial snapshots are available yet.',
    sections: [
      {
        title: 'Reports library',
        body: 'There are currently no approved report downloads. Future publications should show their period, approval date, scope and any limitations.',
      },
      {
        title: 'Useful, safe reporting',
        body: 'Public reports should explain collections, allocations and distributions without exposing beneficiary identities, bank details or private case documents.',
      },
    ],
  },
  process: {
    kicker: 'OUR PROPOSED PROCESS',
    title: 'Listen carefully. Review responsibly. Follow through.',
    intro:
      'Our blueprint separates a request for help from a decision, delivery and follow-up. The operational services are still being prepared.',
    status: 'Proposed workflow; it does not certify that a case has been reviewed or approved.',
    sections: [
      {
        title: '01 · Understand',
        body: 'Record the need, skills, available support and consent through an approved private intake service.',
      },
      {
        title: '02 · Review',
        body: 'Authorised reviewers check appropriate evidence. Committee decisions must respect conflicts, quorum and approved policy.',
      },
      {
        title: '03 · Arrange approved support',
        body: 'Confirm the budget, permitted fund, payee and required independent release approval.',
      },
      {
        title: '04 · Follow the progress',
        body: 'Record delivery separately from payment. For livelihood support, plan follow-up at 30, 90 and 180 days according to the approved programme rules.',
      },
    ],
  },
  dashboard: {
    kicker: 'PUBLIC DASHBOARD',
    title: 'Real progress needs reliable evidence.',
    intro:
      'Public financial and programme outcomes will appear here only when an approved, reconciled reporting process is available.',
    status:
      'Live financial reporting is not connected. Catalogue examples are not foundation impact.',
    sections: [
      {
        title: 'Collections and distribution',
        body: 'No live collection totals, donation counts or fund balances are published in this preview.',
      },
      {
        title: 'Livelihood outcomes',
        body: 'No employment or income outcomes have been independently supplied for publication. Example records must not be counted as people helped.',
      },
      {
        title: 'Reporting standards',
        body: 'Future figures should include definitions, reporting period, as-of date and privacy-safe aggregation.',
      },
    ],
  },
  policies: {
    kicker: 'POLICIES',
    title: 'Clear information before participation.',
    intro:
      'Policy pages must match the services actually offered and the foundation’s approved decisions.',
    status:
      'Production privacy, donation, refund and Shariah policies await qualified review and approval.',
    sections: [
      {
        title: 'This website preview',
        body: 'Illustrative catalogue records and a contribution-planning panel are available. Online payments are not collected here. Do not send identity, banking or medical documents through public channels.',
      },
      {
        title: 'Before collection or private intake',
        body: 'Publish the approved legal identity, privacy notice, purpose-specific consent, grievance contact, retention rules and applicable donation/refund terms.',
      },
    ],
  },
  faq: {
    kicker: 'COMMON QUESTIONS',
    title: 'A few useful answers.',
    intro: 'Understand the current mission and what this website can do today.',
    status: 'Answers describe this website’s current availability.',
    sections: [
      {
        title: 'What is the main mission?',
        body: 'Helping unemployed people in our city and nearby communities find a way to earn.',
      },
      {
        title: 'Why ₹100 a month?',
        body: 'The foundation invites regular small contributions to strengthen this community mission. Larger voluntary contributions are welcome.',
      },
      {
        title: 'Is it an automatic monthly debit?',
        body: 'No. Choosing an amount or reviewing it does not subscribe you, take payment or create a bank mandate.',
      },
      {
        title: 'Are the causes real fundraising appeals?',
        body: 'No. Current catalogue entries are labelled examples to demonstrate the future browsing experience.',
      },
      {
        title: 'Can I assume my contribution qualifies as Zakat or for a tax benefit?',
        body: 'No. Eligibility, fund classification and tax disclosures require the appropriate approvals and evidence.',
      },
    ],
  },
  contact: {
    kicker: 'CONTACT & AVAILABILITY',
    title: 'The right contact matters.',
    intro:
      'The foundation’s verified public contact channels will be published here when supplied.',
    status: 'No phone number, office address or email has been verified for this page.',
    sections: [
      {
        title: 'Getting involved',
        body: 'Explore the volunteer information and the community livelihood mission. Please do not share sensitive identity, bank or medical documents through unverified contacts.',
      },
      {
        title: 'Staff access',
        body: 'A production staff portal requires secure, role-based authentication. An open demo dashboard is not a secure operations service.',
      },
    ],
  },
};
@Component({
  selector: 'app-info',
  standalone: true,
  templateUrl: './info.component.html',
  styles: [':host{display:block}'],
})
export class InfoComponent {
  readonly nav = inject(CauseService);
  readonly page = computed(() => PAGES[this.nav.infoPage()] ?? PAGES['about']);
}
