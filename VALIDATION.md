# Structured logging validation evidence

## Before

The original container emitted unstructured strings such as:

```text
starting
connecting...
connected
error happened
```

Those lines have no timestamp, level, service, or request correlation value.

## After: failure trace

Run the following after building the updated container:

```bash
docker compose up -d --build
curl -i localhost:3000/simulate-error
docker logs orders-api | jq 'select(.level=="error")'
docker logs orders-api | jq 'select(.reqId=="<failing-request-id>")'
```

Captured output from a local application run (the UUID is generated per request):

```json
{"ts":"2026-09-25T07:25:57.706Z","level":"info","service":"orders-api","msg":"request.start","reqId":"553391da-31b9-4fb5-a070-a7d01719b1ba","method":"GET","path":"/simulate-error"}
{"ts":"2026-09-25T07:25:57.707Z","level":"error","service":"orders-api","msg":"request.simulated_failure","reqId":"553391da-31b9-4fb5-a070-a7d01719b1ba","errorName":"Error","errorMessage":"Simulated failure"}
{"ts":"2026-09-25T07:25:57.713Z","level":"info","service":"orders-api","msg":"request.complete","reqId":"553391da-31b9-4fb5-a070-a7d01719b1ba","method":"GET","path":"/simulate-error","statusCode":500,"durationMs":7}
```

The `level` query isolates the failure immediately; copying its `reqId` into the second
query returns its start, error, and completion events even while other requests interleave.
