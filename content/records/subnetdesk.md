# SubnetDesk

SubnetDesk is a cross-platform remote desktop application for devices that can already reach each
other through the same LAN, a routed private network, or a VPN. It is derived from RustDesk but
deliberately removes the public device-ID, rendezvous, relay, cloud-account, proxy, and automatic
public-update paths. Users connect directly by IP address or hostname, while mDNS can discover
nearby devices on a local network.

## What makes it different

The project is narrower than a general Internet remote-support service. It assumes that routing is
already handled by the user's LAN or VPN and keeps the connection on that existing path. This makes
it useful for home labs, offices, classrooms, and on-site support where public coordination is
unnecessary or undesirable.

SubnetDesk retains remote control, clipboard, audio, and file transfer. Its access controls include
username/password authentication with Argon2id password hashes, trust-on-first-use endpoint
fingerprints, and CIDR source-network allowlists. The codebase pairs a Rust systems core with a
Flutter interface and ships for Windows, macOS, Linux, and Android.

## Caveats

SubnetDesk does not provide Internet rendezvous, NAT traversal, or a relay service. Both endpoints
must already be mutually reachable through a LAN, private route, or VPN. Its listening port should
only be exposed to trusted networks, and users should verify a new device fingerprint through a
separate trusted channel when possible.

## How to get it

The latest GitHub release provides Windows MSI and portable executable builds, macOS disk images
for Intel and Apple Silicon, Linux DEB, RPM, AppImage, Flatpak, and Arch packages, and Android APKs.

## Verified sources

- Repository: <https://github.com/zibo-chen/SubnetDesk>
- Latest release: <https://github.com/zibo-chen/SubnetDesk/releases/latest>
- Project scope and comparison: <https://github.com/zibo-chen/SubnetDesk#why-subnetdesk>
- Security model: <https://github.com/zibo-chen/SubnetDesk#security-model>
- Build instructions: <https://github.com/zibo-chen/SubnetDesk#build-from-source>
