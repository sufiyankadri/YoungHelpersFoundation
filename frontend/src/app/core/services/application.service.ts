import { Injectable, signal } from '@angular/core';

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

/**
 * Service managing intake applications wizard, volunteer registrations, and verification workflows.
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  // Apply For Help Wizard State
  readonly applyStep = signal<number>(1);
  readonly applySubmitted = signal<boolean>(false);
  readonly lastCaseNumber = signal<string>('YHF-REQ-2026-9042');

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

  // Admin Dashboard State & Worklist
  readonly adminApplications = signal<HelpApplicationRecord[]>([
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

  readonly adminSelectedTab = signal<'cases' | 'ledger' | 'causes' | 'volunteers'>('cases');
  readonly selectedAdminCase = signal<HelpApplicationRecord | null>(null);

  /**
   * Submits intake wizard application and appends to the admin review queue.
   */
  submitApplication(): void {
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

  /**
   * Resets the application wizard to step 1.
   */
  resetApplication(): void {
    this.applyStep.set(1);
    this.applySubmitted.set(false);
  }

  /**
   * Submits the volunteer form.
   */
  submitVolunteer(): void {
    this.volunteerForm.submitted = true;
  }

  /**
   * Updates an application status (Admin action).
   */
  updateCaseStatus(app: HelpApplicationRecord, newStatus: HelpApplicationRecord['status']): void {
    app.status = newStatus;
  }

  /**
   * Selects an application to view in the inspection drawer.
   */
  viewAdminCase(app: HelpApplicationRecord): void {
    this.selectedAdminCase.set(app);
  }
}
