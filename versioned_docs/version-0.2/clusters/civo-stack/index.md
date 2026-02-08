---
title: Civo Stack Enterprise
description: Private cloud on your bare metal infrastructure
sidebar_position: 1
---

# Civo Stack Enterprise

## Overview

Civo Stack Enterprise transforms your bare metal infrastructure into a complete private cloud platform. Deploy VMs, Kubernetes, databases, object storage, and serverless workloads - all on your own hardware.

[Learn more about Civo Stack Enterprise →](https://www.civo.com/civostack-enterprise)

**Provisioning time**: 40-60 minutes to fully configured private cloud.

## What You Get

A complete private cloud platform with:

**Compute & Workloads**

- Live VM migration with zero downtime
- Native Kubernetes clusters
- Windows and Linux multi-tenancy
- GPU and AI/ML workload support
- Serverless and containerized applications

**Storage & Data**

- Object storage for backups and artifacts
- Block storage for persistent volumes
- DBaaS (managed MySQL, PostgreSQL)

**Management**

- Centralized web dashboard
- Infrastructure as Code (API, CLI, Terraform)
- Automated updates and security patches
- Hybrid cloud integration (AWS, Azure, GCP)

**Enterprise Features**

- 24/7 enterprise support
- SOC 2, ISO 27001 certified
- VMware migration tools included
- 7-year price guarantee

## Minimum Requirements

To create a Civo Stack cluster, you need:

**Assets**: **5 minimum** - 3 control plane nodes + 2 worker nodes (required for distributed storage)

**Credentials**: GitLab token, image pull secret, Civo API token, and region identifier. [Contact your Civo account manager](https://www.civo.com/contact) for access.

**Network**: Gateway IP, DNS servers, NTP servers, and static IPs for each node.

**Management Cluster**: Running and accessible with Colony agent deployed.

## Why Choose Civo Stack?

**Choose Civo Stack for:**

- Complete private cloud platform (compute, storage, databases)
- Live VM migration and enterprise features
- Multi-tenancy and hybrid cloud requirements
- VMware replacement or modernization
- Production workloads requiring managed services

**Consider K3s instead for:**

- Development and testing environments
- Lightweight Kubernetes without VMs
- Edge deployments with minimal infrastructure

**Consider Talos Linux instead for:**

- Kubernetes-only deployments (no VMs)
- Maximum customization and flexibility
- Generic infrastructure without vendor services

## Ready to Deploy?

[Create Civo Stack Cluster →](./create.md)

[Review Prerequisites →](./prerequisites.md)

## Learn More

- [Civo Stack Enterprise Product Page](https://www.civo.com/civostack-enterprise)
- [Talos Linux Documentation](https://www.talos.dev/)
- [Contact Civo Sales](https://www.civo.com/contact)
- [Compare Cluster Types](../index.md)

Need help? [Join our Slack community](https://konstructio.slack.com/)
