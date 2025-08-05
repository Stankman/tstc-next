// Pricing structure for TSTC tuition - 2025
// 4 tiers with pricing for 1-15 credits each
// Higher tiers = lower cost per credit

export interface PricingTier {
  [credits: number]: number; // credits -> price
}

export interface PricingStructure {
  [tier: number]: PricingTier; // tier -> pricing
}

// 2025 Pricing Data
export const pricing2025: PricingStructure = {
  1: {
    1: 307, 2: 614, 3: 921, 4: 1228, 5: 1535,
    6: 1842, 7: 2149, 8: 2456, 9: 2763, 10: 3070,
    11: 3377, 12: 3684, 13: 3991, 14: 4298, 15: 4605
  },
  2: {
    1: 270, 2: 540, 3: 810, 4: 1080, 5: 1350,
    6: 1620, 7: 1890, 8: 2160, 9: 2430, 10: 2700,
    11: 2970, 12: 3240, 13: 3510, 14: 3780, 15: 4050
  },
  3: {
    1: 232, 2: 464, 3: 696, 4: 928, 5: 1160,
    6: 1392, 7: 1624, 8: 1856, 9: 2088, 10: 2320,
    11: 2552, 12: 2784, 13: 3016, 14: 3248, 15: 3480
  },
  4: {
    1: 194, 2: 388, 3: 582, 4: 776, 5: 970,
    6: 1164, 7: 1358, 8: 1552, 9: 1746, 10: 1940,
    11: 2134, 12: 2328, 13: 2522, 14: 2716, 15: 2910
  }
};

// Utility functions to work with pricing data

/**
 * Get the cost for a specific tier and credit count
 */
export function getTuitionCost(tier: number, credits: number, year: number = 2025): number | null {
  const pricingData = getPricingForYear(year);
  
  if (!pricingData || !pricingData[tier] || !pricingData[tier][credits]) {
    return null;
  }
  
  return pricingData[tier][credits];
}

/**
 * Get pricing data for a specific year
 */
export function getPricingForYear(year: number): PricingStructure | null {
  switch (year) {
    case 2025:
      return pricing2025;
    // Add future years here
    // case 2026:
    //   return pricing2026;
    default:
      return pricing2025; // fallback to 2025
  }
}

/**
 * Calculate cost per credit for a tier
 */
export function getCostPerCredit(tier: number, credits: number, year: number = 2025): number | null {
  const totalCost = getTuitionCost(tier, credits, year);
  if (totalCost === null) return null;
  
  return Math.round((totalCost / credits) * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate total tuition cost for a program based on its tier and total credits
 */
export function calculateProgramTuition(tier: number, totalCredits: number, year: number = 2025): number | null {
  if (!tier || tier < 1 || tier > 4 || totalCredits < 1) return null;
  
  // For programs with more than 15 credits, calculate in chunks
  if (totalCredits <= 15) {
    return getTuitionCost(tier, totalCredits, year);
  }
  
  // For larger programs, calculate per semester (assuming 15 credits max per semester)
  const fullSemesters = Math.floor(totalCredits / 15);
  const remainingCredits = totalCredits % 15;
  
  let totalCost = 0;
  
  // Calculate cost for full semesters
  const semesterCost = getTuitionCost(tier, 15, year);
  if (semesterCost === null) return null;
  totalCost += semesterCost * fullSemesters;
  
  // Calculate cost for remaining credits
  if (remainingCredits > 0) {
    const remainingCost = getTuitionCost(tier, remainingCredits, year);
    if (remainingCost === null) return null;
    totalCost += remainingCost;
  }
  
  return totalCost;
}

/**
 * Get cost per credit for a specific tier
 */
export function getCostPerCreditForTier(tier: number, year: number = 2025): number | null {
  // Use 1 credit to get the base cost per credit for this tier
  return getTuitionCost(tier, 1, year);
}

/**
 * Get all semester breakdown options for a program
 */
export function getProgramSemesterBreakdown(tier: number, totalCredits: number, year: number = 2025): Array<{ semester: number; credits: number; cost: number }> | null {
  if (!tier || tier < 1 || tier > 4 || totalCredits < 1) return null;
  
  const semesters = [];
  let remainingCredits = totalCredits;
  let semesterNumber = 1;
  
  while (remainingCredits > 0) {
    const creditsThisSemester = Math.min(remainingCredits, 15);
    const cost = getTuitionCost(tier, creditsThisSemester, year);
    
    if (cost === null) return null;
    
    semesters.push({
      semester: semesterNumber,
      credits: creditsThisSemester,
      cost
    });
    
    remainingCredits -= creditsThisSemester;
    semesterNumber++;
  }
  
  return semesters;
}

/**
 * Calculate total cost for multiple semesters
 */
export function calculateProgramCost(semesters: Array<{ tier: number; credits: number }>, year: number = 2025): number | null {
  let totalCost = 0;

  for (const semester of semesters) {
    const cost = getTuitionCost(semester.tier, semester.credits, year);
    if (cost === null) return null;
    totalCost += cost;
  }

  return totalCost;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Example usage and testing
export function exampleUsage() {
  console.log('=== TSTC Tuition Pricing Examples ===');
  
  // Get cost for 12 credits in tier 3
  const cost = getTuitionCost(3, 12);
  console.log(`12 credits in tier 3: ${formatCurrency(cost!)}`);
  
  // Calculate program cost for Advanced Manufacturing (Tier 1, 60 credits)
  const programCost = calculateProgramTuition(1, 60);
  console.log(`Advanced Manufacturing (Tier 1, 60 credits): ${formatCurrency(programCost!)}`);
  
  // Get cost per credit for tier 3
  const costPerCredit = getCostPerCreditForTier(3);
  console.log(`Cost per credit in tier 3: ${formatCurrency(costPerCredit!)}`);
  
  // Show semester breakdown for a 45-credit program in tier 2
  const breakdown = getProgramSemesterBreakdown(2, 45);
  console.log('\nSemester breakdown for 45-credit tier 2 program:');
  breakdown!.forEach(semester => {
    console.log(`  Semester ${semester.semester}: ${semester.credits} credits - ${formatCurrency(semester.cost)}`);
  });
  
  const totalBreakdownCost = breakdown!.reduce((sum, semester) => sum + semester.cost, 0);
  console.log(`  Total: ${formatCurrency(totalBreakdownCost)}`);
}
