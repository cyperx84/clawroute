# Roadmap

## Phase 0 — framing
- [x] define repo boundaries
- [x] draft architecture
- [x] draft initial schemas
- [ ] choose implementation language/runtime

## Phase 1 — MVP
- [x] implement model capability registry
- [x] implement policy loader
- [x] implement routing request evaluator
- [x] implement budget checks
- [x] emit routing decision JSON
- [x] add CLI for local testing
- [x] externalize route/policy config
- [x] add initial trace output

## Phase 2 — OpenClaw integration
- [ ] define OpenClaw routing hook contract
- [ ] add example integration docs
- [ ] handle fallback/escalation decisions
- [ ] collect trace events from runtime

## Phase 3 — observability + eval
- [ ] aggregate route decisions
- [ ] compare cost/latency by task class
- [ ] support feedback/eval inputs
- [ ] measure route effectiveness over time

## Phase 4 — ecosystem intelligence
- [ ] ingest capability metadata from changelogs.info
- [ ] ingest local compatibility signals from clwatch
- [ ] add deprecation-aware routing
- [ ] add price-change awareness
