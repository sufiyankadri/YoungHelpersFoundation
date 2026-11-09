import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CausesComponent } from './causes.component';
import { CauseService } from '../../core/services/cause.service';
describe('Explore page interactions', () => {
  let fixture: ComponentFixture<CausesComponent>;
  let root: HTMLElement;
  let service: CauseService;
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    await TestBed.configureTestingModule({ imports: [CausesComponent] }).compileComponents();
    fixture = TestBed.createComponent(CausesComponent);
    service = TestBed.inject(CauseService);
    service.explore();
    fixture.detectChanges();
    root = fixture.nativeElement;
  });
  afterEach(() => {
    fixture.destroy();
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });
  it('paginates the catalogue and keeps controls in sync', () => {
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(6);
    const next = Array.from(root.querySelectorAll<HTMLButtonElement>('.pagination button')).find(
      (b) => b.textContent?.includes('Next'),
    )!;
    next.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(2);
    expect(root.querySelector('.pagination')?.textContent).toContain('Page 2 of 2');
  });
  it('shows a clear empty state and restores results through reset', () => {
    const input = root.querySelector<HTMLInputElement>('#cause-search')!;
    input.value = 'not-a-record';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(0);
    expect(root.querySelector('.public-empty')).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.public-empty button')!.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(6);
  });
  it('combines controls and opens the selected example detail', () => {
    const select = root.querySelector<HTMLSelectElement>('#programme-filter')!;
    select.value = 'medical';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(2);
    root.querySelector<HTMLButtonElement>('.discovery-link')!.click();
    expect(service.activeTab()).toBe('cause');
    expect(service.selectedCause()?.category).toBe('medical');
  });
  it('keeps filters behind an accessible mobile disclosure without losing state', () => {
    const toggle = root.querySelector<HTMLButtonElement>('.filter-toggle')!;
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    service.updateQuery({ search: 'tools' });
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(service.query().search).toBe('tools');
  });
  it('clamps an out-of-range page in the rendered result list', () => {
    service.updateQuery({ category: 'medical', page: 999 });
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage()).toBe(1);
    expect(root.querySelectorAll('app-cause-card')).toHaveLength(2);
  });
});
