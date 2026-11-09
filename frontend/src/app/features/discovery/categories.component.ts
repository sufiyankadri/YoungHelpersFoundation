import { Component, inject } from '@angular/core';
import { CauseService } from '../../core/services/cause.service';
@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styles: [':host{display:block}'],
})
export class CategoriesComponent {
  readonly nav = inject(CauseService);
}
