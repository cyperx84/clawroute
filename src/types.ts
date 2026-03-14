export type TaskType =
  | 'coding'
  | 'summarization'
  | 'extraction'
  | 'research'
  | 'orchestration'
  | 'vision'
  | 'pdf';

export type CostMode = 'cheap' | 'balanced' | 'premium';
export type PrivacyMode = 'standard' | 'private' | 'local-only';
export type ContextSize = 'small' | 'medium' | 'large';

export interface RoutingRequest {
  schema: 'clawroute.routing-request.v1';
  request_id: string;
  agent_id: string;
  session_id: string;
  task_type: TaskType;
  tool_kind?: string;
  channel?: string;
  context_size: ContextSize;
  capabilities_required: string[];
  privacy_mode: PrivacyMode;
  cost_mode: CostMode;
  user_override?: string | null;
}

export interface RouteTarget {
  route_id: string;
  provider: string;
  model: string;
  capabilities: string[];
  cost_class: 'low' | 'medium' | 'high';
  privacy_modes: PrivacyMode[];
  task_types: TaskType[];
}

export interface Policy {
  schema: 'clawroute.policy.v1';
  id: string;
  priority?: number;
  match: {
    agent_id?: string[];
    task_type?: TaskType[];
    cost_mode?: CostMode[];
    privacy_mode?: PrivacyMode[];
  };
  route: {
    preferred: string[];
    max_cost_usd?: number;
  };
}

export interface RoutingDecision {
  schema: 'clawroute.routing-decision.v1';
  request_id: string;
  selected: {
    provider: string;
    model: string;
    route_id: string;
  };
  fallback: Array<{
    provider: string;
    model: string;
    route_id: string;
  }>;
  matched_policies: string[];
  budget: {
    max_cost_usd?: number;
    mode: CostMode;
  };
  reason: string[];
  warnings?: string[];
}
