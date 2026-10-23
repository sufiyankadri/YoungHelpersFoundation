import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { Cause } from '../../core/models/cause.model';

/**
 * Homepage component featuring Hero, 4 Strategic Pillars, Featured Verified Causes,
 * Rozgaar Spotlight, Verification Lifecycle, and Trust Pillars.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CauseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  Math = Math;

  constructor(
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  onDonate(cause?: Cause): void {
    this.donationService.openDonateModal(cause);
  }
}
