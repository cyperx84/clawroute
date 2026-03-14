import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Policy, RouteTarget } from './types.js';

function readJsonFile<T>(path: string): T {
  const fullPath = resolve(process.cwd(), path);
  return JSON.parse(readFileSync(fullPath, 'utf8')) as T;
}

export function loadRoutes(path = 'config/routes.json'): RouteTarget[] {
  return readJsonFile<RouteTarget[]>(path);
}

export function loadPolicies(path = 'config/policies.json'): Policy[] {
  return readJsonFile<Policy[]>(path);
}
