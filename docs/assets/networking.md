---
title: Network Configuration
description: Advanced networking for Colony assets and clusters
sidebar_position: 4
---

## Overview

This guide covers advanced networking configurations for Colony assets and clusters.

## Basic Networking

For most deployments, basic static IP configuration is sufficient:

- Gateway IP
- DNS servers
- NTP servers
- Static IPs per node

These are configured during cluster creation.

## VLAN Configuration

For environments with tagged VLANs:

- Management VLAN: IPMI and out-of-band access
- Provisioning VLAN: PXE boot and OS installation
- Cluster VLAN: Kubernetes control plane and data plane
- Storage VLAN: Dedicated storage traffic (optional)

:::info
VLAN configuration requires switches configured for 802.1Q tagging and proper DHCP relay for PXE boot.
:::

## Network Bonding

Link aggregation for redundancy and bandwidth:

- Active-Backup: Failover only
- LACP (802.3ad): Load balancing and failover
- Requires switch configuration

## DHCP Server Setup

If you need to run your own DHCP server for PXE:

```bash
# Install dnsmasq
sudo apt install -y dnsmasq

# Configure for PXE
sudo tee /etc/dnsmasq.d/pxe.conf <<EOF
interface=eth0
dhcp-range=192.168.1.100,192.168.1.200,12h
dhcp-boot=pxelinux.0,<hostname>,<load-balancer-ip>
enable-tftp
tftp-root=/var/lib/tftpboot
EOF

# Restart dnsmasq
sudo systemctl restart dnsmasq
```

## Troubleshooting

### PXE Boot Fails

- Verify DHCP server responds
- Check TFTP server reachable
- Ensure correct VLAN/subnet

### Network Not Reachable

- Check gateway configuration
- Verify DNS resolution
- Test with `ping`, `curl`

## What's Next

- [Asset Management →](./index.md)
- [Cluster Provisioning →](../clusters/index.md)
