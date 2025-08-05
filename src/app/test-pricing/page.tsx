// Quick test of the tier-based pricing system
import { calculateProgramTuition, getCostPerCreditForTier, formatCurrency } from '@/lib/pricing';

console.log('Testing tier-based pricing system...');

// Test Tier 1 program (60 credits)
const tier1Cost = calculateProgramTuition(1, 60);
const tier1PerCredit = getCostPerCreditForTier(1);

console.log(`Tier 1 (60 credits): ${formatCurrency(tier1Cost!)} | ${formatCurrency(tier1PerCredit!)}/credit`);

// Test Tier 2 program (45 credits)
const tier2Cost = calculateProgramTuition(2, 45);
const tier2PerCredit = getCostPerCreditForTier(2);

console.log(`Tier 2 (45 credits): ${formatCurrency(tier2Cost!)} | ${formatCurrency(tier2PerCredit!)}/credit`);

export default function TestPricing() {
  return (
    <div className="p-4">
      <h1>Pricing System Test</h1>
      <p>Check console for pricing calculations</p>
    </div>
  );
}
