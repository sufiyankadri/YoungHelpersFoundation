import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { Cause } from '../../core/models/cause.model';

/**
 * Homepage featuring the primary monthly livelihood mission, program information,
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

  readonly missionChoice = signal<number | 'custom'>(100);
  readonly missionCustomAmount = signal('');
  readonly missionError = signal('');
  readonly missionReview = signal(false);

  chooseMissionAmount(amount: number | 'custom'): void {
    this.missionChoice.set(amount);
    this.missionReview.set(false);
    this.missionError.set('');
  }
  setMissionCustomAmount(event: Event): void {
    this.missionCustomAmount.set((event.target as HTMLInputElement).value);
    this.missionReview.set(false);
    this.missionError.set('');
  }
  missionAmount(): number {
    return this.missionChoice() === 'custom' ? Number(this.missionCustomAmount()) : this.missionChoice() as number;
  }
  missionFormattedAmount(): string {
    return new Intl.NumberFormat('en-IN').format(this.missionAmount());
  }
  reviewMissionContribution(): void {
    const amount = this.missionAmount();
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      this.missionError.set('Please enter a positive whole-rupee amount.');
      this.missionReview.set(false);
      return;
    }
    this.missionError.set('');
    this.missionReview.set(true);
  }


  constructor(
    public causeService: CauseService,
    public donationService: DonationService
  ) {}

  exploreProgram(category: 'medical' | 'emergency'): void {
    this.causeService.setCategory(category);
    this.causeService.navigateTo('causes');
  }

  onDonate(cause?: Cause): void {
    this.donationService.openDonateModal(cause);
  }
}
