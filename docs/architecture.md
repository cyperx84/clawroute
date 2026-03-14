# Architecture

## System view

```text
changelogs.info ──▶ capability intelligence
clwatch         ──▶ local compatibility/update signals
clawforge       ──▶ fleet metadata + policy bindings
OpenClaw core   ──▶ routing requests + runtime events
                        │
                        ▼
                   ClawRoute
             ┌──────────┼──────────┐
             ▼          ▼          ▼
         routing     budget      traces
         policy      engine      / audit
```

## Core flow

1. OpenClaw prepares a routing request before model execution
2. ClawRoute classifies the task and loads matching policies
3. Capability registry filters candidate models/providers
4. Budget engine removes routes that violate spend constraints
5. Selector returns a primary route and fallback chain
6. OpenClaw executes the selected route
7. OpenClaw emits completion/failure events for tracing and evals

## Main modules

### 1. Request classifier
Maps requests into categories such as:
- coding
- summarization
- extraction
- research
- orchestration
- vision
- pdf

### 2. Capability registry
Tracks whether a route supports:
- tools
- vision
- PDF
- long context
- local-only
- structured output
- latency/cost classes

### 3. Policy engine
Matches policies on fields like:
- agent id
- task type
- tool kind
- channel
- privacy mode
- user override mode
- context size

### 4. Budget engine
Applies constraints such as:
- per-task max cost
- per-session budget
- daily spend
- premium spend caps

### 5. Selector
Chooses the best route based on:
- policy preference order
- capability match
- budget fit
- latency/cost mode

### 6. Escalation manager
Builds fallback chains for:
- provider failure
- low confidence / low quality outcomes
- timeout
- capability mismatch

### 7. Trace logger
Writes structured decision records for:
- auditability
- observability
- future evaluation
