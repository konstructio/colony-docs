---
title: Create API Key
description: Generate authentication credentials for Colony agent
sidebar_position: 3
---

## Overview

An API key is required to authenticate the Colony agent with the hosted Colony API at [colony.konstruct.io](https://colony.konstruct.io). The key allows your management cluster to register hardware, report status, and receive provisioning workflows.

## Purpose of API Key

The API key serves these functions:

- **Agent Authentication**: Validates your management cluster's identity
- **Datacenter Association**: Links assets and clusters to your account
- **Secure Communication**: Encrypts data between management cluster and Colony API
- **Access Control**: Ensures only authorized agents can manage your infrastructure

## Create Your API Key

### Step 1: Log In

1. Navigate to [colony.konstruct.io](https://colony.konstruct.io)
2. Click **Sign In**
3. Choose an OAuth provider:
   - **GitHub**: Sign in with your GitHub account
   - **GitLab**: Sign in with your GitLab account
   - **Google**: Sign in with your Google account

First-time login automatically creates:

- Your user account
- A default datacenter
- A unique datacenter ID

### Step 2: Access API Keys

1. Once logged in, you'll see the Colony dashboard
2. In the left sidebar, click **API Keys**
3. Click **Create New API Key**

### Step 3: Generate Key

1. Click **Generate API key**

2. Copy the `colony init` command containing your API key and datacenter ID, we'll need two more values before we run it

## Use Your API Key

The `colony init` command you copied contains your API key and datacenter ID. You need to add two more parameters before running it:

```bash
colony init \
  --api-key <from-ui> \
  --data-center-id <from-ui> \
  --load-balancer-interface vlan1001 \
  --load-balancer-ip 10.1.1.5
```text

Replace:

- `vlan1001` with your asset management network interface
- `10.1.1.5` with a static IP in the same subnet as your assets for colony to use

Example:

```bash
colony init \
  --api-key cd-c1d1e981b67e_30204cc8faf061722004fe7641ed381b94eae5b5 \
  --data-center-id aa872c72-cbe1-498b-9b83-37a19e578d34 \
  --load-balancer-interface eth0 \
  --load-balancer-ip 192.168.1.10
```text

## API Key Security

### Revoke Compromised Keys

If your API key is exposed:

1. Log in to [colony.konstruct.io](https://colony.konstruct.io)
2. Navigate to **API Keys**
3. Find the compromised key
4. Click **Revoke** or **Delete**
5. Generate a new key immediately
6. Update management cluster configuration with new key

### Key Rotation

To rotate keys:

1. Generate a new API key (don't delete old one yet)
2. Update management cluster with new key
3. Verify agent connects successfully
4. Revoke old API key

This ensures zero downtime during rotation.

## Manage Multiple Datacenters

Each datacenter gets its own API key and agent ID during creation. Generate a separate key for each datacenter you manage.

## Troubleshooting

### Key Not Working

**Symptoms**: Agent fails to authenticate with "invalid API key" error.

**Solutions**:

- Verify you copied the complete key (no truncation)
- Check for extra spaces or newlines in key string
- Ensure key hasn't been revoked in UI
- Try generating a new key
- Check network connectivity to colony.konstruct.io

### Lost API Key

**Symptoms**: Can't find the `colony init` command.

**Solution**: Generate a new key:

1. Log in to [colony.konstruct.io](https://colony.konstruct.io)
2. Navigate to **API Keys**
3. Click **Create New API Key**
4. Copy the new `colony init` command
5. Use it to reinitialize your management cluster

### Agent Can't Reach API

**Symptoms**: Agent logs show "connection refused" or timeout errors.

**Solutions**:

- Verify management cluster has internet access: `curl https://colony.konstruct.io`
- Check firewall allows HTTPS (443) outbound
- Ensure DNS resolves colony.konstruct.io: `nslookup colony.konstruct.io`
- Verify proxy settings if behind corporate proxy
- Check agent logs: `kubectl logs -n colony -l app=colony-agent`

## What's Next

Now that you have your API key:

[Initialize Management Cluster →](../install/management-cluster.md)

Already initialized? Discover your assets:

[Discover Assets →](./discover-assets.md)

## Learn More

- [Management Cluster Setup](../install/management-cluster.md)
- [Asset Discovery](./discover-assets.md)
- [Getting Started Overview](./index.md)

Need help? [Join our Slack community](https://konstructio.slack.com/) for support!
