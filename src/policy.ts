import { estimateMaxCostUsd } from './budget.js';
import type { Policy, RouteTarget, RoutingRequest } from './types.js';

export function matchesPolicy(policy: Policy, request: RoutingRequest): boolean {
  const { match } = policy;
  if (match.agent_id && !match.agent_id.includes(request.agent_id)) return false;
  if (match.task_type && !match.task_type.includes(request.task_type)) return false;
  if (match.cost_mode && !match.cost_mode.includes(request.cost_mode)) return false;
  if (match.privacy_mode && !match.privacy_mode.includes(request.privacy_mode)) return false;
  return true;
}

export function sortPoliciesByPriority(policies: Policy[]): Policy[] {
  return [...policies].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

export function resolvePolicyPreferredRoutes(policies: Policy[]): string[] {
  return sortPoliciesByPriority(policies).flatMap((policy) => policy.route.preferred);
}

export function strictestPolicyBudget(policies: Policy[]): number | undefined {
  const caps = policies
    .map((policy) => policy.route.max_cost_usd)
    .filter((value): value is number => typeof value === 'number');

  if (caps.length === 0) return undefined;
  return Math.min(...caps);
}

export function routeAllowedByPolicyBudget(route: RouteTarget, policies: Policy[]): boolean {
  const cap = strictestPolicyBudget(policies);
  if (typeof cap !== 'number') return true;
  return estimateMaxCostUsd(route) <= cap;
}
