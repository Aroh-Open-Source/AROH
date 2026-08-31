# AROH Open Source Platform & Application Ecosystem

**AROH** is a next-generation open-source platform and distributed product ecosystem that unifies autonomous services, intelligent applications, and decentralized developer tooling under a unified design architecture and semantic synchronization engine.

---

## 🏛️ Ecosystem Architecture

```text
AROH Open Source/
├── Aroh/                              # Central AROH Platform Hub & Services
│   ├── apps/
│   │   └── web/                       # Next.js 16 (Turbopack) Full-Stack Web Portal & Hub
│   ├── packages/
│   │   ├── ads/                       # AROH Design System (ADS Tokens & Components)
│   │   └── asdk/                      # AROH Platform SDK (Auth, Ledger, AI, Sync Engine)
│   ├── manifests/                     # Managed Project Semantic Manifests (v1.0.0 Schema)
│   └── scripts/                       # Automated QA & E2E Validation Suites
└── Products/                          # Standalone & Integrated Ecosystem Applications
    ├── OmniStream/                    # Dual-Mode Video Intelligence & Streaming Platform
    │   ├── src/                       # Cinemorph AI (3D WebGL Theater) + UTube Search
    │   └── src/tests/                 # Tier 1-5 Adversarial & Journey Test Suites (218 tests)
    └── Spedex/                        # Fintech Speed & Spending Analytics Workspace
        ├── backend/                   # Spring Boot 3 Java Analytics Engine
        ├── dashboard_app/             # Vite + React Real-Time Financial Dashboard
        └── mobile/                    # React Native / Expo Smart Wallet Mobile App
```

---

## 🚀 Registered Ecosystem Products

1. **OmniStream** (`Products/OmniStream`): Dual-mode streaming intelligence featuring Cinemorph AI (3D WebGL theater, ML framing geometry, aperture-matched printing ticket intro animation) and UTube media search.
2. **SpeDex** (`Products/Spedex`): High-throughput fintech speed index and spending analytics dashboard for student and campus hostel wallets.
3. **Nebula** (`manifests/nebula-core.manifest.json`): AI-powered personal media intelligence platform for story-driven galleries.
4. **JavaPath Pro** (`manifests/javapath-pro-core.manifest.json`): Interactive Java AST sandbox and AI mentor platform.
5. **Music Mirror** (`manifests/music-mirror-core.manifest.json`): Facial expression mapping and emotion-based music recommender.
6. **Aros Core Wallet**: Platform financial token engine and immutable transaction ledger.
7. **Aroh CMS Alerts**: Real-time broadcast and scheduled notification management system.
8. **Aros Metrics Engine**: System observability, memory graphs, and journey telemetry.

---

## 🧪 Verification & Test Commands

Run tests across individual subsystems or the entire ecosystem:

```bash
# Test entire ecosystem
npm run test:all

# Test AROH Platform (Manifests, AI Provider, SDK Ledger, Session Sync)
npm run test:aroh

# Test OmniStream (218 Tier 1-5 tests)
npm run test:omnistream

# Test Spedex Mobile App (Jest test suite)
npm run test:spedex

# Build all production bundles
npm run build:all
```

---

## 🛡️ Governance & Quality Standard

- **Zero Breaking Changes**: All API routes and interfaces strictly adhere to schema contracts.
- **Provider-Agnostic AI**: Decoupled orchestrator supporting Mock, OpenAI, Anthropic, Gemini, and Local models.
- **Semantic Sync Engine**: Governed bi-directional synchronization with automated conflict resolution policies.
- **Dual-Session SSO Sync**: Seamless cross-tab and cross-app state synchronization.

---

## 📄 License

MIT © [Uday Patnala](https://github.com/UdayPatnala)