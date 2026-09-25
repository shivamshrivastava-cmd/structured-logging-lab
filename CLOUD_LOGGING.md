# Cloud logging mapping

`orders-api` writes one JSON object per stdout line. Container platforms collect stdout,
so a cloud log service can parse `ts`, `level`, `service`, `msg`, and `reqId` as searchable
fields without parsing a free-form message.

## Google Cloud Logging

Configure the container runtime's logging agent to parse JSON stdout. Query failures with:

```
jsonPayload.level="error" AND jsonPayload.service="orders-api"
```

After copying a `reqId` from an error event, view the complete request with:

```
jsonPayload.reqId="<request-id>"
```

## Grafana Loki

Use a JSON pipeline stage in Promtail or Alloy to extract fields. Keep `service` and `level`
as labels (low cardinality), and query the high-cardinality `reqId` from JSON fields:

```
{service="orders-api", level="error"} | json | reqId="<request-id>"
```

Do not promote `reqId`, customer identifiers, tokens, passwords, or payment data to labels.
The application intentionally logs identifiers only and never logs request bodies or credentials.
