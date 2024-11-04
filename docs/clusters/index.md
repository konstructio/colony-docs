---
title: Using Colony
description: Learn more about Konstruct's bare metal data center product
sidebar_position: 5
---
# Summary
After successfully installing the virtual Vagrant environment you're ready to start discovering assets with Colony and adding configurations.

## Discovering Assets

Now that everything is installed and your VM “laptop” is up and running you’re going to connect the data center to Colony.

1. Run the following command to connect your data center to Colony

```
colony init -–apiKey= $COLONY_API_KEY –apiURL=https//colony-api-virtual.konstruct.io
```
2. Next, exit to return the shell back to the data center.
   
```
exit
```
3. Finally, from the data center context run this command to turn on one of the reserved servers every 30 seconds, and auto-enroll them with Colony, making them available for provisioning operations.

```bash
bash ./virtual-datacenter/power-on.sh
```

:::info
If you connect to Colony and (*in the UI*) nothing appears after a minute or two there’s definitely an issue with the setup. Get in touch with us and we’ll be happy to get you sorted out. 
:::

4. Now imagine you’re walking around in the data center to “turn on” the virtual machines. (This process is smaller in scale and slower than it would be in an actual data center because of the constraints of the testing environment and all of the functionality we’ve built in for this “sandbox”.)

You should see something like this

![Colony new data center](./img/colony/newdatacenter.png)



## Creating Clusters