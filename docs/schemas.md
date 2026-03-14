# Schema Drafts

These are early drafts to force boundary clarity.

## Routing request

```json
{
  "schema": "clawroute.routing-request.v1",
  "request_id": "req_123",
  "agent_id": "builder",
  "session_id": "sess_abc",
  "task_type": "coding",
  "tool_kind": "exec",
  "channel": "discord",
  "context_size": "medium",
  "capabilities_required": ["tools"],
  "privacy_mode": "standard",
  "cost_mode": "balanced",
  "user_override": null
}
```

## Routing decision

```json
{
  "schema": "clawroute.routing-decision.v1",
  "request_id": "req_123",
  "selected": {
    "provider": "openai",
    "model": "openai-codex/gpt-5.4",
    "route_id": "codex-primary"
  },
  "fallback": [
    {
      "provider": "anthropic",
      "model": "anthropic/claude-sonnet-4-6",
      "route_id": "sonnet-fallback"
    }
  ],
  "matched_policies": ["builder-coding-default"],
  "budget": {
    "max_cost_usd": 0.5,
    "mode": "balanced"
  },
  "reason": [
    "agent=builder",
    "task_type=coding",
    "capability_match=tools",
    "preferred_by_policy=builder-coding-default"
  ]
}
```

## Event trace

```json
{
  "schema": "clawroute.event.v1",
  "request_id": "req_123",
  "route_id": "codex-primary",
  "agent_id": "builder",
  "task_type": "coding",
  "provider": "openai",
  "model": "openai-codex/gpt-5.4",
  "started_at": "2026-03-14T06:00:00Z",
  "ended_at": "2026-03-14T06:00:11Z",
  "latency_ms": 11000,
  "status": "success",
  "retries": 0,
  "estimated_cost_usd": 0.13
}
```

## Policy draft

```json
{
  "schema": "clawroute.policy.v1",
  "id": "builder-coding-default",
  "match": {
    "agent_id": ["builder"],
    "task_type": ["coding"]
  },
  "route": {
    "preferred": ["codex-primary", "sonnet-fallback"],
    "max_cost_usd": 0.5,
    "privacy_mode": "standard"
  }
}
```
