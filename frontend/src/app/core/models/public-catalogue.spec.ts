import { DEFAULT_QUERY, PUBLIC_EXAMPLES, PROGRAMMES, selectCatalogue } from './public-catalogue';
describe('Public discovery rules', () => {
  it('limits the directory to the three approved programme areas', () => {
    expect(PROGRAMMES.map((p) => p.id)).toEqual(['rozgaar', 'medical', 'emergency']);
    expect(PUBLIC_EXAMPLES.every((c) => PROGRAMMES.some((p) => p.id === c.category))).toBe(true);
  });
  it('combines programme, city and text search', () => {
    const result = selectCatalogue(PUBLIC_EXAMPLES, {
      ...DEFAULT_QUERY,
      category: 'medical',
      city: 'Bhopal',
      search: 'CARE',
    });
    expect(result.map((c) => c.slug)).toEqual(['care-journey']);
  });
  it('trims case-insensitive searches and supports location matching', () => {
    expect(
      selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, search: '  TAILORING  ' }).map(
        (c) => c.slug,
      ),
    ).toEqual(['tailoring-start']);
    expect(
      selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, search: 'Lucknow' }).every(
        (c) => c.location === 'Lucknow',
      ),
    ).toBe(true);
  });
  it('keeps Featured limited to editorial examples', () => {
    const result = selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, collection: 'featured' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.featured)).toBe(true);
  });
  it('orders Latest by publication date and Trending by disclosed sample activity', () => {
    expect(
      selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, collection: 'latest' })[0].slug,
    ).toBe('short-term-stability');
    expect(
      selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, collection: 'trending' })[0].slug,
    ).toBe('tailoring-start');
  });
  it('combines status filtering with ascending remaining budgets without mutating source records', () => {
    const before = PUBLIC_EXAMPLES.map((c) => c.slug);
    const result = selectCatalogue(PUBLIC_EXAMPLES, {
      ...DEFAULT_QUERY,
      status: 'open',
      sort: 'remaining',
    });
    expect(result.every((c) => c.status === 'open')).toBe(true);
    expect(result.map((c) => c.targetAmount - c.raisedAmount)).toEqual(
      [...result.map((c) => c.targetAmount - c.raisedAmount)].sort((a, b) => a - b),
    );
    expect(PUBLIC_EXAMPLES.map((c) => c.slug)).toEqual(before);
  });
  it('returns no results for an unmatched search', () => {
    expect(
      selectCatalogue(PUBLIC_EXAMPLES, { ...DEFAULT_QUERY, search: 'no-such-programme' }),
    ).toEqual([]);
  });
});
