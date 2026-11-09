import { TestBed } from '@angular/core/testing';
import { CauseService } from './cause.service';
describe('Shareable discovery navigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    TestBed.configureTestingModule({});
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });
  it('opens a category guide and creates a safe shareable query URL', () => {
    const service = TestBed.inject(CauseService);
    service.openCategory('medical');
    expect(service.activeTab()).toBe('category');
    expect(service.categoryId()).toBe('medical');
    expect(new URLSearchParams(window.location.search).get('category')).toBe('medical');
  });
  it('restores an incoming combined Explore URL', () => {
    window.history.replaceState(
      {},
      '',
      '/?view=causes&collection=latest&category=medical&city=Bhopal&search=care&status=open&sort=newest&page=2',
    );
    const service = TestBed.inject(CauseService);
    expect(service.activeTab()).toBe('causes');
    expect(service.query()).toMatchObject({
      collection: 'latest',
      category: 'medical',
      city: 'Bhopal',
      search: 'care',
      status: 'open',
      sort: 'newest',
      page: 2,
    });
    expect(service.catalogue().map((c) => c.slug)).toEqual(['care-journey']);
  });
  it('restores state on browser back/forward events', () => {
    const service = TestBed.inject(CauseService);
    service.explore('featured', 'medical');
    window.history.replaceState({}, '', '/?view=causes&collection=trending&category=emergency');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(service.query().collection).toBe('trending');
    expect(service.query().category).toBe('emergency');
  });
  it('resets pagination when filters change and preserves a selected collection', () => {
    const service = TestBed.inject(CauseService);
    service.explore('latest');
    service.updateQuery({ page: 2 });
    service.updateQuery({ city: 'Bhopal' });
    expect(service.query().page).toBe(1);
    service.clearFilters();
    expect(service.query().collection).toBe('latest');
    expect(service.query().city).toBe('all');
  });
  it('sanitizes unknown query options and never treats a URL as an arbitrary route', () => {
    window.history.replaceState(
      {},
      '',
      '/?view=causes&category=evil&collection=evil&sort=evil&city=evil&page=-1',
    );
    const service = TestBed.inject(CauseService);
    expect(service.query()).toMatchObject({
      category: 'all',
      collection: 'all',
      sort: 'recommended',
      city: 'all',
      page: 1,
    });
    service.openInfo('javascript:alert(1)');
    expect(service.infoPage()).toBe('about');
  });
  it('keeps unknown cause slugs in a not-found state', () => {
    const service = TestBed.inject(CauseService);
    service.openCause('does-not-exist');
    expect(service.selectedCause()).toBeNull();
  });
});
