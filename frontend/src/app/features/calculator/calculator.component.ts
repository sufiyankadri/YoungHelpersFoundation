import { Component, computed, signal } from '@angular/core';
import { planningEstimate, formatPaise } from '../../core/models/zakat-estimate';
@Component({
  selector: 'app-calculator',
  standalone: true,
  templateUrl: './calculator.component.html',
  styles: [':host{display:block}'],
})
export class CalculatorComponent {
  readonly labels = [
    'Cash in hand',
    'Bank balances',
    'Gold value you consider applicable',
    'Silver value you consider applicable',
    'Business inventory you consider applicable',
    'Other reviewed applicable assets',
  ];
  readonly assets = signal(['', '', '', '', '', '']);
  readonly liability = signal('');
  readonly threshold = signal('');
  readonly yearReviewed = signal(false);
  readonly valuationDate = signal('');
  readonly result = computed(() => {
    try {
      return {
        value: planningEstimate(
          this.assets(),
          this.liability(),
          this.threshold(),
          this.yearReviewed(),
        ),
        error: '',
      };
    } catch (error) {
      return { value: null, error: (error as Error).message };
    }
  });
  readonly money = formatPaise;
  asset(index: number, event: Event) {
    const next = [...this.assets()];
    next[index] = (event.target as HTMLInputElement).value;
    this.assets.set(next);
  }
  text(event: Event) {
    return (event.target as HTMLInputElement).value;
  }
  checked(event: Event) {
    return (event.target as HTMLInputElement).checked;
  }
  reset() {
    this.assets.set(['', '', '', '', '', '']);
    this.liability.set('');
    this.threshold.set('');
    this.yearReviewed.set(false);
    this.valuationDate.set('');
  }
}
