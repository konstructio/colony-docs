---
title: Install & Asset Discovery
description: Review the details you need to install Colony and discover assets
sidebar_position: 2
---

## Summary

After reviewing the [required prerequisites](../colony-prod/prereqs-colony.md), refer to the details below to install Colony.

## Installing Required Packages

    ```bash
    apt update && apt install wget
    ```

Refer to [Docker Documentation](https://docs.docker.com/desktop/setup/install/linux/) for Docker’s system requirements.

    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    ```

Add your user to the Docker group. Skip this step if you are `root` user

    ```bash
    sudo usermod -aG docker $USER
    ```

After running the command you might need to exit your current session and start new one. To test your permissions to interact with the Docker daemon run

    ```bash
    docker run docker.io/hello-world
    ```

Refer to the linked documentation for more post-installation [steps in Docker](https://docs.docker.com/engine/install/linux-postinstall/)

For kubectl, use the following:

    ```bash
    wget "https://dl.k8s.io/release/v1.31.2/bin/linux/amd64/kubectl" sudo install -o kubectl /usr/bin/local
    chmod 555 /usr/bin/local/kubectl
    ```

## Installing Colony

The following installation instructions apply to Colony version 0.02-rc1 (code named `Christmas-night`).

    ```bash
    git clone -b ipmi https://github.com/konstructio/colony.git
    cd colony
    go build .
    ```

### Items to note

    - `<interface>` refers to the interface connected to `network boot`.
    - The IP address should be in the same subnet as the assets being discovered.
    - This is the address of the `next-server` (tftp server). Refer to the following to [generate API keys](https://colony.konstruct.io/docs/install/virtual-install)

    ```bash
    ./colony init \
    --api-key $YOUR_COLONY_API_KEY \
    --load-balancer-interface <interface> \
    --load-balancer-ip <ip-address>
    ```

    ```bash
    export KUBECONFIG=~/.colony/config
    ```

To manually patch the colony-agent image until we publish a new release

    ```bash
    kubectl -n tink-system set image deployment/colony-colony-agent \
    colony-agent=ghcr.io/konstructio/colony-agent:93fde8b
    ```

## Asset Discovery

To discover an asset run:

    ```bash
    ./colony add-ipmi \
    --ip <asset-managment-address> \
    --username <username> \
    --password <ipmi-password> \
    --auto-discover
    ```

The new asset will appear under the assets tab in Colony. Colony workflows can now be run against the asset.
