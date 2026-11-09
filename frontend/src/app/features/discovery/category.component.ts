import { Component, computed, inject } from '@angular/core';
import { CauseService } from '../../core/services/cause.service';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CauseCardComponent],
  templateUrl: './category.component.html',
  styles: [':host{display:block}'],
})
export class CategoryComponent {
  readonly nav = inject(CauseService);
  readonly programme = computed(() =>
    this.nav.programmes.find((p) => p.id === this.nav.categoryId())!,
  );
  readonly examples = computed(() =>
    this.nav.examples.filter((c) => c.category === this.programme().id).slice(0, 3),
  );
}
