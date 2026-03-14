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

const args = process.argv.slice(2);
const traceMode = args.includes('--trace');
const jsonArg = args.find((arg) => !arg.startsWith('--'));
const request: RoutingRequest = jsonArg ? JSON.parse(jsonArg) : sampleRequest();
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
