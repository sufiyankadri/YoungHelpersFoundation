import { TestBed } from '@angular/core/testing';
import { CauseService } from '../../core/services/cause.service';
import { DonationService } from '../../core/services/donation.service';
import { CauseDetailComponent } from './cause-detail.component';
import { InfoComponent } from './info.component';
import { CategoryComponent } from './category.component';
import { DonateModalComponent } from '../../shared/components/donate-modal/donate-modal.component';
describe('Public detail and evidence boundaries', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });
  it('renders an honest cause detail and switches to the empty updates state', async () => {
    await TestBed.configureTestingModule({ imports: [CauseDetailComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CauseDetailComponent);
    const nav = TestBed.inject(CauseService);
    nav.openCause('workshop-tools');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Not verified for fundraising');
    expect(root.textContent).toContain('example raised');
    Array.from(root.querySelectorAll<HTMLButtonElement>('.detail-tabs button'))
      .find((b) => b.textContent?.includes('Updates'))!
      .click();
    fixture.detectChanges();
    expect(root.querySelector('.detail-story')?.textContent).toContain('No published updates yet.');
  });
  it('renders a helpful not-found view for an invalid cause slug', async () => {
    await TestBed.configureTestingModule({ imports: [CauseDetailComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CauseDetailComponent);
    TestBed.inject(CauseService).openCause('unknown');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('could not be found');
  });
  it('publishes no invented advisory members or tax approvals', async () => {
    await TestBed.configureTestingModule({ imports: [InfoComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InfoComponent);
    const nav = TestBed.inject(CauseService);
    nav.openInfo('advisory');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Appointments and public profiles have not been supplied',
    );
    nav.openInfo('legal');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'No registration, tax entitlement',
    );
  });
  it('connects programme guidance to a prefiltered Explore collection', async () => {
    await TestBed.configureTestingModule({ imports: [CategoryComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CategoryComponent);
    const nav = TestBed.inject(CauseService);
    nav.openCategory('medical');
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.programme-actions .public-button')!
      .click();
    expect(nav.activeTab()).toBe('causes');
    expect(nav.query().category).toBe('medical');
  });
  it('blocks simulated payment capture and displays contribution availability instead', async () => {
    await TestBed.configureTestingModule({ imports: [DonateModalComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DonateModalComponent);
    const service = TestBed.inject(DonationService);
    const receipts = service.recentAdminDonations().length;
    service.openDonateModal();
    service.processDonation();
    fixture.detectChanges();
    expect(service.donationSuccess()).toBe(false);
    expect(service.lastReceiptNumber()).toBe('');
    expect(service.recentAdminDonations()).toHaveLength(receipts);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'No payment has been taken',
    );
    expect((fixture.nativeElement as HTMLElement).querySelector('input')).toBeNull();
  });
  it('resets detail tabs and share feedback when a related record is opened', async () => {
    await TestBed.configureTestingModule({ imports: [CauseDetailComponent] }).compileComponents();
    const fixture=TestBed.createComponent(CauseDetailComponent); const nav=TestBed.inject(CauseService);
    nav.openCause('workshop-tools'); fixture.detectChanges();
    fixture.componentInstance.tab.set('updates'); fixture.componentInstance.shareStatus.set('Example link copied.');
    nav.openCause('tailoring-start'); fixture.detectChanges();
    expect(fixture.componentInstance.tab()).toBe('story');
    expect(fixture.componentInstance.shareStatus()).toBe('');
  });
});
