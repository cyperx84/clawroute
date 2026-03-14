import type { RouteTarget, RoutingRequest } from './types.js';

export interface ParsedOverride {
  routeId?: string;
  provider?: string;
  model?: string;
  costMode?: RoutingRequest['cost_mode'];
  privacyMode?: RoutingRequest['privacy_mode'];
}

export function parseOverride(input: string | null | undefined): ParsedOverride {
  if (!input) return {};
  const parts = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const parsed: ParsedOverride = {};
  for (const part of parts) {
    const [rawKey, ...rest] = part.split(':');
    const key = rawKey.trim();
    const value = rest.join(':').trim();
    if (!key || !value) continue;
    if (key === 'route') parsed.routeId = value;
    if (key === 'provider') parsed.provider = value;
    if (key === 'model') parsed.model = value;
    if (key === 'cost') parsed.costMode = value as RoutingRequest['cost_mode'];
    if (key === 'privacy') parsed.privacyMode = value as RoutingRequest['privacy_mode'];
  }
  return parsed;
}

export function applyRequestOverride(request: RoutingRequest): RoutingRequest {
  const parsed = parseOverride(request.user_override);
  return {
    ...request,
    cost_mode: parsed.costMode ?? request.cost_mode,
    privacy_mode: parsed.privacyMode ?? request.privacy_mode,
  };
}

export function routeMatchesOverride(route: RouteTarget, override: ParsedOverride): boolean {
  if (override.routeId && route.route_id !== override.routeId) return false;
  if (override.provider && route.provider !== override.provider) return false;
  if (override.model && route.model !== override.model) return false;
  return true;
}
