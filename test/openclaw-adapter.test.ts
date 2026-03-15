import { strict as assert } from 'node:assert';
import test from 'node:test';
import { routeForSession } from '../src/openclaw-adapter.js';

test('routeForSession returns a valid decision for builder coding', () => {
  const decision = routeForSession({
    agentId: 'builder',
    sessionId: 'sess_adapter_test',
    channel: 'discord',
    taskType: 'coding',
    toolKind: 'exec',
    contextSize: 'medium',
    capabilitiesRequired: ['tools', 'coding'],
    privacyMode: 'standard',
    costMode: 'balanced',
  });
  assert.equal(decision.schema, 'clawroute.routing-decision.v1');
  assert.ok(decision.selected.route_id);
  assert.ok(decision.selected.model);
  assert.ok(Array.isArray(decision.fallback));
});

test('routeForSession respects local-only privacy mode', () => {
  const decision = routeForSession({
    agentId: 'researcher',
    sessionId: 'sess_adapter_private',
    taskType: 'research',
    contextSize: 'medium',
    capabilitiesRequired: [],
    privacyMode: 'local-only',
    costMode: 'cheap',
  });
  assert.equal(decision.selected.route_id, 'local-private');
});
