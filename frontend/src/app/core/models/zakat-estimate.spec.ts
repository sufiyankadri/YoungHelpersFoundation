import { moneyToPaise, planningEstimate } from './zakat-estimate';
describe('Private planning arithmetic', () => {
  it('parses decimal currency exactly', () => {
    expect(moneyToPaise('123.45')).toBe(12345n);
    expect(moneyToPaise('0.10')).toBe(10n);
    expect(moneyToPaise('')).toBe(0n);
  });
  it.each(['-1', 'NaN', 'Infinity', '1e4', '1.001'])('rejects invalid amount %s', (value) => {
    expect(() => moneyToPaise(value)).toThrow();
  });
  it('does not supply an invented Nisab threshold', () => {
    expect(() => planningEstimate(['100000'], '0', '', true)).toThrow(/threshold/);
    expect(() => planningEstimate(['100000'], '0', '0', true)).toThrow(/greater than zero/);
  });
  it('shows no estimate until the lunar-year condition has been reviewed', () => {
    const result = planningEstimate(['100000'], '0', '10000', false);
    expect(result.ready).toBe(false);
    expect(result.estimate).toBe(0n);
  });
  it('calculates a net 2.5 percent illustration and includes the exact entered threshold', () => {
    const result = planningEstimate(['100000', '20000'], '20000', '100000', true);
    expect(result.net).toBe(10000000n);
    expect(result.belowThreshold).toBe(false);
    expect(result.estimate).toBe(250000n);
  });
  it('returns zero below the entered threshold and never produces negative wealth', () => {
    expect(planningEstimate(['100'], '0', '101', true).estimate).toBe(0n);
    expect(planningEstimate(['100'], '200', '1', true).net).toBe(0n);
  });
  it('rounds to the nearest paise and rejects out-of-range totals', () => {
    expect(planningEstimate(['1.00'], '0', '1', true).estimate).toBe(3n);
    expect(() => moneyToPaise('9999999999999999999999')).toThrow(/large/);
  });
});
