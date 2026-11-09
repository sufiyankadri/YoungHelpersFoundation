import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
@Component({
  selector: 'app-cause-detail',
  standalone: true,
  imports: [CommonModule, CauseCardComponent],
  templateUrl: './cause-detail.component.html',
  styles: [':host{display:block}'],
})
export class CauseDetailComponent {
  readonly nav = inject(CauseService);
  readonly donations = inject(DonationService);
  readonly cause = this.nav.selectedCause;
  readonly tab = signal('story');
  readonly shareStatus = signal('');
  readonly remaining = computed(() =>
    Math.max(0, (this.cause()?.targetAmount ?? 0) - (this.cause()?.raisedAmount ?? 0)),
  );
  readonly progress = computed(() =>
    this.cause()?.targetAmount
      ? Math.min(100, (this.cause()!.raisedAmount / this.cause()!.targetAmount) * 100)
      : 0,
  );
  readonly related = computed(() =>
    this.nav.examples
      .filter((c) => c.category === this.cause()?.category && c.slug !== this.cause()?.slug)
      .slice(0, 3),
  );
  constructor() {
    effect(() => {
      this.nav.selectedSlug();
      this.tab.set('story');
      this.shareStatus.set('');
    });
  }
  money(value: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  async share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.shareStatus.set('Example link copied.');
    } catch {
      this.shareStatus.set('Copy the page URL from your browser to share this example.');
    }
  }
  support() {
    this.donations.openDonateModal(this.cause() ?? undefined);
  }
}
