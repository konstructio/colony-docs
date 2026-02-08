---
title: API Reference
description: Colony REST API endpoints and usage
sidebar_position: 1
---

## Overview

Colony provides a REST API for programmatic access to infrastructure management. The API is used by the Colony agent and can also be accessed directly for automation and integration.

## Base URL

```
https://colony.konstruct.io/api/v1
```

## Authentication

All API requests require authentication via API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://colony.konstruct.io/api/v1/assets
```

See [Create API Key](../getting-started/api-key.md) for obtaining credentials.

## Endpoints

### Assets

**List Assets**:

```
GET /api/v1/assets
```

**Get Asset Details**:

```
GET /api/v1/assets/{id}
```

**Provision Asset**:

```
POST /api/v1/assets/{id}/provision
```

**Wipe Asset**:

```
POST /api/v1/assets/{id}/wipe
```

### Clusters

**List Clusters**:

```
GET /api/v1/clusters
```

**Create Cluster**:

```
POST /api/v1/clusters
```

**Get Cluster Details**:

```
GET /api/v1/clusters/{id}
```

**Delete Cluster**:

```
DELETE /api/v1/clusters/{id}
```

**Download Kubeconfig**:

```
GET /api/v1/clusters/{id}/kubeconfig
```

### Workflows

**List Workflows**:

```
GET /api/v1/workflows
```

**Get Workflow Status**:

```
GET /api/v1/workflows/{id}
```

## Example Requests

### Create Cluster

```bash
curl -X POST https://colony.konstruct.io/api/v1/clusters \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @cluster-config.json
```

**cluster-config.json**:

```json
{
  "name": "production-cluster",
  "type": "civo_stack",
  "flavor": "talos",
  "gateway": "192.168.1.1",
  "controlPlanes": [
    {
      "assetId": "asset-1",
      "ip": "192.168.1.101",
      "subnet": "24"
    }
  ],
  "workers": [
    {
      "assetId": "asset-2",
      "ip": "192.168.1.201",
      "subnet": "24"
    }
  ],
  "credentials": {
    "gitlabToken": "glpat-xxx",
    "imagePullSecret": "base64-encoded-secret",
    "civoApiToken": "api-token",
    "region": "PHX1"
  }
}
```

### List Assets

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://colony.konstruct.io/api/v1/assets
```

**Response**:

```json
{
  "assets": [
    {
      "id": "asset-1",
      "hostname": "server01",
      "status": "available",
      "ipmi": "192.168.2.50",
      "specs": {
        "cpu": "Intel Xeon",
        "ram": "64GB",
        "disk": "1TB NVMe"
      }
    }
  ]
}
```

## Rate Limits

- **100 requests per minute** per API key
- **1000 requests per hour** per API key

Exceeded limits return HTTP 429 with `Retry-After` header.

## Error Responses

Standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

Error response format:

```json
{
  "error": "Asset not found",
  "code": "ASSET_NOT_FOUND",
  "details": "Asset with ID 'asset-123' does not exist"
}
```

## What's Next

- [Create API Key →](../getting-started/api-key.md)
- [Configuration Options →](./config-options.md)
- [Cluster Provisioning →](../clusters/index.md)
