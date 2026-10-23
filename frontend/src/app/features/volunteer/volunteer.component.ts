import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../core/services/application.service';

/**
 * Volunteer registration component with roles list and on-boarding intake form.
 */
@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss'
})
export class VolunteerComponent {
  constructor(public applicationService: ApplicationService) {}

  submit(): void {
    this.applicationService.submitVolunteer();
  }

  reset(): void {
    this.applicationService.volunteerForm.submitted = false;
  }
}
