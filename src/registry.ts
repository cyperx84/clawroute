import type { Policy, RouteTarget } from './types.js';

export const routeRegistry: RouteTarget[] = [
  {
    route_id: 'codex-primary',
    provider: 'openai',
    model: 'openai-codex/gpt-5.4',
    capabilities: ['tools', 'coding'],
    cost_class: 'high',
    privacy_modes: ['standard', 'private'],
    task_types: ['coding', 'orchestration'],
  },
  {
    route_id: 'sonnet-fallback',
    provider: 'anthropic',
    model: 'anthropic/claude-sonnet-4-6',
    capabilities: ['tools', 'coding', 'summarization', 'pdf'],
    cost_class: 'medium',
    privacy_modes: ['standard', 'private'],
    task_types: ['coding', 'summarization', 'research', 'pdf', 'orchestration'],
  },
  {
    route_id: 'glm-cheap',
    provider: 'zai',
    model: 'zai/glm-5',
    capabilities: ['summarization', 'extraction'],
    cost_class: 'low',
    privacy_modes: ['standard'],
    task_types: ['summarization', 'extraction'],
  },
  {
    route_id: 'openrouter-general',
    provider: 'openrouter',
    model: 'openrouter/auto',
    capabilities: ['summarization', 'research', 'orchestration'],
    cost_class: 'medium',
    privacy_modes: ['standard'],
    task_types: ['summarization', 'research', 'orchestration'],
  },
];

export const policies: Policy[] = [
  {
    schema: 'clawroute.policy.v1',
    id: 'builder-coding-default',
    match: {
      agent_id: ['builder'],
      task_type: ['coding'],
    },
    route: {
      preferred: ['codex-primary', 'sonnet-fallback'],
      max_cost_usd: 0.5,
    },
  },
  {
    schema: 'clawroute.policy.v1',
    id: 'cheap-summary-default',
    match: {
      task_type: ['summarization', 'extraction'],
      cost_mode: ['cheap', 'balanced'],
    },
    route: {
      preferred: ['glm-cheap', 'openrouter-general'],
      max_cost_usd: 0.05,
    },
  },
  {
    schema: 'clawroute.policy.v1',
    id: 'research-general-default',
    match: {
      task_type: ['research', 'orchestration'],
    },
    route: {
      preferred: ['openrouter-general', 'sonnet-fallback'],
      max_cost_usd: 0.2,
    },
  },
];
