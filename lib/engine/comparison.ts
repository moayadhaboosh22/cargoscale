import { CostBreakdown, FreightComparisonResult } from '../types/shipment';

const LOW_CONFIDENCE_DIFFERENCE_PERCENT = 2;

export function compareLclVsFcl(
  lclCost: CostBreakdown | null,
  fclCost: CostBreakdown | null
): FreightComparisonResult {
  if (lclCost === null || fclCost === null) {
    return {
      lclCost,
      fclCost,
      differenceAmount: null,
      recommendedOption: null,
      strength: 'LOW',
      reasons: ['Insufficient pricing data for a reliable financial comparison.'],
    };
  }

  if (!Number.isFinite(lclCost.totalEstimatedCost) || !Number.isFinite(fclCost.totalEstimatedCost)) {
    return {
      lclCost,
      fclCost,
      differenceAmount: null,
      recommendedOption: null,
      strength: 'LOW',
      reasons: ['Insufficient pricing data for a reliable financial comparison.'],
    };
  }

  const differenceAmount = Math.abs(lclCost.totalEstimatedCost - fclCost.totalEstimatedCost);
  const smallerTotal = Math.min(lclCost.totalEstimatedCost, fclCost.totalEstimatedCost);
  const differencePercent = smallerTotal === 0 ? 0 : (differenceAmount / smallerTotal) * 100;

  const recommendedOption: 'LCL' | 'FCL' =
    lclCost.totalEstimatedCost <= fclCost.totalEstimatedCost ? 'LCL' : 'FCL';

  if (differencePercent < LOW_CONFIDENCE_DIFFERENCE_PERCENT) {
    return {
      lclCost,
      fclCost,
      differenceAmount,
      recommendedOption,
      strength: 'LOW',
      reasons: [
        'The cost difference between LCL and FCL is small; other factors (transit time, handling, customs) should be considered.',
      ],
    };
  }

  return {
    lclCost,
    fclCost,
    differenceAmount,
    recommendedOption,
    strength: 'HIGH',
    reasons: [
      recommendedOption + ' is estimated to be cheaper by ' + differenceAmount.toFixed(2) + ' ' + lclCost.currency + ' based on entered rates.',
      'Currency conversion, taxes, duties and local charges are not included unless explicitly entered.',
    ],
  };
}