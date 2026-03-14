import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Policy, RouteTarget } from './types.js';
import { validatePolicies, validateRoutes } from './validate.js';

function readJsonFile<T>(path: string): T {
  const fullPath = resolve(process.cwd(), path);
  return JSON.parse(readFileSync(fullPath, 'utf8')) as T;
}

export function loadRoutes(path = 'config/routes.json'): RouteTarget[] {
  return validateRoutes(readJsonFile<RouteTarget[]>(path));
}

export function loadPolicies(path = 'config/policies.json'): Policy[] {
  return validatePolicies(readJsonFile<Policy[]>(path));
}
