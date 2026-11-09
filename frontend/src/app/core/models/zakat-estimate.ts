export function moneyToPaise(value: string): bigint {
  const normalized = value.trim() || '0';
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized))
    throw new Error('Use non-negative rupee amounts with up to two decimal places.');
  const [whole, fraction = ''] = normalized.split('.');
  const paise = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (paise > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error('This value is too large for this planning worksheet.');
  return paise;
}
export function planningEstimate(
  assets: string[],
  liability: string,
  threshold: string,
  yearReviewed: boolean,
) {
  if (!threshold.trim())
    throw new Error('Enter a Nisab threshold confirmed for your chosen basis and date.');
  const total = assets.reduce((sum, value) => sum + moneyToPaise(value), 0n);
  const due = moneyToPaise(liability);
  const nisab = moneyToPaise(threshold);
  if (nisab <= 0n) throw new Error('The reviewed Nisab threshold must be greater than zero.');
  if (total > BigInt(Number.MAX_SAFE_INTEGER) || due > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error('The total exceeds this worksheet’s supported range.');
  const net = total > due ? total - due : 0n;
  const belowThreshold = net < nisab;
  return {
    total,
    due,
    net,
    nisab,
    belowThreshold,
    ready: yearReviewed,
    estimate: yearReviewed && !belowThreshold ? (net + 20n) / 40n : 0n,
  };
}
export function formatPaise(value: bigint) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
}
