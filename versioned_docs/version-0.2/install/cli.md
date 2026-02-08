---
title: Install the Colony CLI
description: Download and install the Colony command-line interface
sidebar_position: 1
---

## Overview

The Colony CLI is a command-line tool for managing bare metal infrastructure, provisioning clusters, and interacting with the Colony API.

The Colony CLI provides commands for:
- Initializing management clusters
- Discovering and managing hardware assets
- Provisioning operating systems
- Creating Kubernetes clusters
- Managing IPMI credentials

## Prerequisites

Before installing the Colony CLI, ensure you have:

- **Operating System**: Linux (x86-64 architecture)
- **Network**: Internet connectivity to download the binary

:::info
Arm processors are not currently supported. Colony requires x86-64 architecture.
:::

## Installation

### Step 1: Download and Extract

Download the Colony CLI binary:

```bash
curl -fsSL https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.4/colony_Linux_x86_64.tar.gz | tar xz
```

This downloads and extracts the `colony` binary to your current directory.

### Step 2: Verify the Binary

Test that the binary works:

```bash
colony version
```

**Expected output:**
```
colony version v0.2.4
```

### Step 3: Move to PATH

```bash
sudo mv colony /usr/local/bin/
```

## Verify Installation

Confirm the CLI is installed correctly:

```bash
colony version
```

You should see output showing the Colony version information.

Test that the CLI is accessible from any directory:

```bash
cd ~ && colony version
```

## Troubleshooting

### Command Not Found

If the `colony` command is not found after installation:

Check that `/usr/local/bin` is in your PATH:
```bash
echo $PATH | grep -o '/usr/local/bin'
```

If not found, add it to your shell profile:
```bash
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Download Failed

If the download fails with a network error:

1. Check your internet connection
2. Verify you can access the URL:
   ```bash
   curl -I https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.4/colony_Linux_x86_64.tar.gz
   ```
3. Try downloading to a file first:
   ```bash
   curl -fsSL https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.4/colony_Linux_x86_64.tar.gz -o colony.tar.gz
   tar xzf colony.tar.gz
   ```

## What's Next

Now that you have the CLI installed, you're ready to:

- [Initialize your management cluster](./management-cluster.md) - Setup colony and its supporting components
- [Review prerequisites](../getting-started/prerequisites.md) - Ensure your environment meets requirements
- [Create an API key](../getting-started/api-key.md) - Get credentials for authentication
