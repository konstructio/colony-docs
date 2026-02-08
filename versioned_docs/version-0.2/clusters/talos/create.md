---
title: Create Talos Linux Cluster
description: Step-by-step guide to provisioning standard Kubernetes with Talos
sidebar_position: 3
---

## Overview

This guide walks through creating a Talos Linux cluster using the Colony UI. The process takes 10-15 minutes from start to ready cluster, with additional time needed for CNI installation.

## Prerequisites

Before starting, ensure you have:

- [ ] 2+ available assets
- [ ] Network configuration (gateway, DNS, NTP, static IPs)
- [ ] Management cluster running
- [ ] Plan for CNI installation (Flannel, Cilium, Calico)

See the [Talos Linux Overview](./index.md) for full details on what you need.

## Step 1: Navigate to Cluster Creation

1. Log in to [colony.konstruct.io](https://colony.konstruct.io)
2. Select your datacenter from the dashboard
3. Click **Clusters** in the sidebar
4. Click **Create Cluster**

## Step 2: Initial Configuration

Configure basic cluster settings:

### Cluster Name

Enter a descriptive name for your cluster:

```
prod-talos-cluster
```

Use lowercase, alphanumeric characters, and hyphens. This name appears in the UI and kubeconfig.

### Cluster Type

Select **K8s Stack** from the dropdown.

This sets the cluster type to `k8s_stack`.

### Cluster Flavor

Select **Talos** from the flavor dropdown.

This configures Colony to use Talos Linux provisioning (without CSE).

### Gateway IP

Enter your network gateway IP address:

```
192.168.1.1
```

This is the default route for all cluster nodes.

### Extra SANs (Optional)

Add additional Subject Alternative Names for the API server certificate:

```
cluster.example.com,api.cluster.local,192.168.1.100
```

Comma-separated list. Useful if you'll access the API via DNS or load balancer. Leave empty if using only control plane IPs.

Click **Next** to continue.

## Step 3: Configure Control Plane

### Select Assets

1. Click **Add Control Plane Node**
2. From the dropdown, select an available asset
3. Repeat for additional control planes (3 recommended for HA)

:::tip
For high availability, use 3 or 5 control plane nodes. Odd numbers avoid split-brain scenarios in etcd quorum.
:::

### Assign Static IPs

For each control plane node, enter:

- **IP Address**: Static IP for this node (e.g., `192.168.1.101`)
- **Subnet**: Network prefix (e.g., `24` for /24 or 255.255.255.0)

### Network Configuration

- **DNS Servers**: Comma-separated IPs (e.g., `8.8.8.8,8.8.4.4`)
- **NTP Servers**: Time sync servers (e.g., `time.cloudflare.com` or `0.pool.ntp.org,1.pool.ntp.org`)

### Storage Configuration

**Disk Device**: Device path for etcd and Kubernetes data:

```
/dev/sda
```

Common values:

- `/dev/sda` - First SATA/SCSI disk
- `/dev/nvme0n1` - First NVMe disk
- `/dev/vda` - First virtio disk (VMs)

:::warning
This disk will be wiped during provisioning. Ensure it's the correct device and contains no critical data.
:::

Click **Next** to continue.

## Step 4: Configure Workers

Worker configuration mirrors control plane setup:

### Select Assets

1. Click **Add Worker Node**
2. Select available assets from dropdown
3. Add multiple workers for workload distribution

### Assign Static IPs

For each worker, enter:

- **IP Address**: Static IP (e.g., `192.168.1.201`)
- **Subnet**: Network prefix (e.g., `24`)

### Network & Storage

- **DNS Servers**: Same as control plane
- **NTP Servers**: Same as control plane
- **Disk Device**: Storage device path (e.g., `/dev/sda`)

:::tip
Workers run your application pods. Plan resources based on workload requirements. Talos is lightweight but apps still need adequate CPU and RAM.
:::

Click **Next** to continue.

## Step 5: Review and Create

Review your configuration:

- **Cluster Name**: Verify spelling and naming convention
- **Type**: K8s Stack (Talos - Vanilla)
- **Control Planes**: Count and IP assignments
- **Workers**: Count and IP assignments
- **Network**: Gateway, DNS, NTP settings
- **Extra SANs**: If specified, verify entries

If everything looks correct, click **Create Cluster**.

:::info
Notice there's no credentials step! Talos Linux doesn't require GitLab tokens, image pull secrets, or API tokens.
:::

## Provisioning Timeline

Your cluster will progress through these stages:

| Stage | Duration | Description |
|-------|----------|-------------|
| **PXE Boot** | 2-3 min | Assets network boot and download Talos installer |
| **OS Install** | 4-6 min | Talos Linux written to disk, machines reboot |
| **Config Apply** | 2-3 min | Talos machine configs applied via API |
| **Bootstrap** | 2-4 min | First control plane initializes Kubernetes |
| **Node Join** | 2-4 min | Additional nodes join cluster |
| **Ready** | 1 min | Cluster healthy, kubeconfig available |

**Total**: Approximately 10-15 minutes depending on hardware and network speed.

:::warning
After provisioning completes, the cluster is NOT fully functional. You must install a CNI before pods can run.
:::

### Monitor Progress

Watch provisioning in real-time:

**Colony UI**:

- Cluster status shows current stage
- Progress bar indicates completion percentage
- Logs available in cluster details

**kubectl** (from management cluster):

```bash
# Watch colony-agent logs
kubectl logs -n colony -l app=colony-agent -f

# Check Tinkerbell workflows
kubectl get workflows -A

# View workflow details
kubectl describe workflow -n tink-system <workflow-name>
```

## Verification

### Download kubeconfig

Once provisioning completes:

1. Click **Download Kubeconfig** in the cluster details
2. Save to `~/.kube/talos-config`
3. Export for kubectl:

```bash
export KUBECONFIG=~/.kube/talos-config
```

### Check Cluster Status

Verify cluster is accessible:

```bash
kubectl get nodes
```

Expected output (nodes will be NotReady without CNI):

```
NAME                    STATUS     ROLES           AGE   VERSION
control-plane-01        NotReady   control-plane   5m    v1.29.0
control-plane-02        NotReady   control-plane   4m    v1.29.0
worker-01               NotReady   <none>          3m    v1.29.0
worker-02               NotReady   <none>          3m    v1.29.0
```

:::tip
Nodes show "NotReady" because no CNI is installed yet. This is expected for Talos Linux. Continue to CNI installation.
:::

### Download talosconfig

For Talos node management:

1. In Colony UI, click **Download Talosconfig**
2. Save to `~/.talos/config`
3. Verify Talos access:

```bash
talosctl --talosconfig ~/.talos/config version --nodes 192.168.1.101
```

## Install CNI (Required)

Without CNI, pods cannot communicate. Choose and install a CNI:

### Option 1: Flannel (Easiest)

Simple VXLAN overlay network:

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

Wait for Flannel pods to run:

```bash
kubectl get pods -n kube-flannel
```

### Option 2: Cilium (Recommended)

eBPF-based networking with advanced features:

```bash
# Install Cilium CLI
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-amd64.tar.gz
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz

# Install Cilium
cilium install
```

Wait for Cilium to be ready:

```bash
cilium status --wait
```

### Option 3: Calico

BGP-based networking with network policy:

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml
```

Wait for Calico pods to run:

```bash
kubectl get pods -n kube-system -l k8s-app=calico-node
```

### Verify CNI Installation

After installing CNI, nodes should become Ready:

```bash
kubectl get nodes
```

Expected output:

```
NAME                    STATUS   ROLES           AGE   VERSION
control-plane-01        Ready    control-plane   8m    v1.29.0
control-plane-02        Ready    control-plane   7m    v1.29.0
worker-01               Ready    <none>          6m    v1.29.0
worker-02               Ready    <none>          6m    v1.29.0
```

All nodes should show "Ready" status.

### Verify Pod Networking

Deploy a test pod:

```bash
kubectl run test-nginx --image=nginx --port=80
kubectl expose pod test-nginx --port=80

# Wait for pod to run
kubectl wait --for=condition=ready pod/test-nginx --timeout=60s

# Check pod has IP
kubectl get pod test-nginx -o wide
```

Test connectivity:

```bash
# Run a test pod
kubectl run test-curl --rm -it --image=curlimages/curl -- /bin/sh

# Inside the pod:
curl http://test-nginx.default.svc.cluster.local
# Should return nginx welcome page
exit
```

If curl succeeds, CNI is working correctly!

## Talos Management

Manage Talos nodes using `talosctl`:

### Check Node Status

```bash
# Node version
talosctl --talosconfig ~/.talos/config version --nodes 192.168.1.101

# Node services
talosctl --talosconfig ~/.talos/config services --nodes 192.168.1.101

# etcd members (control planes)
talosctl --talosconfig ~/.talos/config -n 192.168.1.101 etcd members
```

### View Logs

```bash
# Kubelet logs
talosctl --talosconfig ~/.talos/config logs --nodes 192.168.1.101 kubelet

# API server logs (control plane)
talosctl --talosconfig ~/.talos/config logs --nodes 192.168.1.101 kube-apiserver

# All services
talosctl --talosconfig ~/.talos/config dmesg --nodes 192.168.1.101
```

### Node Operations

```bash
# Reboot a node
talosctl --talosconfig ~/.talos/config reboot --nodes 192.168.1.201

# Shutdown a node
talosctl --talosconfig ~/.talos/config shutdown --nodes 192.168.1.201

# Reset a node (wipe and rejoin)
talosctl --talosconfig ~/.talos/config reset --nodes 192.168.1.201
```

:::warning
Talos has NO SSH access. All management is via `talosctl` API. This ensures immutability and security.
:::

## Troubleshooting

### Nodes Stuck in NotReady

**Symptoms**: Nodes don't become Ready after provisioning.

**Solution**: Install CNI (see above). Nodes cannot be Ready without network plugin.

### Provisioning Stuck at PXE Boot

**Symptoms**: Assets don't boot from network, provisioning times out.

**Solutions**:

- Verify DHCP server is running and configured with PXE settings
- Check TFTP server is reachable: `tftp <load-balancer-ip>`
- Confirm assets have PXE boot enabled in BIOS/UEFI
- Check Tinkerbell smee logs: `kubectl logs -n tinkerbell -l app=smee`

### Nodes Not Joining Cluster

**Symptoms**: Some nodes show in Talos but not `kubectl get nodes`.

**Solutions**:

- Check node status in Talos: `talosctl --talosconfig ~/.talos/config get members --nodes <control-plane-ip>`
- Verify static IPs are correct and pingable
- Ensure firewall allows port 6443 (API server) and 50000-50001 (Talos API)
- Check kubelet logs: `talosctl --talosconfig ~/.talos/config logs --nodes <node-ip> kubelet`

### API Server Unreachable

**Symptoms**: `kubectl` commands timeout or refuse connection.

**Solutions**:

- Verify kubeconfig uses correct IP and port
- Check control plane nodes are healthy: `talosctl --talosconfig ~/.talos/config services --nodes <control-plane-ip>`
- Ensure port 6443 is not blocked by firewall
- Confirm API server is running: `talosctl --talosconfig ~/.talos/config logs --nodes <control-plane-ip> kube-apiserver`

### CNI Pods Not Starting

**Symptoms**: CNI pods in Pending or CrashLoopBackOff.

**Solutions**:

- Check node resources: `kubectl describe nodes`
- Verify CNI manifest is correct for Talos (some CNIs need Talos-specific configs)
- Check CNI pod logs: `kubectl logs -n <cni-namespace> <pod-name>`
- Ensure nodes can reach container registries to pull images

### Pod DNS Not Working

**Symptoms**: Pods can't resolve DNS names.

**Solutions**:

- Install CoreDNS (usually comes with Kubernetes, but verify): `kubectl get pods -n kube-system -l k8s-app=kube-dns`
- Check CoreDNS is running: `kubectl logs -n kube-system -l k8s-app=kube-dns`
- Verify CNI is installed and working
- Test DNS from pod: `kubectl run test-dns --rm -it --image=busybox -- nslookup kubernetes.default`

## What's Next

Your Talos Linux cluster is ready! Here's what you can do:

### Install Additional Components

**Ingress Controller** (Traefik):

```bash
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
helm install traefik traefik/traefik --namespace traefik --create-namespace
```

**Storage Provisioner** (Longhorn):

```bash
helm repo add longhorn https://charts.longhorn.io
helm repo update
helm install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace
```

**Monitoring** (Prometheus + Grafana):

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### Add More Nodes

Scale your cluster by adding workers or control planes:

[Add Nodes to Cluster →](../add-nodes.md)

### Deploy Applications

Use kubectl or Helm:

```bash
# Example: Deploy an app
kubectl create deployment hello --image=gcr.io/google-samples/hello-app:1.0
kubectl expose deployment hello --port=8080 --type=NodePort
kubectl get svc hello
```

### Configure Storage

Create storage classes for persistent volumes:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: driver.longhorn.io  # Or your CSI driver
parameters:
  numberOfReplicas: "3"
  staleReplicaTimeout: "2880"
allowVolumeExpansion: true
```

### Set Up Backups

Back up etcd for disaster recovery:

```bash
# Using talosctl
talosctl --talosconfig ~/.talos/config -n 192.168.1.101 etcd snapshot /tmp/etcd-backup.db
```

### Upgrade Cluster

Talos supports atomic, rollback-capable upgrades:

```bash
# Upgrade Talos version
talosctl --talosconfig ~/.talos/config upgrade \
  --nodes 192.168.1.101 \
  --image ghcr.io/siderolabs/installer:v1.7.0

# Upgrade Kubernetes version
talosctl --talosconfig ~/.talos/config upgrade-k8s \
  --nodes 192.168.1.101 \
  --to 1.30.0
```

## Learn More

- [Talos Documentation](https://www.talos.dev/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Cilium Documentation](https://docs.cilium.io/)
- [Flannel Documentation](https://github.com/flannel-io/flannel)
- [Calico Documentation](https://docs.tigera.io/calico/latest/about/)
- [Talos Linux Overview](./index.md)
- [Add Nodes Guide](../add-nodes.md)

Need help? [Join our Slack community](https://konstructio.slack.com/) for support!
