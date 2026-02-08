---
title: API Reference
description: Colony REST API endpoints and usage
sidebar_position: 1
---

## Overview

Colony provides a REST API for programmatic access to infrastructure management. The API is used by the Colony agent and can also be accessed directly for automation and integration.

## Base URL

```text
https://colony.konstruct.io/api/v1
```text

## Authentication

All API requests require authentication via API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://colony.konstruct.io/api/v1/assets
```text

See [Create API Key](../getting-started/api-key.md) for obtaining credentials.

## Endpoints

### Assets

**List Assets**:

```text
GET /api/v1/assets
```text

**Get Asset Details**:

```text
GET /api/v1/assets/{id}
```text

**Provision Asset**:

```text
POST /api/v1/assets/{id}/provision
```text

**Wipe Asset**:

```text
POST /api/v1/assets/{id}/wipe
```text

### Clusters

**List Clusters**:

```text
GET /api/v1/clusters
```text

**Create Cluster**:

```text
POST /api/v1/clusters
```text

**Get Cluster Details**:

```text
GET /api/v1/clusters/{id}
```text

**Delete Cluster**:

```text
DELETE /api/v1/clusters/{id}
```text

**Download Kubeconfig**:

```text
GET /api/v1/clusters/{id}/kubeconfig
```text

### Workflows

**List Workflows**:

```text
GET /api/v1/workflows
```text

**Get Workflow Status**:

```text
GET /api/v1/workflows/{id}
```text

## Example Requests

### Create Cluster

```bash
curl -X POST https://colony.konstruct.io/api/v1/clusters \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @cluster-config.json
```text

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
```text

### List Assets

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://colony.konstruct.io/api/v1/assets
```text

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
```text

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
```text

## What's Next

- [Create API Key →](../getting-started/api-key.md)
- [Configuration Options →](./config-options.md)
- [Cluster Provisioning →](../clusters/index.md)
