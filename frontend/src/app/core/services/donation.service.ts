import { Injectable, signal, computed } from '@angular/core';
import { Cause } from '../models/cause.model';
import { CauseService } from './cause.service';

export interface AdminDonationRecord {
  ref: string;
  donor: string;
  amount: number;
  fund: 'Zakat' | 'Sadaqah' | 'General';
  cause: string;
  date: string;
}

/**
 * Service managing donation modal lifecycle, amounts, custom contributions, and receipt generation.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationService {
  // Modal State
  readonly isModalOpen = signal<boolean>(false);
  readonly selectedCause = signal<Cause | null>(null);
  readonly donationSuccess = signal<boolean>(false);
  readonly lastReceiptNumber = signal<string>('');

  // Donation Form Fields
  readonly donationAmount = signal<number>(2500);
  readonly customAmount = signal<string>('');
  readonly selectedFundType = signal<'Zakat' | 'Sadaqah' | 'General'>('Zakat');
  readonly donorName = signal<string>('');
  readonly donorPhone = signal<string>('');
  readonly donorPan = signal<string>('');
  readonly donorAnonymous = signal<boolean>(false);

  // Zakat Calculator Standard Values
  readonly nisabStandard = signal<'silver' | 'gold'>('silver');
  readonly silverNisabValue = 68000; // ~612.36g of Silver in INR
  readonly goldNisabValue = 685000;  // ~87.48g of Gold in INR

  // Calculator Assets & Liabilities
  readonly goldValue = signal<number>(0);
  readonly silverValue = signal<number>(0);
  readonly cashInHand = signal<number>(0);
  readonly businessStock = signal<number>(0);
  readonly liabilities = signal<number>(0);

  // Computations for Nisab & Zakat
  readonly currentNisab = computed(() => {
    return this.nisabStandard() === 'silver' ? this.silverNisabValue : this.goldNisabValue;
  });

  readonly calculatedNetWealth = computed(() => {
    const totalAssets = 
      Number(this.goldValue() || 0) + 
      Number(this.silverValue() || 0) + 
      Number(this.cashInHand() || 0) + 
      Number(this.businessStock() || 0);
    const net = totalAssets - Number(this.liabilities() || 0);
    return net > 0 ? net : 0;
  });

  readonly isZakatEligible = computed(() => {
    return this.calculatedNetWealth() >= this.currentNisab();
  });

  readonly calculatedZakatPayable = computed(() => {
    if (!this.isZakatEligible()) return 0;
    return Math.round(this.calculatedNetWealth() * 0.025);
  });

  // Recent Admin Donations Audit Log
  readonly recentAdminDonations = signal<AdminDonationRecord[]>([
    { ref: 'YHF-REC-2026-48210', donor: 'Irfan Sheikh', amount: 25000, fund: 'Zakat', cause: 'Electrician Toolkit', date: '23 Oct 2026' },
    { ref: 'YHF-REC-2026-48209', donor: 'Dr. Sameera Khan', amount: 15000, fund: 'Zakat', cause: 'Pediatric Cardiac Surgery', date: '23 Oct 2026' },
    { ref: 'YHF-REC-2026-48208', donor: 'Anonymous Well-Wisher', amount: 5000, fund: 'Sadaqah', cause: 'Emergency Relief', date: '22 Oct 2026' },
    { ref: 'YHF-REC-2026-48207', donor: 'Mohd Zubair', amount: 10000, fund: 'General', cause: 'Foundation Pool', date: '22 Oct 2026' }
  ]);

  constructor(private causeService: CauseService) {}

  /**
   * Opens universal donation modal, optionally pre-selecting a target cause.
   */
  openDonateModal(cause?: Cause): void {
    if (cause) {
      this.selectedCause.set(cause);
      this.selectedFundType.set(cause.fundType);
    } else {
      this.selectedCause.set(null);
    }
    this.donationSuccess.set(false);
    this.isModalOpen.set(true);
  }

  /**
   * Closes the donation modal.
   */
  closeDonateModal(): void {
    this.isModalOpen.set(false);
    this.selectedCause.set(null);
    this.donationSuccess.set(false);
  }

  /**
   * Sets preset donation tier amount.
   */
  setAmount(amt: number): void {
    this.donationAmount.set(amt);
    this.customAmount.set('');
  }

  /**
   * Processes donation, updates cause progress and appends transaction to admin audit log.
   */
  processDonation(): void {
    const generatedReceipt = 'YHF-REC-2026-' + Math.floor(Math.random() * 89999 + 10000);
    this.lastReceiptNumber.set(generatedReceipt);
    this.donationSuccess.set(true);

    const cause = this.selectedCause();
    if (cause) {
      cause.raisedAmount += this.donationAmount();
      cause.donorCount += 1;
    }

    // Append to admin transactions
    this.recentAdminDonations.update(list => [
      {
        ref: generatedReceipt,
        donor: this.donorAnonymous() ? 'Anonymous Donor' : (this.donorName() || 'Generous Donor'),
        amount: this.donationAmount(),
        fund: this.selectedFundType(),
        cause: cause?.title || 'General Fund',
        date: '23 Oct 2026'
      },
      ...list
    ]);
  }
}
