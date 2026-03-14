import { strict as assert } from 'node:assert';
import test from 'node:test';
import { routeRequest } from '../src/router.js';
import type { RoutingRequest } from '../src/types.js';

function baseRequest(): RoutingRequest {
  return {
    schema: 'clawroute.routing-request.v1',
    request_id: 'req_test',
    agent_id: 'builder',
    session_id: 'sess_test',
    task_type: 'coding',
    tool_kind: 'exec',
    channel: 'discord',
    context_size: 'medium',
    capabilities_required: ['tools', 'coding'],
    privacy_mode: 'standard',
    cost_mode: 'balanced',
    user_override: null,
  };
}

test('balanced builder coding prefers budget-allowed route', () => {
  const decision = routeRequest(baseRequest());
  assert.equal(decision.selected.route_id, 'sonnet-fallback');
});

test('premium builder coding still respects strict policy budget', () => {
  const req = { ...baseRequest(), cost_mode: 'premium' as const };
  const decision = routeRequest(req);
  assert.equal(decision.selected.route_id, 'sonnet-fallback');
});

test('local-only research selects local route', () => {
  const req: RoutingRequest = {
    ...baseRequest(),
    request_id: 'req_private',
    agent_id: 'researcher',
    task_type: 'research',
    capabilities_required: [],
    privacy_mode: 'local-only',
    cost_mode: 'cheap',
  };
  const decision = routeRequest(req);
  assert.equal(decision.selected.route_id, 'local-private');
});

test('route override does not bypass strict policy budget', () => {
  const req: RoutingRequest = {
    ...baseRequest(),
    request_id: 'req_override',
    cost_mode: 'premium',
    user_override: 'route:codex-primary',
  };
  const decision = routeRequest(req);
  assert.equal(decision.selected.route_id, 'sonnet-fallback');
});
