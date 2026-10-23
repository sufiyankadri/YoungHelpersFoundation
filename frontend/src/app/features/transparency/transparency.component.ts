import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Public Audit Ledger & Transparency component displaying dedicated pool balances and live reconciled transactions.
 */
@Component({
  selector: 'app-transparency',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transparency.component.html',
  styleUrl: './transparency.component.scss'
})
export class TransparencyComponent {}
