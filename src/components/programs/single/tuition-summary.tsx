import { 
  calculateProgramTuition, 
  getCostPerCreditForTier, 
  getProgramSemesterBreakdown,
  formatCurrency 
} from '@/lib/pricing';

interface TuitionSummaryProps {
  tier: number;
  credits: number;
  className?: string;
}

interface TuitionBadgeProps {
  tier: number;
  credits: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Comprehensive tuition summary component showing program cost breakdown
 */
export function TuitionSummary({ tier, credits, className = '' }: TuitionSummaryProps) {
  const totalCost = calculateProgramTuition(tier, credits);
  const costPerCredit = getCostPerCreditForTier(tier);
  const semesterBreakdown = getProgramSemesterBreakdown(tier, credits);

  if (!totalCost || !costPerCredit) {
    return <div className={`text-gray-500 ${className}`}>Tuition information not available</div>;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        Tuition Cost (Tier {tier})
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Total Program Cost:</span>
          <span className="text-xl font-bold text-blue-900">{formatCurrency(totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Cost per Credit Hour:</span>
          <span>{formatCurrency(costPerCredit)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Credits:</span>
          <span>{credits}</span>
        </div>
      </div>

      {semesterBreakdown && semesterBreakdown.length > 1 && (
        <div className="border-t border-blue-200 pt-3">
          <h4 className="font-medium text-blue-900 mb-2">Semester Breakdown:</h4>
          <div className="space-y-1">
            {semesterBreakdown.map((semester) => (
              <div key={semester.semester} className="flex justify-between text-sm">
                <span className="text-gray-600">Semester {semester.semester} ({semester.credits} credits):</span>
                <span>{formatCurrency(semester.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact tuition badge for use in cards and lists
 */
export function TuitionBadge({ tier, credits, size = 'md', className = '' }: TuitionBadgeProps) {
  const totalCost = calculateProgramTuition(tier, credits);

  if (!totalCost) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center
      bg-green-100 text-green-800 
      font-medium rounded-full
      ${sizeClasses[size]}
      ${className}
    `}>
      {formatCurrency(totalCost)}
    </span>
  );
}
