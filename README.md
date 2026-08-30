# Mount ⌨️

**Real mechanical keyboard sounds for your PC. Open source.**

Mount plays authentic mechanical switch sounds while you type anywhere on your PC or Mac, with spatial audio, a live visualizer, and per-switch customization — offline, open source, built on web tech.

---

## ✨ Features

- 🔊 **13 Switch Sound Profiles** — Alpaca, Gateron Black Ink V2, Alps Blue, Kailh Box Navy, IBM Buckling Spring, NovelKeys Cream, Holy Panda, Cherry MX Black, Cherry MX Blue, Cherry MX Brown, Gateron Red Ink V2, Topre 45g, Turquoise Tealio
- 🎵 **High-Fidelity Sample Engine** — Row-accurate keydown downstroke and keyup release recordings
- 🎧 **Spatial Audio** — Stereo panning based on key coordinate positions for immersive typing
- 🎛️ **Sound Customization** — Volume, Tone (Thock ↔ Clack DSP filter), and Pitch rate controls
- ⌨️ **Live Visualizer** — Compact keyboard matrix & audio waveform pulses with each keystroke
- 🖥️ **System Tray / Menu Bar App** — Lives in your system tray (Windows) or menu bar (macOS) with low resource footprint
- ⌨️ **Global Shortcut** — `Ctrl+Shift+K` (Windows) / `⌘+Shift+K` (macOS) toggles the popover from anywhere
- 🔒 **Fully Offline** — Zero network requests, zero analytics, zero data collection
- 🍎 **Cross-Platform** — Native support for both Windows and macOS
- 📖 **MIT Licensed** — Fully open source

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| App Shell | Electron |
| UI | Next.js (static export) |
| Styling | Tailwind CSS |
| Animations | Motion.dev (Framer Motion) |
| Sound | Web Audio API |
| Key Capture | uiohook-napi |
| Packaging | electron-builder |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Windows 10/11** or **macOS 12+** (Monterey or later)

### Development

```bash
# Install dependencies (root + renderer)
npm install

# Start dev mode (Next.js dev server + Electron)
npm run dev
```

The renderer runs on `http://localhost:3000`. Electron loads from it and captures global keystrokes via `uiohook-napi`.

> **Tip:** You can also open `http://localhost:3000` directly in your browser to preview the UI. Keyboard sounds will play when the browser tab is focused (using the browser keyboard fallback).

#### macOS: Accessibility Permission

On macOS, Mount requires **Accessibility permission** to capture global keystrokes. When you first run the app, macOS will prompt you to grant this permission:

1. Open **System Settings → Privacy & Security → Accessibility**
2. Enable the toggle for **Mount** (or **Electron** during development)
3. Restart Mount if needed

### Production Build

```bash
# Build everything
npm run build

# Package for Windows
npm run dist

# Package for macOS
npm run dist:mac

# Package for both platforms (on macOS only)
npm run dist:all
```

The installer will be generated in the `release/` directory.

## 📁 Project Structure

```
mount/
├── electron/
│   ├── main.ts              # Tray, BrowserWindow, IPC, protocol handler
│   ├── preload.ts           # Context bridge (renderer ↔ main)
│   ├── keyboard-hook.ts     # uiohook-napi global key capture
│   └── settings.ts          # JSON settings persistence
├── renderer/                # Next.js app (static export)
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Inter font
│   │   ├── page.tsx         # Main settings UI
│   │   └── globals.css      # Tailwind + custom styles
│   ├── components/
│   │   ├── Header.tsx       # Logo + enable/disable toggle
│   │   ├── SwitchSelector.tsx # Profile picker cards
│   │   ├── VolumeControl.tsx  # Volume slider
│   │   ├── TonePitchPad.tsx   # 2D tone/pitch control
│   │   ├── Visualizer.tsx     # Keyboard visualizer
│   │   └── StatusBar.tsx      # Status + keystroke count
│   ├── lib/
│   │   ├── audio-engine.ts    # Web Audio synthesis engine
│   │   ├── switch-profiles.ts # 6 switch profile definitions
│   │   ├── spatial-audio.ts   # Key → pan position mapping
│   │   └── use-keyboard-events.ts # React hook for keystroke events
│   └── types/
│       └── electron.d.ts      # Type declarations for IPC bridge
├── assets/
│   └── icon.png              # App icon (tray / menu bar)
├── LICENSE                   # MIT
└── README.md
```

## 🔊 How the Audio Engine Works

Mount utilizes a low-latency Web Audio API engine combined with pre-decoded `AudioBuffer` caching and real-time DSP:

1. **Row-Specific Downstroke Sampling** — Plays row-matched samples (`GENERIC_R0` to `GENERIC_R4`) and dedicated recordings for `SPACE`, `ENTER`, and `BACKSPACE`.
2. **Upstroke Release Feedback** — Keyup events trigger authentic switch return samples (`GENERIC`, `SPACE`, `ENTER`, `BACKSPACE`).
3. **Lowpass DSP Tone Filter** — Interactive 2D pad modulates cutoff frequency between deep warm thock (1.2 kHz) and bright snappy clack (16 kHz).
4. **Organic Micro-Randomization** — Subtle per-stroke pitch (+/- 3%) and gain variation to eliminate robotic repetition.
5. **Spatial Stereo Panning** — Maps each key's physical horizontal keyboard coordinate to `StereoPannerNode` (-0.7 to +0.7).

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

[MIT](LICENSE) — Use it, fork it, ship it.
