---
title: CLI Reference
description: Complete reference for Colony CLI commands
sidebar_position: 3
---

## Overview

The Colony CLI provides commands for bootstrapping management clusters and discovering assets.

## Installation

See [Install the CLI](../install/cli.md) for installation instructions.

## Commands

### colony init

Initialize a K3s management cluster with Tinkerbell.

```bash
colony init [flags]
```

**Flags**:

- `--api-key string` - Colony API key (required)
- `--load-balancer-interface string` - Network interface for PXE services (required)
- `--load-balancer-ip string` - Static IP for Tinkerbell services (required)

**Example**:

```bash
colony init \
  --api-key $COLONY_API_KEY \
  --load-balancer-interface eth0 \
  --load-balancer-ip 192.168.1.10
```

**What it does**:

1. Installs K3s on local machine
2. Deploys Tinkerbell stack (boots, hegel, rufio, smee, tink-server)
3. Configures networking for PXE boot
4. Registers management cluster with Colony API
5. Starts colony-agent

### colony add-ipmi

Register an asset using IPMI credentials.

```bash
colony add-ipmi [flags]
```

**Flags**:

- `--ip string` - IPMI IP address (required)
- `--username string` - IPMI username (required)
- `--password string` - IPMI password (required)
- `--auto-discover` - Automatically power on and PXE boot asset

**Example**:

```bash
colony add-ipmi \
  --ip 192.168.2.50 \
  --username ADMIN \
  --password secretpass \
  --auto-discover
```

**What it does**:

1. Validates IPMI connectivity
2. Creates hardware resource in Kubernetes
3. If `--auto-discover`: Powers on asset and triggers PXE boot
4. Asset appears in Colony UI as "discovering"

### colony version

Display Colony CLI version.

```bash
colony version
```

**Example output**:

```
Colony CLI version: 0.2.0
Build date: 2024-01-15
Commit: abc123def
```

### colony help

Display help information.

```bash
colony help [command]
```

**Examples**:

```bash
# General help
colony help

# Command-specific help
colony help init
colony help add-ipmi
```

## Environment Variables

### COLONY_API_KEY

API key for authentication.

```bash
export COLONY_API_KEY="your-api-key-here"
colony init --load-balancer-interface eth0 --load-balancer-ip 192.168.1.10
```

### IPMI_USERNAME / IPMI_PASSWORD

IPMI credentials for asset discovery.

```bash
export IPMI_USERNAME=ADMIN
export IPMI_PASSWORD=secretpass
colony add-ipmi --ip 192.168.2.50 --auto-discover
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Network error
- `4` - Authentication error

## Configuration Files

### ~/.colony/config

K3s kubeconfig created by `colony init`.

```bash
export KUBECONFIG=~/.colony/config
kubectl get pods -A
```

## Tips

### Bulk Asset Discovery

Use shell loops for multiple assets:

```bash
for IP in 192.168.2.{50..60}; do
  colony add-ipmi --ip "$IP" --username ADMIN --password pass --auto-discover
  sleep 5
done
```

### Secure Password Handling

Avoid exposing passwords:

```bash
# Read from stdin
read -s IPMI_PASSWORD
export IPMI_PASSWORD
colony add-ipmi --ip 192.168.2.50 --auto-discover

# Or use a secrets file
source ~/.colony-secrets
colony add-ipmi --ip 192.168.2.50 --auto-discover
```

## What's Next

- [Install CLI →](../install/cli.md)
- [Initialize Management Cluster →](../install/management-cluster.md)
- [Discover Assets →](../getting-started/discover-assets.md)
