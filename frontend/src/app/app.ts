import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cause, MOCK_CAUSES, IMPACT_STATS } from './core/models/cause.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  Math = Math;

  // Navigation State
  activeTab = signal<'home' | 'causes' | 'calculator' | 'rozgaar' | 'apply' | 'transparency'>('home');
  selectedCategory = signal<'all' | 'rozgaar' | 'medical' | 'emergency'>('all');
  
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

  // Quick Zakat Calculator State
  goldValue = signal<number>(0);
  silverValue = signal<number>(0);
  cashInHand = signal<number>(0);
  businessStock = signal<number>(0);
  liabilities = signal<number>(0);

  calculatedNetWealth = computed(() => {
    const totalAssets = Number(this.goldValue() || 0) + Number(this.silverValue() || 0) + Number(this.cashInHand() || 0) + Number(this.businessStock() || 0);
    const net = totalAssets - Number(this.liabilities() || 0);
    return net > 0 ? net : 0;
  });

  calculatedZakatPayable = computed(() => {
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

  // Impact Stats
  stats = signal(IMPACT_STATS);

  // Active Rozgaar Case for Detail View
  activeRozgaarCase = computed(() => {
    return this.causes().find(c => c.category === 'rozgaar') || this.causes()[0];
  });

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
    this.donationSuccess.set(true);
    if (this.selectedCause()) {
      const c = this.selectedCause()!;
      c.raisedAmount += this.donationAmount();
      c.donorCount += 1;
    }
  }

  submitApplication() {
    this.applySubmitted.set(true);
  }

  resetApplication() {
    this.applyStep.set(1);
    this.applySubmitted.set(false);
  }
}
