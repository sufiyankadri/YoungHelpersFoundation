import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { Cause, FaqItem, ImpactStat } from '../models/cause.model';
import {
  PUBLIC_EXAMPLES,
  PROGRAMMES,
  CatalogueQuery,
  Collection,
  DEFAULT_QUERY,
  selectCatalogue,
} from '../models/public-catalogue';
export type NavigationTab =
  | 'home'
  | 'causes'
  | 'categories'
  | 'category'
  | 'cause'
  | 'info'
  | 'calculator'
  | 'rozgaar'
  | 'about'
  | 'volunteer'
  | 'transparency'
  | 'faq'
  | 'apply'
  | 'admin';
export type CauseCategoryFilter = 'all' | 'rozgaar' | 'medical' | 'education' | 'emergency';
const views: NavigationTab[] = [
  'home',
  'causes',
  'categories',
  'category',
  'cause',
  'info',
  'calculator',
  'rozgaar',
  'about',
  'volunteer',
  'transparency',
  'faq',
  'apply',
  'admin',
];
export const INFO_PAGES = [
  'about',
  'advisory',
  'council',
  'legal',
  'audit',
  'process',
  'dashboard',
  'policies',
  'faq',
  'contact',
] as const;
@Injectable({ providedIn: 'root' })
export class CauseService {
  readonly activeTab = signal<NavigationTab>('home');
  readonly selectedCategory = signal<CauseCategoryFilter>('all');
  readonly categoryId = signal('rozgaar');
  readonly selectedSlug = signal('');
  readonly infoPage = signal<string>('about');
  readonly causes = signal<Cause[]>(PUBLIC_EXAMPLES);
  readonly examples = PUBLIC_EXAMPLES;
  readonly programmes = PROGRAMMES;
  readonly query = signal<CatalogueQuery>({ ...DEFAULT_QUERY });
  readonly filteredCauses = computed(() =>
    this.causes().filter(
      (c) => this.selectedCategory() === 'all' || c.category === this.selectedCategory(),
    ),
  );
  readonly catalogue = computed(() => selectCatalogue(this.examples, this.query()));
  readonly activeRozgaarCase = computed(
    () => this.causes().find((c) => c.category === 'rozgaar') || this.causes()[0],
  );
  readonly selectedCause = computed(
    () => this.examples.find((c) => c.slug === this.selectedSlug()) ?? null,
  );
  readonly stats = signal<ImpactStat[]>([]);
  readonly faqs = signal<FaqItem[]>([
    {
      q: 'What is the main mission?',
      a: 'Helping unemployed people in our city and nearby communities find a way to earn.',
      category: 'rozgaar',
    },
    {
      q: 'Are online contributions enabled?',
      a: 'No. Amount review does not create a payment or monthly debit.',
      category: 'verification',
    },
  ]);
  readonly expandedFaqIndex = signal<number | null>(0);
  private destroyRef = inject(DestroyRef);
  constructor() {
    this.readLocation();
    const restore = () => this.readLocation();
    window.addEventListener('popstate', restore);
    this.destroyRef.onDestroy(() => window.removeEventListener('popstate', restore));
  }
  navigateTo(tab: NavigationTab): void {
    const aliases: Partial<Record<NavigationTab, NavigationTab>> = {
      rozgaar: 'category',
      about: 'info',
      transparency: 'info',
      faq: 'info',
      admin: 'info',
    };
    if (tab === 'rozgaar') this.categoryId.set('rozgaar');
    if (tab === 'about') this.infoPage.set('about');
    if (tab === 'transparency') this.infoPage.set('audit');
    if (tab === 'faq') this.infoPage.set('faq');
    if (tab === 'admin') this.infoPage.set('contact');
    this.activeTab.set(aliases[tab] ?? tab);
    this.writeLocation();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }
  setCategory(category: CauseCategoryFilter): void {
    this.selectedCategory.set(category);
    this.query.update((q) => ({ ...q, category, page: 1 }));
    if (this.activeTab() === 'causes') this.writeLocation(true);
  }
  openCategory(id: string): void {
    this.categoryId.set(PROGRAMMES.some((p) => p.id === id) ? id : 'rozgaar');
    this.navigateTo('category');
  }
  openCause(slug: string): void {
    this.selectedSlug.set(slug);
    this.navigateTo('cause');
  }
  openInfo(page: string): void {
    this.infoPage.set(INFO_PAGES.includes(page as (typeof INFO_PAGES)[number]) ? page : 'about');
    this.navigateTo('info');
  }
  explore(collection: Collection = 'all', category = 'all'): void {
    this.query.set({ ...DEFAULT_QUERY, collection, category });
    this.selectedCategory.set(category as CauseCategoryFilter);
    this.navigateTo('causes');
  }
  updateQuery(change: Partial<CatalogueQuery>): void {
    this.query.update((q) => ({ ...q, ...change, page: change.page ?? 1 }));
    this.selectedCategory.set(this.query().category as CauseCategoryFilter);
    this.writeLocation(true);
  }
  clearFilters(): void {
    const collection = this.query().collection;
    this.query.set({ ...DEFAULT_QUERY, collection });
    this.selectedCategory.set('all');
    this.writeLocation(true);
  }
  toggleFaq(index: number): void {
    this.expandedFaqIndex.set(this.expandedFaqIndex() === index ? null : index);
  }
  private writeLocation(replace = false): void {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    if (this.activeTab() !== 'home') url.searchParams.set('view', this.activeTab());
    if (this.activeTab() === 'category') url.searchParams.set('category', this.categoryId());
    if (this.activeTab() === 'cause') url.searchParams.set('slug', this.selectedSlug());
    if (this.activeTab() === 'info') url.searchParams.set('page', this.infoPage());
    if (this.activeTab() === 'causes') {
      for (const [key, value] of Object.entries(this.query()))
        if (String(value) !== String(DEFAULT_QUERY[key as keyof CatalogueQuery]))
          url.searchParams.set(key, String(value));
    }
    if (url.href !== window.location.href)
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }
  private readLocation(): void {
    const p = new URLSearchParams(window.location.search);
    const view = p.get('view') as NavigationTab;
    this.activeTab.set(views.includes(view) ? view : 'home');
    const category = p.get('category') ?? 'all';
    this.categoryId.set(PROGRAMMES.some((v) => v.id === category) ? category : 'rozgaar');
    this.selectedSlug.set(p.get('slug') ?? '');
    this.infoPage.set(
      INFO_PAGES.includes(p.get('page') as (typeof INFO_PAGES)[number]) ? p.get('page')! : 'about',
    );
    const collection = p.get('collection') as Collection;
    const page = Number(p.get('page'));
    this.query.set({
      ...DEFAULT_QUERY,
      category: ['all', ...PROGRAMMES.map((v) => v.id)].includes(category) ? category : 'all',
      collection: ['all', 'trending', 'featured', 'latest'].includes(collection)
        ? collection
        : 'all',
      search: (p.get('search') ?? '').slice(0, 200),
      city: ['all', ...this.examples.map((c) => c.location)].includes(p.get('city') ?? '')
        ? p.get('city')!
        : 'all',
      status: ['open', 'completed'].includes(p.get('status') ?? '') ? p.get('status')! : 'all',
      sort: ['newest', 'remaining'].includes(p.get('sort') ?? '') ? p.get('sort')! : 'recommended',
      page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    });
    this.selectedCategory.set(this.query().category as CauseCategoryFilter);
  }
}
