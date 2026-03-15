/**
 * Cost estimation module.
 *
 * Right now uses known provider pricing snapshots.
 * Later: ingest live pricing from changelogs.info capability payloads.
 */

export interface CostEstimate {
  min_usd: number;
  max_usd: number;
  basis: string;
}

interface ModelPricing {
  input_per_1m: number;
  output_per_1m: number;
}

// Snapshot pricing (USD per 1M tokens) — update as models change
const PRICING: Record<string, ModelPricing> = {
  'openai-codex/gpt-5.4': { input_per_1m: 3.0, output_per_1m: 15.0 },
  'anthropic/claude-sonnet-4-6': { input_per_1m: 3.0, output_per_1m: 15.0 },
  'anthropic/claude-opus-4-6': { input_per_1m: 15.0, output_per_1m: 75.0 },
  'zai/glm-5': { input_per_1m: 0.1, output_per_1m: 0.1 },
  'openrouter/auto': { input_per_1m: 1.0, output_per_1m: 5.0 },
  'local/llama': { input_per_1m: 0.0, output_per_1m: 0.0 },
};

const CONTEXT_TOKENS: Record<'small' | 'medium' | 'large', number> = {
  small: 2_000,
  medium: 20_000,
  large: 100_000,
};

export function estimateCost(
  model: string,
  contextSize: 'small' | 'medium' | 'large',
  estimatedOutputTokens = 1_000,
): CostEstimate {
  const pricing = PRICING[model];
  if (!pricing) {
    return {
      min_usd: 0,
      max_usd: 0.5,
      basis: 'unknown-model-fallback',
    };
  }

  const inputTokens = CONTEXT_TOKENS[contextSize];
  const minOutput = Math.floor(estimatedOutputTokens * 0.5);
  const maxOutput = estimatedOutputTokens * 2;

  const minCost = (inputTokens / 1_000_000) * pricing.input_per_1m + (minOutput / 1_000_000) * pricing.output_per_1m;
  const maxCost = (inputTokens / 1_000_000) * pricing.input_per_1m + (maxOutput / 1_000_000) * pricing.output_per_1m;

  return {
    min_usd: parseFloat(minCost.toFixed(6)),
    max_usd: parseFloat(maxCost.toFixed(6)),
    basis: `snapshot:${model}`,
  };
}

export function modelKnown(model: string): boolean {
  return model in PRICING;
}
