export interface TierPricing {
  [tier: number]: number; // Cost per credit for each tier
}

export const pricing2025: TierPricing = {
  1: 307, // Cost per credit for tier 1
  2: 270, // Cost per credit for tier 2
  3: 232, // Cost per credit for tier 3
  4: 194  // Cost per credit for tier 4
};

export function getTuitionCost(tier: number, credits: number, year: number = 2025): number | null {
  const pricingData = getPricingForYear(year);
  
  if (!pricingData || !pricingData[tier] || credits < 1) {
    return null;
  }
  
  return pricingData[tier] * credits;
}

export function getPricingForYear(year: number): TierPricing | null {
  switch (year) {
    case 2025:
      return pricing2025;
    // Add future years here
    // case 2026:
    //   return pricing2026;
    default:
      return pricing2025;
  }
}

export function getCostPerCredit(tier: number, credits: number, year: number = 2025): number | null {
  const totalCost = getTuitionCost(tier, credits, year);
  if (totalCost === null) return null;
  
  return Math.round((totalCost / credits) * 100) / 100; // Round to 2 decimal places
}

export function getCostPerCreditForTier(tier: number, year: number = 2025): number | null {
  const pricingData = getPricingForYear(year);
  
  if (!pricingData || !pricingData[tier]) {
    return null;
  }
  
  return pricingData[tier];
}

export function calculateSpecializationCost(totalCredits: number, tier: number, year: number = 2025): number | null {
  const costPerCredit = getCostPerCreditForTier(tier, year);
  
  if (costPerCredit === null || totalCredits < 1) {
    return null;
  }
  
  return totalCredits * costPerCredit;
}

export function calculateProgramTuitionRange(
  specializations: Array<{ totalCredits: number }>, 
  programTier: number, 
  year: number = 2025
): { min: number; max: number } | null {
  if (!specializations.length || programTier < 1 || programTier > 4) {
    return null;
  }
  
  const costs = specializations.map(spec => 
    calculateSpecializationCost(spec.totalCredits, programTier, year)
  );
  
  // Check if any cost calculation failed
  if (costs.some(cost => cost === null)) {
    return null;
  }
  
  const validCosts = costs as number[];
  
  return {
    min: Math.min(...validCosts),
    max: Math.max(...validCosts)
  };
}

export function calculateProgramTuition(tier: number, totalCredits: number, year: number = 2025): number | null {
  return calculateSpecializationCost(totalCredits, tier, year);
}

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

export function calculateProgramCost(semesters: Array<{ tier: number; credits: number }>, year: number = 2025): number | null {
  let totalCost = 0;

  for (const semester of semesters) {
    const cost = getTuitionCost(semester.tier, semester.credits, year);
    if (cost === null) return null;
    totalCost += cost;
  }

  return totalCost;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}