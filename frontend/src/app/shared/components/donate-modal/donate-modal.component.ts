import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../../../core/services/donation.service';

/**
 * Universal donation modal handling preset amounts, custom values, fund allocation, and instant receipt generation.
 */
@Component({
  selector: 'app-donate-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donate-modal.component.html',
  styleUrl: './donate-modal.component.scss'
})
export class DonateModalComponent {
  constructor(public donationService: DonationService) {}

  close(): void {
    this.donationService.closeDonateModal();
  }

  setAmount(amt: number): void {
    this.donationService.setAmount(amt);
  }

  onCustomAmountInput(val: string): void {
    const num = Number(val);
    if (num > 0) {
      this.donationService.donationAmount.set(num);
    }
  }

  processDonation(): void {
    this.donationService.processDonation();
  }
}
