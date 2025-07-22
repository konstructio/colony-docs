---
title: Install & Asset Discovery
description: Review the details you need to install Colony and discover assets
sidebar_position: 2
---

## Summary

After reviewing the [required prerequisites](../colony-prod/prereqs-colony.md), refer to the details below to install Colony.

## Step 1 - Installing Colony

The following installation instructions apply to Colony version `v0.2.2`. 

    ```bash
    git clone -b cse-config https://github.com/konstructio/colony.git
    cd colony
    go build .
    ```

## Step 2 - Create Your API Key

1. Navigate to `https://colony.konstruct.io/`
2. Log in with any of the options listed, this step creates your data center (and unique ID for the data center)
3. Go to **API Keys** and select **Create New API Key**.

**Save this information in a safe place, it only displays once.**

## Step 3 - Run the Colony `init`

We introducted 3 additional arugments in the latest version. These arguments are required for CSE install. `gitlab-token` is used to clone and push changes to `autopilot` repository in the new Gitlab instance. `docker-token` is a Github PAT that has permission to GCR and `cse-installer` container image. `api-go-token` is used for creating region in staging (default endpoint). 

    ```bash
    ./colony init \
    --api-key $YOUR_COLONY_API_KEY \
    --load-balancer-interface <asset-managment-interface> \
    --load-balancer-ip <ip-address>
    --gitlab-token <gitlab-token> \
    --api-token <api-go-token> \
    --docker-token <github-token> \
    ```
 
    ```bash
    export KUBECONFIG=~/.colony/config
    ```

Then update colony-agent image
    ```bash
    kubectl set image -n tink-system deploy/colony-colony-agent colony-agent=ghcr.io/konstructio/colony-agent:652a30e 
    ```

### Items to Note

    - `<interface>` refers to the interface connected to `network boot`.
    - The IP address should be in the same subnet as the assets being discovered.
    - This is the address of the `next-server` (tftp server). Refer to the following to [generate API keys](https://colony.konstruct.io/docs/install/virtual-install)

## Step 4 - Asset Discovery

PXE boot your new servers. The asset will appear under the assets tab in the Colony UI.

## Step 5 - Adding a Cluster

After your Assets are discovered and listed as available you can use them to provision a cluster. You must have a minimum of 5 Assets to create a cluster (three for the Control plane and two for the Worker node).

![Create Cluster with Civo](../../img/civostack/initial-configuration.png)

1. Select **Create Cluster** to start this process.
2. Fill out CSE config
3. Complete Control plane details, and Worker node information as desired.
4. Select **Create CivoStack**** to complete this process.

![Provisioning Clusters](../../img/civostack/provisioning.png)
