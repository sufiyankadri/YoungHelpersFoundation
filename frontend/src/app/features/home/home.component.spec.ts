import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DonationService } from '../../core/services/donation.service';
import { CauseService } from '../../core/services/cause.service';

describe('Monthly livelihood mission', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let root: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });
  afterEach(() => fixture.destroy());
  function button(selector: string): HTMLButtonElement { return root.querySelector<HTMLButtonElement>(selector)!; }
  it('connects the main English hero action to the monthly mission and starts at 100 rupees', () => {
    expect(root.querySelector('.banner-hero h1')?.textContent).toContain('Helping unemployed people');
    expect(root.querySelector('.banner-primary')?.getAttribute('href')).toBe('#monthly-mission');
    expect(root.querySelector('#monthly-mission')).not.toBeNull();
    expect(button('.mission-presets button').getAttribute('aria-pressed')).toBe('true');
  });
  it('reviews a larger amount without issuing a receipt, selecting a fund or changing fundraising totals', () => {
    const donations = TestBed.inject(DonationService);
    const causes = TestBed.inject(CauseService);
    const fundBefore = donations.selectedFundType();
    const recordsBefore = donations.recentAdminDonations().length;
    const totalsBefore = causes.causes().map(cause => cause.raisedAmount);
    (root.querySelectorAll('.mission-presets button')[2] as HTMLButtonElement).click();
    button('.mission-contribute').click();
    fixture.detectChanges();
    expect(root.querySelector('.mission-review')?.textContent).toContain('₹500');
    expect(root.querySelector('.mission-review')?.textContent).toContain('No payment has been taken');
    expect(donations.selectedFundType()).toBe(fundBefore);
    expect(donations.recentAdminDonations()).toHaveLength(recordsBefore);
    expect(donations.donationSuccess()).toBe(false);
    expect(donations.isModalOpen()).toBe(false);
    expect(causes.causes().map(cause => cause.raisedAmount)).toEqual(totalsBefore);
  });
  it('rejects a nonpositive custom amount and accepts a valid larger amount', () => {
    (root.querySelectorAll('.mission-presets button')[3] as HTMLButtonElement).click();
    fixture.detectChanges();
    const input = root.querySelector<HTMLInputElement>('#mission-custom-amount')!;
    input.value = '-1'; input.dispatchEvent(new Event('input'));
    button('.mission-contribute').click(); fixture.detectChanges();
    expect(root.querySelector('.mission-error')).not.toBeNull();
    expect(root.querySelector('.mission-review')).toBeNull();
    input.value = '1234'; input.dispatchEvent(new Event('input'));
    button('.mission-contribute').click(); fixture.detectChanges();
    expect(root.querySelector('.mission-error')).toBeNull();
    expect(root.querySelector('.mission-review')?.textContent).toContain('₹1,234');
  });
  it('clears an old review when the amount changes', () => {
    button('.mission-contribute').click(); fixture.detectChanges();
    expect(root.querySelector('.mission-review')).not.toBeNull();
    (root.querySelectorAll('.mission-presets button')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(root.querySelector('.mission-review')).toBeNull();
    expect(root.querySelector('.mission-payment-note')?.textContent).toContain('not an automatic subscription');
  });
});
