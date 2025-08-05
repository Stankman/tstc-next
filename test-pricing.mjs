// Test the new tier-based pricing system
import { 
  calculateProgramTuition, 
  getCostPerCreditForTier, 
  getProgramSemesterBreakdown,
  formatCurrency 
} from './lib/pricing';

console.log('=== Tier-Based Pricing System Test ===');

// Test program: Advanced Manufacturing (Tier 1) with 60 credits
console.log('\n🏭 Advanced Manufacturing Program (Tier 1):');
const tier1Program = {
  tier: 1,
  credits: 60
};

const tier1Cost = calculateProgramTuition(tier1Program.tier, tier1Program.credits);
const tier1PerCredit = getCostPerCreditForTier(tier1Program.tier);
const tier1Breakdown = getProgramSemesterBreakdown(tier1Program.tier, tier1Program.credits);

console.log(`Total Cost: ${formatCurrency(tier1Cost!)}`);
console.log(`Cost per Credit: ${formatCurrency(tier1PerCredit!)}`);
console.log('Semester Breakdown:');
tier1Breakdown?.forEach(semester => {
  console.log(`  Semester ${semester.semester}: ${semester.credits} credits - ${formatCurrency(semester.cost)}`);
});

// Test program: Automotive Technology (Tier 2) with 45 credits  
console.log('\n🚗 Automotive Technology Program (Tier 2):');
const tier2Program = {
  tier: 2,
  credits: 45
};

const tier2Cost = calculateProgramTuition(tier2Program.tier, tier2Program.credits);
const tier2PerCredit = getCostPerCreditForTier(tier2Program.tier);
const tier2Breakdown = getProgramSemesterBreakdown(tier2Program.tier, tier2Program.credits);

console.log(`Total Cost: ${formatCurrency(tier2Cost!)}`);
console.log(`Cost per Credit: ${formatCurrency(tier2PerCredit!)}`);
console.log('Semester Breakdown:');
tier2Breakdown?.forEach(semester => {
  console.log(`  Semester ${semester.semester}: ${semester.credits} credits - ${formatCurrency(semester.cost)}`);
});

// Compare costs
console.log('\n📊 Cost Comparison:');
console.log(`Tier 1 (60 credits): ${formatCurrency(tier1Cost!)} | ${formatCurrency(tier1PerCredit!)}/credit`);
console.log(`Tier 2 (45 credits): ${formatCurrency(tier2Cost!)} | ${formatCurrency(tier2PerCredit!)}/credit`);
console.log(`\nSavings with Tier 2: ${formatCurrency(tier1PerCredit! - tier2PerCredit!)}/credit`);
