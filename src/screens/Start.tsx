import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LaserFlow from '../components/LaserFlow';
import LiquidGlassCard from '../components/LiquidGlassCard';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Start: React.FC = () => {
  const devicePresets = {
    'iphone-se': { label: 'iPhone SE (2/3)', width: 320, height: 568 },
    'android-360x800': { label: 'Android (360×800)', width: 360, height: 800 },
    'iphone-12-14': { label: 'iPhone 12/13/14', width: 390, height: 844 },
    'iphone-15-pro-max': { label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  } as const;

  type DevicePresetKey = keyof typeof devicePresets;
  const [presetId, setPresetId] = useState<DevicePresetKey>('iphone-12-14');
  const preset = devicePresets[presetId];
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [impactAnchor, setImpactAnchor] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return;

    let raf = 0;
    const recalc = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
      const wr = wrapper.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      const x = tr.left + tr.width / 2 - wr.left;
      const y = tr.top - wr.top; // top edge of target box
      setImpactAnchor({ x, y });
      });
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(wrapper);
    ro.observe(target);
    window.addEventListener('scroll', recalc, { passive: true });
    recalc();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', recalc);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [presetId]);

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

      <div
        style={{ width: preset.width, height: preset.height }}
        className="rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-[#2E1371] to-[#130B2B]"
      >
        <div className="relative w-full h-full" ref={wrapperRef}>
          {/* Laser background */}
          <div className="absolute inset-0">
            {impactAnchor && (
            <LaserFlow 
              color="#CF9EFF"
              horizontalBeamOffset={0.0}
              verticalBeamOffset={0.0}
              verticalSizing={4}
              horizontalSizing={3.2}
              flowSpeed={0.35}
              flowStrength={0.5}
              decay={1.1}
              falloffStart={1.25}
              fogFallSpeed={1}
              fogIntensity={0.5}
              fogScale={0.3}
              wispSpeed={20.0}
              wispIntensity={15.0}
              wispDensity={2}
              mouseTiltStrength={0.01}
              mouseSmoothTime={0.0}
              baseFlatten={1}
              impactAnchorPx={impactAnchor}
              coreThicknessPx={80}
              coreHeightPx={500}
              
            />)}
          </div>


          {/* Target square around 45% height */}
          <div ref={targetRef} className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[240px] aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-3" style={{ borderColor: '#CF9EFF' }}>
            {/* Dice SVG: white face with transparent pips (cutouts) */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-[10px] z-[2]" style={{borderTop: '2px solid #CF9EFF', borderRadius: '12px' }} />
              <div className="absolute inset-[10px] z-[2] overflow-hidden" style={{borderRadius: '12px' }}>
              <div className="absolute top-[-20px] left-[-10px] right-[-10px] z-[2] h-[48px] overflow-hidden" style={{background: 'radial-gradient(circle, #CF9EFF, transparent)', borderRadius: '50%', filter: 'blur(16px)' }} />
              </div>
              
            <svg viewBox="0 0 100 100" className="w-32 h-32 box-shadow-lg" style={{ filter: 'drop-shadow(0 0 0 #000) inset 0 -4px 8px #cf9effaa' }}>
              <defs>
                <mask id="pips-mask">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Five pips */}
                  <circle cx="25" cy="25" r="7" fill="black" />
                  <circle cx="75" cy="25" r="7" fill="black" />
                  <circle cx="50" cy="50" r="7" fill="black" />
                  <circle cx="25" cy="75" r="7" fill="black" />
                  <circle cx="75" cy="75" r="7" fill="black" />
                </mask>
                <clipPath id="dice-clip">
                  <rect x="8" y="8" width="84" height="84" rx="10" />
                </clipPath>
                <linearGradient id="dice-top-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CF9EFF" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#CF9EFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#CF9EFF" stopOpacity="0" />
                </linearGradient>
                <filter id="dice-glow-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>
              <rect x="8" y="8" width="84" height="84" rx="10" fill="white" mask="url(#pips-mask)" />
              <rect x="8" y="8" width="84" height="84" rx="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Inner glow along the top edge (inside dice) */}
              <rect
                x="8"
                y="8"
                width="84"
                height="24"
                rx="10"
                fill="url(#dice-top-glow)"
                clipPath="url(#dice-clip)"
                mask="url(#pips-mask)"
                filter="url(#dice-glow-blur)"
                opacity="0.9"
                style={{ mixBlendMode: 'screen' as any }}
              />
            </svg>
            </div>

            {/* Title */}
            <div className="text-center leading-none select-none">
              <span className="text-3xl font-bold bg-gradient-to-r from-[#CF9EFF] via-[#A071FF] to-[#CF9EFF] bg-clip-text text-transparent animate-gradient">Dice</span>
              <span className="text-3xl font-bold text-white">&nbsp;Tracker</span>
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 w-[240px] h-[64px]" style={{ top: 'calc(44% + 152px)' }}>
            <LiquidGlassCard className="w-full h-full animate-[rainbow_6s_linear_infinite]" style={{ borderRadius: '8rem', background: 'conic-gradient(from var(--angle), #CF9EFF, #A071FF, #CF9EFF, transparent, transparent, transparent, transparent)' }}>
              <Link to="/profile" className="w-full h-full py-4 px-8 flex items-center justify-center no-underline" style={{ borderRadius: '8rem', fontWeight: 'bold' }}>Get Started</Link>
            </LiquidGlassCard>
          </div>
          <GoogleSignInButton className="w-[64px] h-[64px] bg-red rounded-full absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(44% + 152px + 100px)' }} />
        </div>
      </div>
    </div>
  );
};

export default Start;


