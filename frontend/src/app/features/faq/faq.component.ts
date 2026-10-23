import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';

/**
 * Frequently Asked Questions interactive accordion component.
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  constructor(public causeService: CauseService) {}

  toggle(idx: number): void {
    this.causeService.toggleFaq(idx);
  }
}
