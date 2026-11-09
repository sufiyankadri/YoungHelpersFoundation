import { Component, ElementRef, HostListener, effect, inject } from '@angular/core';
import { DonationService } from '../../../core/services/donation.service';
import { CauseService } from '../../../core/services/cause.service';
@Component({
  selector: 'app-donate-modal',
  standalone: true,
  templateUrl: './donate-modal.component.html',
  styleUrl: './donate-modal.component.scss',
})
export class DonateModalComponent {
  readonly donationService = inject(DonationService);
  readonly nav = inject(CauseService);
  private host = inject(ElementRef);
  private previous: HTMLElement | null = null;
  constructor() {
    effect(() => {
      if (this.donationService.isModalOpen()) {
        this.previous = document.activeElement as HTMLElement | null;
        setTimeout(() => this.host.nativeElement.querySelector('.availability-close')?.focus());
      }
    });
  }
  close() {
    this.donationService.closeDonateModal();
    this.previous?.focus();
  }
  mission() {
    this.close();
    this.nav.navigateTo('home');
    setTimeout(() =>
      document
        .getElementById('monthly-mission')
        ?.scrollIntoView({ block: 'start', behavior: 'auto' }),
    );
  }
  @HostListener('document:keydown', ['$event']) keys(event: KeyboardEvent) {
    if (!this.donationService.isModalOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
    if (event.key === 'Tab') {
      const controls = Array.from(
        this.host.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }
}
