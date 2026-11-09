import { Cause } from './cause.model';
export type Programme = 'rozgaar' | 'medical' | 'emergency';
export type Collection = 'all' | 'trending' | 'featured' | 'latest';
export interface PublicCause extends Cause {
  publishedAt: string;
  featured: boolean;
  sampleActivity: number;
  status: 'open' | 'completed';
}
export interface ProgrammeGuide {
  id: Programme;
  name: string;
  label: string;
  kicker: string;
  image: string;
  icon: string;
  summary: string;
  purpose: string;
  needs: string[];
  steps: string[];
}
export const PROGRAMMES: ProgrammeGuide[] = [
  {
    id: 'rozgaar',
    name: 'Rozgaar & livelihoods',
    label: 'Livelihoods',
    kicker: 'OUR PRIMARY MISSION',
    image: 'cause_tailoring.jpg',
    icon: 'handyman',
    summary: 'The right opportunity can become a new beginning.',
    purpose:
      'Helping unemployed people in our city and nearby communities find a way to earn is the heart of Young Helpers Foundation. Our ₹100/month community mission supports this purpose; it does not promise a job or an income.',
    needs: [
      'Existing skills and the work someone wants to do',
      'Local demand, practical training and available opportunities',
      'Suitable tools, quotations and a realistic starting plan',
    ],
    steps: [
      'Understand the person and the opportunity',
      'Review the practical needs and proposed support',
      'Arrange approved support and follow the progress',
    ],
  },
  {
    id: 'medical',
    name: 'Medical support',
    label: 'Medical',
    kicker: 'A SUPPORTING AREA',
    image: 'cause_medical.jpg',
    icon: 'health_and_safety',
    summary: 'Care begins with understanding what a family needs.',
    purpose:
      'This supporting programme describes a considered approach to treatment-related hardship. Assistance would depend on review, approved policies and available resources. This website is not an emergency medical service.',
    needs: [
      'A clear explanation of the treatment-related need',
      'Reviewed estimates and available assistance schemes',
      'An approved support method and follow-up plan',
    ],
    steps: [
      'Understand the need and available assistance',
      'Review estimates and supporting information privately',
      'Consider authorised support and follow-up',
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency assistance',
    label: 'Emergency',
    kicker: 'A SUPPORTING AREA',
    image: 'cause_ration.jpg',
    icon: 'emergency',
    summary: 'A little stability when circumstances change.',
    purpose:
      'Sudden hardship can interrupt a household’s ability to earn or meet essential needs. This programme outlines a responsible response, with privacy and review. Urgency does not remove the need for authorisation.',
    needs: [
      'What has happened and what is needed now',
      'Available evidence of the need and other support',
      'A proposed response, delivery method and follow-up',
    ],
    steps: [
      'Record the immediate need',
      'Review the situation and response options',
      'Authorise suitable support and confirm delivery',
    ],
  },
];
const seed = [
  [
    'workshop-tools',
    'An electrician’s first independent workshop',
    'rozgaar',
    'Bhopal',
    'cause_electrician.jpg',
    38500,
    12500,
    '2026-10-18',
    true,
    32,
  ],
  [
    'tailoring-start',
    'A tailoring skill. A chance to earn.',
    'rozgaar',
    'Indore',
    'cause_tailoring.jpg',
    26000,
    6000,
    '2026-10-23',
    true,
    44,
  ],
  [
    'food-cart',
    'A small food cart. A fresh start.',
    'rozgaar',
    'Delhi',
    'cause_foodcart.jpg',
    32000,
    32000,
    '2026-10-12',
    false,
    15,
  ],
  [
    'treatment-review',
    'Helping a household plan treatment support',
    'medical',
    'Lucknow',
    'cause_medical.jpg',
    85000,
    21000,
    '2026-10-26',
    true,
    28,
  ],
  [
    'care-journey',
    'Support along a family’s care journey',
    'medical',
    'Bhopal',
    'cause_medical.jpg',
    45000,
    4000,
    '2026-10-29',
    false,
    12,
  ],
  [
    'essential-supplies',
    'Essential supplies during a difficult month',
    'emergency',
    'Delhi',
    'cause_ration.jpg',
    18000,
    8000,
    '2026-10-24',
    true,
    36,
  ],
  [
    'restart-after-crisis',
    'Rebuilding a routine after sudden hardship',
    'emergency',
    'Indore',
    'cause_foodcart.jpg',
    24000,
    24000,
    '2026-10-10',
    false,
    8,
  ],
  [
    'short-term-stability',
    'A little stability for the next step',
    'emergency',
    'Lucknow',
    'cause_ration.jpg',
    15000,
    2000,
    '2026-10-30',
    false,
    18,
  ],
] as const;
// Entirely illustrative editorial records. No names, KYC, real fundraising or eligibility evidence.
export const PUBLIC_EXAMPLES: PublicCause[] = seed.map((s, i) => ({
  id: 'EXAMPLE-' + (i + 1),
  slug: s[0],
  title: s[1],
  category: s[2],
  location: s[3],
  coverImage: s[4],
  targetAmount: s[5],
  raisedAmount: s[6],
  publishedAt: s[7],
  featured: s[8],
  sampleActivity: s[9],
  tagline: PROGRAMMES.find((p) => p.id === s[2])!.summary,
  fundType: 'General',
  donorCount: 0,
  daysLeft: 0,
  verifiedDate: '',
  shariahCompliant: false,
  story:
    'This is an illustrative programme example, not a beneficiary appeal. It shows how a future approved cause could explain the need, proposed support and next steps. No beneficiary identity or private evidence is published, and the displayed budget figures are examples only.',
  status: s[6] >= s[5] ? 'completed' : 'open',
  rozgaarPlan:
    s[2] === 'rozgaar'
      ? {
          toolName: 'Suitable tools subject to review',
          expectedMonthlyIncome: 0,
          timeline: 'No delivery date approved',
          day30Status: 'Follow-up to be scheduled after approved support',
          day90Status: 'Progress review subject to the programme plan',
        }
      : undefined,
}));
export interface CatalogueQuery {
  collection: Collection;
  search: string;
  category: string;
  city: string;
  status: string;
  sort: string;
  page: number;
}
export const DEFAULT_QUERY: CatalogueQuery = {
  collection: 'all',
  search: '',
  category: 'all',
  city: 'all',
  status: 'all',
  sort: 'recommended',
  page: 1,
};
export function selectCatalogue(causes: PublicCause[], query: CatalogueQuery): PublicCause[] {
  const text = query.search.trim().toLocaleLowerCase('en-IN');
  let result = causes.filter(
    (c) =>
      (query.category === 'all' || c.category === query.category) &&
      (query.city === 'all' || c.location === query.city) &&
      (query.status === 'all' || c.status === query.status) &&
      (!text ||
        [c.title, c.tagline, c.location, PROGRAMMES.find((p) => p.id === c.category)?.name]
          .join(' ')
          .toLocaleLowerCase('en-IN')
          .includes(text)) &&
      (query.collection !== 'featured' || c.featured),
  );
  return [...result].sort((a, b) => {
    if (query.sort === 'remaining')
      return (
        Math.max(a.targetAmount - a.raisedAmount, 0) -
          Math.max(b.targetAmount - b.raisedAmount, 0) || a.slug.localeCompare(b.slug)
      );
    if (query.sort === 'newest' || query.collection === 'latest')
      return b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug);
    if (query.collection === 'trending')
      return b.sampleActivity - a.sampleActivity || a.slug.localeCompare(b.slug);
    return (
      Number(b.category === 'rozgaar') - Number(a.category === 'rozgaar') ||
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.slug.localeCompare(b.slug)
    );
  });
}
