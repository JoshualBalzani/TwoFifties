# Install TwoFifties on TrueNAS

[Italiano](TRUENAS.it.md) · [Project manual](../README.md) · [Ready-to-edit YAML](../deploy/truenas.yaml)

## Scope and requirements

This procedure targets **TrueNAS Docker Apps, version 24.10 or newer**. Select an apps pool in the TrueNAS interface first. It does not target the older Kubernetes Apps system or FreeBSD-based TrueNAS CORE. On CORE, use a separate Linux VM/host and follow the regular Docker instructions. TrueNAS documents the Docker Apps transition in its [24.10 Apps reference](https://www.truenas.com/docs/scale/24.10/scaleuireference/apps/).

You need administrator access to TrueNAS, space for the source and persistent data, internet access during the image build, and an available TCP port. This setup builds the included Dockerfile on your NAS; it does not depend on an image being published to Docker Hub or GHCR.

## 1. Prepare the source and persistent storage

Create a dedicated app dataset in your pool. The examples use these paths; replace **tank** with your actual pool and adjust the directory layout if needed:

| NAS path | Purpose |
| --- | --- |
| /mnt/tank/apps/twofifties/source | Complete source code, including Dockerfile, app/ and server/ |
| /mnt/tank/apps/twofifties/backups | Persistent state, JSON backups and receipt images |

Download the repository ZIP from GitHub on your computer, extract it, and copy its **contents** into the source directory using an existing share or file-transfer method. The Dockerfile must be directly at /mnt/tank/apps/twofifties/source/Dockerfile, not inside another nested TwoFifties-main directory. If Git is already available on your NAS, cloning the repository into the same source directory is an alternative. Installing extra packages into the TrueNAS operating system is unnecessary.

Keep backups outside the source directory so replacing source files does not replace your data. TrueNAS describes host paths and persistent app storage in its [app storage guide](https://apps.truenas.com/getting-started/app-storage/).

## 2. Grant the container write access

The included Docker image runs as the non-root Node user, **UID 1000 / GID 1000**. In the dataset permissions editor, allow that numeric user/group to traverse parent directories and read, create, modify and delete files inside the dedicated backups directory. With an ACL dataset, add the corresponding ACL entry; with POSIX permissions, set suitable ownership and mode on that directory. Keep administrative access for your own account.

Do not make your whole pool world-writable. If the app logs EACCES or permission denied, fix the dedicated directory permissions rather than running the container as root. The [TrueNAS custom app reference](https://www.truenas.com/docs/scale/25.10/scaleuireference/apps/installcustomappscreens/) explains numeric IDs, host paths and ACL settings.

## 3. Install using the YAML editor

1. In TrueNAS, open **Apps → Discover Apps**, then use the menu option **Install via YAML**. Labels can vary slightly between releases.
2. Set the application name to **twofifties**.
3. Open [deploy/truenas.yaml](../deploy/truenas.yaml), paste its contents into the custom configuration editor and replace both example NAS paths.
4. Replace AUTH_USER and AUTH_PASS with your own username and a long unique password. Adjust TZ or the host port if necessary. This YAML supplies environment variables directly; it does not load the .env file from the desktop setup.
5. Save and wait for the build and app startup to finish.

TrueNAS supports Compose-based custom deployments and building from an existing Dockerfile; see its [custom app installation guide](https://apps.truenas.com/managing-apps/installing-custom-apps/).

The essential storage mapping is:

```yaml
volumes:
  - type: bind
    source: /mnt/tank/apps/twofifties/backups
    target: /app/data
    bind:
      create_host_path: false
```

The directory must already exist. Port **5001 on the NAS** maps to **8080 inside the container**. If another app uses 5001, change only the left-hand port value in the template, for example 15001:8080.

## 4. Open the app and verify persistence

Open **http://YOUR_NAS_IP:5001**, authenticate with the credentials you configured, then complete the first-run guide and enter both names. Change language in **More → Settings → Language**.

In **More → Backup and restore**, create a backup. Check that a manual-*.json file appears in the NAS backups directory. Restart the app from TrueNAS and check that names and transactions remain. This verifies both persistence and write access. Use an HTTPS reverse proxy for access beyond a trusted local network.

## Import existing data

For a downloaded JSON backup, open **Backup and restore → Import backup**, choose the file and confirm. The previous state is saved before restoration. To retain receipt images when moving from another server, copy the receipts subdirectory too.

For an entire server migration, stop the old instance, copy the contents of its backups directory into the new NAS backups directory before starting the new instance, and verify permissions. Preserve latest.json, other JSON backups and receipts/. Do not overwrite an active workspace with a filesystem copy.

## Updates and recovery

Before updating, create an app backup and preserve the whole backups directory; a TrueNAS dataset snapshot is useful alongside that copy. Stop the app, update the source directory with the new release, then redeploy/rebuild the custom app from its YAML configuration. Confirm in the app logs that the image was rebuilt. Source and persistent data remain separate.

If you need to recover, choose an older JSON backup in the app or import a saved one. Keep the associated receipt images available. No financial data or credentials should be added to the GitHub repository.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Dockerfile cannot be found | The build context must be the absolute NAS source path; Dockerfile must be directly inside it. |
| Backup folder not found | Create the exact host directory before installation; the template deliberately refuses to create a mistyped path. |
| Permission denied when saving | Grant UID/GID 1000 the required access to the backups directory and traverse access to parent paths. |
| Address already in use | Pick an unused NAS host port while retaining container port 8080. |
| Authentication fails | Check the credentials in the TrueNAS YAML, not an unrelated desktop .env file. |
| Receipt image missing after moving | Copy the receipts directory alongside the JSON backup. |

The YAML is checked with Docker Compose, and Docker build/persistence are tested locally. This repository does not include a live TrueNAS test environment or claim catalog certification.
