import { formatCurrency, getTuitionCost, getAllTierPricing, calculateProgramCost } from "@/lib/pricing";

interface TuitionCalculatorProps {
  credits?: number;
  semesters?: Array<{ credits: number; label: string }>;
  year?: number;
}

export function TuitionCalculator({ credits, semesters, year = 2025 }: TuitionCalculatorProps) {
  // Single semester calculation
  if (credits && !semesters) {
    const allTiers = getAllTierPricing(credits, year);
    
    if (!allTiers) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Invalid credit count (must be 1-15)</p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-3">
          Tuition Options for {credits} Credit{credits !== 1 ? 's' : ''} ({year})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {allTiers.map(({ tier, cost, costPerCredit }) => (
            <div key={tier} className="bg-white rounded p-3 border">
              <div className="text-center">
                <div className="text-sm text-gray-600">Tier {tier}</div>
                <div className="text-lg font-bold text-blue-700">{formatCurrency(cost)}</div>
                <div className="text-xs text-gray-500">{formatCurrency(costPerCredit)}/credit</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          💡 Higher tiers offer lower cost per credit
        </p>
      </div>
    );
  }

  // Multi-semester program calculation
  if (semesters && semesters.length > 0) {
    const totalCredits = semesters.reduce((sum, sem) => sum + sem.credits, 0);
    
    // Calculate costs for each tier across all semesters
    const tierTotals = [1, 2, 3, 4].map(tier => {
      const semesterCosts = semesters.map(semester => {
        const cost = getTuitionCost(tier, semester.credits, year);
        return { ...semester, cost: cost || 0 };
      });
      
      const totalCost = semesterCosts.reduce((sum, sem) => sum + sem.cost, 0);
      
      return {
        tier,
        totalCost,
        semesterCosts,
        avgCostPerCredit: Math.round((totalCost / totalCredits) * 100) / 100
      };
    });

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-3">
          Program Tuition Estimate ({totalCredits} total credits, {year})
        </h3>
        
        {/* Tier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {tierTotals.map(({ tier, totalCost, avgCostPerCredit }) => (
            <div key={tier} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-400 transition-colors">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Tier {tier}</div>
                <div className="text-xl font-bold text-green-700 mb-1">{formatCurrency(totalCost)}</div>
                <div className="text-xs text-gray-500">{formatCurrency(avgCostPerCredit)}/credit avg</div>
              </div>
            </div>
          ))}
        </div>

        {/* Semester Breakdown */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-green-700 hover:text-green-800">
            View Semester Breakdown
          </summary>
          <div className="mt-3 space-y-2">
            {semesters.map((semester, index) => (
              <div key={index} className="bg-white rounded p-3 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{semester.label}</span>
                  <span className="text-sm text-gray-600">{semester.credits} credits</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[1, 2, 3, 4].map(tier => {
                    const cost = getTuitionCost(tier, semester.credits, year);
                    return (
                      <div key={tier} className="text-center p-1 bg-gray-50 rounded">
                        <div className="text-gray-600">T{tier}</div>
                        <div className="font-medium">{formatCurrency(cost || 0)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </details>
        
        <p className="text-xs text-gray-600 mt-3">
          💰 Savings from Tier 1 to Tier 4: {formatCurrency(tierTotals[0].totalCost - tierTotals[3].totalCost)}
        </p>
      </div>
    );
  }

  return null;
}

// Integration component for Kuali degree plans
interface KualiTuitionCalculatorProps {
  degreePlan?: {
    semesters?: Array<{
      label: string;
      credits: number;
    }>;
    totalCredits?: number;
  };
  year?: number;
}

export function KualiTuitionCalculator({ degreePlan, year = 2025 }: KualiTuitionCalculatorProps) {
  if (!degreePlan || !degreePlan.semesters || degreePlan.semesters.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600 text-sm">No semester data available for tuition calculation</p>
      </div>
    );
  }

  return (
    <TuitionCalculator 
      semesters={degreePlan.semesters} 
      year={year}
    />
  );
}
