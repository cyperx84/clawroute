# ClawRoute

> Runtime routing, policy, and budget control for OpenClaw.

ClawRoute is the missing control-plane layer for OpenClaw: it decides which model/provider should handle a task, why, under what budget, and what fallback path to take if the first choice fails.

## Why

OpenClaw can run agents and tools. ClawForge can manage fleets. changelogs.info + clwatch can track the ecosystem.

What is still missing is a runtime decision layer:

- route each task to the right model/provider
- enforce budget and policy constraints
- support privacy/locality modes
- explain routing decisions
- emit traces for observability and evaluation

## Scope

ClawRoute is responsible for:

- task-aware model/provider routing
- policy evaluation
- budget enforcement
- fallback/escalation chains
- routing decision traces
- model capability registry

ClawRoute is **not** responsible for:

- executing model calls itself
- replacing OpenClaw runtime/session management
- replacing ClawForge fleet lifecycle management
- replacing changelogs.info or clwatch

## Architecture

```text
OpenClaw core
  ├─ sends routing request
  ├─ receives routing decision
  └─ emits runtime events

ClawRoute
  ├─ classifier
  ├─ capability registry
  ├─ policy engine
  ├─ budget engine
  ├─ selector
  ├─ escalation manager
  └─ trace logger
```

## Initial MVP

- schema-first design
- static rule-based routing
- capability-aware selection
- external JSON route/policy config
- cost-mode filtering
- privacy-aware route filtering
- fallback chains
- JSON decision traces
- simple CLI/API surface

## Quick start

```bash
npm install
npm run route
npm run route -- --trace
```

Pass a request JSON string:

```bash
npm run route -- '{
  "schema":"clawroute.routing-request.v1",
  "request_id":"req_2",
  "agent_id":"builder",
  "session_id":"sess_2",
  "task_type":"coding",
  "context_size":"medium",
  "capabilities_required":["tools","coding"],
  "privacy_mode":"standard",
  "cost_mode":"balanced"
}'
```

## Example use cases

- Builder agent doing code edits prefers Codex, falls back to Sonnet
- Research agent with long context prefers Gemini/long-context-capable models
- Cheap summary tasks stay under a per-task spend cap
- Sensitive tasks use local-only or provider-allowlisted routes

## Planned docs

- `docs/vision.md`
- `docs/architecture.md`
- `docs/schemas.md`
- `docs/roadmap.md`

## Status

Early scaffold. Defining boundaries, schemas, and MVP.
