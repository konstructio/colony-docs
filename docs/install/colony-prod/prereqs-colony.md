---
title: Colony Prerequisites
description: Review the details you need to get started with Colony in production
sidebar_position: 1
---

## Summary

Before getting started with a production Colony deployment we recommend reviewing the following.

### Common Terms

- **Laptop**: A machine used to bootstrap a Colony installation. The use of this term does not represent an actual laptop. It could be a physical machine or virtualized machine.

- **Assets**:

### Hardware Requirements

A machine running Colony requires a minimum of the following:
    - 8 GB of Ram
    - 4 or more recent x86-64 CPU cores. _Arm processors are not currently supported._
    - 64Gb for root volume. _We highly recommend a high throughput drive for the boot drive._

### Networking Requirements

A good rule of thumb regarding network requirements for Colony is to put it on the same subnet as the machines you would like it to manage. Colony relies on (Layer 2 DHCP protocol) and the DHCP Discover packet to identify and create a record for a machine.

At present, Colony doesn't include a DHCP server. If your have separate networks for interacting with out-of-band management inside the assets and reaching out to the internet, the Colony interface connected to the network should be untagged. _It currently only supports IPV4._

The network boot (PXE) subnet should have access to the following addresses to pull manifest, container images, and boot images

- Github
- Github Container registry
- Docker Hub
- Talos Factory
- Ubuntu mirrors

:::tip

To summarize:

- Interface connected to out-of-band network and network boot should be untagged
- DHCP server running inside network boot
- Internet Access

:::

### Operating Systems

Colony has been tested with the following operating systems. Theoretically any operating system supported by Docker should work.

- Ubuntu 22.04
- Debian 12

### Packages

- `docker`
- `git`
- `wget`
- `kubectl`

### Other Requirements

Colony requires root privileges for machine running.
