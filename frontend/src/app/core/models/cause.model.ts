export interface Cause {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'rozgaar' | 'medical' | 'emergency';
  fundType: 'Zakat' | 'Sadaqah' | 'General';
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  daysLeft: number;
  location: string;
  verifiedDate: string;
  shariahCompliant: boolean;
  coverImage: string;
  story: string;
  rozgaarPlan?: {
    toolName: string;
    expectedMonthlyIncome: number;
    timeline: string;
    day30Status: string;
    day90Status: string;
  };
  urgent?: boolean;
}

export const MOCK_CAUSES: Cause[] = [
  {
    id: 'YHF-RZ-2026-001',
    slug: 'electrician-toolkit-mohammad-aadil',
    title: 'Ek Rozgaar: Certified Electrician Commercial Toolkit Setup',
    tagline: 'Supporting a certified diploma holder with industrial tools to start his own mobile electrical repair services.',
    category: 'rozgaar',
    fundType: 'Zakat',
    targetAmount: 38500,
    raisedAmount: 31200,
    donorCount: 42,
    daysLeft: 8,
    location: 'Old Delhi, Delhi',
    verifiedDate: '18 Oct 2026',
    shariahCompliant: true,
    coverImage: 'cause_electrician.jpg',
    story: 'Aadil has completed his ITI Electrical certification with high marks. However, due to lack of heavy drilling, testing instruments, and ladder kit, he is unable to take independent contracts. Providing this toolkit transfers permanent asset ownership (Tamleek), making his family self-reliant.',
    rozgaarPlan: {
      toolName: 'Bosch Professional Toolkit & Digital Multimeter Set',
      expectedMonthlyIncome: 24000,
      timeline: 'Asset delivery scheduled 48h after fund completion',
      day30Status: 'Tool verification & first 15 domestic clients',
      day90Status: 'Commercial shop tie-ups & independent income'
    }
  },
  {
    id: 'YHF-RZ-2026-002',
    slug: 'tailoring-boutique-fatima-bi',
    title: 'Ek Zakat Ek Rozgaar: Industrial Sewing Machine for Widow Mother',
    tagline: 'Enabling a skilled mother of 3 children to run tailoring services from home with industrial stitching gear.',
    category: 'rozgaar',
    fundType: 'Zakat',
    targetAmount: 26000,
    raisedAmount: 19500,
    donorCount: 29,
    daysLeft: 12,
    location: 'Bhopal, MP',
    verifiedDate: '15 Oct 2026',
    shariahCompliant: true,
    coverImage: 'cause_tailoring.jpg',
    story: 'Fatima lost her husband two years ago. She has 7+ years of hand-stitching experience. With a computerized high-speed sewing machine, she can complete bulk school uniform orders from local vendors, ensuring dignified livelihood and education for her children.',
    rozgaarPlan: {
      toolName: 'Jack F4 Direct Drive Industrial Sewing Machine',
      expectedMonthlyIncome: 18000,
      timeline: 'Immediate vendor quotation verified by local volunteer',
      day30Status: 'Initial local boutique supply orders',
      day90Status: 'Stable self-sustained income crossing ₹18,000/mo'
    }
  },
  {
    id: 'YHF-MD-2026-003',
    slug: 'pediatric-cardiac-surgery-baby-arham',
    title: 'Zindagi Bachao: Urgent Pediatric Valve Surgery Assistance',
    tagline: 'Critical hospital bill settlement for a 4-year-old child admitted to intensive cardiac care.',
    category: 'medical',
    fundType: 'Zakat',
    targetAmount: 85000,
    raisedAmount: 64000,
    donorCount: 88,
    daysLeft: 3,
    location: 'Lucknow, UP',
    verifiedDate: '21 Oct 2026',
    shariahCompliant: true,
    urgent: true,
    coverImage: 'cause_medical.jpg',
    story: 'Baby Arham was diagnosed with congenital heart condition. The hospital estimate was partially covered under Ayushman Bharat; the remaining critical medicine, post-op ICU stay, and stent consumable require urgent support. Direct hospital payment arrangement verified by YHF Medical Committee.'
  },
  {
    id: 'YHF-EM-2026-004',
    slug: 'fire-rehabilitation-grocery-cart',
    title: 'Emergency Relief: Rebuilding Street Food Cart after Local Fire',
    tagline: 'Providing steel cart, stove, and raw ration to restore daily earning for a breadwinner.',
    category: 'emergency',
    fundType: 'Sadaqah',
    targetAmount: 32000,
    raisedAmount: 32000,
    donorCount: 46,
    daysLeft: 0,
    location: 'Kanpur, UP',
    verifiedDate: '10 Oct 2026',
    shariahCompliant: true,
    coverImage: 'cause_foodcart.jpg',
    story: 'A sudden market electrical fire gutted Imran’s small cart, cutting off his family’s only daily bread. Field verifier confirmed total loss. The full target was reached within 48 hours and the new cart was handed over on 14th October.'
  }
];

export interface ImpactStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export const IMPACT_STATS: ImpactStat[] = [
  { label: 'Verified Cases Supported', value: '412+', subtext: '100% field-verified & Shariah reviewed', icon: 'verified' },
  { label: 'Sustainable Rozgaars Built', value: '185', subtext: 'Asset handover, 0 loans, 100% ownership', icon: 'handshake' },
  { label: '30/90 Day Khud-Mukhtari Rate', value: '94.2%', subtext: 'Beneficiaries earning independent incomes', icon: 'trending_up' },
  { label: 'Transparent Ledger Inflow', value: '₹1.28 Cr', subtext: 'Strict separation of Zakat & Sadaqah', icon: 'account_balance' }
];
