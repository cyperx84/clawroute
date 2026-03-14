import { strict as assert } from 'node:assert';
import test from 'node:test';
import { buildPolicyWarnings } from '../src/diagnostics.js';
import type { Policy, RoutingRequest } from '../src/types.js';

const request: RoutingRequest = {
  schema: 'clawroute.routing-request.v1',
  request_id: 'req_diag',
  agent_id: 'researcher',
  session_id: 'sess_diag',
  task_type: 'research',
  context_size: 'medium',
  capabilities_required: [],
  privacy_mode: 'local-only',
  cost_mode: 'cheap',
  user_override: null,
};

const policies: Policy[] = [
  {
    schema: 'clawroute.policy.v1',
    id: 'p1',
    priority: 10,
    match: {},
    route: { preferred: ['a'], max_cost_usd: 0.2 },
  },
  {
    schema: 'clawroute.policy.v1',
    id: 'p2',
    priority: 80,
    match: {},
    route: { preferred: ['b'], max_cost_usd: 0.1 },
  },
];

test('diagnostics report multi-policy + strictest budget + priority resolution', () => {
  const warnings = buildPolicyWarnings(request, policies);
  assert.ok(warnings.includes('local-only privacy mode requested'));
  assert.ok(warnings.includes('multiple policies matched (2)'));
  assert.ok(warnings.includes('strictest matched policy budget applied (0.1)'));
  assert.ok(warnings.includes('matched policies resolved by priority order'));
});
