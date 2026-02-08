---
title: Cluster Provisioning
description: Deploy Kubernetes clusters on bare metal with Colony
sidebar_position: 1
---

## Overview

Colony supports three cluster types for different use cases. All clusters are provisioned on bare metal hardware through automated workflows that handle operating system installation, Kubernetes deployment, and configuration.

## Cluster Types

### Civo Stack Enterprise

**Complete private cloud on your bare metal**

Transform your datacenter into a full-featured cloud platform. Deploy VMs with live migration, Kubernetes clusters, managed databases, object storage, and serverless workloads - all on your hardware.

[Learn more about Civo Stack Enterprise →](https://www.civo.com/civostack-enterprise)

- **What's included**: VMs, Kubernetes, DBaaS, Object Storage, Block Storage, GPU/AI workloads
- **Enterprise features**: Live VM migration, multi-tenancy, VMware migration tools, 24/7 support
- **Minimum**: 5 assets (3 control planes + 2 workers)
- **Credentials**: Contact your [Civo account manager](https://www.civo.com/contact)

[Documentation →](./civo-stack/index.md) | [Create Cluster →](./civo-stack/create.md)

### K3s

**Lightweight Kubernetes on Ubuntu**

Fast, lightweight Kubernetes distribution running on Ubuntu. Ubuntu is provisioned as part of cluster creation. Ideal for development, edge computing, and resource-constrained environments.

- **Best for**: Development, testing, edge deployments, IoT
- **OS**: Ubuntu 22.04 Jammy (provisioned automatically)
- **Features**: Traefik ingress, CoreDNS, local-path storage included
- **Requirements**: SSH key pair, assets that can PXE boot on the management network

[Learn more →](./k3s/index.md) | [Create K3s Cluster →](./k3s/create.md)

### Talos Linux

**Standard Kubernetes with Talos**

Generic Talos-based Kubernetes without vendor-specific finalization. Provides flexibility for custom configurations and integrations.

- **Best for**: Generic deployments, custom requirements, Talos evaluation
- **OS**: Talos Linux (Container native OS for Kubernetes)
- **Features**: Standard Kubernetes, no vendor lock-in
- **Requirements**: Available assets, network configuration

[Learn more →](./talos/index.md) | [Create Talos Linux Cluster →](./talos/create.md)

## Feature Comparison

| Feature | Civo Stack | K3s | Talos Linux |
|---------|-----------|-----|---------------|
| **OS** | Talos Linux | Ubuntu 22.04 | Talos Linux |
| **Provisioning Time** | 40-60 min | 10-15 min | 10-15 min |
| **Min Assets** | 5 (3 control, 2 workers) | 2 (1 control, 1 worker) | 2 (1 control, 1 worker) |
| **OS Pre-install** | No (PXE boot) | No (PXE boot) | No (PXE boot) |
| **SSH Access** | No (API-managed) | No | No (API-managed) |
| **Credentials** | GitLab, image pull, API token | None | None |
| **CSE Installer** | Yes | No | No |
| **Autopilot Mode** | Yes | No | No |
| **CNI** | Included (CSE) | Included (Flannel) | Manual install |
| **Ingress** | Included (CSE) | Traefik | Manual install |
| **Storage** | Included (CSE) | local-path | Manual install |
| **Updates** | Managed (Talos) | Manual (apt) | Manual (Talos) |
| **Immutability** | Yes | No | Yes |
| **Production Ready** | Yes | Development | Yes |

## Requirements

### All Cluster Types

- [ ] Management cluster running ([initialize here](../install/management-cluster.md))
- [ ] Available assets ([discover here](../getting-started/discover-assets.md))
- [ ] Network configuration (gateway, DNS, NTP)
- [ ] Colony UI or API access

### Additional Requirements by Type

**Civo Stack**:
- [ ] **5 minimum assets** (3 control planes + 2 workers)
- [ ] Civo Stack credentials ([contact your account manager](https://www.civo.com/contact))

**K3s**:
- No additional requirements

**Talos Linux**:
- No additional requirements

## Provisioning Methods

### Colony UI (Recommended)

The web interface provides a guided workflow for cluster creation:

1. Navigate to **Clusters** → **Create Cluster**
2. Complete the form with your configuration
3. Review and create
4. Monitor provisioning progress
5. Download kubeconfig when complete

## After Provisioning

Once your cluster is provisioned:

- **Download kubeconfig**: Access your cluster with kubectl
- **Verify connectivity**: Run `kubectl get nodes` to confirm all nodes are Ready
- **Add more nodes**: Scale your cluster by [adding nodes](./add-nodes.md)
- **Deploy applications**: Use kubectl or Helm to deploy workloads

## Troubleshooting

### Common Issues

**Assets not available**:
- Check asset status in UI (must be "available", not "discovering" or "provisioning")
- Verify IPMI connectivity with `ipmitool -H <ipmi-ip> -I lanplus -U admin -P $PASS power status`
- Ensure assets are powered on and PXE booted

**Provisioning stuck**:
- Check workflow status in Colony UI
- Review colony-agent logs: `kubectl logs -n colony <agent-pod>`
- Verify network connectivity to PXE server
- Check Tinkerbell workflow logs: `kubectl logs -n tinkerbell <pod-name>`

**Cluster not reachable**:
- Verify kubeconfig downloaded correctly
- Check static IPs are pingable from management cluster
- Ensure firewall rules allow API server port (6443)

## What's Next

Choose your cluster type and start provisioning:

- [Civo Stack Cluster →](./civo-stack/create.md)
- [K3s Cluster →](./k3s/create.md)
- [Talos Linux Cluster →](./talos/create.md)
- [Add Nodes to Cluster →](./add-nodes.md)
