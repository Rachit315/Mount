# Mount — Product Requirements Document (v2: Next.js + Tailwind + Motion.dev)

**Tagline:** Real mechanical keyboard sounds for your Mac. Open source.
**One-liner:** Mount plays authentic mechanical switch sounds while you type anywhere on your Mac, with spatial audio, a live visualizer, and per-switch customization — offline, open source, built on web tech.

---

## 0. Critical Architecture Note — Read This First

A plain Next.js web app running in a browser tab can only capture keystrokes **while that tab is focused**. It cannot hear you typing in Xcode, Slack, your terminal, or anywhere else — which kills the core value prop (a keyboard sound that follows you everywhere).

To keep Next.js/Tailwind/Motion.dev as your stack and still get real system-wide sound, ship Mount as an **Electron app**:
→ Electron renders your Next.js UI (menu bar popover, settings, visualizer) exactly like a normal web app
→ A small native layer (Node native module, or a tiny compiled Swift/Rust helper binary talking to Electron over IPC) handles the actual macOS-level keystroke capture, since neither the browser nor Electron's renderer process can do this alone
→ Electron's main process requests Accessibility + Input Monitoring permissions and forwards keystroke events into the renderer, where your Next.js/Web Audio code plays the sound

This is the same pattern used by apps like Rocket, CleanShot, and other "menu bar utility with a web-tech UI" Mac apps. It's the only realistic way to hit your goal with this stack — a Tauri (Rust) shell is a lighter-weight alternative if you're open to it, but Electron pairs more directly with Next.js tooling (`nextron`, static export + `electron-builder`).

## 1. Problem & Opportunity

