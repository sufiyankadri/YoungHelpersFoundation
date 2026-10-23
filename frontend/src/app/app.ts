import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService } from './core/services/cause.service';
import { DonationService } from './core/services/donation.service';
import { ApplicationService } from './core/services/application.service';

// Shared Components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DonateModalComponent } from './shared/components/donate-modal/donate-modal.component';

// Feature Components
import { HomeComponent } from './features/home/home.component';
import { CausesComponent } from './features/causes/causes.component';
import { RozgaarComponent } from './features/rozgaar/rozgaar.component';
import { CalculatorComponent } from './features/calculator/calculator.component';
import { AboutComponent } from './features/about/about.component';
import { VolunteerComponent } from './features/volunteer/volunteer.component';
import { TransparencyComponent } from './features/transparency/transparency.component';
import { FaqComponent } from './features/faq/faq.component';
import { ApplyComponent } from './features/apply/apply.component';
import { AdminComponent } from './features/admin/admin.component';

/**
 * Root Application Component acting as an orchestrator for modular feature views,
 * navigation header, footer, and universal donation modal.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    DonateModalComponent,
    HomeComponent,
    CausesComponent,
    RozgaarComponent,
    CalculatorComponent,
    AboutComponent,
    VolunteerComponent,
    TransparencyComponent,
    FaqComponent,
    ApplyComponent,
    AdminComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(
    public causeService: CauseService,
    public donationService: DonationService,
    public applicationService: ApplicationService
  ) {}
}
