---
title: Asset Discovery Methods
description: Different ways to discover and register hardware assets
sidebar_position: 2
---

## Overview

Colony automatically discovers assets when they PXE boot on the management network. Use `ipmitool` to power on and manage your physical hardware.

## Power Management with ipmitool

### Check Power Status

```bash
ipmitool -H 10.90.13.16 -I lanplus -U admin -P $PASS power status
```

### Power On Asset

```bash
ipmitool -H 10.90.13.16 -I lanplus -U admin -P $PASS power on
```

### Set PXE Boot

```bash
# Set next boot to PXE
ipmitool -H 10.90.13.16 -I lanplus -U admin -P $PASS chassis bootdev pxe

# Power cycle to boot from network
ipmitool -H 10.90.13.16 -I lanplus -U admin -P $PASS power reset
```

## Bulk Discovery

For multiple assets, create a CSV file with IPMI credentials:

```bash
# Create ipmi-assets.csv with format: ip,username,password
# 10.90.13.16,admin,password1
# 10.90.13.17,admin,password2

# Power on all assets
while IFS=, read -r IP USER PASS; do
  echo "Powering on $IP..."
  ipmitool -H "$IP" -I lanplus -U "$USER" -P "$PASS" chassis bootdev pxe
  ipmitool -H "$IP" -I lanplus -U "$USER" -P "$PASS" power on
  sleep 2
done < ipmi-assets.csv
```

## Auto-Discovery Process

When assets PXE boot on the management network, Colony automatically:

1. Detects the asset via DHCP discover packet
2. Collects hardware inventory
3. Registers asset as "available" in the UI
4. Makes asset ready for provisioning

No manual registration required - assets appear automatically after PXE boot.

## What's Next

- [Asset Management Overview →](./index.md)
- [Provision Ubuntu →](./provision-ubuntu.md)
- [Create Clusters →](../clusters/index.md)
