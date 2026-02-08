---
title: Create K3s Cluster
description: Step-by-step guide to provisioning K3s on Ubuntu
sidebar_position: 3
---

## Overview

This guide walks through creating a K3s cluster using the Colony UI. Ubuntu is provisioned automatically as part of cluster creation. The process takes 10-15 minutes from start to ready.

## Prerequisites

Before starting, ensure you have:

- [ ] 2+ available assets that can PXE boot
- [ ] Network configuration (gateway, DNS, static IPs)
- [ ] Management cluster running

See the [K3s Overview](./index.md) for full details on what you need.

:::info
Ubuntu will be provisioned automatically during cluster creation via PXE boot. You don't need to provision Ubuntu beforehand.
:::

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
dev-k3s-cluster
```

Use lowercase, alphanumeric characters, and hyphens.

### Cluster Type

Select **K8s Stack** from the dropdown.

This sets the cluster type to `k8s_stack`.

### Cluster Flavor

Select **K3s** from the flavor dropdown.

This configures Colony to use K3s provisioning templates.

### Gateway IP

Enter your network gateway IP address:

```
192.168.1.1
```

This is the default route for all cluster nodes.

Click **Next** to continue.

## Step 3: Configure Control Plane

### Select Assets

1. Click **Add Control Plane Node**
2. From the dropdown, select an **available asset**
3. For HA, add 2 more control planes (3 total recommended)

:::info
Only assets with "available" status will appear in the dropdown. Ubuntu will be provisioned automatically during cluster creation.
:::

### Assign Static IPs

For each control plane node, enter:

- **IP Address**: Static IP for this node (e.g., `192.168.1.101`)
- **Subnet**: Network prefix (e.g., `24` for /24 or 255.255.255.0)

### Network Configuration

- **DNS Servers**: Comma-separated IPs (e.g., `8.8.8.8,8.8.4.4`)

:::tip
For HA control plane, use 3 or 5 nodes. K3s uses embedded etcd which requires odd numbers for quorum.
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

### Network Configuration

- **DNS Servers**: Same as control plane

:::tip
Workers run your application pods. Size them based on workload requirements. K3s is lightweight but workers still need adequate CPU and RAM for your apps.
:::

Click **Next** to continue.

## Step 5: Review and Create

Review your configuration:

- **Cluster Name**: Verify spelling
- **Type**: K8s Stack (K3s)
- **Control Planes**: Count, IPs, and assets
- **Workers**: Count, IPs, and assets
- **Network**: Gateway and DNS

If everything looks correct, click **Create Cluster**.

## Provisioning Timeline

Your cluster will progress through these stages:

| Stage | Duration | Description |
|-------|----------|-------------|
| **PXE Boot** | 1-2 min | Assets network boot and download Ubuntu installer |
| **Ubuntu Install** | 3-5 min | Ubuntu provisioned to disk via PXE |
| **K3s Server Install** | 2-3 min | Install K3s on first master (server mode) |
| **Token Generation** | 1 min | Wait for K3s to generate join token |
| **Worker Join** | 2-3 min | Install K3s on workers and join cluster |
| **Ready** | 1 min | Cluster healthy, kubeconfig available |

**Total**: Approximately 10-15 minutes depending on network speed and node count.

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

# Check workflows
kubectl get workflows -A
```


## Verification

### Download kubeconfig

Once provisioning completes:

1. Click **Download Kubeconfig** in the cluster details
2. Save to `~/.kube/k3s-config`
3. Export for kubectl:

```bash
export KUBECONFIG=~/.kube/k3s-config
```

### Verify Cluster Health

Check all nodes are Ready:

```bash
kubectl get nodes
```

Expected output:
```
NAME                    STATUS   ROLES                  AGE   VERSION
control-plane-01        Ready    control-plane,master   10m   v1.28.5+k3s1
worker-01               Ready    <none>                 8m    v1.28.5+k3s1
worker-02               Ready    <none>                 8m    v1.28.5+k3s1
```

### Check System Pods

Verify core components are running:

```bash
kubectl get pods -A
```

Look for:
- `kube-system`: CoreDNS, metrics-server, local-path-provisioner
- `kube-system`: Traefik (ingress controller)

All should be in `Running` state.

### Verify K3s Services

Check K3s-specific components:

```bash
# Check Traefik ingress controller
kubectl get svc -n kube-system traefik

# Check local-path storage class
kubectl get storageclass

# Verify CoreDNS is resolving
kubectl run test-dns --image=busybox --rm -it --restart=Never -- nslookup kubernetes.default
```

### Test Cluster Connectivity

Deploy a test workload:

