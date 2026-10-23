import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService, NavigationTab } from '../../../core/services/cause.service';

/**
 * Global site footer with programs, governance links, and contact details.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(public causeService: CauseService) {}

  navigate(tab: NavigationTab): void {
    this.causeService.navigateTo(tab);
  }
}
