import { Component, signal, computed, inject, DestroyRef } from '@angular/core';
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
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  Math = Math;

  readonly activeSlide = signal(0);
  readonly playing = signal(false);
  readonly reduceMotion = signal(false);
  private slideTimer: ReturnType<typeof setInterval> | null = null;
  readonly slides = [
    {
      title: 'Helping unemployed people',
      emphasis: 'build a livelihood.',
      eyebrow: 'ONE MISSION. OPPORTUNITIES TO EARN.',
      body: 'In our city and nearby communities, many people want to work but need the right opportunity. Together, we can help them take a step towards independence—with just ₹100 a month.',
      image: 'cause_electrician.jpg',
      action: 'Join the ₹100/month mission',
      caption: 'Your small contribution.',
      captionStrong: 'A better beginning.',
    },
    {
      title: 'A skill. The right tools.',
      emphasis: 'A first opportunity.',
      eyebrow: 'ROZGAAR IS OUR PRIMARY PURPOSE.',
      body: 'Understand how a practical livelihood plan can connect someone’s skills with the tools, training and local opportunities they need to begin.',
      image: 'cause_tailoring.jpg',
      action: 'Explore the Rozgaar guide',
      caption: 'Help that looks ahead.',
      captionStrong: 'Opportunity with dignity.',
    },
    {
      title: 'Your time and care.',
      emphasis: 'Part of the possibility.',
      eyebrow: 'GET INVOLVED IN YOUR COMMUNITY.',
      body: 'Bring your skills, patience and willingness to listen. Discover how community participation can help shape a thoughtful livelihood mission.',
      image: 'cause_foodcart.jpg',
      action: 'Explore volunteering',
      caption: 'Together in our community.',
      captionStrong: 'A shared beginning.',
    },
  ];
  readonly featuredExamples = computed(() =>
    this.causeService.examples.filter((cause) => cause.featured).slice(0, 3),
  );
  private destroyRef = inject(DestroyRef);
  stopSlides(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
    this.slideTimer = null;
    this.playing.set(false);
  }
  selectSlide(index: number): void {
    this.stopSlides();
    this.activeSlide.set((index + this.slides.length) % this.slides.length);
  }
  slideKey(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    this.selectSlide(this.activeSlide() + (event.key === 'ArrowRight' ? 1 : -1));
  }
  toggleSlides(): void {
    if (this.playing()) {
      this.stopSlides();
      return;
    }
    if (this.reduceMotion()) return;
    this.playing.set(true);
    this.slideTimer = setInterval(
      () => this.activeSlide.update((index) => (index + 1) % this.slides.length),
      8000,
    );
  }
  heroAction(): void {
    if (this.activeSlide() === 1) this.causeService.openCategory('rozgaar');
    else this.causeService.navigateTo('volunteer');
  }

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
    return this.missionChoice() === 'custom'
      ? Number(this.missionCustomAmount())
      : (this.missionChoice() as number);
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
    public donationService: DonationService,
  ) {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.reduceMotion.set(media?.matches ?? false);
    const changed = (event: MediaQueryListEvent) => {
      this.reduceMotion.set(event.matches);
      if (event.matches) this.stopSlides();
    };
    const visibility = () => {
      if (document.hidden) this.stopSlides();
    };
    media?.addEventListener?.('change', changed);
    document.addEventListener('visibilitychange', visibility);
    this.destroyRef.onDestroy(() => {
      this.stopSlides();
      media?.removeEventListener?.('change', changed);
      document.removeEventListener('visibilitychange', visibility);
    });
  }

  exploreProgram(category: 'medical' | 'emergency'): void {
    this.causeService.openCategory(category);
  }

  onDonate(cause?: Cause): void {
    this.donationService.openDonateModal(cause);
  }
}
