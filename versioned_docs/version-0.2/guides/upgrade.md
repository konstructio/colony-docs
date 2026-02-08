---
title: Upgrade Procedures
description: How to upgrade Colony components safely
sidebar_position: 5
---

## Overview

This guide covers upgrading Colony CLI, management clusters, and provisioned clusters.

## Upgrade Colony CLI

### Check Current Version

```bash
colony version
```text

### Download Latest Release

```bash
# Download new version
wget $COLONY_DOWNLOAD_URL -O colony.tar.gz

# Extract
tar -xzf colony.tar.gz

# Backup old binary
sudo mv /usr/local/bin/colony /usr/local/bin/colony.bak

# Install new binary
sudo mv colony /usr/local/bin/colony
sudo chmod +x /usr/local/bin/colony

# Verify
colony version
```text

### Rollback if Needed

```bash
# Restore old version
sudo mv /usr/local/bin/colony.bak /usr/local/bin/colony
```text

## Upgrade Management Cluster

Management cluster upgrades depend on how you deployed Colony.

### K3s Upgrade

```bash
# Check current K3s version
kubectl version --short

# Upgrade K3s (from host)
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.28.5+k3s1 sh -

# Verify
kubectl version --short
kubectl get nodes
```text

### Tinkerbell Components

Tinkerbell is deployed via Colony init. To upgrade:

1. Note your current configuration
2. Back up critical data
3. Re-run `colony init` with new version

:::warning
Re-running init may cause brief downtime for provisioning operations. Plan accordingly.
:::

## Upgrade Provisioned Clusters

### Talos Clusters (Civo Stack, Vanilla)

Talos supports atomic upgrades:

```bash
# Upgrade Talos OS
talosctl --talosconfig ~/.talos/config upgrade \
  --nodes <node-ip> \
  --image ghcr.io/siderolabs/installer:v1.7.0

# Upgrade Kubernetes
talosctl --talosconfig ~/.talos/config upgrade-k8s \
  --nodes <control-plane-ip> \
  --to 1.30.0
```text

**Process**:

1. Upgrade control planes one at a time
2. Wait for each to become Ready
3. Upgrade workers in rolling fashion
4. Verify cluster health

### K3s Clusters

K3s upgrades via SSH:

```bash
# SSH to each node
ssh kbot@<node-ip>

# Upgrade K3s
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.28.5+k3s1 sh -

# For workers, also upgrade
sudo systemctl restart k3s-agent
```text

**Process**:

1. Upgrade control planes first (one at a time if HA)
2. Wait for control planes to stabilize
3. Upgrade workers
4. Verify: `kubectl get nodes`

## Backup Before Upgrade

### Management Cluster

```bash
# Backup K3s data
sudo tar -czf k3s-backup.tar.gz /var/lib/rancher/k3s

# Backup kubeconfig
cp ~/.colony/config ~/.colony/config.bak
```text

### Provisioned Clusters

**Talos**:

```bash
# Backup etcd
talosctl --talosconfig ~/.talos/config -n <control-plane-ip> \
  etcd snapshot /tmp/etcd-backup.db

# Download backup
talosctl --talosconfig ~/.talos/config -n <control-plane-ip> \
  copy /tmp/etcd-backup.db ./etcd-backup.db
```text

**K3s**:

```bash
# Backup from control plane
ssh kbot@<control-plane-ip> \
  "sudo tar -czf /tmp/k3s-backup.tar.gz /var/lib/rancher/k3s"

# Download backup
scp kbot@<control-plane-ip>:/tmp/k3s-backup.tar.gz ./
```text

## Rollback Procedures

### Management Cluster

If upgrade fails:

1. Restore K3s backup:

   ```bash
   sudo systemctl stop k3s
   sudo rm -rf /var/lib/rancher/k3s
   sudo tar -xzf k3s-backup.tar.gz -C /
   sudo systemctl start k3s
   ```

2. Restore kubeconfig:

   ```bash
   cp ~/.colony/config.bak ~/.colony/config
   ```

### Provisioned Clusters

**Talos**: Rollback upgrade:

```bash
talosctl --talosconfig ~/.talos/config upgrade \
  --nodes <node-ip> \
  --image ghcr.io/siderolabs/installer:v1.6.0
```text

**K3s**: Restore from backup via SSH on each node.

## Troubleshooting Upgrades

### Upgrade Fails

- Check logs: `kubectl logs -n <namespace> <pod>`
- Verify network connectivity
- Ensure sufficient disk space
- Check for incompatible versions

### Nodes NotReady After Upgrade

- Wait 5-10 minutes for stabilization
- Check kubelet logs
- Verify CNI still running
- Restart kubelet if needed

### Workloads Disrupted

- Check pod status: `kubectl get pods -A`
- Review events: `kubectl get events --sort-by='.lastTimestamp'`
- Verify resource availability
- Check for breaking changes in Kubernetes versions

## Best Practices

1. **Test in dev first**: Upgrade non-production clusters before production
2. **Read release notes**: Check for breaking changes
3. **Backup everything**: Always backup before upgrading
4. **Upgrade incrementally**: Don't skip multiple versions
5. **Monitor closely**: Watch logs and metrics during upgrade
6. **Have rollback plan**: Know how to revert if issues occur
7. **Schedule maintenance**: Coordinate with teams, avoid peak hours

## What's Next

- [Troubleshooting Guide →](./troubleshooting.md)
- [Cluster Management →](../clusters/index.md)
- [Asset Management →](../assets/index.md)

Need help? [Join our Slack community](https://konstructio.slack.com/) for support!
