import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from '../../core/services/cause.service';
import { Collection, CatalogueQuery } from '../../core/models/public-catalogue';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
@Component({
  selector: 'app-causes',
  standalone: true,
  imports: [CommonModule, CauseCardComponent],
  templateUrl: './causes.component.html',
  styles: [':host{display:block}'],
})
export class CausesComponent {
  readonly causeService = inject(CauseService);
  readonly filtersOpen = signal(false);
  readonly pageSize = 6;
  readonly collections: [Collection, string, string][] = [
    ['all', 'All causes', 'Explore the catalogue'],
    ['trending', 'Trending', 'Example activity order'],
    ['featured', 'Featured', 'Editorial preview selection'],
    ['latest', 'Latest', 'Newest example publication'],
  ];
  readonly cities = [...new Set(this.causeService.examples.map((c) => c.location))].sort();
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.causeService.catalogue().length / this.pageSize)),
  );
  readonly currentPage = computed(() => Math.min(this.causeService.query().page, this.pageCount()));
  readonly results = computed(() =>
    this.causeService
      .catalogue()
      .slice((this.currentPage() - 1) * this.pageSize, this.currentPage() * this.pageSize),
  );
  readonly activeFilters = computed(() => {
    const q = this.causeService.query();
    return [q.search, q.category !== 'all', q.city !== 'all', q.status !== 'all'].filter(Boolean)
      .length;
  });
  toggleFilters() {
    this.filtersOpen.update((value) => !value);
  }
  setCollection(collection: Collection) {
    this.causeService.updateQuery({ collection, sort: 'recommended' });
  }
  change(key: 'search' | 'category' | 'city' | 'status' | 'sort', event: Event) {
    this.causeService.updateQuery({
      [key]: (event.target as HTMLInputElement).value,
    } as Partial<CatalogueQuery>);
  }
  page(value: number) {
    this.causeService.updateQuery({ page: value });
    document
      .getElementById('explore-results')
      ?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
  }
}
