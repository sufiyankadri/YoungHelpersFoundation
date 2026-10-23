import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../../core/services/donation.service';

/**
 * Shariah Zakat Calculator component with silver/gold Nisab toggles and instant 2.5% calculation.
 */
@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  constructor(public donationService: DonationService) {}

  payCalculatedZakat(): void {
    const amount = this.donationService.calculatedZakatPayable();
    this.donationService.setAmount(amount);
    this.donationService.selectedFundType.set('Zakat');
    this.donationService.openDonateModal();
  }

  giveSadaqah(): void {
    this.donationService.selectedFundType.set('Sadaqah');
    this.donationService.openDonateModal();
  }
}
