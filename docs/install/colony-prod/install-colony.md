---
title: Install & Asset Discovery
description: Review the details you need to install Colony and discover assets
sidebar_position: 2
---

## Summary

After reviewing the [required prerequisites](../colony-prod/prereqs-colony.md), refer to the details below to install Colony.

## Step 1 - Installing Colony

The following installation instructions apply to Colony version `v0.2`.

Download and extract the Colony CLI:

```bash
curl -fsSL https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.4/colony_Linux_x86_64.tar.gz | tar xz
```

Verify the binary works:

```bash
colony version
```

Move to your PATH:

```bash
sudo mv colony /usr/local/bin/
```

## Step 2 - Create Your API Key

1. Navigate to `https://colony.konstruct.io/`
2. Log in with any of the options listed, this step creates your data center (and unique ID for the data center)
3. Go to **API Keys** and select **Create New API Key**.

**Save this information in a safe place, it only displays once.**

## Step 3 - Run the Colony `init`

```bash
colony init \
  --api-key <from-ui> \
  --data-center-id <from-ui> \
  --load-balancer-interface <asset-management-interface> \
  --load-balancer-ip <ip-address>
```

```bash
export KUBECONFIG=~/.colony/config
```

### Items to Note

- `<interface>` refers to the interface connected to `network boot`
- The IP address should be in the same subnet as the assets being discovered
    - This is the address of the `next-server` (tftp server). Refer to the following to [generate API keys](https://colony.konstruct.io/docs/install/virtual-install)

## Step 4 - Asset Discovery

Power on your assets to auto-discover. Use `ipmitool` for power management:

```bash
# Check power status
ipmitool -H <ipmi-ip> -I lanplus -U <username> -P <password> power status

# Set PXE boot and power on
ipmitool -H <ipmi-ip> -I lanplus -U <username> -P <password> chassis bootdev pxe
ipmitool -H <ipmi-ip> -I lanplus -U <username> -P <password> power on
```

Assets will PXE boot and automatically appear in the Colony UI.

## Step 5 - Adding a Cluster

After your Assets are discovered and listed as available you can use them to provision a cluster. You must have a minimum of two Assets to create a cluster (one for the Control plane and one for the Worker node).

![Create Cluster with Civo](../../img/civostack/initial-configuration.png)

1. Select **Create Cluster** to start this process.
2. Complete Cluster details, Control plane details, and Worker node information as desired.
3. Select **Create CivoStack**** to complete this process.

![Provisioning Clusters](../../img/civostack/provisioning.png)
