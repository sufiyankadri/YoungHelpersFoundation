import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';

/**
 * Ek Zakat Ek Rozgaar flagship model breakdown, 4-step lifecycle, and active case spotlight.
 */
@Component({
  selector: 'app-rozgaar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rozgaar.component.html',
  styleUrl: './rozgaar.component.scss'
})
export class RozgaarComponent {
  constructor(
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  sponsorRozgaar(): void {
    this.donationService.openDonateModal(this.causeService.activeRozgaarCase());
  }
}
