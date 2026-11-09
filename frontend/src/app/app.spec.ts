import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Public application shell', () => {
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });
  it('renders an accessible main landmark and full-width homepage banner', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('main#main-content')).not.toBeNull();
    expect(root.querySelector('.banner-hero h1')?.textContent).toContain(
      'Helping unemployed people',
    );
    expect(root.querySelector('.banner-hero .banner-image')).not.toBeNull();
  });
  it('renders three program pathways below the banner', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('.pathways-grid .pathway')).toHaveLength(3);
    expect(root.querySelectorAll('.overview-grid .overview-card')).toHaveLength(3);
  });
  it('boots a programme deep link on a static host', async () => {
    window.history.replaceState({}, '', '/?view=category&category=medical');
    const fixture=TestBed.createComponent(App); await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Medical support');
  });
  it('does not collect private application data before intake is enabled', async () => {
    window.history.replaceState({}, '', '/?view=apply');
    const fixture=TestBed.createComponent(App); await fixture.whenStable();
    const root=fixture.nativeElement as HTMLElement;
    expect(root.querySelector('main')?.textContent).toContain('Applications are not open online yet.');
    expect(root.querySelector('main input')).toBeNull();
  });
});
