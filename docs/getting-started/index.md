---
title: Getting Started
description: Your journey to provisioning bare metal infrastructure with Colony
sidebar_position: 1
---

## Welcome to Colony

Colony makes it easy to manage bare metal infrastructure and deploy Kubernetes clusters on physical hardware. This guide will walk you through the complete setup process, from installation to your first cluster.

## Your Journey

Follow these steps to get up and running with Colony:

### 1. Review Prerequisites

Ensure your environment meets the minimum requirements for running Colony.

- [ ] Hardware: 8GB RAM, 4 CPUs, 64GB disk
- [ ] Network: Layer 2 connectivity, DHCP server, internet access
- [ ] OS: Ubuntu 22.04 or Debian 12
- [ ] Packages: Docker, Git, wget, kubectl

[Review Prerequisites →](./prerequisites.md)

### 2. Install the CLI

Download and install the Colony command-line tool.

- [ ] Download and extract binary
- [ ] Move to `/usr/local/bin`
- [ ] Verify with `colony version`

[Install CLI →](../install/cli.md)

### 3. Create API Key

Get the `colony init` command from [colony.konstruct.io](https://colony.konstruct.io).

- [ ] Log in to Colony UI
- [ ] Navigate to API Keys
- [ ] Click Generate API key
- [ ] Copy the `colony init` command

[Create API Key →](./api-key.md)

### 4. Initialize Management Cluster

Setup colony and its supporting components.

- [ ] Add network interface and IP to the `colony init` command
- [ ] Run `colony init`
- [ ] Export KUBECONFIG
- [ ] Verify pods are running

[Initialize Cluster →](../install/management-cluster.md)

### 5. Discover Assets

Power on your physical hardware to auto-discover on the management network.

- [ ] Collect IPMI addresses and credentials
- [ ] Use `ipmitool` to power on and PXE boot assets
- [ ] Verify assets appear in UI with "available" status
- [ ] Confirm network connectivity

[Discover Assets →](./discover-assets.md)

### 6. Provision Workloads

Choose your deployment path:

**Option A: Provision Ubuntu Hosts**

Install Ubuntu on bare metal for standalone servers.

[Provision Ubuntu →](../assets/provision-ubuntu.md)

**Option B: Create Kubernetes Clusters**

Deploy production-ready clusters on your assets:

- **Civo Stack**: Enterprise: Repurpose your existing datacenter as private cloud
- **K3s**: Lightweight Kubernetes on Ubuntu
- **Talos Linux**: Container Linux for Kubernetes

[Create Clusters →](../clusters/index.md)

## Support Resources

Need help? We're here to support you:

- **Slack Community**: [Join konstructio.slack.com](https://konstructio.slack.com/) for questions and support
- **Documentation**: Browse guides and references in the sidebar
- **Blog**: [Read Colony updates](https://blog.konstruct.io/virtual-data-center/)

## What's Next

Ready to begin? Start with [Prerequisites →](./prerequisites.md)

Already familiar with Colony? Jump to:

- [Cluster Provisioning](../clusters/index.md)
- [Asset Management](../assets/index.md)
