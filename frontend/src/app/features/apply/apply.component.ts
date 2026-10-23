import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';
import { CauseService } from '../../core/services/cause.service';

/**
 * Beneficiary intake wizard component with 3-step verification flow.
 */
@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent {
  constructor(
    public applicationService: ApplicationService,
    public causeService: CauseService
  ) {}

  nextStep(step: number): void {
    this.applicationService.applyStep.set(step);
  }

  submit(): void {
    this.applicationService.submitApplication();
  }

  reset(): void {
    this.applicationService.resetApplication();
  }

  returnHome(): void {
    this.causeService.navigateTo('home');
  }
}
