---
title: Prerequisites
description: Requirements for running Colony in your environment
sidebar_position: 2
---

## Summary

Before getting started with Colony, review the following requirements to ensure your environment is ready for deployment.

## Common Terms

- **Laptop**: A machine used to bootstrap a Colony installation. The use of this term does not represent an actual laptop. It could be a physical machine or virtual machine.

- **Asset**: A machine to be discovered and turned into a cluster using Colony.

- **Management Cluster**: The K3s cluster running Colony for bare metal provisioning.

## Hardware Requirements

A machine running Colony requires a minimum of the following:

- **8 GB of RAM** (16 GB recommended for production)
- **4 or more recent x86-64 CPU cores**
  - _Arm processors are not currently supported._
- **64GB for root volume**
  - _We highly recommend a high throughput drive for the boot drive._

:::info
These requirements are for the management cluster that orchestrates provisioning. Assets being provisioned have their own requirements based on the cluster type you're deploying.
:::

## Networking Requirements

A good rule of thumb regarding network requirements for Colony is to put it on the same subnet as the machines you would like it to manage. Colony relies on Layer 2 DHCP protocol and the DHCP Discover packet to identify and create a record for a machine.

### Network Configuration

- **Layer 2 Connectivity**: Management cluster and assets must be on same broadcast domain
- **DHCP Server**: Required for PXE boot (Colony does not include one by default but one can be added to your environment)
- **Untagged VLAN**: Interface connected to out-of-band management and private network should be untagged
- **IPv4 Only**: Colony currently only supports IPv4 networking

### Required Internet Access

The private VLAN should have access to the following addresses to pull manifests, container images, and ISO files:

- **GitHub**: Source code and releases
- **GitHub Container Registry (ghcr.io)**: Container images for Colony components
- **Docker Hub**: Container images for Kubernetes and dependencies
- **Talos Factory**: Talos Linux installer images
- **Ubuntu Mirrors**: Ubuntu package repositories and installer images

:::tip
To summarize networking requirements:

- Interface connected to out-of-band network and private network should be untagged
- DHCP server running on network boot subnet
- Internet access to registries and package repos
:::

### Port Requirements

The management cluster uses these ports:

| Port | Protocol | Purpose |
|------|----------|---------|
| 69 | UDP | TFTP (PXE boot server) |
| 80 | TCP | HTTP (boot artifacts, workflows) |
| 443 | TCP | HTTPS (Colony API, UI) |
| 6443 | TCP | Kubernetes API (K3s management cluster) |

Ensure these ports are not in use by other services.

## Operating Systems

Colony has been tested with the following operating systems. Theoretically any operating system supported by Docker should work.

- **Ubuntu 22.04** (Recommended)
- **Debian 12**

:::info
This is for the management cluster host. Assets can be provisioned with Ubuntu, Talos, or other supported operating systems.
:::

## Required Packages

Install these packages on the management cluster host before running Colony:

- **`docker`** - Container runtime for K3s and Tinkerbell
- **`git`** - Clone Colony repository (if building from source)
- **`wget`** - Download Colony binary
- **`kubectl`** - Manage Kubernetes clusters

### Installation

**Ubuntu/Debian**:

```bash
# Update package lists
sudo apt update

# Install dependencies
sudo apt install -y docker.io git wget

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Add user to docker group (optional, avoids sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker
```

## Root Privileges

Root privileges are required for the host machine used to run Colony. This is needed for:

- Installing and configuring K3s
- Managing network interfaces and IP addresses
- Configuring DHCP and TFTP services via Tinkerbell
- Managing Docker containers

:::warning
Colony's `init` command requires sudo/root access. Ensure your user has sudo privileges or run as root.
:::

## Network Interface

Identify the network interface connected to your asset management network:

```bash
# List network interfaces
ip addr show

# Example output:
# 1: lo: ...
# 2: eth0: inet 192.168.1.10/24 ...
# 3: eth1: inet 10.0.0.5/24 ...
```

You'll need:
- **Interface name** (e.g., `eth0`, `ens192`)
- **IP address** in the same subnet as your assets
- **Subnet mask** (e.g., `/24` for 255.255.255.0)

## DHCP Server

Colony requires an existing DHCP server configured for PXE boot. The DHCP server should:

- Assign IP addresses to assets on boot
- Provide PXE boot options (next-server, bootfile)
- Be reachable from assets on Layer 2 network

### DHCP PXE Configuration

Your DHCP server needs these options:

```
# Example dnsmasq configuration
dhcp-range=192.168.1.100,192.168.1.200,12h
dhcp-boot=pxelinux.0,<load-balancer-hostname>,<load-balancer-ip>
enable-tftp
tftp-root=/var/lib/tftpboot
```

Or for ISC DHCP:

```
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option domain-name-servers 8.8.8.8, 8.8.4.4;
  next-server <load-balancer-ip>;
  filename "pxelinux.0";
}
```

Replace `<load-balancer-ip>` with the IP you'll use for `colony init --load-balancer-ip`.

:::tip
If you don't have a DHCP server, you can use dnsmasq on the management cluster host. See [Networking Guide](../assets/networking.md) for setup instructions.
:::

## Pre-Flight Checklist

Before proceeding, verify you have:

- [ ] Physical or virtual machine with 8GB+ RAM, 4+ CPUs, 64GB+ disk
- [ ] Ubuntu 22.04 or Debian 12 installed
- [ ] Docker, Git, wget, kubectl packages installed
- [ ] Root/sudo access to the machine
- [ ] Network interface identified (connected to asset management network)
- [ ] DHCP server configured with PXE boot options
- [ ] Internet connectivity to GitHub, Docker Hub, Talos Factory, Ubuntu mirrors
- [ ] Ports 69, 80, 443, 6443 available (not in use)

## Asset Requirements

For the physical hardware you'll provision:

- **IPMI/BMC**: Out-of-band management (iDRAC, iLO, IPMI, IMM)
- **IPMI Credentials**: Username and password for each asset
- **PXE Boot**: Enabled in BIOS/UEFI
- **Network Connectivity**: Connected to same subnet as management cluster
- **Minimum Specs**: Varies by cluster type (see cluster-specific docs)

See [Discover Assets](./discover-assets.md) for asset discovery requirements.

## What's Next

Prerequisites met? Continue your journey:

[Install the CLI →](../install/cli.md)

Already have CLI installed? Initialize your management cluster:

[Initialize Management Cluster →](../install/management-cluster.md)

Need help planning your deployment? [Join our Slack community](https://konstructio.slack.com/) for architecture advice!
