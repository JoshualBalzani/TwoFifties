# Install TwoFifties: the complete beginner guide

This guide takes you from downloading the project to verifying your first saved expense, then explains other devices, automatic startup, backups, updates and recovery. Git is optional: a ZIP download works too. Run the commands on your own computer or server, not on the GitHub Pages website.

[Guida italiana](INSTALLATION.it.md) · [Application manual](../README.md) · [Project website](https://joshualbalzani.github.io/TwoFifties/)

## Contents

- [1. Understand what you are installing](#1-understand-what-you-are-installing)
- [2. Choose your installation](#2-choose-your-installation)
- [3. Prepare files and terminal](#3-prepare-files-and-terminal)
- [4. Docker on Windows or Mac](#4-docker-on-windows-or-mac)
- [5. Docker on Linux](#5-docker-on-linux)
- [6. Start with Docker Compose](#6-start-with-docker-compose)
- [7. Nodejs on Windows](#7-nodejs-on-windows)
- [8. Nodejs on Mac or Linux](#8-nodejs-on-mac-or-linux)
- [9. Automatic startup without Docker](#9-automatic-startup-without-docker)
- [10. TrueNAS step by step](#10-truenas-step-by-step)
- [11. Other NAS devices and hosting](#11-other-nas-devices-and-hosting)
- [12. First launch and persistence checks](#12-first-launch-and-persistence-checks)
- [13. Phones and other devices](#13-phones-and-other-devices)
- [14. Remote access and HTTPS](#14-remote-access-and-https)
- [15. Configuration explained](#15-configuration-explained)
- [16. Backups and recovery](#16-backups-and-recovery)
- [17. Update without losing data](#17-update-without-losing-data)
- [18. Move an older installation](#18-move-an-older-installation)
- [19. Troubleshooting](#19-troubleshooting)
- [20. Final checklist and getting help](#20-final-checklist-and-getting-help)

## 1. Understand what you are installing

TwoFifties opens in a browser but needs a **running server**. That can be your Windows PC, Mac, Linux computer, compatible NAS or hosted server. It runs the application, stores files and lets your two devices share the same workspace.

A phone is a **client**: it opens the server's address. You do not install Docker or Node.js on every phone. The two names entered during setup are not separate accounts: the workspace is shared, with a shared access password if configured.

| Term | Practical meaning |
| --- | --- |
| Repository | The project files published on GitHub. |
| Terminal | A command window: PowerShell on Windows, Terminal on Mac/Linux. |
| Server/host | The machine running TwoFifties, which must remain available. |
| Docker | Runs the app in a separate environment called a container. |
| Compose | Reads `docker-compose.yml` and sets up the container. |
| Port | The number after the colon in the address, normally `5001`. |
| localhost | The device on which you are opening the browser; not necessarily the server. |
| backups | The directory containing real workspace data and receipt images. |

**GitHub Pages hosts the product website and this guide, not the application server.** Opening `app/index.html`, uploading files to static hosting or forking the repository does not provide working APIs, shared synchronization and server backups. No external database, cloud account or API key is required.

## 2. Choose your installation

| Your situation | Follow this route | What must stay running |
| --- | --- | --- |
| Try it on Windows or Mac | Docker Desktop, then section 6; or Node.js | The computer and Docker, or the Node process. |
| Linux server or mini PC | Docker Engine with Compose | The host and Docker service. |
| TrueNAS with Docker Apps | Section 10 and the included YAML | The NAS and custom application. |
| Another Docker-capable NAS | Section 11; check build support and persistent directories | The NAS and container. |
| Prefer no Docker | Node.js 24 or newer | The Node process; configure automatic startup for regular use. |
| Access away from home | Working local installation, then section 14 | A reachable server and remote-access setup. |
| Only have a phone | You also need a machine or service hosting the server | This server version does not run on the phone alone. |

Choose **one route** to begin. Running Docker and Node on the same port causes a conflict; you do not need all the installation methods.

Allow disk space for the source files, Docker images when used, backups and receipts. Usage depends on your data; the project does not claim a measured minimum hardware specification. Initial installation requires internet, and download/build time varies with your connection and machine.

## 3. Prepare files and terminal

### Download without Git

1. Open the [TwoFifties repository](https://github.com/JoshualBalzani/TwoFifties).
2. Select **Code → Download ZIP**, or use the [direct ZIP download](https://github.com/JoshualBalzani/TwoFifties/archive/refs/heads/main.zip).
3. Extract the archive. On Windows choose **Extract All**; do not work inside the compressed folder.
4. Move the extracted directory to a stable location, such as `C:\TwoFifties` or `~/TwoFifties`. Avoid temporary directories and cloud-synchronized folders for active data.
5. Check that `package.json`, `docker-compose.yml`, `Dockerfile`, `app`, `server` and `scripts` are visible together. If you only see another directory named `TwoFifties-main`, open that directory first.

You can rename `TwoFifties-main` to `TwoFifties`. Enable file-name extensions in Windows File Explorer so you can distinguish `.env` from `.env.txt`.

### Download using Git, if installed

```sh
git clone https://github.com/JoshualBalzani/TwoFifties.git
cd TwoFifties
```

Git is optional when using the ZIP. If `git` is not recognized, use the ZIP or install Git from its [official website](https://git-scm.com/downloads).

### Open a terminal in the right directory

On Windows open PowerShell and adapt the path:

```powershell
cd "C:\TwoFifties"
Get-ChildItem
```

On Mac/Linux open Terminal:

```sh
cd "$HOME/TwoFifties"
ls
```

Quotes are especially important for paths containing spaces. Copy only the commands inside a code block, not its language label or a terminal prompt. Run one command at a time and wait for completion. PowerShell and Bash examples are not interchangeable.

**Expected result:** the listing includes `package.json` and the project directories. If not, correct your location before continuing. Do not create replacement project files to work around being in the wrong folder.

## 4. Docker on Windows or Mac

Docker Desktop provides the tools needed for section 6. You do not need Node.js installed on the host for this route.

### Windows

1. Follow the [official Docker Desktop Windows installation guide](https://docs.docker.com/desktop/setup/install/windows-install/) and check its current system requirements.
2. Install the version matching your machine. This app needs **Linux containers**.
3. Complete any requested WSL 2 setup or restart first. For WSL problems follow the [Microsoft installation guide](https://learn.microsoft.com/windows/wsl/install).
4. Open Docker Desktop and wait until its engine is running.
5. Open a new PowerShell in the project directory:

```powershell
docker --version
docker compose version
docker info
```

The first two commands should display versions. `docker info` must contact the engine. `Cannot connect to the Docker daemon` means Docker is not ready or running; this problem occurs before TwoFifties starts.

### Mac

1. Use **About This Mac** to identify Apple Silicon or Intel.
2. Follow the [official Docker Desktop Mac installation guide](https://docs.docker.com/desktop/setup/install/mac-install/) and select the matching download.
3. Open Docker Desktop, finish setup and wait for its engine.
4. In a new Terminal run `docker --version`, `docker compose version` and `docker info`.

You do not need to manually force an image platform or find a supposed public TwoFifties image: the included configuration **builds the local source**. Continue with section 6.

## 5. Docker on Linux

These instructions assume a normal Linux host with administrative access. Do not install Docker into the TrueNAS operating system using these steps; use its dedicated section.

1. Identify the host distribution, such as Ubuntu or Debian.
2. Install Docker Engine following the official guide for [Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [Debian](https://docs.docker.com/engine/install/debian/) or [your distribution](https://docs.docker.com/engine/install/).
3. Install the [Compose plugin](https://docs.docker.com/compose/install/linux/) if missing.
4. Check `docker --version`, `docker compose version` and `docker info`.

If the Docker guide requires `sudo`, use commands such as `sudo docker compose version`. You can prefix subsequent Docker commands with `sudo` when your account cannot access the engine. Docker group membership grants substantial host privileges; do not change membership merely to conceal a permissions problem.

Create the data directory inside TwoFifties before startup:

```sh
mkdir -p backups
```

The included container uses **UID 1000 and GID 1000**. On Linux with ordinary POSIX permissions, if that identity cannot write to the dedicated directory:

```sh
sudo chown -R 1000:1000 ./backups
```

Run this from the project directory and only against its `backups` directory, never an entire disk. ACLs, rootless Docker and user mappings may need host-specific settings. Configure the mounted directory correctly instead of using `chmod 777`.

## 6. Start with Docker Compose

### Create the configuration file

From the project directory, copy the template **for a new installation**. If `.env` already exists, edit and preserve it instead of replacing it with a blank template.

PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Mac/Linux:

```sh
cp .env.example .env
nano .env
```

Any plain-text editor is fine. In nano, save with Ctrl+O, Enter and exit with Ctrl+X. Do not save an RTF document on Mac.

The template contains:

```dotenv
PORT=5001
TZ=Europe/Rome
AUTH_USER=
AUTH_PASS=
CLEAR_ALL_PASSWORD_HASH=
```

For protected access, set **both** `AUTH_USER` and `AUTH_PASS`. Choose a username without `:` and a long, unique password. These are not the two display names. Never publish `.env` or real credentials on GitHub.

```dotenv
PORT=5001
TZ=Europe/Rome
AUTH_USER='choose-a-username'
AUTH_PASS='replace-with-a-long-unique-password'
CLEAR_ALL_PASSWORD_HASH=
```

Replace the examples. Single quotes help treat `$` and `#` literally. If the password contains a single quote, choose another value or follow the [official Compose env syntax](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/). Leaving both blank means no login; do not use that on an exposed server or untrusted network. Setting just one field is not a valid protected setup: the server currently enables its check when `AUTH_USER` is present.

### Build and run

```sh
docker compose up --build -d
docker compose ps
docker compose logs --tail=100 twofifties
```

The first command downloads the Node base image and builds the app. Download messages alone are not errors. `-d` keeps the container running after you close the terminal. In `ps`, look for `Up` or equivalent and the published port. Logs should show server startup rather than repeated restarts.

On the server computer open **http://localhost:5001**. If authentication is enabled, enter the configured username and password. Continue to section 12 to verify actual saving.

### Useful commands

| Task | Command from the TwoFifties directory |
| --- | --- |
| Check status | `docker compose ps` |
| Recent logs | `docker compose logs --tail=100 twofifties` |
| Follow logs | `docker compose logs -f twofifties` |
| Stop following logs | Ctrl+C; this does not stop a detached container. |
| Stop the app | `docker compose stop twofifties` |
| Restart the existing container | `docker compose restart twofifties` |
| Apply changed env or source files | `docker compose up --build -d` |

A plain `restart` does not recreate a container with new environment values. With the included model, host directory `./backups` is mounted at `/app/data`. Do not change that mapping or delete its directory to fix a startup problem.

`restart: unless-stopped` helps restart the app when Docker starts; it does not switch on a powered-off computer or launch Docker Desktop for you. Enable Docker Desktop startup at login if desired. On Linux check that the Docker service starts automatically.

## 7. Nodejs on Windows

This route runs the app directly and does not require Docker.

1. Install a supported LTS release of **Node.js 24 or newer** from the [official download page](https://nodejs.org/en/download). Node 24 is the version used in the project's Dockerfile and CI.
2. Close and reopen PowerShell to refresh PATH.
3. Open the project directory as described in section 3.
4. Check versions:

```powershell
node --version
npm.cmd --version
```

Node must report `v24` or higher, not `v18`, `v20` or `v22`.

5. Create `.env` as in section 6 if you want credentials or another port; `npm start` reads it.
6. Install dependencies and run:

```powershell
npm.cmd ci
npm.cmd ci --prefix server
npm.cmd start
```

Using `npm.cmd` avoids PowerShell blocking the `npm.ps1` wrapper with a script execution policy message. You do not need to disable the global execution policy. In Command Prompt, `npm` is normally sufficient.

**Expected result:** the terminal stays open showing the server message. Open **http://localhost:5001**. Keep that terminal open while using the app; closing it ends this foreground process. To stop it deliberately, press Ctrl+C. To start again, return to the same directory and run only `npm.cmd start`; reinstalling dependencies on every launch is unnecessary.

## 8. Nodejs on Mac or Linux

Install a supported LTS version of Node 24 or newer from the [official website](https://nodejs.org/en/download) or a version manager whose instructions you follow. Distribution repositories may provide older releases: check the version number, not merely whether the command exists.

```sh
node --version
npm --version
cd "$HOME/TwoFifties"
npm ci
npm ci --prefix server
npm start
```

Create `.env` first if needed, as in section 6. Open **http://localhost:5001** on the server. The foreground process stops with Ctrl+C.

Do not use `sudo npm ci` as a universal permissions fix. The project and data directory should be writable by the account running the app. Do not substitute `node server/server.js`: it bypasses `.env` loading and the paths configured by `scripts/start.cjs`. Use `npm start` or `node scripts/start.cjs`.

`npm ci` uses the included lockfiles. If it cannot find `package-lock.json`, check the directory and ZIP extraction instead of deleting lockfiles or blindly changing commands.

## 9. Automatic startup without Docker

A manual Node launch does not guarantee availability after closing the terminal, disconnecting SSH or restarting the machine. For regular use choose a system service or Docker.

### Windows Task Scheduler

1. Verify that `npm.cmd start` works, then stop it with Ctrl+C to avoid two processes using the same port.
2. Run `where.exe node` and keep the full executable path, for example `C:\Program Files\nodejs\node.exe`.
3. Open **Task Scheduler** and create a task named TwoFifties for your account.
4. For a personal PC choose a trigger at user logon. Use running without a logged-in session only if you understand its account credentials and permissions.
5. Set the program to the Node executable, arguments to `"C:\TwoFifties\scripts\start.cjs"`, and **Start in** to `C:\TwoFifties`.
6. Save, run the task manually and open the app. Check that your saved names appear.

Adapt every path. Normal operation on port 5001 does not require administrator privileges. Moving the project or changing Node's location requires checking the task again. Restart the PC once to verify the intended behavior.

### Linux user service with systemd

This applies to distributions using systemd, not the TrueNAS operating system. First run `command -v node` and `pwd` in your project directory: your actual paths may differ.

```sh
mkdir -p "$HOME/.config/systemd/user"
nano "$HOME/.config/systemd/user/twofifties.service"
```

Example for an account named `mario`, to adapt:

```ini
[Unit]
Description=TwoFifties personal expense server

[Service]
Type=simple
WorkingDirectory=/home/mario/TwoFifties
ExecStart=/usr/bin/node /home/mario/TwoFifties/scripts/start.cjs
Environment=NODE_ENV=production
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Replace `/usr/bin/node` with the path from `command -v node` and the project path with your actual directory. Version managers such as nvm may use a version-specific executable path that needs updating later.

```sh
systemctl --user daemon-reload
systemctl --user enable --now twofifties
systemctl --user status twofifties --no-pager
journalctl --user -u twofifties -n 100 --no-pager
```

To keep a user service running without an active session, an administrator can enable lingering for your account:

```sh
sudo loginctl enable-linger "$USER"
```

Verify after a reboot. Stop with `systemctl --user stop twofifties`, or disable with `systemctl --user disable --now twofifties`. On Mac, Docker Desktop is the managed-restart route documented here; a Node terminal does not automatically become a macOS service.

## 10. TrueNAS step by step

This route targets **TrueNAS with Docker-based Apps, from version 24.10**. It does not apply to TrueNAS CORE/FreeBSD or the older Kubernetes Apps system. Use a Linux VM or separate host for incompatible systems. UI labels vary between releases; see the [official custom Apps guide](https://apps.truenas.com/managing-apps/installing-custom-apps/).

### Prepare storage

1. Open the TrueNAS administrative interface.
2. Select/configure an Apps pool if needed.
3. Create a dedicated dataset and source/data directories. This guide uses:

| Directory | Contents |
| --- | --- |
| `/mnt/tank/apps/twofifties/source` | Source files with `Dockerfile` directly inside. |
| `/mnt/tank/apps/twofifties/backups` | Live state, backup JSON and `receipts`. |

`tank` is a placeholder: replace it with your real pool. Keep `backups` outside `source` so code updates cannot replace the data directory.

4. Download and extract the ZIP on your computer. Copy the extracted **contents** to `source` using a share or your usual transfer method. The file should be `source/Dockerfile`, not `source/TwoFifties-main/Dockerfile`.
5. Check that `server`, `app` and the other project files are present. Do not install Node or packages with `apt` in the TrueNAS operating system.
6. Set permissions on `backups`: the container writes as UID/GID **1000:1000**. It needs traversal of parent directories and permission to read, create, modify and delete data files. Use the dataset ACL editor when appropriate and preserve administrative access. Do not change the entire pool or use `777` as a general fix.

### Create the application

1. Open **Apps → Discover Apps** and find **Install via YAML** in the menu.
2. Choose a name such as `twofifties`.
3. Copy the [repository template](../deploy/truenas.yaml), also shown here:

```yaml
services:
  twofifties:
    build:
      context: /mnt/tank/apps/twofifties/source
      dockerfile: Dockerfile
    environment:
      TZ: Europe/Rome
      AUTH_USER: 'choose-a-username'
      AUTH_PASS: 'replace-with-a-long-unique-password'
      BACKUP_DIR: /app/data
    ports:
      - "5001:8080"
    volumes:
      - type: bind
        source: /mnt/tank/apps/twofifties/backups
        target: /app/data
        bind:
          create_host_path: false
    restart: unless-stopped
```

4. Replace **both** paths and both credentials. Do not leave demonstration values. The data directory must already exist; `create_host_path: false` helps catch a mistyped path instead of silently creating another directory.
5. If port 5001 is occupied, change only the left-hand number, for example `"15001:8080"`.
6. Save and wait for the build. Read the logs if startup fails or repeats.
7. Open **http://NAS_IP:5001**, or the port you selected. Replace `NAS_IP` with your NAS's real address.
8. Complete section 12, restart the app through TrueNAS and verify that data remains.

This YAML passes environment values directly to the container; it **does not read the `.env` file on your PC**. No prepublished TwoFifties image on Docker Hub or GHCR is required. If the YAML menu is missing, check release, Apps section and account privileges. Do not paste Compose into a field expecting only an image name.

The [dedicated TrueNAS guide](TRUENAS.md) links additional storage and ACL references. Not every NAS model or TrueNAS release has been tested: Compose syntax and the container can be checked, but verify UI behavior and permissions on your actual device.

## 11. Other NAS devices and hosting

### Synology, QNAP and other Docker hosts

Check your model's documentation for Linux containers, persistent storage and **Dockerfile/Compose `build` support**. An editor that accepts only `image:` may not build this project.

The essentials remain a full source directory, separate persistent data directory, host port mapped to **8080 in the container**, credentials and writable storage for the container user. Use paths on the actual NAS, not paths from another computer.

If its manager cannot build, the NAS administrator can build on its Docker engine:

```sh
docker build -t twofifties:local .
```

Then configure that manager to use the local image instead of `build`, preserving port and volume settings. Build on the engine that will run the image, or arrange a suitable image transfer matching the host architecture. There is no universal certified procedure for every NAS manager.

### VPS or managed Node hosting

A Linux VPS can use the Docker or Node route. A managed platform must support long-running Node 24+ processes, **persistent disk storage**, and its required listening port.

A repository-based Node deployment uses the repository root, dependency installation `npm ci --prefix server --omit=dev`, start command `npm start`, `BACKUP_DIR` on the persistent disk, and `AUTH_USER`/`AUTH_PASS` in the service's environment settings. A platform may supply `PORT`; do not replace it with 5001 if the platform requires another value. Do not commit a real `.env` to pass secrets.

An ephemeral filesystem may lose data on every redeployment. Serverless, PHP-only hosting and GitHub Pages are not equivalent to this Node server. Sleeping or stopped services cannot synchronize until they run again. Provider pricing and limits are outside the project.

## 12. First launch and persistence checks

A visible page does not prove server-side persistence. Follow these checks:

1. Open the correct address and enter server credentials when configured.
2. Complete onboarding. Introductory slides can be skipped; **two distinct, nonempty names** are required.
3. Choose your theme. Preferences and language are available through **More → Settings** on mobile or the desktop navigation.
4. Create a €1 test expense with a recognizable description. Check payer and split, then save.
5. Check the server indicator in the top bar. A local browser save does not prove that the server is reachable.
6. Open **Backup and restore**, choose **Create backup** and verify the new list entry.
7. On the host, check that `backups` contains `latest.json` and a `manual-....json` file. For Docker inspect the mounted host directory, not only files inside the container.
8. Reload: names and the test expense should remain.
9. Restart the container or Node process and check again. This verifies persistence.
10. Open the same server from another browser/device and check that it shows the same workspace. Delete the test expense in the app when finished if you do not want to keep it.

Opening **http://localhost:5001/api/health** on the host should return `{"status":"ok"}` after authentication when configured. This endpoint is also protected by server login. It checks reachability, not complete backup integrity.

## 13. Phones and other devices

### Find the host address

Windows: run `ipconfig` and find the IPv4 address of the connected network adapter, or read network settings. Linux: `hostname -I` may show multiple addresses; select the LAN address. On Mac use the Wi-Fi/Ethernet details in network settings.

If the host is `192.168.1.50`, open **http://192.168.1.50:5001** on the phone. Replace this example with your actual address. `localhost` on a phone means that phone, not the PC.

The phone and host need a reachable network path. Guest Wi-Fi, client isolation, VLANs or mobile data can prevent access. A sleeping PC cannot serve other devices.

Allow only necessary access on a trusted private network when the firewall asks; do not disable the entire firewall. Docker on Linux has its own port-publishing behavior; see [Docker's firewall limitations](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations). A DHCP reservation on the router can keep the LAN address stable.

### Home-screen shortcuts and offline use

Use your browser's add-to-home-screen feature when available. This is not an App Store or Play Store package. Installation and camera functions depend on browser and device support.

Service workers and offline caching require a supported secure context, normally **HTTPS** or `localhost`. The app at `http://192.168...` may work online without all offline/install features. Visit online on each device and test caching before relying on it.

Synchronization happens when the browser app is running and can reach the server; do not assume continuous syncing with the browser closed. HTTP/HTTPS, different ports and different domains are different browser origins with separate local copies. Do not clear site data while unsynchronized changes remain.

## 14. Remote access and HTTPS

First verify local access, backups and credentials. A `192.168...` address is not normally reachable from the public internet. A private VPN between your devices is one option; follow your chosen system's instructions.

A public domain needs a reachable host, correct DNS, HTTPS and authentication. Basic login **does not encrypt plain HTTP** or create separate user accounts. Do not simply open router port 5001 while leaving access unprotected.

Example with Caddy installed **on the same host** as an app already running on port 5001:

```caddyfile
expenses.example.com {
    reverse_proxy 127.0.0.1:5001
}
```

Replace the placeholder with a domain you control. Configure DNS and proxy reachability using the [Caddy automatic HTTPS guide](https://caddyserver.com/docs/automatic-https). Caddy handles certificates when its prerequisites are met. See also its [reverse proxy quick start](https://caddyserver.com/docs/quick-starts/reverse-proxy).

This example does not install Caddy, configure your router/firewall or bypass CGNAT. If Caddy is another container, `127.0.0.1` refers to that container: an administrator should configure a shared Docker network and backend `twofifties:8080`. Prefer a dedicated subdomain; the app uses absolute `/api/...` paths and cannot simply be moved under an arbitrary URL prefix.

If the proxy runs on the host and direct access is unnecessary, the Compose mapping can be restricted to loopback as `"127.0.0.1:5001:8080"`. Direct LAN access to that port then stops; clients must use the proxy. Avoid conflicting authentication layers that overwrite `Authorization` or demand incompatible credentials.

## 15. Configuration explained

| Variable | Node through npm start | Included Docker Compose |
| --- | --- | --- |
| `PORT` | Process port, normally 5001. | Host port; the container keeps port 8080. |
| `TZ` | Process timezone, such as Europe/Rome. | Passed to the container. |
| `AUTH_USER` | Shared username; its presence enables login. | Passed to the container. |
| `AUTH_PASS` | Shared password; configure both fields. | Passed to the container. |
| `CLEAR_ALL_PASSWORD_HASH` | Optional complete-deletion password hash. | Passed to the container. |
| `BACKUP_DIR` | Alternative data directory; prefer an absolute path. | The model uses `/app/data`; adding this only to `.env` does not change the mount. |
| `PUBLIC_DIR` | Set to the app directory by the startup script. | Determined by the image structure; normally unchanged. |

Values already present in the process environment may take precedence over the file. If a setting does not change, check service, task or provider settings too. On TrueNAS edit the application's YAML.

To use host port 15001, set `PORT=15001` in `.env` and restart Node or recreate Docker with `docker compose up --build -d`. Open **http://localhost:15001** afterward. On TrueNAS edit the port mapping instead.

### Separate password for deleting all data

This is optional and not required for normal installation or use. With `CLEAR_ALL_PASSWORD_HASH` blank, the server-protected complete-deletion feature is unavailable. Do not place a plain-text password in this field.

The required `salt:hash` format uses a random 16-byte salt and a 64-byte scrypt result, both hexadecimal. On a machine with Node, generate it without echoing the password:

```sh
node scripts/create-clear-password.cjs
```

Paste only the generated value into `CLEAR_ALL_PASSWORD_HASH` in `.env` or your TrueNAS YAML, then restart Node or recreate the container. This is separate from the login password. If forgotten, preserve a backup and generate a new hash; the original password cannot be recovered from the app.

If using Docker without host Node, you can use a temporary runtime container mounting **only** `scripts` read-only. Replace the absolute example path and keep the quotes:

```sh
docker run --rm -it --mount "type=bind,source=/absolute/path/TwoFifties/scripts,target=/tools,readonly" node:24-alpine node /tools/create-clear-password.cjs
```

On Windows, `source` can be a path such as `C:\TwoFifties\scripts`. This downloads the Node runtime if needed and does not mount your data directory.

## 16. Backups and recovery

### What to keep

| File/directory | Purpose |
| --- | --- |
| `latest.json` | Current server state. |
| `daily-*.json` | Daily snapshots created when the server persists state; none are produced while the server is off. |
| `manual-*.json` | Backups requested from the app. |
| `pre-restore-*.json` and safety files | Copies retained before restoration or conversion. |
| `receipts/` | Actual receipt images; JSON files contain their references. |
| `.env` or service configuration | Ports and credentials; preserve privately. |

Automatic cleanup covers `daily` backups older than the 90-day window. This is not a remote backup service. A copy on the same disk does not protect against that disk failing; keep an independent protected copy.

### Create and download

1. Open **Backup and restore**.
2. Choose **Create backup** and wait for confirmation.
3. The file is created on the server. Use its **Download** icon to save the JSON to your device.
4. For a complete transfer, also keep `receipts` or the entire data directory.

Excel export is useful for reading transactions but **does not replace** a complete workspace backup.

### Restore JSON through the app

1. Bring devices with offline edits online and resolve conflicts first.
2. Back up the current state.
3. Choose **Import backup**, select the JSON and read the preview.
4. Use an accepted format within the interface's size limit, normally 4.5 MB for this flow.
5. Confirm only if you want to replace the workspace. The server first saves a safety copy.
6. Refresh other devices and check names, expenses, recurrences, budgets and receipts.

**Import transactions** adds JSON/CSV transactions and is not equivalent to complete restore. If rejected, retain the original file and read the message; do not edit payers/shares by hand merely to force acceptance.

### Full copy and recovery when startup fails

Stop the app before copying live files so JSON and receipts form a consistent set. Copy the whole data directory to a new destination; do not move or delete the only copy. Preserve configuration and the source version too.

If `latest.json` is corrupt, first duplicate the whole directory and retain the corrupt file for investigation. With the server stopped, a working copy can use a known complete backup as `latest.json`, preserving receipts and permissions. If uncertain about its format, use a separate installation and the interface's restore flow rather than overwriting the sole archive.

## 17. Update without losing data

### Before updating

Tell the other person, wait for device synchronization, create an in-app backup and preserve **all** data and configuration independently. Avoid edits during migration. Keep the previous source or record its commit using `git rev-parse HEAD` when using Git.

Example archive after stopping Docker from the project directory:

PowerShell:

```powershell
docker compose stop twofifties
$backupStamp = Get-Date -Format "yyyyMMdd-HHmmss"
Compress-Archive -Path .\backups -DestinationPath "..\TwoFifties-backups-$backupStamp.zip"
```

Mac/Linux:

```sh
docker compose stop twofifties
tar -czf "../TwoFifties-backups-$(date +%Y%m%d-%H%M%S).tar.gz" backups
```

For Node, stop its process or service and copy the directory with your file manager or backup tool. Archives contain personal data: choose their destination carefully. If copying or updating fails, restart the previous version without deleting anything.

### Update a Git checkout

```sh
git pull --ff-only
```

If Git reports local edits or divergence, stop and preserve your changes. Do not blindly run `git reset --hard`.

Docker:

```sh
docker compose up --build -d
docker compose logs --tail=100 twofifties
```

Node: run `npm ci` and `npm ci --prefix server` again, then `npm start` or restart its service. PowerShell can use `npm.cmd`. Restarting an old container alone does not build updated code.

### Update a ZIP installation

Extract the new ZIP to **a new directory**, not over a running installation. After stopping the old instance, privately copy `.env` and the data directory into the correct new location, or retain an already configured external data mount. Never run two app versions against the same archive simultaneously. On TrueNAS update `source`, keep `backups` separate, then rebuild/redeploy from its UI.

Repeat section 12 and test the second device. A service worker update may require reloading. Do not clear browser storage containing unsynchronized changes.

### Roll back

Keep pre-update data and the previous source. Stop the new server and test a **matching** previous code/data pair in a separate directory before resuming normal use. Do not assume a newer data format is readable by every older version.

## 18. Move an older installation

For a normal move, finish device edits, stop the old server and copy `backups`, including `receipts`, to the new host. Configure persistent paths and permissions, start, verify and update the phones' address. Keep the old archive until the new one is checked.

### Previous named Docker volume

Only use these commands if the old installation stored data in the previous container volume. Run them in that old installation while its container still exists, after safeguarding any data already present on the destination:

```sh
docker compose stop twofifties
docker compose cp twofifties:/app/data/. ./backups
docker compose up --build -d
```

If `./backups` already contains another workspace, do not merge the archives. Export the old data to a separate directory and choose which workspace to restore. Do not use `docker compose down -v` or delete the old volume before verifying.

### Previous Node data directory

`npm start` copies old `data` contents into `backups` at initial startup only when `data/latest.json` exists and the new current-state file is absent. Preserve the original directory. If both contain data, do not force a merge.

### Legacy SPESE backups

Restore attempts conversion when saved names identify the two people unambiguously. The original imported JSON is retained alongside the pre-restore safety copy. An uncertain mapping is rejected: keep the message and request help without posting personal financial data.

## 19. Troubleshooting

Start with the matching symptom. Deleting `backups`, `.env` or browser data should not be the first response.

| Symptom | Check | What to do |
| --- | --- | --- |
| `docker` not recognized | Missing installation or old terminal environment. | Complete official setup and open a new terminal. |
| `Cannot connect to the Docker daemon` | Docker Desktop/Engine stopped. | Start Docker and wait for `docker info` to work. |
| Compose command unavailable | Missing plugin or old command syntax. | Check `docker compose version`; this guide uses a space, not `docker-compose`. |
| WSL/virtualization unavailable | Windows Docker prerequisites. | Complete official WSL/setup steps or consider Node on an incompatible PC. |
| `no configuration file provided` | Wrong working directory. | Enter the directory containing `docker-compose.yml`. |
| Missing Dockerfile/package.json | Unextracted ZIP or nested source directory. | Check the file listing and build context. |
| Download/npm network error | Internet, DNS, proxy, registry or disk issue. | Fix the host connection/settings and available space before retrying. |
| `node`/`npm` not recognized | Missing Node or PATH update. | Install Node 24+ and reopen the terminal. |
| `npm.ps1` blocked | PowerShell wrapper policy. | Use `npm.cmd`; do not disable the global policy. |
| Unsupported Node / missing process.loadEnvFile | Node too old. | Check the version used by the actual terminal or service. |
| `EADDRINUSE` / occupied port | Duplicate instance or another service. | Stop the old instance or change the host port, not randomly the container's 8080. |
| Cannot open even on the host | Stopped process, wrong address or port. | Check status, logs and `/api/health` locally. |
| Works on PC, not phone | localhost, firewall, guest Wi-Fi or sleeping host. | Use the server IP and the network checks in section 13. |
| Repeated password request / HTTP 401 | Wrong credentials or proxy rewriting Authorization. | Check both fields, recreate Docker and try a private browser window to avoid cached credentials. |
| Old password after changing it | Container not recreated or env set elsewhere. | Recreate with Compose; for Node restart and inspect service environment. |
| EACCES / permission denied / backup fails | Data directory unwritable. | Check mount, ownership and ACLs; included container uses UID/GID 1000. |
| TrueNAS host path does not exist | Missing or incorrect directory. | Create/correct the exact path rather than hiding the path check. |
| No TrueNAS Web UI button | No custom link configured for YAML app. | Open NAS IP and mapped port manually. |
| Repeated container restarts | Startup, corrupt state, permissions or full disk. | Read recent logs, preserve data and address the first useful error. |
| Missing data after restarting | Wrong volume/directory or earlier local-only save. | Stop edits and locate the previous archive; do not overwrite it with a new workspace. |
| Devices show different workspaces | Different server/URL or offline copy. | Compare address, port and domain, check reachability and synchronize. |
| Modification conflict | Same record edited in different copies. | Read and resolve the comparison; do not choose blindly. |
| Missing receipts after moving | Only JSON copied. | Recover the `receipts` directory and check permissions. |
| Backup rejected / too large | Wrong format, client limit or proxy/server limit. | Use a compatible complete backup and correct import flow; never truncate the JSON. |
| Deletion says password not configured | Optional hash is absent. | Configure section 15's hash; normal app use does not need it. |
| HTTPS 502/504 | Proxy cannot reach backend. | Check app and networking; container localhost is not the host. |
| HTTPS certificate fails | DNS, domain, ports, proxy or CGNAT. | Check HTTPS prerequisites and proxy logs. |
| Offline/camera/install unavailable | Insecure LAN HTTP, permissions or browser support. | Try HTTPS and check permissions; capabilities vary by browser. |
| Old interface after update | Old page/service worker. | Synchronize first, close tabs and reload; clear data only after safeguarding changes. |
| Disk full | Receipts, backups, Docker images or logs. | Keep an independent backup and identify what can be removed; never delete the sole data copy. |

To identify a port owner, Windows can use `Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue`, Linux `ss -ltnp`, and Mac `lsof -nP -iTCP:5001 -sTCP:LISTEN`. Identify the process before stopping it; it may be another required service.

To uninstall, stop the app and preserve backups/configuration. `docker compose down` removes this project's containers; adding `-v` is unnecessary. Delete source/data only after deciding what to keep. For Node, also disable any scheduled task or service you created.

## 20. Final checklist and getting help

- I know which device runs the server and where the real data is stored.
- The host and second device reach the same correct server address.
- A saved test survives restarting the actual server.
- I have a complete backup, including receipts, on an independent destination.
- Automatic startup is verified if continuous availability is needed.
- Credentials and HTTPS or appropriate private remote access are configured.
- I can stop the service and inspect logs without deleting data.

For help, open a [repository issue](https://github.com/JoshualBalzani/TwoFifties/issues) with OS/NAS version, installation method, Node/Docker version, the step followed, exact error and relevant recent logs. Say whether direct access on the server works and whether a proxy is involved.

**Never attach `.env`, passwords, Authorization headers, financial backups or private receipts.** Redact private data in screenshots. These instructions describe the included project; router, NAS and provider settings may need adaptation.
