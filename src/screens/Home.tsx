import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import desertPng from '../assets/images/desert.png';
import brickPng from '../assets/images/brick.png';
import grainPng from '../assets/images/grain.png';
import lumberPng from '../assets/images/lumber.png';
import orePng from '../assets/images/ore.png';
import sheepPng from '../assets/images/sheep.png';
//import waterPng from '../assets/images/gemini_water.png';
import Iridescence from '../components/Iridescence.tsx';


const Home: React.FC = () => {
  const devicePresets = {
    'iphone-se': { label: 'iPhone SE (2/3)', width: 320, height: 568 },
    'android-360x800': { label: 'Android (360×800)', width: 360, height: 800 },
    'iphone-12-14': { label: 'iPhone 12/13/14', width: 390, height: 844 },
    'iphone-15-pro-max': { label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  } as const;

  type DevicePresetKey = keyof typeof devicePresets;
  const [presetId, setPresetId] = useState<DevicePresetKey>('iphone-12-14');
  const preset = devicePresets[presetId];

  type Terrain = 'forest' | 'pasture' | 'fields' | 'hills' | 'mountains' | 'desert';
  type Tile = { terrain: Terrain; number: number | null };
  const rows = [3,4,5,4,3];
  const numberOrder = [5,2,6,3,8,10,9,12,11,4,8,10,9,4,5,6,3,11];

  function mulberry32(a: number) { return function() { let t = a += 0x6D2B79F5; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffle<T>(arr: T[], rand: () => number) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

  function generateBoard(seed: number): Tile[][] {
    const rand = mulberry32(seed);
    const bag: Terrain[] = [
      ...Array(4).fill('forest'),
      ...Array(4).fill('pasture'),
      ...Array(4).fill('fields'),
      ...Array(3).fill('hills'),
      ...Array(3).fill('mountains'),
      'desert',
    ];
    shuffle(bag, rand);

    const tiles: Tile[][] = [];
    let idx = 0;
    for (const n of rows) {
      const row: Tile[] = [];
      for (let i = 0; i < n; i++) row.push({ terrain: bag[idx++], number: null });
      tiles.push(row);
    }

    // Assign numbers using absolute [col,row] spiral with flat-top columns
    const outer: Array<[number, number]> = [
      [0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,3],[2,4],[1,3],[0,2],[0,1]
    ];
    const inner: Array<[number, number]> = [
      [1,1],[2,1],[3,1],[3,2],[2,3],[1,2]
    ];
    const center: Array<[number, number]> = [[2,2]];
    const spiralAbs = [...outer, ...inner, ...center];

    // Build columns mapping (top-to-bottom) to mirror render order
    const columns: Array<Array<{ r: number; c: number }>> = Array.from({ length: 5 }, () => []);
    const startIndexByRowMap = [0,1,0,0,2];
    for (let r = 0; r < tiles.length; r++) {
      const row = tiles[r];
      const start = startIndexByRowMap[r] ?? 0;
      for (let c = 0; c < row.length; c++) {
        const x = start + c;
        columns[x].push({ r, c });
      }
    }

    let ni = 0;
    for (const [x, y] of spiralAbs) {
      const pos = columns[x]?.[y];
      if (!pos) continue;
      const tile = tiles[pos.r][pos.c];
      if (tile.terrain !== 'desert') {
        tile.number = numberOrder[ni++];
        if (ni >= numberOrder.length) break;
      }
    }
    return tiles;
  }

  function assignNumbersToExistingBoard(existing: Tile[][]): Tile[][] {
    // Deep clone numbers only
    const tiles: Tile[][] = existing.map(row => row.map(t => ({ terrain: t.terrain, number: null as number | null })));
    const startIndexByRowMap = [0,1,0,0,2];
    const outer: Array<[number, number]> = [
      [0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,3],[2,4],[1,3],[0,2],[0,1]
    ];
    const inner: Array<[number, number]> = [
      [1,1],[2,1],[3,1],[3,2],[2,3],[1,2]
    ];
    const center: Array<[number, number]> = [[2,2]];
    const spiralAbs = [...outer, ...inner, ...center];

    const columns: Array<Array<{ r: number; c: number }>> = Array.from({ length: 5 }, () => []);
    for (let r = 0; r < tiles.length; r++) {
      const row = tiles[r];
      const start = startIndexByRowMap[r] ?? 0;
      for (let c = 0; c < row.length; c++) {
        const x = start + c;
        columns[x].push({ r, c });
      }
    }

    let ni = 0;
    for (const [x, y] of spiralAbs) {
      const pos = columns[x]?.[y];
      if (!pos) continue;
      const tile = tiles[pos.r][pos.c];
      if (tile.terrain !== 'desert') {
        tile.number = numberOrder[ni++];
        if (ni >= numberOrder.length) break;
      }
    }
    return tiles;
  }

  function CatanSetup() {
    const [players, setPlayers] = useState<number>(4);
    // no separate seed state required
    const [board, setBoard] = useState<Tile[][] | null>(() => {
      try {
        const raw = localStorage.getItem('catan_last_map');
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { seed: number; board: Tile[][] };
        if (parsed && parsed.board && Array.isArray(parsed.board)) {
          // Normalize numbers to current spiral mapping
          const fixed = assignNumbersToExistingBoard(parsed.board);
          // Persist normalized once
          localStorage.setItem('catan_last_map', JSON.stringify({ seed: parsed.seed, board: fixed }));
          return fixed;
        }
        return null;
      } catch { return null; }
    });

    const onGenerate = () => {
      const newSeed = Date.now();
      const b = generateBoard(newSeed);
      setBoard(b);
      localStorage.setItem('catan_last_map', JSON.stringify({ seed: newSeed, board: b }));
    };

    return (
      <div className="absolute left-[1.25rem] right-[1.25rem] top-[76px] bottom-[84px] flex flex-col gap-5 overflow-auto">
        {/* Top controls */}
        <div className="w-full p-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="text-sm font-medium">Players</div>
              <div className="inline-flex items-center gap-2">
                {[4,5,6].map(n => (
                  <button key={n} onClick={() => setPlayers(n)}
                    className={`h-9 w-9 rounded-lg border text-sm border-white/30 bg-gradient-to-br ${players===n ? 'from-[#B6116B] to-[#3B1578]' : 'from-[#2E1371] to-[#21232F]'}`}
                    style={{ boxShadow: (players!==n ? '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' : '-1px -1px 0px 0px rgb(255, 83, 192), 0px -1px 0px 0px rgb(255, 83, 192)') }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div />
          </div>
        </div>

        {/* Board container */}
        <div className="w-full p-4 rounded-2xl relative overflow-hidden">
          <CatanBoard board={board} />
        </div>

        {/* Actions */}
          <button onClick={onGenerate} aria-label="Generate Map"
            className="h-10 w-full rounded-lg border border-white/20 bg-gradient-to-br from-[#B6116B] to-[#3B1578] flex items-center justify-center text-sm"
            style={{ boxShadow: '-1px -1px 0px 0px rgb(255, 83, 192), 0px -1px 0px 0px rgb(255, 83, 192)' }}>
            Generate Map
          </button>
      </div>
    );
  }

  function CatanBoard({ board }: { board: Tile[][] | null }) {

    const terrainColor: Record<string, string> = {
      forest: '#1f7a1f',
      pasture: '#68a61c',
      fields: '#d2a842',
      hills: '#b55324',
      mountains: '#7b7f86',
      desert: '#d7c58b',
    };
    const terrainImage: Record<string, string> = {
      forest: lumberPng,
      pasture: sheepPng,
      fields: grainPng,
      hills: brickPng,
      mountains: orePng,
      desert: desertPng,
    };

    if (!board) {
      return (
        <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
          Click Generate Map to create a random board
        </div>
      );
    }

    // Flat-top (horizontal) resource hexes
    const TILE_W = 82; // px (flat-top hex width)
    const TILE_H = 72; // px (flat-top hex height)
    const MAX_COLS = 5;
    const dx = TILE_W * 0.75; // center-to-center horizontal for flat-top
    const dy = TILE_H * 1.0;  // center-to-center vertical between rows for flat-top

    const maxLen = 5;
    const containerWidth = TILE_W + dx * (MAX_COLS - 1);
    const containerHeight = TILE_H + dy * (maxLen - 1);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [containerZoom, setContainerZoom] = useState<number>(1);

    useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;

      const recalc = () => {
        const w = el.clientWidth || containerWidth;
        const z = Math.min(1, w / containerWidth);
        setContainerZoom(z);
      };

      recalc();

      const ro = new ResizeObserver(recalc);
      ro.observe(el);
      window.addEventListener('resize', recalc);
      window.addEventListener('load', recalc);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', recalc);
        window.removeEventListener('load', recalc);
      };
    }, [board, containerWidth]);

    return (
      <div className="w-full h-full flex items-start justify-start pt-2 select-none" id="catan-map-container" ref={wrapperRef}>
        <div className="relative" style={{ width: containerWidth, height: containerHeight + 45, zoom: `${containerZoom}` }}>
          {/* Water background as a large hex behind tiles */}
          <LiquidGlassCard
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: containerWidth + 36,
              height: containerHeight + 45,
              // Pointy (vertical) big board water background
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              zIndex: 0,
            }}
          >
            <Iridescence color={[7, 151, 211]} className='absolute inset-0' style={{ transform: 'rotate(90deg) scale(1.5)' }} />
          </LiquidGlassCard>
 
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: containerWidth, height: containerHeight }}>
          {(() => {
            // Build columns from the row-shaped board using absolute column index
            const columns: Array<Array<{ r: number; j: number }>> = Array.from({ length: MAX_COLS }, () => []);
            // Start positions to achieve column heights 3,4,5,4,3 for rows [3,4,5,4,3]
            // R0 len3 -> start 0 (covers c0..c2)
            // R1 len4 -> start 1 (covers c1..c4)
            // R2 len5 -> start 0 (covers c0..c4)
            // R3 len4 -> start 0 (covers c0..c3)
            // R4 len3 -> start 2 (covers c2..c4)
    const startIndexByRow = [0, 1, 0, 0, 2]; // used in rendering; left for clarity
            for (let r = 0; r < board.length; r++) {
              const row = board[r];
              const rowStartAbs = startIndexByRow[r] ?? 0;
              for (let j = 0; j < row.length; j++) {
                const absC = rowStartAbs + j;
                columns[absC].push({ r, j });
              }
            }
            // Render columns as vertical stacks
            return columns.map((col, cAbs) => {
              const left = cAbs * dx;
              const topStart = (maxLen - col.length) * (dy / 2);
              return col.map((pos, i) => {
                const top = topStart + i * dy;
                const tile = board[pos.r][pos.j];
                return (
                  <div key={`${pos.r}-${pos.j}`} className="absolute" style={{ left, top, width: TILE_W, height: TILE_H, zIndex: 1 }}>
                    <div
                      className="w-full h-full"
                      style={{
                        // Flat-top (horizontal) hex for resource tiles
                        clipPath: 'polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)',
                        background: terrainColor[tile.terrain],
                        backgroundImage: `url(${terrainImage[tile.terrain]})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    {tile.terrain !== 'desert' && tile.number !== null && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                          className={`flex items-center justify-center rounded-full ${tile.number===6||tile.number===8 ? 'bg-[#B71C1C] text-white' : 'bg-[#f6e6c9] text-black'}`}
                          style={{ width: 28, height: 28, border: '1px solid rgba(0,0,0,0.2)' }}
                        >
                          <span className="text-xs font-semibold">{tile.number}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            });
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-neutral-200 flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-2 text-white bg-neutral-800 rounded-md px-2">
        <label htmlFor="device" className="text-sm">Device</label>
        <select
          id="device"
          value={presetId}
          onChange={(e) => setPresetId(e.target.value as DevicePresetKey)}
          className="bg-neutral-800 border border-white/10 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-white/20"
        >
          {Object.entries(devicePresets).map(([id, p]) => (
            <option key={id} value={id}>
              {p.label} ({p.width}×{p.height})
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: preset.width, height: preset.height }} className="rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-[#2E1371] to-[#130B2B] text-white relative">
        <div className="absolute w-[300px] h-[300px] left-[-132px] top-[178px]" style={{ background: 'rgba(96, 255, 231, 0.4)', filter: 'blur(100px)' }} />
        <div className="absolute w-[300px] h-[300px] right-[-147px] top-[375px]" style={{ background: 'rgba(255, 83, 192, 0.4)', filter: 'blur(100px)' }} />
        
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="h-9 flex items-center justify-between gap-2 select-none">
          <button aria-label="Back" className="p-2 relative">
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.15)', backgroundBlendMode: 'overlay', backdropFilter: 'blur(20px)', boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }} >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            </button>
            <span className="text-[20px] leading-none font-bold">
              <span className="bg-gradient-to-r from-[#CF9EFF] via-[#A071FF] to-[#CF9EFF] bg-clip-text text-transparent animate-gradient">Dice</span>
              <span className="text-white">&nbsp;Tracker</span>
            </span>
            <button aria-label="Options" className="p-2 relative">
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.15)', backgroundBlendMode: 'overlay', backdropFilter: 'blur(20px)', boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }} >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <circle cx="12" cy="6" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="18" r="1.6" />
              </svg>
            </div>
            </button>
          </h1>
        </div>

        {/* Content */}
        <CatanSetup />



        {/* Footer nav (placeholders) */}
     
        <div className="absolute bottom-0 left-0 right-0 h-[64px] z-[1]" style={{ boxSizing: 'border-box' }}>
          <div className="absolute inset-0 z-[1] overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.6)', backgroundBlendMode: 'overlay', boxSizing: 'border-box' }} >
            <div className="absolute w-[200px] h-[231px] left-[-45px] top-[-148px] z-[4]" style={{ background: '#3B1578', filter: 'blur(40px)' }} />
            <div className="absolute w-[200px] h-[231px] left-[86px] top-[12px] z-[2]" style={{ background: '#5172B3', filter: 'blur(60px)' }} />
            <div className="absolute w-[200px] h-[231px] left-[234px] top-[17px] z-[3]" style={{ background: '#FF53C0', filter: 'blur(60px)' }} />
          </div>




          <div className="h-14 flex items-center justify-around z-[9] relative">
            <button aria-label="Home" className="p-2 relative h-[40px] w-[40px]">
            <LiquidGlassCard className="absolute w-[64px] h-[64px] rounded-full bottom-[28px] left-[-20px] flex items-center justify-center" style={{ borderRadius: '50%'}} >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden >
                <path d="M12 3.2 2.8 11a1 1 0 0 0 .65 1.76H5v7.24c0 .56.45 1 1 1h4.5V15h3V21h4.5c.55 0 1-.44 1-1V12.76h1.55a1 1 0 0 0 .65-1.76L12 3.2Z" />
              </svg>
              </LiquidGlassCard>
            </button>

            {/* Tracker (dice icon) */}
            <Link to="/tracker" aria-label="Tracker" className="p-2 relative h-[40px] w-[40px]">
                <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" aria-hidden>
                  <defs>
                    <mask id="pips-mask-footer-tracker">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <circle cx="25" cy="25" r="9" fill="black" />
                      <circle cx="75" cy="25" r="9" fill="black" />
                      <circle cx="50" cy="50" r="9" fill="black" />
                      <circle cx="25" cy="75" r="9" fill="black" />
                      <circle cx="75" cy="75" r="9" fill="black" />
                    </mask>
                  </defs>
                  <rect x="8" y="8" width="84" height="84" rx="12" fill="currentColor" mask="url(#pips-mask-footer-tracker)" />
                  <rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                </svg>
            </Link>

            {/* Profile (solid) */}
            <Link to="/profile" aria-label="Profile" className="p-2 relative h-[40px] w-[40px]">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden >
                <path d="M12 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                <path d="M4 20.5c0-4.142 3.582-7.5 8-7.5s8 3.358 8 7.5V22H4v-1.5Z" />
              </svg>
            </Link>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Home;


