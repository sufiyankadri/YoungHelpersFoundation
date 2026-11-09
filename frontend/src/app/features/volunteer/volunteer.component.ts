import { Component, inject } from '@angular/core';
import { CauseService } from '../../core/services/cause.service';
@Component({
  selector: 'app-volunteer',
  standalone: true,
  templateUrl: './volunteer.component.html',
  styles: [':host{display:block}'],
})
export class VolunteerComponent {
  readonly nav = inject(CauseService);
}
