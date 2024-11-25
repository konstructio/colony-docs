---
title: Use Colony with Proxmox
description: Use Colony in a virtual environment with Proxmox
sidebar_position: 4
---

## Using Colony

With Proxmox installed and Colony running you should be able to view all of the infrastructure you created in the Colony UI.

## Creating Clusters

After your assets are all listed as “discovered” you can navigate to the **Clusters page** in the sidebar and we can show you how easy it is to use Colony to create a new cluster (*in this example we’ll use Talos as a demo)

:::note
In a real-world set up data centers have network segmentation rules governing the IP address ranges in use.
:::

1. Select **Create Cluster** and choose **Kubernetes** from the menu to open the initial configuration. _For this example we’re going to create a new cluster with Talos._
2. Complete the cluster details as follows:
   - Select a cluster type - Talos (_simplicity and security_)
   - Cluster Name - talos-demo (_or something similar_
   - Global Gateway IP - 10.0.10.1 (_static for the vagrant data center environment_)
   - Additional SANS (_not required_)

3. Select **Next** to continue to select a Control Plane (_you can choose one or multiples, these instructions are for one_)
4. Select the top disk (the multi-disk setup is just to show support)
   - Static IP for all the VMs --> 10.0.10.20/24
5. Select **Next** to continue to the Worker Node.
   - Static IP 10.0.10.21/24

**While it’s provisioning you will see Colony starting up the worker and control plane nodes.**

## View in Proxmox

If you navigate back to Proxmox you should see all of the VMs connected. To interact with the cluster you created, download the kubeconfig file. Export the variable and run

```shell
kubectl get nodes
```

## Deprovisioning

To destroy the virtual machine you created run the following:

```shell
START_ID=200
LAST_ID=$(($START_ID + 2))

for i in $(seq $START_ID $LAST_ID)
do
    qm stop $i
    qm destroy $i
done
```
