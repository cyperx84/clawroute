# OpenClaw Integration Contract (Draft)

## Goal
Allow OpenClaw core to ask ClawRoute for a routing decision before model execution.

## Request flow
1. OpenClaw prepares a `clawroute.routing-request.v1` payload
2. OpenClaw sends it to ClawRoute (library call, subprocess, or HTTP later)
3. ClawRoute returns `clawroute.routing-decision.v1`
4. OpenClaw executes the selected route
5. OpenClaw emits completion/failure events for observability/evals

## Minimum request fields
- `request_id`
- `agent_id`
- `session_id`
- `task_type`
- `context_size`
- `capabilities_required`
- `privacy_mode`
- `cost_mode`
- `user_override`

## Minimum response fields
- selected provider/model/route
- fallback chain
- matched policies
- budget mode + max cost
- decision reasons
- warnings

## Suggested OpenClaw hook points
- before assistant model selection
- before delegated sub-task model selection
- before optional premium escalation
- after completion/failure for trace emission

## Example transport options
- embedded TypeScript library
- local subprocess (`clawroute route <json>`)
- local HTTP daemon later
