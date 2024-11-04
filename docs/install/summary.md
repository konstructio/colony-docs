---
title: Installing Colony
description: Follow the steps to install Colony in a virtual Vagrant environment
---

# Installing Colony

## Summary
This installation guide walks through what you need to install Colony into a repeatable Vagrant virtual environment. 

Ensure you have the components required for the installation and then refer to the steps to get Colony up and running to check out the interface. 

## Colony Vagrant Support

This installation guide walks through what you need to install Colony into a repeatable Vagrant virtual environment. The virtual data center `colony-vagrant` creates an environment that you can host on a single Civo compute instance to explore Colony
We’re working to expand support for this virtual data center to include AWS soon. 


## What You’ll Need
To be able to run this virtual environment for Colony you’re going to need the following:

 - Git (Run `brew install git`)
 - Make (Run `brew install make`) 
 - A [Civo API key](https://www.civo.com/docs/account/api-keys) 
 - A Colony API token (*details on creating this below*)

### Generate your Colony API Key 

Logging in to Colony for the first time creates your account and gives you access to create an API Key. Accounts can be created by logging in with: Civo, GitHub, GitLab, or Google.

Complete the steps to generate a new Colony API Key

1. Log in to Colony (https://colony.konstruct.io/)
2. Navigate to **API Keys** and select **Generate API Key**

![Colony API Key](./img/colony/colony-apikey.png)

3. Once created, copy and save the key information to use in your Colony install.

