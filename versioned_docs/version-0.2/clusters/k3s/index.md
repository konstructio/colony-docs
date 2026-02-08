---
title: K3s Clusters
description: Lightweight Kubernetes on Ubuntu for development and edge deployments
sidebar_position: 2
---

# K3s Clusters

## What is K3s?

K3s is a lightweight, certified Kubernetes distribution designed for resource-constrained environments, edge computing, and development. Colony provisions K3s clusters on Ubuntu 22.04 with SSH access, Traefik ingress, and local storage included.

**Provisioning time**: 10-15 minutes from assets to ready cluster.

## What You Get

A fully functional K3s cluster with:

- **Ubuntu 22.04** - Provisioned automatically via PXE boot
- **K3s** - Lightweight Kubernetes (~100MB binary)
- **Traefik** - Ingress controller pre-configured
- **CoreDNS** - Service discovery included
- **local-path** - Storage provisioner ready
- **Flannel** - Pod networking configured

## What You Need

To create a K3s cluster, you need:

**Assets**: 2+ available assets (auto-discovered via IPMI) that can PXE boot on the management network. Colony will automatically provision Ubuntu during cluster creation.

**Network Info**: Gateway IP, DNS servers, and static IPs for each node.

**Management Cluster**: Running and accessible with Colony agent deployed.

That's it. No credentials, no tokens, no complex prerequisites.

## How It Works

When you create a K3s cluster, Colony:

1. PXE boots your assets and loads Ubuntu 22.04 via ISO
2. Installs Ubuntu to disk with cloud-init configuration
3. Installs K3s on the first control plane node
4. Joins worker nodes to the cluster
5. Provides kubeconfig for cluster management

## Why Choose K3s?

**Choose K3s for:**

- Development and testing environments
- Edge deployments with limited resources
- Fast iteration cycles (10-15 minute provisioning)
- Lightweight Kubernetes footprint

**Consider Civo Stack instead if:**

- You need enterprise features (autopilot, integrated observability)
- You want a complete private cloud platform
- You prefer immutable infrastructure (Talos)

**Consider Talos Linux instead if:**

- You want standard Kubernetes without pre-installed components
- You prefer API-managed, immutable infrastructure
- You need maximum security with immutable OS

## Ready to Create?

[Create K3s Cluster →](./create.md)

The create guide walks you through selecting assets, configuring networking, and launching your cluster.

## After Creation

Once your cluster is provisioned, you can:

**Access via kubectl**:

```bash
# Download kubeconfig from Colony UI
export KUBECONFIG=~/k3s-cluster-config
kubectl get nodes
```

**Deploy workloads**:

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

**Use Traefik ingress**:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

## Learn More

- [Create K3s Cluster Guide →](./create.md)
- [K3s Documentation](https://docs.k3s.io/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Compare Cluster Types](../index.md)

Need help? [Join our Slack community](https://konstructio.slack.com/)
