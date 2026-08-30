# Contributing to Mount

Thanks for your interest in contributing to Mount! 🎉

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/mount.git
   cd mount
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This automatically installs renderer dependencies via `postinstall`.

3. **Start development**
   ```bash
   npm run dev
   ```
   This launches the Next.js dev server and Electron concurrently.

## Project Architecture

- **`electron/`** — Main process code (TypeScript, compiled to CommonJS)
  - `main.ts` — App lifecycle, tray, window management, IPC
  - `preload.ts` — Context bridge for secure renderer ↔ main communication
  - `keyboard-hook.ts` — Global keystroke capture via uiohook-napi
  - `settings.ts` — JSON file persistence

- **`renderer/`** — Next.js app (static export, loaded by Electron)
  - `lib/audio-engine.ts` — Core Web Audio synthesis engine
  - `lib/switch-profiles.ts` — Switch profile parameter definitions
  - `components/` — React UI components

## Adding a New Switch Profile

1. Open `renderer/lib/switch-profiles.ts`
2. Add a new entry to the `switchProfiles` array with synthesis parameters
3. Choose appropriate values for noise, body, and click components
4. Test in dev mode — you'll hear the sound immediately

## Code Style

- TypeScript everywhere
- Functional React components with hooks
- Tailwind CSS for styling
- Motion.dev for animations

## Commit Messages

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` code restructuring
- `perf:` performance improvement

## Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes
3. Test in both dev mode and production build
4. Submit a PR with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
