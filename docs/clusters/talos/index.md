---
title: Talos Linux Clusters
description: Standard Kubernetes with Talos Linux for generic deployments
sidebar_position: 3
---

# Talos Linux Clusters

## What is Talos Linux?

Talos Linux provides standard Kubernetes without vendor-specific components. It's a clean, immutable OS managed entirely via API - no SSH, no shell, no package manager. Perfect for secure, reproducible Kubernetes deployments with full control over networking, storage, and add-ons.

**Provisioning time**: 10-15 minutes from assets to ready cluster.

## What You Get

A standard Kubernetes cluster on immutable infrastructure:

- **Talos Linux** - Container native OS provisioned via PXE boot
- **Kubernetes** - Unmodified upstream distribution
- **API Management** - Configure nodes with `talosctl` (no SSH)
- **Immutability** - Read-only root filesystem, atomic updates
- **Security** - Minimal attack surface, no shell access

## What You Need

To create a Talos Linux cluster, you need:

**Assets**: 2+ available assets (auto-discovered via IPMI) that can PXE boot on the management network.

**Network Info**: Gateway IP, DNS servers, NTP servers, and static IPs for each node.

**Management Cluster**: Running and accessible with Colony agent deployed.

**That's it.** No credentials, no tokens, no SSH keys required.

## What's NOT Included

Unlike Civo Stack, you'll need to install these yourself after cluster creation:

- **CNI** (required) - Flannel, Cilium, Calico, or your choice
- **Storage** (optional) - Longhorn, OpenEBS, Rook, or local-path
- **Ingress** (optional) - Traefik, Nginx, or HAProxy
- **Monitoring** (optional) - Prometheus, Grafana, Loki

This gives you complete flexibility but requires more setup.

## How It Works

When you create a Talos Linux cluster, Colony:

1. PXE boots your assets and loads Talos installer
2. Writes immutable Talos OS to disk
3. Applies machine configurations via Talos API
4. Bootstraps the first control plane node
5. Joins additional nodes to the cluster
6. Provides kubeconfig and talosconfig for management

No SSH is ever enabled. All management is via the Talos API using `talosctl`.

## Why Choose Talos Linux?

**Choose Talos Linux for:**

- Standard Kubernetes without vendor lock-in
- Maximum security with immutable infrastructure
- Full control over CNI, CSI, and all add-ons
- Consistent platform across environments
- Evaluating Talos without vendor features

**Choose Civo Stack instead if:**

- You want everything pre-configured and managed
- You need enterprise features (autopilot, integrated observability)
- You prefer faster time-to-production

**Choose K3s instead if:**

- You need SSH access for debugging
- You want components included (Traefik, local storage)
- You prefer a familiar Ubuntu environment

## Ready to Create?

[Create Talos Linux Cluster →](./create.md)

The create guide walks you through selecting assets, configuring networking, and launching your cluster. After creation, you'll install a CNI to make the cluster fully functional.

## After Creation

Once your cluster is provisioned:

**1. Download configs**:

```bash
# From Colony UI, download kubeconfig and talosconfig
export KUBECONFIG=~/talos-cluster-config
export TALOSCONFIG=~/.talos/config
```

**2. Verify cluster** (nodes will be NotReady without CNI):

```bash
kubectl get nodes
# All nodes show NotReady - this is expected
```

**3. Install CNI** (required):

```bash
# Example: Flannel
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Wait for nodes to become Ready
kubectl get nodes --watch
```

**4. Deploy workloads**:

```bash
kubectl create deployment nginx --image=nginx
kubectl get pods
```

See the [Create Guide](./create.md#whats-next) for detailed CNI installation options.

## Learn More

- [Create Talos Linux Cluster Guide →](./create.md)
- [Talos Documentation](https://www.talos.dev/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Compare Cluster Types](../index.md)

Need help? [Join our Slack community](https://konstructio.slack.com/)
