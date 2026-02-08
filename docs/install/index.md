---
title: Installation
description: Install Colony CLI and initialize your management cluster
sidebar_position: 1
---

## Overview

Installing Colony involves three main steps:

1. **Install the CLI** - Download the Colony command-line tool
2. **Create API Key** - Get the `colony init` command from colony.konstruct.io
3. **Initialize Management Cluster** - Setup colony and its supporting components

## Installation Steps

### Step 1: Install the CLI

The Colony CLI is required to bootstrap your management cluster and discover assets.

[Install the CLI →](./cli.md)

**Quick install**:

```bash
# Download and extract
curl -fsSL https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.4/colony_Linux_x86_64.tar.gz | tar xz

# Verify
colony version

# Move to PATH
sudo mv colony /usr/local/bin/
```

### Step 2: Create API Key

Get your `colony init` command from colony.konstruct.io.

[Create API Key →](../getting-started/api-key.md)

**Quick summary**:

1. Log in to [colony.konstruct.io](https://colony.konstruct.io)
2. Navigate to **API Keys**
3. Click **Generate API key**
4. Copy the `colony init` command

### Step 3: Initialize Management Cluster

After installing the CLI and getting your API key, create your K3s management cluster with Tinkerbell.

[Initialize Management Cluster →](./management-cluster.md)

**Quick init**:

```bash
colony init \
  --api-key <from-ui> \
  --data-center-id <from-ui> \
  --load-balancer-interface eth0 \
  --load-balancer-ip 192.168.1.10

export KUBECONFIG=~/.colony/config
```

## Prerequisites

Before installing, ensure you have:

- [ ] Ubuntu 22.04 or Debian 12
- [ ] Docker installed and running
- [ ] Root/sudo access
- [ ] 8 GB RAM, 4 CPUs, 64 GB disk
- [ ] Network interface for asset management
- [ ] Colony API key ([create one](../getting-started/api-key.md))

See [Prerequisites](../getting-started/prerequisites.md) for detailed requirements.

## Next Steps

After installation:

1. **[Discover Assets](../getting-started/discover-assets.md)** - Register your physical hardware
2. **[Create Clusters](../clusters/index.md)** - Deploy Kubernetes on bare metal

## Get Help

- **Documentation**: Browse guides in the sidebar
- **Slack Community**: [Join konstructio.slack.com](https://konstructio.slack.com/)
- **Blog**: [Read our Colony blog post](https://blog.konstruct.io/virtual-data-center/)

## What's Next

Continue your journey:

[Install the CLI →](./cli.md)
