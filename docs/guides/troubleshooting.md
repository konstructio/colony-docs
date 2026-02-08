---
title: Troubleshooting Guide
description: Solutions for common Colony issues
sidebar_position: 4
---

## Overview

This guide covers common issues and debugging techniques for Colony.

## Management Cluster Issues

### colony init Fails

**Symptoms**: Initialization fails with errors.

**Common causes**:

- Docker not running
- Ports in use (80, 443, 6443, 69)
- Interface doesn't exist or is down
- IP address not available on interface
- Insufficient disk space

**Solutions**:

```bash
# Check Docker
sudo systemctl status docker
sudo systemctl start docker

# Check ports
sudo netstat -tulpn | grep -E ':(80|443|6443|69)\s'

# Check interface
ip addr show eth0
ip link set eth0 up

# Check disk space
df -h /var/lib/rancher/k3s
```text

### Pods Won't Start

**Symptoms**: Tinkerbell or colony-agent pods stuck Pending or CrashLoopBackOff.

**Solutions**:

```bash
# Check pod status
kubectl get pods -A

# Describe pod for events
kubectl describe pod -n tinkerbell <pod-name>

# View logs
kubectl logs -n tinkerbell <pod-name>

# Check node resources
kubectl describe nodes
```text

Common issues:

- Insufficient resources (need 8GB RAM, 4 CPUs)
- Image pull failures (check internet connectivity)
- Volume mount issues (check disk space)

## Asset Discovery Issues

### Asset Doesn't Appear

**Symptoms**: After `colony add-ipmi`, asset not in UI or kubectl.

**Solutions**:

```bash
# Test IPMI connectivity
ping <ipmi-ip>
curl -k https://<ipmi-ip>

# Check IPMI credentials (try web interface)
# https://<ipmi-ip>

# Check colony-agent logs
kubectl logs -n colony -l app=colony-agent -f

# Check rufio (IPMI controller)
kubectl logs -n tinkerbell -l app=rufio
```text

### Asset Stuck "discovering"

**Symptoms**: Asset remains in discovering status for >15 minutes.

**Solutions**:

```bash
# Check if asset powered on
# Via IPMI web interface or:
ipmitool -H <ipmi-ip> -U <user> -P <pass> power status

# Check PXE boot enabled in BIOS
# Access via IPMI console

# Check DHCP server
sudo journalctl -u dnsmasq  # if using dnsmasq
# Verify DHCP leases

# Check TFTP server
kubectl logs -n tinkerbell -l app=smee

# Check Tinkerbell workflows
kubectl get workflows -A
kubectl describe workflow -n tink-system <workflow-name>
```text

## Provisioning Issues

### Ubuntu Provisioning Fails

**Symptoms**: Asset returns to "available" without OS installed.

**Solutions**:

```bash
# Check workflow logs
kubectl logs -n tinkerbell -l app=tink-worker

# Check asset can reach Ubuntu mirrors
# Via IPMI console or if SSH available:
curl -I http://archive.ubuntu.com

# Check Tinkerbell hegel (metadata server)
kubectl logs -n tinkerbell -l app=hegel

# Verify disk exists and is writeable
# Check IPMI console for disk errors
```text

### Cluster Provisioning Stuck

**Symptoms**: Cluster stuck in provisioning, no progress.

**Solutions**:

```bash
# Check colony-agent logs
kubectl logs -n colony -l app=colony-agent -f

# Check specific workflow
kubectl get workflows -A
kubectl describe workflow -n tink-system <workflow-name>

# For Talos clusters: Check Talos API
talosctl --talosconfig ~/.talos/config version --nodes <node-ip>

# For K3s clusters: Check SSH access
ssh -i ~/.ssh/key kbot@<node-ip>
sudo journalctl -u k3s -f
```text

## Network Issues

### PXE Boot Fails

**Symptoms**: Assets don't network boot.

**Solutions**:

1. **Verify DHCP**:
   - Check DHCP server running and configured
   - Verify PXE options (next-server, bootfile)
   - Check DHCP leases

2. **Verify TFTP**:

   ```bash
   # Test TFTP from another machine
   tftp <load-balancer-ip>
   tftp> get pxelinux.0
   ```

3. **Check BIOS**:
   - Enable PXE boot
   - Set boot order: Network first
   - Disable secure boot if needed

4. **Network connectivity**:
   - Same subnet as assets
   - VLAN configuration correct
   - Switch ports untagged

### Can't Reach Nodes

**Symptoms**: kubectl times out, nodes unreachable.

**Solutions**:

```bash
# Test connectivity
ping <node-ip>
telnet <node-ip> 6443

# Check firewall
sudo iptables -L -n | grep 6443

# Verify static IPs assigned correctly
# Check Colony UI or kubectl get nodes -o wide

# Check API server running
kubectl logs -n kube-system -l component=kube-apiserver
```text

## Cluster Health Issues

### Nodes NotReady

**Symptoms**: `kubectl get nodes` shows NotReady.

**Solutions**:

**For Talos Linux**: Install CNI

```bash
# Flannel
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Or Cilium
cilium install
```text

**For other issues**:

```bash
# Check kubelet
kubectl describe node <node-name>

# Check node logs
# Talos:
talosctl --talosconfig ~/.talos/config logs --nodes <node-ip> kubelet

# K3s:
ssh kbot@<node-ip> sudo journalctl -u k3s -f
```text

### Pods Won't Schedule

**Symptoms**: Pods stuck in Pending.

**Solutions**:

```bash
# Check pod events
kubectl describe pod <pod-name>

# Common issues:
# - Insufficient resources
kubectl top nodes

# - Taints preventing scheduling
kubectl describe node <node-name> | grep Taints

# - Missing CNI
kubectl get pods -n kube-system -l k8s-app=flannel

# - PVC not bound
kubectl get pvc
```text

## Getting Help

### Collect Logs

Before asking for help, collect logs:

```bash
# Colony agent
kubectl logs -n colony -l app=colony-agent > colony-agent.log

# Tinkerbell components
kubectl logs -n tinkerbell -l app=boots > boots.log
kubectl logs -n tinkerbell -l app=hegel > hegel.log
kubectl logs -n tinkerbell -l app=rufio > rufio.log
kubectl logs -n tinkerbell -l app=smee > smee.log

# Workflows
kubectl get workflows -A -o yaml > workflows.yaml
```text

### Useful Debug Commands

```bash
# System info
kubectl version
kubectl get nodes -o wide
kubectl get pods -A

# Hardware inventory
kubectl get hardware -A

# Workflows
kubectl get workflows -A
kubectl describe workflow -n tink-system <workflow-name>

# Colony agent status
kubectl get pods -n colony
kubectl describe pod -n colony <agent-pod>
```text

## Support Resources

- **Slack**: [Join konstructio.slack.com](https://konstructio.slack.com/)
- **GitHub Issues**: [Report bugs](https://github.com/konstructio/colony/issues)
- **Documentation**: [docs.colony.konstruct.io](https://colony.konstruct.io/docs/)

## What's Next

- [UI Walkthrough →](./ui-walkthrough.md)
- [CLI Reference →](./cli-reference.md)
- [Cluster Guides →](../clusters/index.md)
