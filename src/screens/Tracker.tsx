import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';

const Tracker: React.FC = () => {
  // removed device presets – full-viewport rendering

  type RollSource = 'virtual' | 'manual';
  interface DiceRollEntry {
    id: string;
    total: number; // 2..12
    dice?: [number, number]; // present for virtual rolls
    source: RollSource;
    ts: number; // epoch ms
  }

  const [mode, setMode] = useState<RollSource>('virtual');
  const [rolls, setRolls] = useState<DiceRollEntry[]>(() => {
    try {
      const raw = localStorage.getItem('dice_tracker_rolls');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as DiceRollEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dice_tracker_rolls', JSON.stringify(rolls));
  }, [rolls]);

  const addRoll = (total: number, source: RollSource, dice?: [number, number]) => {
    const entry: DiceRollEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      total,
      dice,
      source,
      ts: Date.now(),
    };
    setRolls(prev => [...prev, entry]);
  };

  const undoLast = () => {
    setRolls(prev => prev.slice(0, -1));
  };

  const counts = useMemo(() => {
    const map: Record<number, number> = {};
    for (let i = 2; i <= 12; i++) map[i] = 0;
    for (const r of rolls) {
      if (r.total >= 2 && r.total <= 12) map[r.total] += 1;
    }
    return map;
  }, [rolls]);

  const maxCount = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);

  // Virtual dice animation
  const [dieA, setDieA] = useState<number>(1);
  const [dieB, setDieB] = useState<number>(1);
  const rollingRef = useRef<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollVirtual = () => {
    if (isRolling) return;
    setIsRolling(true);
    const start = performance.now();
    const duration = 900;
    const tick = (t: number) => {
      const elapsed = t - start;
      // spin dice quickly
      setDieA(Math.floor(Math.random() * 6) + 1);
      setDieB(Math.floor(Math.random() * 6) + 1);
      if (elapsed < duration) {
        rollingRef.current = requestAnimationFrame(tick);
      } else {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;
        setDieA(a);
        setDieB(b);
        setIsRolling(false);
        addRoll(a + b, 'virtual', [a, b]);
      }
    };
    rollingRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (rollingRef.current) cancelAnimationFrame(rollingRef.current);
  }, []);

  const formatTime = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleString();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#2E1371] to-[#130B2B] text-white relative">
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
        <div className="absolute left-[1.25rem] right-[1.25rem] top-[76px] bottom-[84px] flex flex-col gap-5 overflow-auto">
          {/* Top: Input section with mode toggle */}
          <div className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Record roll</div>
              <div className="inline-flex items-center bg-white/10 rounded-full p-1">
                <button
                  className={`h-8 px-3 rounded-full text-xs transition-colors ${mode === 'virtual' ? 'bg-white/25 text-white' : 'text-white/70 hover:bg-white/10'}`}
                  onClick={() => setMode('virtual')}
                >
                  Virtual
                </button>
                <button
                  className={`h-8 px-3 rounded-full text-xs transition-colors ${mode === 'manual' ? 'bg-white/25 text-white' : 'text-white/70 hover:bg-white/10'}`}
                  onClick={() => setMode('manual')}
                >
                  Manual
                </button>
              </div>
            </div>

            {mode === 'virtual' ? (
              <div className="mt-4 flex items-center justify-between gap-4">
                {/* Dice visuals */}
                <div className="flex items-center gap-4">
                  {[
                    { v: dieA },
                    { v: dieB },
                  ].map((d, idx) => (
                    <div key={idx} className="w-18 h-18 sm:w-18 sm:h-18 rounded-xl bg-white text-black flex items-center justify-center text-xl sm:text-3xl font-bold shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" aria-label={`Die ${idx + 1}: ${d.v}`}>
                      {d.v}
                    </div>
                  ))}
                </div>
                <button 
                  style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}
                  onClick={rollVirtual}
                  disabled={isRolling}
                  className="h-11 px-5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-sm shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F]"
                >
                  {isRolling ? '...' : 'Roll'}
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 11 }, (_, i) => i + 2).map(n => (
                    <button
                      key={n}
                      onClick={() => addRoll(n, 'manual')}
                      className="h-10 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 text-sm shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F]"
                      style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle: Histogram */}
          <div className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Distribution</div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {Array.from({ length: 11 }, (_, i) => i + 2).map(n => {
                const c = counts[n];
                const h = Math.round((c / maxCount) * 100);
                const inside = h >= 20;
                return (
                  <div key={n} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="relative w-full transition-[height] duration-300 ease-out" style={{ height: `${h}%` }}>
                      <div className="absolute inset-0 rounded-t-md bg-gradient-to-t from-white/15 to-white/60" />
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 text-[10px] ${inside ? 'top-1 text-black/80' : '-top-4 text-white/70'}`}
                      >
                        {c}
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] text-white/70" style={{ fontWeight: 'bold', color: 'rgb(255, 83, 192)' }}>{n}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom: History with undo */}
          <div className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm min-h-[200px] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">History</div>
              <button
                onClick={undoLast}
                disabled={rolls.length === 0}
                className="h-8 px-3 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-xs shadow-2xl bg-gradient-to-br from-[#B6116B] to-[#3B1578]"
                style={{ boxShadow: '-1px -1px 0px 0px rgb(255, 83, 192), 0px -1px 0px 0px rgb(255, 83, 192)' }}
              >
                Undo
              </button>
            </div>

            <div className="flex-1 overflow-auto pr-1">
              {[...rolls].reverse().map((r, idx, arr) => {
                const prev = arr[idx + 1];
                const deltaSec = prev ? Math.max(0, Math.floor((r.ts - prev.ts) / 1000)) : null;
                const deltaLabel = deltaSec == null
                  ? null
                  : deltaSec >= 60
                    ? `${Math.floor(deltaSec / 60)}m ${deltaSec % 60}s`
                    : `${deltaSec}s`;
                return (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center text-base font-semibold">
                        {r.total}
                      </div>
                      <div className="text-xs">
                        <div className="text-white/90">{formatTime(r.ts)}</div>
                        <div className="text-white/60">{r.source === 'virtual' && r.dice ? `(${r.dice[0]}+${r.dice[1]})` : 'manual'}</div>
                      </div>
                    </div>
                    {deltaLabel !== null && (
                      <div className="text-xs text-white/60">{deltaLabel}</div>
                    )}
                  </div>
                );
              })}
              {rolls.length === 0 && (
                <div className="text-xs text-white/60 py-4 text-center">No rolls yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer nav (placeholders) */}
     
        <div className="absolute bottom-0 left-0 right-0 h-[64px] z-[1]" style={{ boxSizing: 'border-box' }}>
          <div className="absolute inset-0 z-[1] overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.6)', backgroundBlendMode: 'overlay', boxSizing: 'border-box' }} >
            <div className="absolute w-[200px] h-[231px] left-[-45px] top-[-148px] z-[4]" style={{ background: '#3B1578', filter: 'blur(40px)' }} />
            <div className="absolute w-[200px] h-[231px] left-[86px] top-[12px] z-[2]" style={{ background: '#5172B3', filter: 'blur(60px)' }} />
            <div className="absolute w-[200px] h-[231px] left-[234px] top-[17px] z-[3]" style={{ background: '#FF53C0', filter: 'blur(60px)' }} />
          </div>




          <div className="h-14 flex items-center justify-around z-[9] relative">
            {/* Home (solid) */}
            <Link to="/home" aria-label="Home" className="p-2 relative h-[40px] w-[40px]">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden >
                <path d="M12 3.2 2.8 11a1 1 0 0 0 .65 1.76H5v7.24c0 .56.45 1 1 1h4.5V15h3V21h4.5c.55 0 1-.44 1-1V12.76h1.55a1 1 0 0 0 .65-1.76L12 3.2Z" />
              </svg>
            </Link>

            {/* Tracker (dice icon) */}
            <button aria-label="Tracker" className="p-2 relative h-[40px] w-[40px]">
              <LiquidGlassCard className="absolute w-[64px] h-[64px] rounded-full bottom-[28px] left-[-20px] flex items-center justify-center" style={{ borderRadius: '50%'}} >
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
              </LiquidGlassCard>
            </button>

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
  );
};

export default Tracker;


