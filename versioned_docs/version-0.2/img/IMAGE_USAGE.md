# Image Usage in Colony Documentation

## Civostack Images (docs/img/civostack/)

### Already in Use
- `initial-configuration.png` - Used in clusters/civo-stack/create.md Step 2
- `provisioning.png` - Used in clusters/civo-stack/create.md Provisioning Timeline
- `control-plane.png` - (OLD) Similar to newer screenshots, may be redundant
- `worker-node.png` - (OLD) Similar to newer screenshots, may be redundant

### Newly Organized
- `worker-nodes-step5.png` - ✅ Added to clusters/civo-stack/create.md Step 4
- `control-plane-advanced-config.png` - ✅ Added to clusters/civo-stack/create.md Step 3 (Advanced Config)
- `cluster-details-step3.png` - Detailed cluster config (Basic Details + Network + IP Ranges + Storage)
- `cluster-ip-ranges-step3.png` - IP range configuration (MxLinkNet, Node IP, Ingress IP, Tenant IP)
- `cluster-storage-step3.png` - Storage configuration (Mayastor + CEPH + Wasabi)
- `cluster-storage-wasabi-step3.png` - Storage with Wasabi credentials visible

### Legacy (Probably Old UI)
- `cluster-details-basic-details.png`
- `cluster-details-ip-ranges.png`
- `cluster-details-storage.png`
- `cluster-details-whitelist-policy.png`
- `cluster-details.png`
- `clusters-civostack.png`

**Note**: The "step3" images show newer UI with more advanced features (IP ranges, storage backends, Wasabi)
than the current docs describe. These could be added as an "Advanced Configuration" section.

## Assets Images (docs/img/assets/)

- `assets-list-available.png` - ✅ Added to assets/index.md (shows assets with "available" status)
- `assets-list-mixed-status.png` - ✅ Added to getting-started/discover-assets.md (shows mixed statuses)

## Clusters Images (docs/img/clusters/)

- `cluster-provisioning-status.png` - Shows cluster during provisioning (nodes showing "Provisioning" status)
- `cluster-detail-provisioned.png` - ✅ Added to clusters/add-nodes.md (all nodes provisioned)
- `cluster-add-nodes-dropdown.png` - ✅ Added to clusters/add-nodes.md (Add Nodes menu)
- `add-worker-nodes-modal.png` - ✅ Added to clusters/add-nodes.md (Add Worker Nodes dialog)
- `cluster-download-config.png` - ✅ Added to clusters/civo-stack/create.md Verification (Download button)
- `cluster-download-config-hover.png` - Shows hover state of download button

## UI Images (docs/img/ui/)

- `clusters-empty-create-dropdown.png` - ✅ Added to guides/ui-walkthrough.md (Create Cluster dropdown)

## Colony Images (docs/img/colony/)

### Already in Use
- `colonylanding.png` - Used in docs/index.md
- API key and signup screenshots available for future use

## Templates Images (docs/img/templates/)

### Ubuntu Provisioning Workflow
- `assets.png` - Assets list view
- `ubuntu/select.png` - Template selection
- `ubuntu/template.png` - Ubuntu template details
- `ubuntu/provisioning.png` - Provisioning in progress
- `ubuntu/ready.png` - Ubuntu provisioned successfully

**Recommendation**: Add these to assets/provision-ubuntu.md to show the visual workflow

## Cypress Test Screenshots (docs/img/cypress/)

- `cluster/create-form-step1.png` - Test screenshot, may not be useful for user docs
- `cluster/create-form-step2.png` - Test screenshot, may not be useful for user docs

## Usage Images (docs/img/usage/)

- `clusters-empty.png` - Empty clusters view
- `newdatacenter.png` - New datacenter view

## Summary

**Images Added to Docs (9 total)**:
1. assets/assets-list-available.png → assets/index.md
2. assets/assets-list-mixed-status.png → getting-started/discover-assets.md
3. ui/clusters-empty-create-dropdown.png → guides/ui-walkthrough.md
4. civostack/control-plane-advanced-config.png → clusters/civo-stack/create.md
5. civostack/worker-nodes-step5.png → clusters/civo-stack/create.md
6. clusters/cluster-detail-provisioned.png → clusters/add-nodes.md
7. clusters/cluster-add-nodes-dropdown.png → clusters/add-nodes.md
8. clusters/add-worker-nodes-modal.png → clusters/add-nodes.md
9. clusters/cluster-download-config.png → clusters/civo-stack/create.md

**Remaining Images to Consider**:
- Ubuntu provisioning workflow (5 images) → Could add to assets/provision-ubuntu.md
- Advanced cluster config screenshots (3 images) → Could add as advanced guide
- Legacy civostack images (7 images) → May be outdated, keep for reference

**Images Not Needed**:
- Cypress test screenshots (internal testing)
- colonyvagrantdiagram.png (vagrant install deprecated)
