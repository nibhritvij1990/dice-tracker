import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';

const Profile: React.FC = () => {
  const devicePresets = {
    'iphone-se': { label: 'iPhone SE (2/3)', width: 320, height: 568 },
    'android-360x800': { label: 'Android (360×800)', width: 360, height: 800 },
    'iphone-12-14': { label: 'iPhone 12/13/14', width: 390, height: 844 },
    'iphone-15-pro-max': { label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  } as const;

  type DevicePresetKey = keyof typeof devicePresets;
  const [presetId, setPresetId] = useState<DevicePresetKey>('iphone-12-14');
  const preset = devicePresets[presetId];
  // removed unused impactAnchor and measurement refs

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

        {/* Primary actions */}
        <div className="px-5 mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <button className="w-full h-12 rounded-xl text-sm font-medium shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F] text-white relative"
              style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}>
                History
              </button>
            </div>
            <div>
            <button className="w-full h-12 rounded-xl text-sm font-medium shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F] text-white relative"
              style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}>
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="px-5 mt-6 grid grid-cols-2 gap-3">
          <div>
            <div className="p-4 rounded-xl text-sm font-medium shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F] text-white relative"
              style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}>
              <div className="text-xs text-white/80">Last Session</div>
              <div className="mt-2 text-xl font-semibold">12 rolls</div>
              <div className="text-xs text-white/70">Avg: 3.8</div>
            </div>
          </div>
          <div>
          <div className="p-4 rounded-xl text-sm font-medium shadow-2xl bg-gradient-to-br from-[#2E1371] to-[#21232F] text-white relative"
              style={{ boxShadow: '-1px -1px 0px 0px rgb(7, 251, 211), 0px -1px 0px 0px rgb(7, 251, 211)' }}>
              <div className="text-xs text-white/80">Best Streak</div>
              <div className="mt-2 text-xl font-semibold">4 in a row</div>
              <div className="text-xs text-white/70">High: 6</div>
            </div>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-3">
          <div className="w-full">
          <Link to="/tracker" aria-label="Tracker" className="flex items-center justify-center w-full h-14 rounded-xl text-base font-medium shadow-2xl bg-gradient-to-br from-[#B6116B] to-[#3B1578] text-white relative"
              style={{ boxShadow: '-1px -1px 0px 0px rgb(255, 83, 192), 0px -1px 0px 0px rgb(255, 83, 192)' }}>
                Start Tracking
              </Link>
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
            <Link to="/tracker" aria-label="Tracker" className="p-2 relative h-[40px] w-[40px]">
              <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" aria-hidden>
                <defs>
                  <mask id="pips-mask-footer">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <circle cx="25" cy="25" r="9" fill="black" />
                    <circle cx="75" cy="25" r="9" fill="black" />
                    <circle cx="50" cy="50" r="9" fill="black" />
                    <circle cx="25" cy="75" r="9" fill="black" />
                    <circle cx="75" cy="75" r="9" fill="black" />
                  </mask>
                </defs>
                <rect x="8" y="8" width="84" height="84" rx="12" fill="currentColor" mask="url(#pips-mask-footer)" />
                <rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
              </svg>
            </Link>

            {/* Profile (solid) */}
            <button aria-label="Profile" className="p-2 relative h-[40px] w-[40px]">
              <LiquidGlassCard className="absolute w-[64px] h-[64px] rounded-full bottom-[28px] left-[-20px] flex items-center justify-center" style={{ borderRadius: '50%'}} >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden >
                <path d="M12 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                <path d="M4 20.5c0-4.142 3.582-7.5 8-7.5s8 3.358 8 7.5V22H4v-1.5Z" />
              </svg>
            </LiquidGlassCard>
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Profile;