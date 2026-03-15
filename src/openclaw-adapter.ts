/**
 * OpenClaw adapter for ClawRoute.
 *
 * This module shows how OpenClaw core (or any calling system) would integrate
 * ClawRoute into a request pipeline.
 *
 * Usage pattern:
 *   1. Before model invocation, build a RoutingRequest from session context.
 *   2. Call routeForSession() to get a RoutingDecision.
 *   3. Use decision.selected to pick provider/model.
 *   4. On completion/failure, call emitCompletionEvent() for observability.
 */

import { createSelectionTrace } from './trace.js';
import { routeRequest } from './router.js';
import type {
  CostMode,
  PrivacyMode,
  RoutingDecision,
  RoutingRequest,
  TaskType,
} from './types.js';

export interface OpenClawSessionContext {
  agentId: string;
  sessionId: string;
  channel?: string;
  taskType: TaskType;
  toolKind?: string;
  contextSize: 'small' | 'medium' | 'large';
  capabilitiesRequired: string[];
  privacyMode: PrivacyMode;
  costMode: CostMode;
  userOverride?: string | null;
}

export interface CompletionEvent {
  requestId: string;
  routeId: string;
  status: 'success' | 'failure' | 'retry';
  latencyMs: number;
  tokensUsed?: number;
  actualCostUsd?: number;
  errorCode?: string;
}

let _requestCounter = 0;
function generateRequestId(agentId: string): string {
  return `req_${agentId}_${Date.now()}_${++_requestCounter}`;
}

/**
 * Primary integration point for OpenClaw.
 * Call this before selecting a model for any agent task.
 */
export function routeForSession(ctx: OpenClawSessionContext): RoutingDecision {
  const request: RoutingRequest = {
    schema: 'clawroute.routing-request.v1',
    request_id: generateRequestId(ctx.agentId),
    agent_id: ctx.agentId,
    session_id: ctx.sessionId,
    task_type: ctx.taskType,
    tool_kind: ctx.toolKind,
    channel: ctx.channel,
    context_size: ctx.contextSize,
    capabilities_required: ctx.capabilitiesRequired,
    privacy_mode: ctx.privacyMode,
    cost_mode: ctx.costMode,
    user_override: ctx.userOverride ?? null,
  };

  return routeRequest(request);
}

/**
 * Emit a completion event after a model invocation resolves.
 * Attach to the trace log for observability and future evaluation.
 */
export function buildCompletionTrace(
  request: RoutingRequest,
  decision: RoutingDecision,
  completion: CompletionEvent,
) {
  const selectionTrace = createSelectionTrace(request, decision);
  return {
    ...selectionTrace,
    completion: {
      status: completion.status,
      latency_ms: completion.latencyMs,
      tokens_used: completion.tokensUsed ?? null,
      actual_cost_usd: completion.actualCostUsd ?? null,
      error_code: completion.errorCode ?? null,
      completed_at: new Date().toISOString(),
    },
  };
}
