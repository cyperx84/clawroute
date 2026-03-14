# Roadmap

## Phase 0 — framing
- [x] define repo boundaries
- [x] draft architecture
- [x] draft initial schemas
- [ ] choose implementation language/runtime

## Phase 1 — MVP
- [ ] implement model capability registry
- [ ] implement policy loader
- [ ] implement routing request evaluator
- [ ] implement budget checks
- [ ] emit routing decision JSON
- [ ] add CLI for local testing

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
