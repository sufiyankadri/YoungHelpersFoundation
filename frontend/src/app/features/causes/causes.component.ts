import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService, CauseCategoryFilter } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';
import { Cause } from '../../core/models/cause.model';

/**
 * Explore Causes component with category tabs and comprehensive case cards.
 */
@Component({
  selector: 'app-causes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './causes.component.html',
  styleUrl: './causes.component.scss'
})
export class CausesComponent {
  Math = Math;

  constructor(
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  setCategory(category: CauseCategoryFilter): void {
    this.causeService.setCategory(category);
  }

  onDonate(cause: Cause): void {
    this.donationService.openDonateModal(cause);
  }
}
