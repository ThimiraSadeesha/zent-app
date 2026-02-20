<p align="center">
  <h1 align="center">⚡ Zent</h1>
  <p align="center">A modern, encrypted remote server monitoring & Docker management dashboard.</p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#license">License</a>
</p>

---

## Overview

Zent is a lightweight web dashboard that connects to remote Linux servers via **SSH** and provides real-time system monitoring and Docker container management — all through an elegant, animated UI. Every API request and response is encrypted end-to-end using **AES-256-GCM**, ensuring credentials and telemetry never travel in plaintext.

---

## Features

- **🔐 Secure SSH Authentication** — Connect to any remote server with host, port, username & password. Credentials are stored in `httpOnly`, `Secure`, `SameSite=Strict` session cookies.
- **📊 Real-Time System Monitoring** — Live dashboards for CPU usage, memory consumption, disk utilization, uptime, and logged-in user.
- **🐳 Docker Container Management** — List all containers (running & stopped), and **start**, **stop**, or **restart** them with a single click.
- **🔒 End-to-End API Encryption** — All API payloads are encrypted with AES-256-GCM. A unique encryption key is generated per session.
- **🛡️ Security Headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy` headers are set on every response.
- **🚪 Middleware Route Protection** — Unauthenticated users are automatically redirected away from protected routes.
- **✨ Modern Animated UI** — Sleek dark-themed interface with background beam animations powered by Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI, Lucide Icons |
| **Animations** | Motion (Framer Motion) |
| **SSH** | ssh2 (Node.js) |
| **Encryption** | Node.js `crypto` — AES-256-GCM |
| **Runtime** | Node.js 22 (Alpine) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions (self-hosted runner) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **npm** ≥ 10
- A remote Linux server accessible via SSH (with Docker installed for container management features)

### Installation

```bash
# Clone the repository
git clone https://github.com/ThimiraSadeesha/zent-ui.git
cd zent-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your remote server's SSH credentials to start monitoring.

---

## Deployment

### Docker

Build and run a standalone production container:

```bash
docker build -t zent-app .
docker run -d -p 3000:3000 --name zent --restart unless-stopped zent-app
```

### Docker Compose (Multi-Instance)

The included `docker-compose.yml` spins up **3 instances** behind different ports for load balancing:

```bash
docker compose up -d
```

| Instance | Port |
|---|---|
| zent-app-1 | `3001` |
| zent-app-2 | `3002` |
| zent-app-3 | `3003` |

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/github-pipelines.yml`) handles:

- **Pull Requests** — Builds a validation Docker image and cleans up after.
- **Push to `main`** — Builds, stops old containers, and deploys 3 fresh instances on a self-hosted runner.

---

## Architecture

```
zent-ui/
├── app/
│   ├── api/
│   │   ├── server/
│   │   │   ├── login/        # POST — SSH authentication & session creation
│   │   │   ├── logout/       # Session termination
│   │   │   └── stats/        # GET  — CPU, memory, disk, uptime
│   │   └── docker/
│   │       └── containers/   # GET  — List containers
│   │                         # POST — Start / Stop / Restart container
│   ├── components/
│   │   ├── background/       # Animated background beams
│   │   ├── docker/           # Docker container cards
│   │   ├── login/            # Login form + background
│   │   ├── server/           # System resource cards
│   │   └── shared/           # Reusable UI components
│   ├── dashboard/            # Protected dashboard page
│   └── page.tsx              # Home / Login page
├── lib/
│   ├── encryption.ts         # Server-side AES-256-GCM encrypt/decrypt
│   ├── encryption-client.ts  # Client-side secure fetch wrapper
│   ├── ssh.ts                # SSH connection & command execution
│   └── utils.ts              # Shared utilities
├── proxy.ts                  # Next.js middleware (auth guard)
├── Dockerfile                # Multi-stage production build
├── Dockerfile.build          # CI validation build
├── docker-compose.yml        # Multi-instance deployment
└── next.config.ts            # Security headers & config
```

### Request Flow

```
Browser ──► Next.js Middleware (auth check)
               │
               ├── ✗ Redirect to /
               └── ✓ Proceed
                      │
                      ▼
              API Route Handler
                      │
               Decrypt Request (AES-256-GCM)
                      │
                      ▼
               SSH into Remote Server
                      │
               Execute Command
                      │
                      ▼
               Encrypt Response (AES-256-GCM)
                      │
                      ▼
                   Browser
               Decrypt & Render
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**Copyright © 2026 Thimira Sadeesha**

---

<p align="center">
  Developed and Designed by <strong>Lumiraq Team</strong>
</p>
