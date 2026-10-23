import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cause } from '../../../core/models/cause.model';

/**
 * Reusable card displaying cause details, funding progress bar, and donate action.
 */
@Component({
  selector: 'app-cause-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cause-card.component.html',
  styleUrl: './cause-card.component.scss'
})
export class CauseCardComponent {
  @Input({ required: true }) cause!: Cause;
  @Output() donate = new EventEmitter<Cause>();

  Math = Math;

  onDonate(): void {
    this.donate.emit(this.cause);
  }
}
