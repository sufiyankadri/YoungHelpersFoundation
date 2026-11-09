import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
describe('Controllable mission carousel', () => {
  let fixture: ComponentFixture<HomeComponent>;
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    await TestBed.configureTestingModule({ imports: [HomeComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('starts on the main mission without autoplay and supports manual wraparound', () => {
    const page = fixture.componentInstance;
    expect(page.activeSlide()).toBe(0);
    expect(page.playing()).toBe(false);
    page.selectSlide(-1);
    fixture.detectChanges();
    expect(page.activeSlide()).toBe(2);
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Your time and care',
    );
    page.selectSlide(3);
    expect(page.activeSlide()).toBe(0);
  });
  it('supports next/previous buttons and exposes the selected dot', () => {
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('[aria-label="Next banner slide"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeSlide()).toBe(1);
    expect(root.querySelectorAll('.slider-dots button')[1].getAttribute('aria-pressed')).toBe(
      'true',
    );
    root.querySelector<HTMLButtonElement>('[aria-label="Previous banner slide"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeSlide()).toBe(0);
  });
  it('only rotates on request and stops when the user focuses the banner', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const page = fixture.componentInstance;
    page.toggleSlides();
    expect(page.playing()).toBe(true);
    vi.advanceTimersByTime(8000);
    expect(page.activeSlide()).toBe(1);
    (fixture.nativeElement as HTMLElement)
      .querySelector('.banner-hero')!
      .dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(page.playing()).toBe(false);
    vi.advanceTimersByTime(16000);
    expect(page.activeSlide()).toBe(1);
  });
  it('disables autoplay when reduced motion is requested and cleans up timers on selection', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    const page = fixture.componentInstance;
    page.reduceMotion.set(true);
    page.toggleSlides();
    expect(page.playing()).toBe(false);
    page.reduceMotion.set(false);
    page.toggleSlides();
    page.selectSlide(2);
    vi.advanceTimersByTime(16000);
    expect(page.activeSlide()).toBe(2);
    expect(page.playing()).toBe(false);
  });
});