Laptop keyboards feel dead. Keeby proved the demand (#8 on Product Hunt, closed source, App Store-gated, free tier limited). Mount is the open-source alternative: same core experience, MIT-licensed, built with a modern web stack so the UI is easy for contributors to hack on.

## 2. Goals

**Primary**
→ Ship an Electron menu bar app (Next.js/Tailwind/Motion.dev UI) that plays real switch sounds on every keystroke, system-wide
→ Fully open source, MIT license, from day one
→ Feature parity with Keeby's core loop in v1

**Secondary**
→ Community-contributed switch sound packs
→ Position Mount as the open-source, verifiably-offline alternative to closed typing-sound apps

**Non-goals (v1)**
→ Windows/Linux builds
→ Mobile app
→ Cloud sync / accounts

## 3. Target Users
→ Developers, writers, indie hackers on a MacBook who miss mechanical feedback
→ Mechanical keyboard enthusiasts who want the sound without the hardware
→ Open-source-first users who want to verify "offline" claims themselves

## 4. Core Features (v1 — MVP)

### 4.1 Sound Engine
→ Native helper captures keydown events system-wide, forwards to Electron main process via IPC, main process relays to renderer
→ Renderer plays sound via **Web Audio API** (`AudioContext`, preloaded `AudioBuffer`s per sample — avoid `<audio>` tags, they're too slow for this)
→ Target **sub-15ms** perceived latency end-to-end (native capture → IPC → Web Audio playback). This is your hardest technical constraint — budget real time to profile and tune the IPC hop, since it's the one thing a fully-native app wouldn't have to fight
→ Fully offline. No network calls, no analytics by default

### 4.2 Switch Profiles
→ 6–8 profiles at launch: Gateron Red (linear), Holy Panda (tactile), a clicky profile, a heavy-clicky profile, Cream, Buckling Spring
→ **You cannot use Keeby's actual audio files** — they're copyrighted assets. Record your own switches, commission recordings, or source CC-licensed samples (freesound.org, CC0 libraries). Solve this before writing app code — it's the one dependency everything else sits on
→ Each profile = a folder of compressed audio files (`.ogg`/`.webm` for small bundle size) + a `manifest.json` mapping keys to samples. Preload and decode into `AudioBuffer`s on app launch

### 4.3 Spatial Audio
→ Use Web Audio's `StereoPannerNode` (or `PannerNode` for more control) — pan value derived from a keymap-to-x-position lookup table
→ Auto-detect headphones vs. speakers via `navigator.mediaDevices` / Electron's audio device APIs and adjust pan width accordingly

### 4.4 Reactive Visualizer
→ Build with **Motion.dev** — this is exactly what it's good at: a compact popover visualizer that pulses per keystroke, driven by the same IPC event stream that triggers audio
→ v1: menu bar popover visualizer. v2 stretch: notch-area overlay (needs a separate always-on-top transparent Electron window positioned under the notch — doable, but treat as v2, not v1)

### 4.5 Sound Customization
→ Volume: Web Audio `GainNode`
→ Tone (thock ↔ clack): `BiquadFilterNode` (lowpass/highpass sweep) layered on playback
→ Pitch (deep ↔ sharp): `AudioBufferSourceNode.playbackRate`
→ Build the tone/pitch controls as a 2D pad in Tailwind + Motion.dev — drag position maps directly to filter frequency (x) and playback rate (y)

### 4.6 Menu Bar App Shell
→ Electron `Tray` API for the menu bar icon, `BrowserWindow` (frameless, positioned under the tray icon) hosting your Next.js UI as the popover
→ No dock icon (`app.dock.hide()` on macOS)
→ Global hotkey via Electron's `globalShortcut` module (e.g. ⌘⇧K)

### 4.7 Onboarding
→ First-launch flow (built in Next.js): explain Accessibility + Input Monitoring permissions, deep-link to the right System Settings pane, "test your sound" step before closing onboarding
→ Detect install location (warn if running from Downloads instead of Applications)

### 4.8 Privacy & Trust
→ No data collection, no network requests. Since it's open source and the Electron main process code is readable, this is verifiable — lead with that in the README and landing page copy

## 5. Out of Scope (v1)
→ Mouse click sounds
→ Notch visualizer overlay
→ Windows/Linux builds
→ Paid/marketplace switch packs
→ iOS companion app

## 6. Tech Stack

→ **Electron** — app shell, Tray, global shortcuts, native permission requests
→ **Next.js** (static export via `next export`, since Electron doesn't run a Next.js server) — UI: settings, onboarding, visualizer popover
→ **Tailwind CSS** — styling
→ **Motion.dev** — visualizer animation, 2D tone/pitch pad, micro-interactions
→ **Web Audio API** — sample playback, panning, filtering, pitch shift
→ **Native keystroke helper** — either a small compiled Swift binary using `CGEventTap`, spawned as a child process and communicating over stdio/IPC, or a Node native addon (`node-gyp` + Objective-C/Swift bridge) if you want to avoid a separate binary. The Swift-binary-as-child-process route is simpler to build and debug independently
→ **electron-builder** — packaging, code signing, notarization, auto-update feed
→ Distribute via GitHub Releases first (skip App Store review cycle — Keeby was rejected 4 times before approval)

## 7. Repo Structure

```
mount/
├── electron/
│   ├── main.ts              (Tray, BrowserWindow, IPC, permissions)
│   ├── ipc/                 (keystroke event bridge)
│   └── native-helper/       (Swift binary source + build script)
├── renderer/                 (Next.js app — static export)
│   ├── app/
│   │   ├── settings/
│   │   ├── onboarding/
│   │   └── visualizer/
│   ├── components/
│   ├── lib/audio-engine.ts  (Web Audio playback, panning, filters)
│   └── lib/switch-profiles.ts
├── switch-packs/
│   ├── gateron-red/
│   │   ├── manifest.json
│   │   └── samples/*.ogg
│   └── ...
├── CONTRIBUTING.md
├── LICENSE                   (MIT)
└── README.md
```

## 8. Roadmap / Milestones

**Milestone 1 — Core loop (2–3 weeks)**
→ Native helper capturing keystrokes → Electron IPC → Web Audio playback, 2 switch profiles, bare-bones Tray menu

**Milestone 2 — Feature parity (2–3 weeks)**
→ Next.js/Tailwind UI for settings and popover, Motion.dev visualizer, spatial audio, tone/pitch controls, global hotkey, 6+ profiles

**Milestone 3 — Polish & launch (1–2 weeks)**
→ Onboarding flow, notarized/signed build via electron-builder, landing page, Product Hunt launch

**Milestone 4 — Post-launch**
→ Notch overlay visualizer, community switch packs, headphone auto-detect refinement, evaluate Tauri migration if Electron bundle size/latency becomes a real complaint

## 9. Success Metrics
→ GitHub stars, GitHub Releases downloads
→ Product Hunt launch-day ranking
→ Community-contributed switch packs within 60 days
→ Perceived latency feedback (watch for "feels laggy" comments — this is your main technical risk surfacing)

## 10. Risks
→ **Audio sourcing** — solve before writing app code
→ **Latency through the Electron/IPC pipeline** — this is the real technical risk of this stack choice vs. a fully native app. Prototype the native-helper → IPC → Web Audio path first, in isolation, before building any UI, to confirm the latency is actually acceptable
→ **Electron bundle size** (~150–200MB) — acceptable for a utility app, but mention it in the README so it's not a surprise
→ Global keystroke capture triggers macOS security prompts — onboarding needs to make the ask feel legitimate, and the open-source repo is your proof

---

**Next step:** Before any UI work, build a throwaway prototype of just the native-helper → IPC → Web Audio path and measure real latency. If it's not under ~15ms, that's the one thing worth knowing before you commit the whole stack.