# structured-logging-lab

This repository contains a simple Orders API application for the DevOps Foundation assignment: Implementing Structured Logging for Debugging (LU 5.3).

## Setup

```bash
docker compose up -d
```

## View Logs

```bash
docker logs orders-api
```

Each application log line is JSON with `ts`, `level`, `service`, and `msg` fields.
Request logs also include a unique `reqId`; see [VALIDATION.md](VALIDATION.md) for the
error-tracing commands and [CLOUD_LOGGING.md](CLOUD_LOGGING.md) for cloud query mappings.

## Trigger Error

```bash
curl localhost:3000/simulate-error
```
