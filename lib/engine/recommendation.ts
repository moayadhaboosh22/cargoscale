import {
  RecommendationInput,
  RecommendationResult,
  RecommendationStrength,
} from '../types/shipment';
import { compareLclVsFcl } from './comparison';

const LOW_UTILIZATION_THRESHOLD_PERCENT = 15;
const HIGH_CONFIDENCE_UTILIZATION_THRESHOLD_PERCENT = 90;

export function buildRecommendation(input: RecommendationInput): RecommendationResult {
  if (input.cargoSummary.totalPackages === 0) {
    return {
      headline: 'Pending',
      reasons: ['Enter your shipment details to see the recommendation.'],
      warnings: [],
      confidence: 'LOW',
      costComparison: null,
    };
  }

  if (input.freightMode === 'Air') {
    return {
      headline: 'Air Freight (Express / Standard)',
      reasons: ['Chargeable weight is ' + input.chargeableWeightKg.toFixed(2) + ' kg.'],
      warnings: [],
      confidence: 'HIGH',
      costComparison: null,
    };
  }

  if (input.freightMode === 'LCL') {
    const warnings: string[] = [];
    if (input.lclCost === null) {
      warnings.push('Cost comparison unavailable -- enter the required LCL rate.');
    }
    return {
      headline: 'LCL (Less than Container Load)',
      reasons: ['Based on entered cargo volume and weight (revenue ton basis).'],
      warnings,
      confidence: input.lclCost === null ? 'LOW' : 'HIGH',
      costComparison: null,
    };
  }

  // FCL
  const mix = input.containerMix;
  const warnings: string[] = [];

  if (!mix || !mix.feasible) {
    return {
      headline: mix && mix.dimensionalIssue ? 'No suitable container -- dimensional issue' : 'No suitable container',
      reasons: mix ? mix.reasons : ['Unable to generate a container recommendation.'],
      warnings: [],
      confidence: 'LOW',
      costComparison: null,
    };
  }

  const mixText = mix.lines.map((l) => l.count + 'x ' + l.type).join(' + ');
  const headline = 'Recommended Container Mix (' + mixText + ')';
  const reasons = [...mix.reasons];

  const maxUtil = Math.max(mix.volumeUtilizationPercent, mix.payloadUtilizationPercent);
  let confidence: RecommendationStrength = maxUtil >= HIGH_CONFIDENCE_UTILIZATION_THRESHOLD_PERCENT ? 'MEDIUM' : 'HIGH';

  const isLowUtilization =
    mix.totalContainers === 1 &&
    mix.volumeUtilizationPercent > 0 &&
    mix.volumeUtilizationPercent < LOW_UTILIZATION_THRESHOLD_PERCENT;

  if (isLowUtilization) {
    warnings.push(
      'Low utilization: this shipment only uses ' + mix.volumeUtilizationPercent.toFixed(1) + '% of the recommended container\'s volume.'
    );
  }

  let costComparison = null;
  if (input.lclCost && input.fclCost) {
    costComparison = compareLclVsFcl(input.lclCost, input.fclCost);
    if (isLowUtilization && costComparison.recommendedOption === 'LCL' && costComparison.strength !== 'LOW') {
      warnings.push(
        'LCL is estimated cheaper by ' + (costComparison.differenceAmount ? costComparison.differenceAmount.toFixed(2) : '0.00') +
        ' ' + input.lclCost.currency + '; consider switching freight mode.'
      );
      confidence = 'MEDIUM';
    }
  } else if (isLowUtilization) {
    warnings.push('Cost comparison unavailable -- enter both LCL and FCL rates to see whether switching mode would be cheaper.');
  }

  return { headline, reasons, warnings, confidence, costComparison };
}
