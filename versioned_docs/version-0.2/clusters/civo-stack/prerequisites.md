---
title: Civo Stack Prerequisites
description: Requirements for creating Civo Stack clusters
sidebar_position: 2
---

## Overview

Before creating a Civo Stack cluster, ensure you have all required assets, credentials, and network configuration ready.

## Assets

**Minimum 5 assets required:**

- **3 control plane nodes** - High availability Kubernetes control plane
- **2 worker nodes** - Distributed storage (Mayastor/CEPH) requires minimum 2 workers

Each asset must:

- Be in **"available"** status (auto-discovered)
- Have 32+ GB RAM, 24+ CPU cores, 1TB+ disk
- Support PXE boot on the management network

Check asset status in Colony UI under **Assets** tab.

## Credentials

### Civo Stack Access

Civo Stack requires credentials for accessing private GitLab repositories and container registries. Contact your Civo account manager to obtain:

- **GitLab Personal Access Token**: Access to Civo Stack repositories
- **Image Pull Secret**: Base64-encoded Docker config for gcr.io or private registry
- **Civo API Token**: Authentication for Civo services
- **Region Identifier**: Your datacenter region (e.g., `PHX1`, `NYC3`)

:::warning
Keep credentials secure. Store in password manager or secrets management system. Never commit to source control.
:::

### Credential Format

**GitLab Token**:

```text
glpat-xxxxxxxxxxxxxxxxxxxx
```text

**Image Pull Secret** (base64-encoded Docker config):

```text
eyJhdXRocyI6eyJnY3IuaW8iOnsidXNlcm5hbWUiOiJfanNvbl9rZXki...
```text

**Civo API Token**:

```text
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```text

**Region**:

```text
PHX1
```text

## Network Configuration

### Required Information

- [ ] **Gateway IP**: Default route for cluster nodes (e.g., `192.168.1.1`)
- [ ] **DNS Servers**: Comma-separated list (e.g., `8.8.8.8,8.8.4.4`)
- [ ] **NTP Servers**: Time synchronization (e.g., `time.cloudflare.com`)
- [ ] **Static IPs**: One per node (control planes + workers)
- [ ] **Subnet Mask**: Network prefix (e.g., `/24` for 255.255.255.0)

### Network Requirements

- **Layer 2 connectivity**: All nodes on same broadcast domain
- **DHCP available**: For initial PXE boot (static IPs assigned after)
- **Internet access**: Nodes must reach container registries, package repos
- **Firewall rules**: Allow inter-node traffic on all ports

:::info
Talos uses specific ports for cluster communication:

- **6443**: Kubernetes API server
- **50000**: Talos API (apid)
- **50001**: Talos trustd
- **Flannel/CNI**: UDP 8472 (VXLAN), UDP 4789 (Geneve)

:::

### Network Topology Example

```text
Internet
    |
Gateway (192.168.1.1)
    |
Management Network (192.168.1.0/24)
    |
    +-- Management Cluster (192.168.1.10)
    +-- Control Plane 1 (192.168.1.101)
    +-- Control Plane 2 (192.168.1.102)
    +-- Control Plane 3 (192.168.1.103)
    +-- Worker 1 (192.168.1.201)
    +-- Worker 2 (192.168.1.202)
```text

## CSE Installer Image

### Default Image

Colony uses the latest Civo Stack Engine installer image by default:

```text
ghcr.io/civo/cse-installer:latest
```text

### Custom Image (Optional)

If your Civo account manager provides a specific CSE version:

```text
ghcr.io/civo/cse-installer:v1.2.3
```text

:::tip
Use the default `latest` tag unless instructed otherwise. The installer is version-aware and selects appropriate component versions.
:::

## Management Cluster

- [ ] Management cluster initialized ([setup guide](../../install/management-cluster.md))
- [ ] Colony agent running: `kubectl get pods -n colony`
- [ ] Tinkerbell services healthy: `kubectl get pods -n tinkerbell`
- [ ] KUBECONFIG exported: `export KUBECONFIG=~/.colony/config`

## Colony UI Access

- [ ] Logged in to [colony.konstruct.io](https://colony.konstruct.io)
- [ ] API key created and saved
- [ ] Datacenter visible in UI
- [ ] Assets showing in Assets tab

## Pre-Flight Checklist

Before proceeding to cluster creation, verify:

- [ ] 2+ assets in "available" status
- [ ] Civo Stack credentials obtained (contact account manager)
- [ ] Network information documented (gateway, DNS, NTP, static IPs)
- [ ] Management cluster running and accessible
- [ ] Colony UI accessible with datacenter visible

## What's Next

All prerequisites met? You're ready to create your cluster:

[Create Civo Stack Cluster →](./create.md)

Need help obtaining credentials? Contact your Civo account manager or [join our Slack community](https://konstructio.slack.com/).
