# Isola

A peaceful, playable 3D island sandbox built with Three.js and Vite. Create a little world with roaming animals, trees, flowers, and buildings.

## Run

Requires Node.js 20.19+ or 22.12+ and a browser with WebGL 2.

```sh
npm ci
npm run dev
```

If your environment's default npm cache is unavailable, use `npm ci --cache /workspace/.npm-cache`.

## Play

- Choose **Animals**, **Nature**, or **Build**, then select an item and click the island to place it. You can place several copies. Press **R** to rotate your next object.
- **Explore** lets you drag to orbit and click animals to meet and feed them. Right-drag to pan; scroll or pinch to zoom.
- **Remove** deletes the object you click. **Undo** or **Ctrl/Cmd + Z** reverses placement and removal.
- Change weather, switch to night, and set the simulation speed from the sun control. Pause wildlife with the pause button or **Space**.
- The world saves automatically in this browser. **Save island** saves immediately. **Settings** supports JSON download, validated import, and starting a fresh island.
- On a phone, **Make it yours** opens the catalog. Select an object to return to the island and place it.

Keyboard shortcuts: **1** Explore, **2** Place, **3** Remove, **Esc** finish placing, **+ / −** zoom, **/** search, **?** help.

## Validate

```sh
npm run build
npm test
```

The Playwright smoke test starts its own Vite server, drives the real canvas and UI, and checks placement, feeding, deletion, undo, camera controls, weather, saving, import/export, reset, and phone interaction. It uses `/usr/bin/chromium` when available. Else install the matching browser with `npx playwright install chromium`, or set `CHROMIUM_PATH` to a browser executable. Set `TEST_BASE_URL` to test an already running server.

`npm run capture` records desktop and phone screenshots against a development server on port 5173. Captures are ignored by Git.

## Implementation

- `src/world.js`: procedural models, terrain, ocean shader, wildlife simulation, camera, placement, persistence, and world validation.
- `src/main.js`: catalog, object inspector, world settings, keyboard interaction, and ambient ocean sound.
- `src/style.css`: responsive layout and locally bundled fonts.

All models are generated in code. There are no remote runtime asset requests or required API credentials. Saved worlds stay on the current device unless downloaded. This is a single-player creative sandbox; there is no multiplayer or survival progression.
