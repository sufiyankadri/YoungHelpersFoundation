import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { CauseService } from '../../../core/services/cause.service';

describe('Grouped navigation', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let root: HTMLElement;
  let causes: CauseService;
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    await TestBed.configureTestingModule({ imports: [NavbarComponent] }).compileComponents();
    fixture = TestBed.createComponent(NavbarComponent);
    root = fixture.nativeElement;
    causes = TestBed.inject(CauseService);
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });
  function trigger(label: string): HTMLButtonElement {
    return Array.from(root.querySelectorAll<HTMLButtonElement>('.group-trigger')).find((button) =>
      button.textContent?.includes(label),
    )!;
  }
  it('opens a disclosure and closes the previous group when another is selected', () => {
    trigger('Programs').click();
    fixture.detectChanges();
    expect(trigger('Programs').getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('#submenu-programs')).not.toBeNull();
    trigger('Resources').click();
    fixture.detectChanges();
    expect(trigger('Programs').getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('#submenu-programs')).toBeNull();
    expect(root.querySelector('#submenu-resources')).not.toBeNull();
  });
  it('Escape closes the submenu and restores focus to its disclosure button', () => {
    const button = trigger('Programs');
    button.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('#submenu-programs button')!.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('#submenu-programs')).toBeNull();
    expect(document.activeElement).toBe(button);
  });
  it('ArrowDown opens the submenu and focuses its first destination', async () => {
    trigger('Programs').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(document.activeElement).toBe(root.querySelector('#submenu-programs button'));
  });
  it('a medical destination opens its guide and closes mobile navigation', () => {
    root.querySelector<HTMLButtonElement>('.mobile-toggle')!.click();
    fixture.detectChanges();
    trigger('Programs').click();
    fixture.detectChanges();
    const medical = Array.from(root.querySelectorAll<HTMLButtonElement>('.dropdown-link')).find(
      (button) => button.textContent?.includes('Medical support'),
    )!;
    medical.click();
    fixture.detectChanges();
    expect(causes.activeTab()).toBe('category');
    expect(causes.categoryId()).toBe('medical');
    expect(root.querySelector('.mobile-toggle')!.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('.nav-dropdown')).toBeNull();
  });
  it('Explore causes clears a previous category filter', () => {
    causes.setCategory('medical');
    trigger('Explore').click();
    fixture.detectChanges();
    Array.from(root.querySelectorAll<HTMLButtonElement>('#submenu-explore button'))
      .find((button) => button.textContent?.includes('All causes'))!
      .click();
    expect(causes.selectedCategory()).toBe('all');
    expect(causes.activeTab()).toBe('causes');
  });
  it('closes when a click lands outside the header', () => {
    trigger('Programs').click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(root.querySelector('.nav-dropdown')).toBeNull();
  });
  it('skip navigation preserves a filtered URL and focuses the current main landmark', () => {
    window.history.replaceState({}, '', '/?view=causes&search=tools');
    const main = document.createElement('main'); main.id='main-content'; main.tabIndex=-1; document.body.append(main);
    try {
      root.querySelector<HTMLAnchorElement>('.skip-nav')!.click();
      expect(window.location.search).toBe('?view=causes&search=tools');
      expect(document.activeElement).toBe(main);
    } finally { main.remove(); }
  });
});
