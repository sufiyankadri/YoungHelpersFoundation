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
  providedIn: 'root',
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
  readonly selectedFundType = signal<'Zakat' | 'Sadaqah' | 'General' | null>(null);
  readonly donorName = signal<string>('');
  readonly donorPhone = signal<string>('');
  readonly donorPan = signal<string>('');
  readonly donorAnonymous = signal<boolean>(false);

  // Zakat Calculator Standard Values
  readonly nisabStandard = signal<'silver' | 'gold'>('silver');
  readonly silverNisabValue = 68000; // ~612.36g of Silver in INR
  readonly goldNisabValue = 685000; // ~87.48g of Gold in INR

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
  readonly recentAdminDonations = signal<AdminDonationRecord[]>([]);

  constructor(private causeService: CauseService) {}

  /**
   * Opens universal donation modal, optionally pre-selecting a target cause.
   */
  openDonateModal(cause?: Cause): void {
    if (cause) {
      this.selectedCause.set(cause);
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
    // Collection is unavailable; do not simulate captured payments or receipts.
    this.donationSuccess.set(false);
  }
}
