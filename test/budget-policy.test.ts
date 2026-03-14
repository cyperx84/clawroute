import { strict as assert } from 'node:assert';
import test from 'node:test';
import { routeRequest } from '../src/router.js';
import type { RoutingRequest } from '../src/types.js';

const base: RoutingRequest = {
  schema: 'clawroute.routing-request.v1',
  request_id: 'req_budget',
  agent_id: 'builder',
  session_id: 'sess_budget',
  task_type: 'coding',
  tool_kind: 'exec',
  channel: 'discord',
  context_size: 'medium',
  capabilities_required: ['tools', 'coding'],
  privacy_mode: 'standard',
  cost_mode: 'premium',
  user_override: null,
};

test('strict policy budget can still filter high-cost route in premium mode', () => {
  const decision = routeRequest(base);
  assert.equal(decision.selected.route_id, 'sonnet-fallback');
});

test('explicit route override does not bypass unsupported privacy/capability checks', () => {
  const req: RoutingRequest = {
    ...base,
    request_id: 'req_bad_override',
    task_type: 'research',
    capabilities_required: [],
    privacy_mode: 'local-only',
    cost_mode: 'cheap',
    agent_id: 'researcher',
    user_override: 'route:codex-primary,cost:premium',
  };
  const decision = routeRequest(req);
  assert.notEqual(decision.selected.route_id, 'codex-primary');
});
