---
title: Configuration Options
description: Reference for Colony configuration parameters
sidebar_position: 2
---

## Overview

This reference documents configuration options for Colony CLI, management clusters, and provisioned clusters.

## Colony Init Configuration

### Required Parameters

```bash
colony init \
  --api-key STRING \
  --load-balancer-interface STRING \
  --load-balancer-ip STRING
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--api-key` | Colony API authentication key | `col_abc123...` |
| `--load-balancer-interface` | Network interface for PXE services | `eth0`, `ens192` |
| `--load-balancer-ip` | Static IP for Tinkerbell TFTP/HTTP | `192.168.1.10` |

### Optional Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--k3s-version` | `latest` | Specific K3s version to install |
| `--skip-k3s-install` | `false` | Skip K3s installation (if already installed) |

## Cluster Configuration

### Common Parameters (All Cluster Types)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Cluster name (lowercase, alphanumeric, hyphens) |
| `type` | enum | Yes | `civo_stack` or `k8s_stack` |
| `flavor` | enum | Yes | `talos` or `k3s` |
| `gateway` | string | Yes | Network gateway IP |
| `extraSANs` | string | No | Additional API server SANs (comma-separated) |

### Node Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assetId` | string | Yes | Hardware asset identifier |
| `ip` | string | Yes | Static IP address for node |
| `subnet` | string | Yes | Network prefix (e.g., `24` for /24) |
| `dns` | string | Yes | DNS servers (comma-separated) |
| `ntp` | string | Yes | NTP servers (comma-separated) |
| `diskDevice` | string | Yes | Disk device path (e.g., `/dev/sda`) |

### Civo Stack Specific

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gitlabToken` | string | Yes | GitLab personal access token |
| `imagePullSecret` | string | Yes | Base64-encoded Docker config JSON |
| `civoApiToken` | string | Yes | Civo API authentication token |
| `region` | string | Yes | Datacenter region (e.g., `PHX1`) |
| `cseInstallerImage` | string | No | CSE installer image (default: `latest`) |

### K3s Specific

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sshPublicKey` | string | Yes | SSH public key for kbot user |

## Network Configuration

### DNS Servers

Common options:

- **Google**: `8.8.8.8,8.8.4.4`
- **Cloudflare**: `1.1.1.1,1.0.0.1`
- **Quad9**: `9.9.9.9,149.112.112.112`
- **Custom**: Your internal DNS servers

### NTP Servers

Common options:

- **Cloudflare**: `time.cloudflare.com`
- **Google**: `time.google.com`
- **NTP Pool**: `0.pool.ntp.org,1.pool.ntp.org,2.pool.ntp.org`
- **Custom**: Your internal NTP servers

### Disk Devices

Common values:

- **SATA/SCSI**: `/dev/sda`, `/dev/sdb`
- **NVMe**: `/dev/nvme0n1`, `/dev/nvme1n1`
- **Virtio (VMs)**: `/dev/vda`, `/dev/vdb`

:::warning
Specify the correct disk device. Wrong device can result in data loss or failed provisioning.
:::

## Environment Variables

### Colony CLI

| Variable | Description | Example |
|----------|-------------|---------|
| `COLONY_API_KEY` | API authentication key | `col_abc123...` |
| `IPMI_USERNAME` | Default IPMI username | `ADMIN` |
| `IPMI_PASSWORD` | Default IPMI password | `secretpass` |

### Management Cluster

| Variable | Description | Example |
|----------|-------------|---------|
| `KUBECONFIG` | Path to kubeconfig | `~/.colony/config` |

## Talos Machine Config

For advanced Talos configuration, you can customize machine configs after provisioning:

```bash
# Get current config
talosctl --talosconfig ~/.talos/config get machineconfig -n <node-ip>

# Edit and apply
talosctl --talosconfig ~/.talos/config apply-config \
  --nodes <node-ip> \
  --file custom-config.yaml
```

## K3s Configuration

For K3s clusters, customize via `/etc/rancher/k3s/config.yaml` on nodes:

```yaml
# /etc/rancher/k3s/config.yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "cluster.example.com"
disable:
  - traefik  # Disable if using custom ingress
```

## Resource Requirements

### Management Cluster

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Disk | 64 GB | 128 GB |

### Cluster Nodes

**Control Planes**:

| Cluster Type | Min CPU | Min RAM | Min Disk |
|--------------|---------|---------|----------|
| Civo Stack | 4 cores | 8 GB | 64 GB |
| K3s | 2 cores | 4 GB | 32 GB |
| Talos Linux | 4 cores | 8 GB | 64 GB |

**Workers**:

| Cluster Type | Min CPU | Min RAM | Min Disk |
|--------------|---------|---------|----------|
| Civo Stack | 4 cores | 16 GB | 128 GB |
| K3s | 2 cores | 4 GB | 64 GB |
| Talos Linux | 4 cores | 16 GB | 128 GB |

## What's Next

- [API Reference →](./api.md)
- [Cluster Provisioning →](../clusters/index.md)
- [Troubleshooting →](../guides/troubleshooting.md)
