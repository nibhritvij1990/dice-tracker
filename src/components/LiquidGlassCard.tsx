import React from 'react';
import styles from './LiquidGlassCard.module.css';

type LiquidGlassCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  distortion?: number; // 0..1 controls refraction intensity
  thickness?: number;  // 0..1 controls perceived glass thickness/curvature
};

export default function LiquidGlassCard({ children, className = '', style, distortion = 0.5, thickness = 0.5 }: LiquidGlassCardProps) {
  // Map user-friendly 0..1 to filter params with sane defaults
  const baseFrequency = 0.004 + (distortion * 0.02); // 0.004..0.024
  const blurStd = 1 + distortion * 4;                 // 1..5
  const dispScale = 40 + distortion * 180;            // 40..220
  const surfaceScale = 2 + thickness * 8;             // 2..10 (curvature)
  const specularExp = 50 + thickness * 150;           // 50..200 (sharper highlights)

  return (
    <div className={`${styles.wrapper} ${className}`} style={style}>
      <div className={styles.effect} />
      <div className={styles.tint} />
      <div className={styles.shine} />
      <div className={styles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <svg style={{ display: 'none' }} aria-hidden>
        <filter id="lg-glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency={`${baseFrequency} ${baseFrequency}`} numOctaves="1" seed="5" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation={`${blurStd}`} result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale={`${surfaceScale}`} specularConstant="1" specularExponent={`${specularExp}`} lightingColor="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale={`${dispScale}`} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
} 