import { routeAllowedByCostMode } from './budget.js';
import { loadPolicies, loadRoutes } from './loaders.js';
import type { Policy, RouteTarget, RoutingDecision, RoutingRequest } from './types.js';

function matchesPolicy(policy: Policy, request: RoutingRequest): boolean {
  const { match } = policy;
  if (match.agent_id && !match.agent_id.includes(request.agent_id)) return false;
  if (match.task_type && !match.task_type.includes(request.task_type)) return false;
  if (match.cost_mode && !match.cost_mode.includes(request.cost_mode)) return false;
  if (match.privacy_mode && !match.privacy_mode.includes(request.privacy_mode)) return false;
  return true;
}

function supportsRequest(route: RouteTarget, request: RoutingRequest): boolean {
  if (!route.task_types.includes(request.task_type)) return false;
  if (!route.privacy_modes.includes(request.privacy_mode)) return false;
  if (!routeAllowedByCostMode(route, request.cost_mode)) return false;
  return request.capabilities_required.every((cap) => route.capabilities.includes(cap));
}

function dedupeRoutes(routes: RouteTarget[]): RouteTarget[] {
  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.route_id)) return false;
    seen.add(route.route_id);
    return true;
  });
}

export function routeRequest(request: RoutingRequest): RoutingDecision {
  const policies = loadPolicies();
  const routeRegistry = loadRoutes();
  const matchedPolicies = policies.filter((policy) => matchesPolicy(policy, request));
  const preferredRouteIds = matchedPolicies.flatMap((policy) => policy.route.preferred);

  const candidates = dedupeRoutes(
    preferredRouteIds
      .map((id) => routeRegistry.find((route) => route.route_id === id))
      .filter((route): route is RouteTarget => Boolean(route))
      .filter((route) => supportsRequest(route, request)),
  );

  const warnings: string[] = [];
  if (request.privacy_mode === 'local-only') {
    warnings.push('local-only privacy mode requested');
  }
  if (matchedPolicies.length === 0) {
    warnings.push('no explicit policy matched; using capability fallback');
  }

  if (candidates.length === 0) {
    const fallbackCandidates = dedupeRoutes(
      routeRegistry.filter((route) => supportsRequest(route, request)),
    );
    if (fallbackCandidates.length === 0) {
      throw new Error(`No route found for request ${request.request_id}`);
    }
    const [selected, ...fallback] = fallbackCandidates;
    return {
      schema: 'clawroute.routing-decision.v1',
      request_id: request.request_id,
      selected: {
        provider: selected.provider,
        model: selected.model,
        route_id: selected.route_id,
      },
      fallback: fallback.map((route) => ({
        provider: route.provider,
        model: route.model,
        route_id: route.route_id,
      })),
      matched_policies: matchedPolicies.map((policy) => policy.id),
      budget: {
        max_cost_usd: matchedPolicies[0]?.route.max_cost_usd,
        mode: request.cost_mode,
      },
      reason: [
        'fallback-to-capability-match',
        `task_type=${request.task_type}`,
        `privacy_mode=${request.privacy_mode}`,
        `cost_mode=${request.cost_mode}`,
      ],
      warnings,
    };
  }

  const [selected, ...fallback] = candidates;
  return {
    schema: 'clawroute.routing-decision.v1',
    request_id: request.request_id,
    selected: {
      provider: selected.provider,
      model: selected.model,
      route_id: selected.route_id,
    },
    fallback: fallback.map((route) => ({
      provider: route.provider,
      model: route.model,
      route_id: route.route_id,
    })),
    matched_policies: matchedPolicies.map((policy) => policy.id),
    budget: {
      max_cost_usd: matchedPolicies[0]?.route.max_cost_usd,
      mode: request.cost_mode,
    },
    reason: [
      `agent=${request.agent_id}`,
      `task_type=${request.task_type}`,
      `privacy_mode=${request.privacy_mode}`,
      `cost_mode=${request.cost_mode}`,
      `matched_policy_count=${matchedPolicies.length}`,
    ],
    warnings,
  };
}
