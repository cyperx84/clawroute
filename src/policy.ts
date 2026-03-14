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

export function routeAllowedByPolicyBudget(route: RouteTarget, policies: Policy[]): boolean {
  const caps = policies
    .map((policy) => policy.route.max_cost_usd)
    .filter((value): value is number => typeof value === 'number');

  if (caps.length === 0) return true;

  const strictestCap = Math.min(...caps);
  return estimateMaxCostUsd(route) <= strictestCap;
}
