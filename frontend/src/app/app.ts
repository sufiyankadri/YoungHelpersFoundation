import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cause, MOCK_CAUSES, IMPACT_STATS, FAQ_DATA, FaqItem } from './core/models/cause.model';

export interface HelpApplicationRecord {
  id: string;
  trackingNumber: string;
  fullName: string;
  phone: string;
  city: string;
  program: string;
  monthlyIncome: number;
  quotationAmount: number;
  needDetails: string;
  status: 'Submitted' | 'FieldVerificationAssigned' | 'VerificationAssigned' | 'FieldVerified' | 'CommitteeReview' | 'Approved' | 'Rejected';
  verifierNotes?: string;
  submittedDate: string;
}

export interface VolunteerApplication {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  skills: string;
  availability: string;
  submitted: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  Math = Math;

  // Navigation State - Comprehensive Multi-Page Experience
  activeTab = signal<'home' | 'causes' | 'calculator' | 'rozgaar' | 'about' | 'volunteer' | 'transparency' | 'faq' | 'apply' | 'admin'>('home');
  selectedCategory = signal<'all' | 'rozgaar' | 'medical' | 'education' | 'emergency'>('all');
  
  // Causes
  causes = signal<Cause[]>(MOCK_CAUSES);
  filteredCauses = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.causes();
    return this.causes().filter(c => c.category === cat);
  });

  // Selected Cause for Donation Modal
  selectedCause = signal<Cause | null>(null);
  donationAmount = signal<number>(2500);
  customAmount = signal<string>('');
  selectedFundType = signal<'Zakat' | 'Sadaqah' | 'General'>('Zakat');
  donorName = signal<string>('');
  donorPhone = signal<string>('');
  donorPan = signal<string>('');
  donorAnonymous = signal<boolean>(false);
  donationSuccess = signal<boolean>(false);
  lastReceiptNumber = signal<string>('');

  // Quick Zakat Calculator State with Nisab standards
  nisabStandard = signal<'silver' | 'gold'>('silver');
  silverNisabValue = 68000; // ~612.36g of Silver in INR
  goldNisabValue = 685000;  // ~87.48g of Gold in INR

  goldValue = signal<number>(0);
  silverValue = signal<number>(0);
  cashInHand = signal<number>(0);
  businessStock = signal<number>(0);
  liabilities = signal<number>(0);

  currentNisab = computed(() => {
    return this.nisabStandard() === 'silver' ? this.silverNisabValue : this.goldNisabValue;
  });

  calculatedNetWealth = computed(() => {
    const totalAssets = Number(this.goldValue() || 0) + Number(this.silverValue() || 0) + Number(this.cashInHand() || 0) + Number(this.businessStock() || 0);
    const net = totalAssets - Number(this.liabilities() || 0);
    return net > 0 ? net : 0;
  });

  isZakatEligible = computed(() => {
    return this.calculatedNetWealth() >= this.currentNisab();
  });

  calculatedZakatPayable = computed(() => {
    if (!this.isZakatEligible()) return 0;
    return Math.round(this.calculatedNetWealth() * 0.025);
  });

  // Apply For Help Wizard State
  applyStep = signal<number>(1);
  applyData = {
    program: 'rozgaar',
    fullName: '',
    phone: '',
    city: '',
    address: '',
    monthlyFamilyIncome: '',
    dependentsCount: '',
    occupationSkill: '',
    needDetails: '',
    quotationAmount: '',
    hasGovtCard: 'no',
    consentGranted: false
  };
  applySubmitted = signal<boolean>(false);
  lastCaseNumber = signal<string>('YHF-REQ-2026-9042');

  // Volunteer Join Form State
  volunteerForm: VolunteerApplication = {
    fullName: '',
    phone: '',
    email: '',
    city: '',
    skills: 'Field Verification & Case Visits',
    availability: 'Weekends (4-6 Hours)',
    submitted: false
  };

  // FAQ list
  faqs = signal<FaqItem[]>(FAQ_DATA);
  expandedFaqIndex = signal<number | null>(0);

  // Impact Stats
  stats = signal(IMPACT_STATS);

  // Active Rozgaar Case for Detail View
  activeRozgaarCase = computed(() => {
    return this.causes().find(c => c.category === 'rozgaar') || this.causes()[0];
  });

  // Admin Dashboard State & Worklist
  adminApplications = signal<HelpApplicationRecord[]>([
    {
      id: 'APP-001',
      trackingNumber: 'YHF-REQ-2026-9042',
      fullName: 'Mohammad Aadil',
      phone: '+91 98112 34567',
      city: 'Old Delhi',
      program: 'Ek Rozgaar (Electrician Toolkit)',
      monthlyIncome: 6500,
      quotationAmount: 38500,
      needDetails: 'Certified ITI diploma holder needing professional Bosch power toolkit to begin independent contracting.',
      status: 'CommitteeReview',
      verifierNotes: 'Field check completed by Brother Tariq. Residence verified, 4 dependents, genuine Mustahiq.',
      submittedDate: '21 Oct 2026'
    },
    {
      id: 'APP-002',
      trackingNumber: 'YHF-REQ-2026-9041',
      fullName: 'Fatima Bi',
      phone: '+91 94250 89123',
      city: 'Bhopal, MP',
      program: 'Ek Rozgaar (Tailoring Machine)',
      monthlyIncome: 4500,
      quotationAmount: 26000,
      needDetails: 'Widow mother with 3 school-going daughters needing direct drive industrial stitching gear for school uniform contracts.',
      status: 'Approved',
      verifierNotes: 'Verified at home. Jack F4 quotation verified from local Bhopal sewing vendor.',
      submittedDate: '19 Oct 2026'
    },
    {
      id: 'APP-003',
      trackingNumber: 'YHF-REQ-2026-9040',
      fullName: 'Rashid Mansoori',
      phone: '+91 99345 67890',
      city: 'Kanpur, UP',
      program: 'Emergency Relief (Fire Recovery)',
      monthlyIncome: 5000,
      quotationAmount: 32000,
      needDetails: 'Food cart gutted in bazaar electrical fire. Sole breadwinner.',
      status: 'Approved',
      verifierNotes: 'Local shopkeepers confirmed total loss in night fire. Cart fabricated and delivered.',
      submittedDate: '12 Oct 2026'
    },
    {
      id: 'APP-004',
      trackingNumber: 'YHF-REQ-2026-9039',
      fullName: 'Parveen Bano',
      phone: '+91 88776 54321',
      city: 'Lucknow, UP',
      program: 'Zindagi Bachao (Medical Surgery)',
      monthlyIncome: 7000,
      quotationAmount: 85000,
      needDetails: 'Pediatric heart surgery ICU consumable settlement.',
      status: 'FieldVerificationAssigned',
      verifierNotes: 'Assigned to Volunteer Dr. Farhan for hospital billing estimate cross-check.',
      submittedDate: '22 Oct 2026'
    }
  ]);

  adminSelectedTab = signal<'cases' | 'ledger' | 'causes' | 'volunteers'>('cases');
  selectedAdminCase = signal<HelpApplicationRecord | null>(null);

  // Recent Donations in Admin
  recentAdminDonations = signal([
    { ref: 'YHF-REC-2026-48210', donor: 'Irfan Sheikh', amount: 25000, fund: 'Zakat', cause: 'Electrician Toolkit', date: '23 Oct 2026' },
    { ref: 'YHF-REC-2026-48209', donor: 'Dr. Sameera Khan', amount: 15000, fund: 'Zakat', cause: 'Pediatric Cardiac Surgery', date: '23 Oct 2026' },
    { ref: 'YHF-REC-2026-48208', donor: 'Anonymous Well-Wisher', amount: 5000, fund: 'Sadaqah', cause: 'Emergency Relief', date: '22 Oct 2026' },
    { ref: 'YHF-REC-2026-48207', donor: 'Mohd Zubair', amount: 10000, fund: 'General', cause: 'Foundation Pool', date: '22 Oct 2026' }
  ]);

  openDonateModal(cause?: Cause) {
    if (cause) {
      this.selectedCause.set(cause);
      this.selectedFundType.set(cause.fundType);
    } else {
      this.selectedCause.set(null);
    }
    this.donationSuccess.set(false);
  }

  closeDonateModal() {
    this.selectedCause.set(null);
    this.donationSuccess.set(false);
  }

  setAmount(amt: number) {
    this.donationAmount.set(amt);
    this.customAmount.set('');
  }

  processDonation() {
    const generatedReceipt = 'YHF-REC-2026-' + Math.floor(Math.random() * 89999 + 10000);
    this.lastReceiptNumber.set(generatedReceipt);
    this.donationSuccess.set(true);

    if (this.selectedCause()) {
      const c = this.selectedCause()!;
      c.raisedAmount += this.donationAmount();
      c.donorCount += 1;
    }

    // Add to admin list
    this.recentAdminDonations.update(list => [
      {
        ref: generatedReceipt,
        donor: this.donorAnonymous() ? 'Anonymous Donor' : (this.donorName() || 'Generous Donor'),
        amount: this.donationAmount(),
        fund: this.selectedFundType(),
        cause: this.selectedCause()?.title || 'General Fund',
        date: '23 Oct 2026'
      },
      ...list
    ]);
  }

  submitApplication() {
    const randomTicket = 'YHF-REQ-2026-' + Math.floor(Math.random() * 8999 + 1000);
    this.lastCaseNumber.set(randomTicket);

    const newRecord: HelpApplicationRecord = {
      id: 'APP-' + (this.adminApplications().length + 1),
      trackingNumber: randomTicket,
      fullName: this.applyData.fullName || 'Anonymous Applicant',
      phone: this.applyData.phone || '+91 99999 00000',
      city: this.applyData.city || 'India',
      program: this.applyData.program === 'rozgaar' ? 'Ek Rozgaar' : this.applyData.program === 'medical' ? 'Zindagi Bachao' : 'Emergency Relief',
      monthlyIncome: Number(this.applyData.monthlyFamilyIncome) || 5000,
      quotationAmount: Number(this.applyData.quotationAmount) || 25000,
      needDetails: this.applyData.needDetails,
      status: 'Submitted',
      submittedDate: 'Today'
    };

    this.adminApplications.update(list => [newRecord, ...list]);
    this.applySubmitted.set(true);
  }

  resetApplication() {
    this.applyStep.set(1);
    this.applySubmitted.set(false);
  }

  submitVolunteer() {
    this.volunteerForm.submitted = true;
  }

  toggleFaq(idx: number) {
    this.expandedFaqIndex.set(this.expandedFaqIndex() === idx ? null : idx);
  }

  // Admin Actions
  updateCaseStatus(app: HelpApplicationRecord, newStatus: HelpApplicationRecord['status']) {
    app.status = newStatus;
  }

  viewAdminCase(app: HelpApplicationRecord) {
    this.selectedAdminCase.set(app);
  }
}
