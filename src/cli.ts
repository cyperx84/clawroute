import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createSelectionTrace } from './trace.js';
import { routeRequest } from './router.js';
import type { RoutingRequest } from './types.js';

function sampleRequest(): RoutingRequest {
  return {
    schema: 'clawroute.routing-request.v1',
    request_id: 'req_demo_001',
    agent_id: 'builder',
    session_id: 'sess_demo_001',
    task_type: 'coding',
    tool_kind: 'exec',
    channel: 'discord',
    context_size: 'medium',
    capabilities_required: ['tools', 'coding'],
    privacy_mode: 'standard',
    cost_mode: 'balanced',
    user_override: null,
  };
}

function loadJsonFile(path: string): RoutingRequest {
  const fullPath = resolve(process.cwd(), path);
  return JSON.parse(readFileSync(fullPath, 'utf8')) as RoutingRequest;
}

const args = process.argv.slice(2);
const traceMode = args.includes('--trace');
const fileIndex = args.findIndex((arg) => arg === '--file');
const fileArg = fileIndex >= 0 ? args[fileIndex + 1] : undefined;
const jsonArg = args.find((arg, index) => {
  if (arg.startsWith('--')) return false;
  if (fileIndex >= 0 && index === fileIndex + 1) return false;
  return true;
});

const request: RoutingRequest = fileArg
  ? loadJsonFile(fileArg)
  : jsonArg
    ? JSON.parse(jsonArg)
    : sampleRequest();

const decision = routeRequest(request);

if (traceMode) {
  console.log(
    JSON.stringify(
      {
        decision,
        trace: createSelectionTrace(request, decision),
      },
      null,
      2,
    ),
  );
} else {
  console.log(JSON.stringify(decision, null, 2));
}
