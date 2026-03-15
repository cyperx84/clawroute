import { strict as assert } from 'node:assert';
import test from 'node:test';
import { estimateCost, modelKnown } from '../src/cost.js';

test('local model estimates zero cost', () => {
  const est = estimateCost('local/llama', 'medium');
  assert.equal(est.min_usd, 0);
  assert.equal(est.max_usd, 0);
});

test('sonnet estimate is non-zero for medium context', () => {
  const est = estimateCost('anthropic/claude-sonnet-4-6', 'medium');
  assert.ok(est.min_usd > 0);
  assert.ok(est.max_usd > est.min_usd);
});

test('large context costs more than small context', () => {
  const small = estimateCost('anthropic/claude-sonnet-4-6', 'small');
  const large = estimateCost('anthropic/claude-sonnet-4-6', 'large');
  assert.ok(large.max_usd > small.max_usd);
});

test('unknown model returns fallback estimate', () => {
  const est = estimateCost('unknown/model', 'medium');
  assert.equal(est.basis, 'unknown-model-fallback');
  assert.ok(est.max_usd > 0);
});

test('modelKnown returns true for known model', () => {
  assert.ok(modelKnown('anthropic/claude-sonnet-4-6'));
  assert.ok(!modelKnown('fake/model'));
});
