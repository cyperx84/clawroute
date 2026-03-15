import { estimateCost } from './cost.js';
import type { RoutingDecision, RoutingRequest } from './types.js';

export interface RouteTraceEvent {
  schema: 'clawroute.event.v1';
  request_id: string;
  route_id: string;
  agent_id: string;
  task_type: string;
  provider: string;
  model: string;
  status: 'selected';
  estimated_cost_usd: number | null;
  cost_estimate: { min_usd: number; max_usd: number; basis: string };
  reason: string[];
  matched_policies: string[];
  emitted_at: string;
}

export function createSelectionTrace(
  request: RoutingRequest,
  decision: RoutingDecision,
): RouteTraceEvent {
  return {
    schema: 'clawroute.event.v1',
    request_id: request.request_id,
    route_id: decision.selected.route_id,
    agent_id: request.agent_id,
    task_type: request.task_type,
    provider: decision.selected.provider,
    model: decision.selected.model,
    status: 'selected',
    estimated_cost_usd: decision.budget.max_cost_usd ?? null,
    cost_estimate: estimateCost(decision.selected.model, request.context_size),
    reason: decision.reason,
    matched_policies: decision.matched_policies,
    emitted_at: new Date().toISOString(),
  };
}
