import { strict as assert } from 'node:assert';
import test from 'node:test';
import { resolvePolicyPreferredRoutes, sortPoliciesByPriority, strictestPolicyBudget } from '../src/policy.js';
import type { Policy } from '../src/types.js';

const policies: Policy[] = [
  {
    schema: 'clawroute.policy.v1',
    id: 'low-priority',
    priority: 10,
    match: {},
    route: { preferred: ['a'], max_cost_usd: 0.5 },
  },
  {
    schema: 'clawroute.policy.v1',
    id: 'high-priority',
    priority: 90,
    match: {},
    route: { preferred: ['b'], max_cost_usd: 0.2 },
  },
];

test('policies sort by descending priority', () => {
  const sorted = sortPoliciesByPriority(policies);
  assert.equal(sorted[0]?.id, 'high-priority');
  assert.equal(sorted[1]?.id, 'low-priority');
});

test('preferred routes resolve in policy priority order', () => {
  const routes = resolvePolicyPreferredRoutes(policies);
  assert.deepEqual(routes, ['b', 'a']);
});

test('strictest policy budget wins', () => {
  const budget = strictestPolicyBudget(policies);
  assert.equal(budget, 0.2);
});
