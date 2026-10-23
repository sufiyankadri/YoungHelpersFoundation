import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService, HelpApplicationRecord } from '../../core/services/application.service';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';

/**
 * Admin & Field Operations Command component managing case verification queue,
 * donation audits, and public cause statuses.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  Math = Math;

  constructor(
    public applicationService: ApplicationService,
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  setTab(tab: 'cases' | 'ledger' | 'causes' | 'volunteers'): void {
    this.applicationService.adminSelectedTab.set(tab);
  }

  viewCase(app: HelpApplicationRecord): void {
    this.applicationService.viewAdminCase(app);
  }

  updateStatus(app: HelpApplicationRecord, status: HelpApplicationRecord['status']): void {
    this.applicationService.updateCaseStatus(app, status);
  }

  closeDrawer(): void {
    this.applicationService.selectedAdminCase.set(null);
  }

  returnHome(): void {
    this.causeService.navigateTo('home');
  }

  viewPublicCauses(): void {
    this.causeService.navigateTo('causes');
  }
}
