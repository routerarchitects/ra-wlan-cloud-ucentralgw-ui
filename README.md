<p align="center">
  <img src="images/project/logo.svg" height="170" align="middle" alt="TIP OpenWiFi Logo" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="images/project/mango-logo.png" height="90" align="middle" alt="Mango Cloud Logo" />
</p>

# OpenWiFi Gateway UI (OWGW-UI)

## Overview
The OpenWiFi Gateway UI (OWGW-UI) is the official web management interface for the Gateway Service (`owgw`) within the Telecom Infra Project (TIP) OpenWiFi CloudSDK (OWSDK) ecosystem.

OWGW-UI provides a React-based console that lets network administrators monitor, command, and manage Access Points and other uCentral-compatible devices (such as switches & olg) connected to the OpenWiFi gateway. To run the interface, you can set it up locally for [development](#development) or compile it for [production](#production).

## Role in Mango Cloud
This service is part of [Mango Cloud](https://www.mangowifi.cloud/), Router Architects’ open-source platform for managed Wi-Fi and connectivity operations.

Within Mango Cloud, **OWGW-UI** serves as the **Gateway Management Console** (integrated into the primary management dashboard).

Key integrations include:
* **Device Control Panel**: Interacts with the Gateway REST API (`owgw` port `16002`) to visually trigger device commands (reboots, LED toggles, channel changes, telemetry pulls).
* **Security & Authentication Integration**: Authenticates administrators through the Security Service (`owsec` port `16001`) and uses the issued JWT tokens to authorize API requests.
* **Firmware Management Board**: Manages firmware release binaries and orchestrates batch upgrades via the Firmware Service (`owfms` port `16003`).

### Resources
* [Mango Cloud Website](https://www.mangowifi.cloud/)
* [Mango Cloud Deployment Guide](https://github.com/routerarchitects/mango-cloud-deployment)
* [Router Architects GitHub Organization](https://github.com/routerarchitects)

### Gateway Guides
* [Device Onboarding Overview](https://www.mangowifi.cloud/docs/operations/device-onboarding/onboarding-overview)
* [Device Operations & Commands](https://www.mangowifi.cloud/docs/operations/device-operations-owgw/device-actions-overview)
* [Telemetry & Monitoring](https://www.mangowifi.cloud/docs/operations/device-operations-owgw/telemetry-monitoring)

## Key Features
The Gateway Console provides a unified interface for the following operations:
* **Active Device Manager**: Live inventory dashboard displaying device connections, hardware types, IP/MAC addresses, and network interface statuses (Devices and Device pages).
* **Default Configurations**: Manage and assign default JSON configuration templates to coordinate setting profiles across group nodes.
* **Firmware Upgrade Coordinator**: Keep track of available firmware releases, set default binaries per device type, and schedule upgrades.
* **Diagnostics & Telemetry**: Review real-time console logs, WebSocket telemetry reports, and notifications stream directly from active Access Points.
* **Administrative Role-Based Access (RBAC)**: Manage users, passwords, and service preferences via a secure administrative interface.

## Running the Application

### Development
To run the development server locally, ensure you have [Node.js](https://nodejs.org/) installed:

```bash
git clone https://github.com/routerarchitects/ra-wlan-cloud-ucentralgw-ui
cd ra-wlan-cloud-ucentralgw-ui
npm install
npm run dev
```
By default, the development server will run on port `3000` (`http://localhost:3000`).

### Production Build
To generate production-ready static assets:

```bash
npm run build
```
Once the build completes, the output assets will be generated in the `./build` directory and can be served using Nginx, Apache, or any static content host.

### Configuration
To configure the application endpoints during local development, create a `.env` file in the root folder and set the Security Service (`owsec`) URL:

```text
VITE_UCENTRALSEC_URL=https://<owsec-host>:16001
```
