import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService, NavigationTab } from '../../../core/services/cause.service';
import { DonationService } from '../../../core/services/donation.service';

/**
 * Top announcement bar and main navigation header.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  navigate(tab: NavigationTab): void {
    this.causeService.navigateTo(tab);
  }

  openDonate(): void {
    this.donationService.openDonateModal();
  }
}
