---
title: Installing Colony
description: Follow the steps to install Colony in a virtual Vagrant environment
sidebar_position: 3
---

# Installing Colony

## Summary

This installation guide walks through what you need to install Colony into a repeatable Vagrant virtual environment. The virtual data center `colony-vagrant` creates an environment that you can host on a single Civo compute instance to explore Colony

_We’re working to expand support for this virtual data center to include AWS soon._

## What you’ll need

To be able to install and run this virtual environment you need:

- Git (Run `brew install git`)
- Make (Run `brew install make`)
- A [Civo API key](https://www.civo.com/docs/account/api-keys)
- A Colony API token (_details on creating this below_)

:::tip
The Civo instance that hosts this virtual environment costs just under $1 to run for 4 hours, which is plenty of time to create some new bare metal Kubernetes clusters and add a hello world.
:::

### Generate your Colony API Key

Logging in to Colony for the first time creates your account and gives you access to create an API Key. Accounts can be created by logging in with: Civo, GitHub, GitLab, or Google.

Complete the steps to generate a new Colony API Key

1. Log in to [Colony](https://colony.konstruct.io/)
2. Navigate to **API Keys** and select **Generate API Key**
   ![Colony API Key](../img/colony/colony-apikey.png)

3. Once created, **copy and save the key** to use in your Colony install.

## Steps to install Colony

Follow the steps below to launch a virtual Vagrant environment.

1. Run the following command to clone the Vagrant repository for Colony.

   ```git
   git clone https://github.com/konstructio/colony-vagrant
   ```

2. Navigate to the directory for the repository and make your data center.

   ```bash
   cd colony-vagrant
   make dc
   ```

3. In the terminal, **select a region**. (_We typically use `nyc1`_)
4. Add your **Civo API Key**.
5. Enter your default **SSH key** (or your own/explicit key).
6. Enter **a name** for your data center instance.
7. Add your **Colony API Key**.
8. Select the default **Colony CLI**.
9. Click to select **Create data center**.

_The process to create your virtual data center typically takes about 10 minutes._

After the virtual data center setup completes there will be a small virtual rack of servers, including an exit node, a spine leaf network, and 5 virtual machines (VM) waiting to be turned on and auto-enrolled with Colony.

## What's next?

- [Start using Colony to discover assets](virtual-install2)
- Check out what's [included with the Vagrant VM](vagrant)
