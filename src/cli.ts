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

const input = process.argv[2];
const request: RoutingRequest = input ? JSON.parse(input) : sampleRequest();
const decision = routeRequest(request);
console.log(JSON.stringify(decision, null, 2));
