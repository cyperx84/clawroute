# Vision

ClawRoute gives OpenClaw an economic and policy-aware control plane.

## Problem

Most agent systems use static defaults for model selection. That leads to:

- overpaying for simple tasks
- under-powering complex tasks
- poor handling of privacy/locality needs
- hidden routing decisions
- weak fallback behavior
- no consistent budget control

## Thesis

Agents need a runtime router the way distributed systems need a load balancer.

Not just a prompt layer. An execution policy layer.

## Product statement

Route each task to the cheapest model that can reliably do it, while respecting policy, budget, capability, privacy, and human override constraints.

## Principles

1. **Explainable over magical** — decisions should be inspectable
2. **Policy-first** — humans stay in control
3. **Cheap by default** — escalate only when warranted
4. **Capability-aware** — don't route tasks to models that can't do them
5. **Separable from runtime** — integrate deeply with OpenClaw without bloating core
6. **Observable** — every decision leaves a trace
7. **Local/privacy aware** — routing must respect data boundaries

## Ecosystem fit

- OpenClaw: runtime execution
- ClawForge: fleet lifecycle and policy assignment UX
- changelogs.info: capability and ecosystem intelligence
- clwatch: local impact and update awareness
- ClawRoute: runtime decision layer
