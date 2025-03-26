---
title: Colony Admin
description: Follow the steps to install Colony in a virtual Vagrant environment
sidebar_position: 6
---

## Deprovisioning

To remove Colony you will need to destroy the assets that were created in Colony and in Civo to avoid accumulating cloud costs.

:::tip
The Civo instance that hosts this virtual environment costs just under $1 to run for 4 hours, which is plenty of time to create some new bare metal Kubernetes clusters and add a hello world.
:::

1. To destroy your data center, run the `exit` command in your terminal to log off of the laptop.
2. Then run the `exit` command again to leave the data center.
3. These commands  drop you back into the interactive `colony-vagrant` shell which will allow you to select `option > destroy datacenter`.
4. Select enter to clean up your virtual data center in the cloud including the Assets and any clusters that you created related to the Assets.

## Updating Colony

Coming Soon
