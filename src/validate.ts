import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import type { Policy, RouteTarget, RoutingDecision, RoutingRequest } from './types.js';

const ajv = new Ajv2020({ allErrors: true });

function loadSchema(path: string) {
  const fullPath = resolve(process.cwd(), path);
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

const requestSchema = loadSchema('schemas/routing-request.schema.json');
const decisionSchema = loadSchema('schemas/routing-decision.schema.json');
const policySchema = loadSchema('schemas/policy.schema.json');
const routeSchema = loadSchema('schemas/route.schema.json');

const validateRequestSchema = ajv.compile<RoutingRequest>(requestSchema);
const validateDecisionSchema = ajv.compile<RoutingDecision>(decisionSchema);
const validatePolicySchema = ajv.compile<Policy>(policySchema);
const validateRouteSchema = ajv.compile<RouteTarget>(routeSchema);

export function validateRoutingRequest(input: unknown): RoutingRequest {
  if (!validateRequestSchema(input)) {
    throw new Error(`Invalid routing request: ${ajv.errorsText(validateRequestSchema.errors)}`);
  }
  return input as RoutingRequest;
}

export function validateRoutingDecision(input: unknown): RoutingDecision {
  if (!validateDecisionSchema(input)) {
    throw new Error(`Invalid routing decision: ${ajv.errorsText(validateDecisionSchema.errors)}`);
  }
  return input as RoutingDecision;
}

export function validatePolicies(input: unknown): Policy[] {
  if (!Array.isArray(input)) {
    throw new Error('Policies config must be an array');
  }
  input.forEach((policy, index) => {
    if (!validatePolicySchema(policy)) {
      throw new Error(`Invalid policy at index ${index}: ${ajv.errorsText(validatePolicySchema.errors)}`);
    }
  });
  return input as Policy[];
}

export function validateRoutes(input: unknown): RouteTarget[] {
  if (!Array.isArray(input)) {
    throw new Error('Routes config must be an array');
  }
  input.forEach((route, index) => {
    if (!validateRouteSchema(route)) {
      throw new Error(`Invalid route at index ${index}: ${ajv.errorsText(validateRouteSchema.errors)}`);
    }
  });
  return input as RouteTarget[];
}
