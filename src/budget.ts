import type { CostMode, RouteTarget } from './types.js';

const costRank: Record<RouteTarget['cost_class'], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const modeLimit: Record<CostMode, number> = {
  cheap: 1,
  balanced: 2,
  premium: 3,
};

export function routeAllowedByCostMode(route: RouteTarget, costMode: CostMode): boolean {
  return costRank[route.cost_class] <= modeLimit[costMode];
}

export function estimateMaxCostUsd(route: RouteTarget): number {
  switch (route.cost_class) {
    case 'low':
      return 0.05;
    case 'medium':
      return 0.2;
    case 'high':
      return 0.5;
  }
}
