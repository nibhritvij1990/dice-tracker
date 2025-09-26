## Dice Tracker – Product Brief / BRD

### 1) Overview
This app provides mobile-first mockups and a working prototype for:
- Visual, animated splash experience with brand identity
- A dice tracking tool with live stats and history
- A Catan board setup helper with random map generation and persistence

Tech stack: Vite + React + TypeScript, Tailwind CSS v4, custom WebGL visuals (Iridescence, LaserFlow), localStorage for persistence, React Router for navigation.

### 2) What’s Done
1. Splash Screen
   - Device presets and canvas frame (390×844 baseline)
   - Diagonal gradient background; LaserFlow animation (stable, pixel-anchored)
   - Dice SVG with inner glow; animated “Dice” text; CTA with rainbow border
   - Google sign-in buttons (round, two variants)

2. Tracker
   - Input modes: Virtual dice (2×D6, roll animation) and Manual (2–12 grid)
   - Live-updating histogram with labels (inside/above bar) and animated heights
   - History list: timestamp, per-roll delta (s or mm ss), undo
   - Persistence via localStorage; layout avoids footer overlap; responsive dice sizes

3. Home (Catan Setup Helper)
   - No LiquidGlass for content sections (per requirement)
   - Controls: player selector (4/5/6), Generate Map button (bottom actions section)
   - Board:
     - Flat-top (horizontal) resource hex tiles arranged in columns 3–4–5–4–3
     - Correct A→R number token order using absolute [col,row] spiral, skipping desert
     - Big pointy (vertical) water hex behind the board; tiles centered to water
     - Terrain textures per tile; last map persisted and restored from localStorage
   - Robust scaling with ResizeObserver; stable layout across device presets

### 3) What’s Pending (near-term)
1. Ports & Coast Ring
   - Add coastal ring geometry
   - Place 9 ports (4× generic 3:1, 5× specific 2:1) along coast edges
   - Visuals: port icons, angle/orientation; spacing rules

2. Token Placement Rules (toggles)
   - Disallow adjacent 6/8 tokens (validation pass post-placement)
   - Optional pip clustering constraints (e.g., neighborhood pip-sum threshold)
   - Option to prohibit triple-adjacent same terrain runs

3. QA/Validation Aids
   - Overlay to visualize A→R indices temporarily for verification
   - Simple console/export of token order for test snapshots

4. Accessibility
   - Confirm focus/aria roles on interactive controls
   - Keyboard operation for manual grid and undo

### 4) What We Can Add (enhancements)
1. Catan Features
   - Export/share: render board as image or create shareable URL with seed/config
   - Board presets: official fixed layout vs fully random toggles
   - “Re-roll token order” with same terrain distribution (fairness exploration)
   - Coastal foam/shadows; resource icon overlays; pip dots around tokens

2. Tracker Features
   - Turn tracker, robber alert when 7 occurs
   - Probability heatmap; bias detection vs theoretical distribution
   - Multi-session management; CSV export

3. Visual/UX
   - Theme toggle (purple/pink vs blue/teal accents)
   - Micro-interactions on tiles (hover/press feedback, subtle lift)
   - Token pip-ring rendering for quick glance probability weight

4. Auth/Onboarding
   - Wire Google buttons to real auth
   - Start page: quick tips, recent boards, recent tracking sessions

### 5) Implementation Notes
1. Coordinate Systems
   - Data model is still rows of lengths [3,4,5,4,3].
   - For flat-top rendering, we build absolute columns (0..4) using `startIndexByRow=[0,1,0,0,2]` and push tile references top-to-bottom. DOM positioning uses:
     - left = col × dx; top = topStart + rowInCol × dy
   - The spiral token assignment also uses absolute [col,row] (diamond) indices; we convert [x,y] to the exact tile via `columns[x][y]` to avoid mismatch.

2. Spiral A→R Mapping (absolute [col,row])
   - Outer ring (12): [0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,3],[2,4],[1,3],[0,2],[0,1]
   - Inner ring (6): [1,1],[2,1],[3,1],[3,2],[2,3],[1,2]
   - Center (1): [2,2]
   - Number order: [5,2,6,3,8,10,9,12,11,4,8,10,9,4,5,6,3,11]; skip desert if encountered.

3. Persistence
   - `localStorage.catan_last_map = { seed, board }`, where board stores terrain and derived numbers. On load, we normalize numbers to the current spiral.
   - Tracker rolls persisted to `localStorage.dice_tracker_rolls` with realtime updates.

4. Performance & Stability
   - ResizeObserver and capped zoom ensure board remains fully visible
   - LaserFlow uses pixel-anchored uniforms to prevent jumps; Iridescence accepts 0–255 RGB

### 6) Near-Term Plan (suggested order)
1) Add coast ring & ports (visual + placement)
2) Add “no adjacent 6/8” token validation toggle
3) Add A→R overlay toggle for verification
4) Export/share (seed/config in URL)
5) Optional: fairness constraints, terrain adjacency limits

### 7) Risks & Considerations
- Validation rules can over-constrain randomness; need fallback/reshuffle loop with cap
- Scaling/zoom must account for device presets; test edge cases (iPhone SE, 15 PM)
- Image assets should be optimized and lazy-loaded if needed


