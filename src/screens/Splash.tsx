import React, { useRef, useState } from 'react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import Iridescence from '../components/Iridescence.tsx';
import DecryptedText from '../components/DecryptedText.tsx';

const Splash: React.FC = () => {
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

  // removed unused impactAnchor logic

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
        className="rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-[#2E1371] to-black"
      >
        <div className="relative w-full h-full" ref={wrapperRef}>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-xl overflow-hidden">
            <Iridescence color={[100, 200, 255]} /> 
          </div>
          <LiquidGlassCard distortion={0.8} thickness={1} className='absolute top-[44%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] flex flex-col justify-center items-center text-white'>
          <div className='absolute inset-0 flex flex-col gap-3 items-center justify-center'>
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
            <DecryptedText text="Dice Tracker" animateOn="view" revealDirection='start' sequential={true} speed={200} className='text-white text-3xl font-bold' />
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
};

export default Splash;


