import { strictestPolicyBudget } from './policy.js';
import type { Policy, RoutingRequest } from './types.js';

export function buildPolicyWarnings(
  request: RoutingRequest,
  matchedPolicies: Policy[],
  existing: string[] = [],
): string[] {
  const warnings = [...existing];

  if (request.privacy_mode === 'local-only') {
    warnings.push('local-only privacy mode requested');
  }
  if (matchedPolicies.length === 0) {
    warnings.push('no explicit policy matched; using capability fallback');
    return dedupeWarnings(warnings);
  }
  if (matchedPolicies.length > 1) {
    warnings.push(`multiple policies matched (${matchedPolicies.length})`);
  }

  const budgets = matchedPolicies
    .map((policy) => policy.route.max_cost_usd)
    .filter((value): value is number => typeof value === 'number');

  if (budgets.length > 1) {
    const strictest = strictestPolicyBudget(matchedPolicies);
    warnings.push(`strictest matched policy budget applied (${strictest})`);
  }

  const priorities = new Set(matchedPolicies.map((policy) => policy.priority ?? 0));
  if (priorities.size > 1) {
    warnings.push('matched policies resolved by priority order');
  }

  return dedupeWarnings(warnings);
}

function dedupeWarnings(warnings: string[]): string[] {
  return [...new Set(warnings)];
}