```bash
# Create a deployment
kubectl create deployment nginx --image=nginx --replicas=2

# Expose via NodePort
kubectl expose deployment nginx --port=80 --type=NodePort

# Get the service
kubectl get svc nginx
```

Access the service using any node IP and the NodePort to confirm networking works.

## K3s Features

### Useful Commands

Once connected:

```bash
# Check K3s service status
sudo systemctl status k3s

# View K3s logs
sudo journalctl -u k3s -f

# Check K3s version
k3s --version

# View kubelet logs
sudo journalctl -u k3s-agent -f  # on workers
sudo journalctl -u k3s -f        # on control plane

# Check node resources
top
df -h
free -h
```

:::tip
The `kbot` user has sudo access. Use `sudo` for privileged commands.
:::

## K3s Features

### Traefik Ingress

K3s includes Traefik for HTTP/HTTPS routing:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  rules:
  - host: example.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: example-service
            port:
              number: 80
```

Access via NodePort or LoadBalancer (if available).

### Local-Path Storage

Create persistent volumes on node local disks:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 10Gi
```

Volumes are stored in `/var/lib/rancher/k3s/storage/`.

### Embedded Components

K3s bundles these components:

- **CoreDNS**: Cluster DNS for service discovery
- **Traefik**: Ingress controller for HTTP routing
- **ServiceLB**: Simple load balancer for LoadBalancer services
- **Local-path**: Persistent volume provisioner
- **Metrics Server**: Resource usage metrics

No additional installation required!

## Troubleshooting

### Workers Not Joining

**Symptoms**: Worker nodes don't appear in `kubectl get nodes`.

**Solutions**:
- Check colony-agent logs: `kubectl logs -n colony -l app=colony-agent`
- Verify control plane IP is reachable from workers
- Ensure port 6443 is open from workers to control plane
- Check workflow status: `kubectl get workflows -A`
- Review provisioning logs in Colony UI

### CoreDNS Pods Not Running

**Symptoms**: CoreDNS in CrashLoopBackOff or Pending.

**Solutions**:
- Check CoreDNS logs: `kubectl logs -n kube-system -l k8s-app=kube-dns`
- Verify network plugin (Flannel) is running: `kubectl get pods -n kube-system -l app=flannel`
- Ensure nodes have sufficient resources: `kubectl describe node`
- Check for DNS port (53) conflicts on nodes
- Restart CoreDNS: `kubectl rollout restart deployment/coredns -n kube-system`

### Traefik Not Accessible

**Symptoms**: Ingress doesn't route traffic, Traefik service unreachable.

**Solutions**:
- Check Traefik is running: `kubectl get pods -n kube-system -l app.kubernetes.io/name=traefik`
- Verify Traefik service: `kubectl get svc -n kube-system traefik`
- Check Traefik logs: `kubectl logs -n kube-system -l app.kubernetes.io/name=traefik`
- Ensure NodePort or LoadBalancer ports are accessible
- Verify firewall allows HTTP (80) and HTTPS (443)

### Provisioning Fails at Key Upload

**Symptoms**: Cluster provisioning fails with SSH key upload error.

**Solutions**:
- Verify public key format (should start with `ssh-rsa`, `ssh-ed25519`, etc.)
- Check SSH access to nodes manually: `ssh ubuntu@<node-ip>`
- Ensure `.ssh/authorized_keys` is writable on nodes
- Try provisioning again with correct key format
- Check colony-agent logs for detailed error

## What's Next

Your K3s cluster is ready! Here's what you can do:

### Add More Nodes

Scale your cluster by adding workers:

[Add Nodes to Cluster →](../add-nodes.md)

### Deploy Applications

Use kubectl or Helm to deploy workloads:

```bash
# Deploy with kubectl
kubectl create deployment hello --image=gcr.io/google-samples/hello-app:1.0
kubectl expose deployment hello --port=8080 --type=LoadBalancer

# Deploy with Helm
helm repo add stable https://charts.helm.sh/stable
helm install my-release stable/mysql
```

### Configure Ingress

Expose services via Traefik:

```bash
# Example ingress
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-ingress
spec:
  rules:
  - host: hello.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              number: 8080
EOF

# Access via NodePort
curl -H "Host: hello.local" http://<node-ip>:<traefik-nodeport>/
```

### Set Up Monitoring

Install Prometheus and Grafana:

```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### Enable Persistent Storage

Use local-path for stateful apps:

```bash
# Create PVC
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 20Gi
EOF

# Deploy PostgreSQL with persistent storage
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          value: mypassword
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: postgres-data
EOF
```

## Learn More

- [K3s Documentation](https://docs.k3s.io/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [K3s Overview](./index.md)
- [Add Nodes Guide](../add-nodes.md)

Need help? [Join our Slack community](https://konstructio.slack.com/) for support!
