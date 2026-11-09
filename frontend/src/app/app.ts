import { Component, effect, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CauseService } from './core/services/cause.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DonateModalComponent } from './shared/components/donate-modal/donate-modal.component';
import { HomeComponent } from './features/home/home.component';
import { CausesComponent } from './features/causes/causes.component';
import { CalculatorComponent } from './features/calculator/calculator.component';
import { VolunteerComponent } from './features/volunteer/volunteer.component';
import { CategoriesComponent } from './features/discovery/categories.component';
import { CategoryComponent } from './features/discovery/category.component';
import { CauseDetailComponent } from './features/discovery/cause-detail.component';
import { InfoComponent } from './features/discovery/info.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    DonateModalComponent,
    HomeComponent,
    CausesComponent,
    CalculatorComponent,
    VolunteerComponent,
    CategoriesComponent,
    CategoryComponent,
    CauseDetailComponent,
    InfoComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly causeService = inject(CauseService);
  private title = inject(Title);
  private meta = inject(Meta);
  constructor() {
    effect(() => {
      const view = this.causeService.activeTab();
      const title =
        view === 'home'
          ? 'Livelihoods & the ₹100/month mission'
          : view === 'cause'
            ? (this.causeService.selectedCause()?.title ?? 'Example not found')
            : view === 'category'
              ? (this.causeService.programmes.find((p) => p.id === this.causeService.categoryId())
                  ?.name ?? 'Programme')
              : view === 'info'
                ? this.causeService.infoPage().replaceAll('-', ' ')
                : view === 'causes'
                  ? 'Explore illustrative causes'
                  : view === 'categories'
                    ? 'Programme guides'
                    : view;
      this.title.setTitle(title + ' | Young Helpers Foundation');
      this.meta.updateTag({
        name: 'description',
        content:
          'Helping unemployed people build a livelihood. Explore the voluntary ₹100/month mission, programme guides and clearly labelled illustrative causes.',
      });
      document.documentElement.lang = 'en';
    });
  }
}
