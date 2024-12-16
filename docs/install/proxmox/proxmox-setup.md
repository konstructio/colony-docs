---
title: Installing Colony with Promox
description: Follow the steps to install Colony with Proxmox
sidebar_position: 2
---

## Installing Colony with Proxmox

This guide walks through the setup of Laptop-0, a machine for running Colony, and 3 additional VM's for Colony to auto discovery and install a Talos cluster.  Some items to note:

- Colony requires Docker.

Warning: Colony will be able to PXE boot all machines in your network.

## Getting Started

The steps here are optional, but we recommend completing these to create a Proxmox template VM that you can clone to for better performance and asset creation.

### Debian image

These steps use a `debian cloudinit image for laptop VM`. The commands below should be issued in the Proxmox host machine. You can SSH into the host or use the shell in the Proxmox UI. 
To access the shell select `Datacenter` > your node (choose one if you have multiple > `shell`.

- You will need to install `libguestfs-tools` to interact with cloud-init image.

    ```shell
    apt update
    apt install libguestfs-tools
    ```

:::tip
We recommend prepending sudo to these commands if you are running a user other than `root`. 
:::

Start by creating a directory. This will contain temporary artifacts we need to create template VM. Then download Debian cloud-init image [debian download image](https://cloud.debian.org/images/cloud/). 

```shell
mkdir debian-golden-img

wget https://cloud.debian.org/images/cloud/bookworm/20241004-1890/debian-12-genericcloud-amd64-20241004-1890.qcow2

```

### Guest agent and VIM
We recommend using `virt-customize` to install `qemu-guest-agent` and `vim`. The `qemu-guest-agent` provides a communication channel between a virtual machine and its Proxmox, enabling features like shutdown, time synchronization, and better management of guest systems.  

```shell
virt-customize -a debian-12-genericcloud-amd64-20241004-1890.qcow2 --install qemu-guest-agent
virt-customize -a debian-12-genericcloud-amd64-20241004-1890.qcow2 --install vim
```

### Helm and Kubectl

Install Kubectl and Helm binaries and copy them over to the template VM to ensure these tools are available for managing Kubernetes clusters and Helm charts. Adding them to the template VM ensures that they are automatically included in any new VMs created from the template, eliminating the need for manual installation. 

For helm

```shell
wget https://get.helm.sh/helm-v3.16.2-linux-amd64.tar.gz
tar xvf helm-v3.16.2-linux-amd64.tar.gz
virt-customize -a debian-12-genericcloud-amd64-20241004-1890.qcow2 --copy-in ./linux-amd64/helm:/usr/local/bin/

rm -rf ./linux-amd64
```

For kubectl

```shell
# kubectl
wget "https://dl.k8s.io/release/v1.31.2/bin/linux/amd64/kubectl"
virt-customize -a debian-12-genericcloud-amd64-20241004-1890.qcow2 --copy-in ./kubectl:/usr/local/bin/
```

### Resize config

To prepare the virtual machine increase the disk size to `32 Gb` and remove any machine-specific information generated in the previous step. This ensures that the image can be cloned and reused without conflicts.

```shell
virt-sysprep -a debian-12-genericcloud-amd64-20241004-1890.qcow2

virt-customize -a debian-12-genericcloud-amd64-20241004-1890.qcow2 --truncate /etc/machine-id 

qemu-img resize debian-12-genericcloud-amd64-20241004-1890.qcow2 32G
```

### New ssh-keypair (optional)

Generate ssh-keypair or or specify your own in the next step.

```shell
ssh-keygen -f general-io
```

### Create a VM and template

The following command create a Virtual machine and converts it to a template.

- Machine config 2 GB memory and 2 CPU cores.
- Creates user called `kray` with password `kray`.
- Configures machine to use DHCP to get the IP address.
- Enables qmeu-agent on Proxmox side.
- User creation is not mandatory, but it makes it easier to login through the console.

_Note: the commands below assumes that you are not using spinning rust._

```shell
export TEMPLATE_ID=800
export TEMPLATE_NAME="debian-golden-image-$(date +%Y%M%d)"
export STORAGE="local-lvm"
export SSH_PUBLIC_KEY="./general-io.pub"

qm create ${TEMPLATE_ID} --name "$TEMPLATE_NAME" --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0
qm importdisk ${TEMPLATE_ID} debian-12-genericcloud-amd64-20241004-1890.qcow2 local-lvm
qm set ${TEMPLATE_ID} --scsihw virtio-scsi-single --scsi0 "${STORAGE}":vm-${TEMPLATE_ID}-disk-0,iothread=1,cache=none,ssd=1,discard=on
qm set ${TEMPLATE_ID} --cpu host
qm set ${TEMPLATE_ID} --boot c --bootdisk scsi0
qm set ${TEMPLATE_ID} --ide2 "${STORAGE}":cloudinit
qm set ${TEMPLATE_ID} --serial0 socket --vga serial0
qm set ${TEMPLATE_ID} --agent enabled=1
qm set ${TEMPLATE_ID} --ciuser kray
qm set ${TEMPLATE_ID} --cipassword kray
qm set ${TEMPLATE_ID} --ipconfig0 ip=dhcp
qm set ${TEMPLATE_ID} --sshkey "$SSH_PUBLIC_KEY"
qm template ${TEMPLATE_ID}
```

## Setup for Laptop-0

To complete the setup for Laptop-O you will:

- Clone the template VM (full clone)
- Start the VM
- IP address of the machine displays on the machine summary page
- Use this IP to access the machine through the console or SSH
  - For SSH use the corresponding private key for the public key supplied at the top.
  - If you are on the proxmox host machine private key corresponds to where ever you created `debian-golden-img/general-io`

```shell
ssh -i <private-key> kray@<ip-address>
```

### Install Docker

1. Install docker [for details refer to their documentation here.](https://github.com/docker/docker-install)

    ```shell
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    ```

2. Add your user to the `docker group` and restart your shell. You can exit out of your session and login right back

    ```shell
    usermod -aG docker kray
    ```

3. Run a test docker container

    ```shell
    docker run docker.io/hello-world
    ```

## Set up Colony

### Download Colony

Use the following command to download the Colony binary

```shell
wget https://objectstore.nyc1.civo.com/konstruct-assets/colony/v0.2.0-rc4/colony_Linux_x86_64.tar.gz
tar xvf colony_Linux_x86_64.tar.gz
sudo mv colony /usr/local/bin
```

### Install Colony
Install colony. Better wording would be creaste a Colony cluste or something. Check the interface you are listening on with `ip a` command.
Colony will use this interface to listen to DHCPOFFER traffic and respond with boot files.

colony init \
    --api-key=$COLONY_API_KEY \
    --load-balancer-interface=$INTERFACE \
    --load-balancer-ip=$LOAD_BALANCER_IP
    --loadBalancerIP <loadbalancer>
```

### Create virtual machines for Colony to auto-discover and bootstrap

Use the following command to create and start virtual machine for Colony to auto-discover and provision.

```shell
STORAGE="local-lvm"
START_ID=200
LAST_ID=$(($START_ID + 2))

for i in $(seq $START_ID $LAST_ID)
do
    qm create "$i"  \
        --name <nice name - append $i>
        --boot order='scsi0;net0' \
        --bios seabios \
        --cores 2 \
        --cpu host \
        --memory 2048 \
        --net0 virtio,bridge=vmbr0,firewall=1 \
        --ostype l26 \
        --scsi0 file="${STORAGE}":32,iothread=1 \
        --scsihw virtio-scsi-single \
        --start 1
done
```

## What's Next

After a few seconds the machines will show up in the Colony UI with `Discovering` status and then to `Available`. Once the hardware/machine become `Avaiable` you are ready to provision a Talos cluster.

- Check out the docs on [Using Colony with Proxmox](./proxmox-usage.md) to provision your cluster.
