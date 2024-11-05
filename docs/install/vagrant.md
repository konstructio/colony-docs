---
title: Vagrant VM
description: Learn more about how the Vagrant VM works
sidebar_position: 5
---

## How does the Vagrant VM work?

After the virtual data center setup completes there will be a small virtual rack of servers, including an exit node, a spine leaf network, and 5 virtual machines (VM) that are waiting to be turned on and auto-enrolled with Colony.

The first part of the install is a setup that puts you on a VM “laptop” to match the experience of using Colony in a data center.

Your VM “laptop” is loaded with tools like: 
 - Docker
 - Helm
 - Kubectl - We add an alias for this 
 - Tinkerbell (Tinkerbell stack) 
 - K3d
 - Kubens
 - Colony CLI 

If you're curious about all of the tools we install, check out the repository details [in the setup here.](https://github.com/konstructio/colony-vagrant/blob/5182ef647fab8cffa17147a73ea6270da05c66fe/laptop/setup.sh#L3-L103) 

## Vagrant VM diagram

![Colony Vagrant Diagram](../img/colony/colonyvagrantdiagram.png)
