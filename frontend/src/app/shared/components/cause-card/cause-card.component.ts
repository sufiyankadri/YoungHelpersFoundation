import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cause } from '../../../core/models/cause.model';
import { CauseService } from '../../../core/services/cause.service';
@Component({
  selector: 'app-cause-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cause-card.component.html',
  styleUrl: './cause-card.component.scss',
})
export class CauseCardComponent {
  @Input({ required: true }) cause!: Cause;
  @Output() donate = new EventEmitter<Cause>();
  readonly navigation = inject(CauseService);
  get progress() {
    return this.cause.targetAmount > 0
      ? Math.min(100, Math.max(0, (this.cause.raisedAmount / this.cause.targetAmount) * 100))
      : 0;
  }
  money(value: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  categoryLabel() {
    return (
      this.navigation.programmes.find((p) => p.id === this.cause.category)?.label ?? 'Programme'
    );
  }
  onDonate() {
    this.navigation.openCause(this.cause.slug);
  }
}
