---
title: Initialize Management Cluster
description: Set up K3s management cluster with Tinkerbell for bare metal provisioning
sidebar_position: 2
---

## Overview

The Colony management cluster is a K3s Kubernetes cluster that runs colony and Tinkerbell components for bare metal provisioning. This cluster orchestrates PXE booting, operating system installation, and cluster creation on your physical hardware.

## Prerequisites

Before initializing your management cluster:

- [ ] Colony CLI installed (see [Install the CLI](./cli.md))
- [ ] API key from colony.konstruct.io (see [Create API Key](../getting-started/api-key.md))
- [ ] Docker installed and running
- [ ] Network interface connected to your asset management network
- [ ] Static IP address in the same subnet as your assets

:::warning
The management cluster must be on the same Layer 2 network as your physical assets for PXE booting to work.
:::

## Initialize the Cluster

Run the `colony init` command to create your management cluster. Use the command you copied from the Colony UI after generating your API key:

```bash
colony init \
  --api-key <from-ui> \
  --data-center-id <from-ui> \
  --load-balancer-interface eth0 \
  --load-balancer-ip 192.168.1.10
```

### Parameters

- `--api-key`: Your Colony API key (from [colony.konstruct.io](https://colony.konstruct.io))
- `--data-center-id`: Your datacenter ID (from [colony.konstruct.io](https://colony.konstruct.io))
- `--load-balancer-interface`: Network interface connected to your asset management network (e.g., `eth0`, `ens192`, `vlan1001`)
- `--load-balancer-ip`: Static IP in the same subnet as your assets for colony to use

Example:
```bash
colony init \
  --api-key cd-c1d1e981b67e_30204cc8faf061722004fe7641ed381b94eae5b5 \
  --data-center-id aa872c72-cbe1-498b-9b83-37a19e578d34 \
  --load-balancer-interface vlan1001 \
  --load-balancer-ip 10.1.1.5
```

:::tip
The load balancer IP serves as the PXE boot "next-server" (TFTP server). Ensure your DHCP server is configured to direct PXE clients to this address.
:::

## Configure kubectl Access

After initialization completes, export the kubeconfig:

```bash
export KUBECONFIG=~/.colony/config
```

Add this to your shell profile (`.bashrc`, `.zshrc`) to persist across sessions:

```bash
echo 'export KUBECONFIG=~/.colony/config' >> ~/.bashrc
```

## Verify the Installation

Check that all Tinkerbell components are running:

```bash
kubectl get pods -A
```

You should see pods in these namespaces:

- `kube-system`: K3s core components
- `tinkerbell`: Tinkerbell services (boots, hegel, rufio, smee, tink-server)
- `colony`: Colony agent

Wait for all pods to reach `Running` status before proceeding.

## Troubleshooting

### Initialization Fails

If `colony init` fails:

- **Check Docker**: Ensure Docker is running (`docker ps`)
- **Network connectivity**: Verify the interface is up and has an IP address
- **Port conflicts**: Ensure ports 80, 443, 6443, 69 (TFTP) are not in use
- **Disk space**: Ensure at least 20GB free space for container images

### Pods Not Starting

If pods remain in `Pending` or `CrashLoopBackOff`:

```bash
# Check pod status
kubectl get pods -A

# View pod logs
kubectl logs -n tinkerbell <pod-name>

# Describe pod for events
kubectl describe pod -n tinkerbell <pod-name>
```

Common issues:

- **Image pull errors**: Check internet connectivity for pulling container images
- **Resource constraints**: Ensure host has minimum 8GB RAM, 4 CPUs
- **Storage issues**: Verify `/var/lib/rancher/k3s` has sufficient space

## What's Next

Your management cluster is ready. Now you can:

- [Discover assets](../getting-started/discover-assets.md) - Register physical hardware with IPMI
- [Provision Ubuntu hosts](../assets/provision-ubuntu.md) - Install Ubuntu on assets
- [Create Kubernetes clusters](../clusters/index.md) - Deploy Civo Stack, K3s, or Talos clusters
