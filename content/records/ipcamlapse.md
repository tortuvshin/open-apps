# IPCamLapse

IPCamLapse is a local-first web application for turning periodic IP-camera snapshots into H.264 timelapse videos. It runs on Windows, Linux, or Docker and serves its interface over loopback by default. A built-in simulated camera makes the complete capture-to-video workflow usable without camera hardware.

## What the codebase includes

- An ASP.NET Core Razor Pages interface for sessions, camera profiles, storage settings, system checks, captured frames, and video controls.
- A hosted capture service with explicit scheduled, capturing, paused, rendering, completed, failed, and cancelled states.
- Fixed-timeline capture scheduling that skips missed slots instead of letting slow requests create cumulative drift.
- HTTP camera requests with retries, exponential backoff, response-size limits, JPEG validation, and diagnostics.
- Reusable camera profiles whose passwords are protected at rest with ASP.NET Core Data Protection.
- An FFmpeg boundary for frame-range selection, scaling or cropping, frame rate, quality, elapsed-time overlays, and MP4 generation.
- Storage estimates, actual usage, disk reserve, configurable limits, retention cleanup, and low-space warnings.
- Self-contained Windows x64, Linux x64, and Linux ARM64 releases, plus Linux AMD64 and ARM64 container images with FFmpeg included.

## Why it is useful to study

The capture loop demonstrates two timing problems that are easy to miss in background services. Paused and out-of-window time is excluded from active capture duration, and each frame deadline advances from the planned timeline rather than from the end of the previous network request. The project uses `TimeProvider`-based tests for those rules so long-running behavior can be checked deterministically.

The camera boundary is also deliberately narrow. Camera targets default to literal private, loopback, or link-local HTTP addresses; snapshot responses are size-bounded and accepted only after JPEG validation. The application documents the resulting security model instead of presenting a local service without authentication as safe for direct internet exposure.

For end-to-end work, the demo camera exercises capture, persistence, gallery browsing, rendering, and video download without relying on a particular camera model. The integration suite drives that same path through the HTTP application.

## Caveats

IPCamLapse is an early-preview project with a small user and contributor base. Its real-camera input is an HTTP or HTTPS JPEG snapshot endpoint; it does not currently ingest RTSP streams. Native installs need a working FFmpeg executable for rendering, while the published container image includes FFmpeg.

The web interface has no user authentication. The supported deployment is a trusted machine serving the UI over loopback. Remote access needs an authenticated TLS reverse proxy and a careful review of the documented forwarded-header and access-control assumptions.

## How to run it

Download the latest Windows or Linux archive, start the executable, open the local URL, and choose **Demo camera** to test the workflow. From source, the basic development path is:

```console
git clone https://github.com/KalyteraSystems/IPCamLapse.git
cd IPCamLapse
dotnet restore --locked-mode
dotnet run --project IPCamLapse --urls http://127.0.0.1:5080
```

The published container can be run with a persistent data volume and a loopback-only host binding:

```console
docker run --detach --name ipcamlapse --publish 127.0.0.1:5080:8080 --env LocalAccess__AllowPrivateNetworks=true --volume ipcamlapse-data:/data ghcr.io/kalyterasystems/ipcamlapse:latest
```

## Verified sources

- IPCamLapse repository: <https://github.com/KalyteraSystems/IPCamLapse>
- Latest release: <https://github.com/KalyteraSystems/IPCamLapse/releases/latest>
- Container image: <https://github.com/KalyteraSystems/IPCamLapse/pkgs/container/ipcamlapse>
- Architecture: <https://github.com/KalyteraSystems/IPCamLapse/blob/main/docs/ARCHITECTURE.md>
- Security policy: <https://github.com/KalyteraSystems/IPCamLapse/blob/main/SECURITY.md>
- Contributor guide: <https://github.com/KalyteraSystems/IPCamLapse/blob/main/CONTRIBUTING.md>
