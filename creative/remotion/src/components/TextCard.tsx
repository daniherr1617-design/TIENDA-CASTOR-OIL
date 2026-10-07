import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, H, SANS, W, Zone} from '../theme';
import type {TextBlock} from '../types';
import {Highlighted} from './Highlighted';

// Tarjeta de texto de marca (hook y overlays): marfil, texto carbón y resaltado dorado.
export const TextCard: React.FC<{block: TextBlock; zone: Zone; size?: number}> = ({block, zone, size = 76}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const pop = spring({frame: f, fps, config: {damping: 14, stiffness: 180}});
  const out = interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  const pos = block.position ?? 'top';
  const safeH = H - zone.top - zone.bottom;
  const top = pos === 'top' ? zone.top + 30 : pos === 'center' ? zone.top + safeH * 0.38 : H - zone.bottom - 300;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: zone.left,
        width: W - zone.left - zone.right,
        display: 'flex',
        justifyContent: 'center',
        opacity: out,
        transform: `translateY(${(1 - pop) * -40}px) scale(${0.9 + 0.1 * pop})`,
      }}
    >
      <div
        style={{
          background: 'rgba(250,247,242,0.94)',
          color: BRAND.charcoal,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.08,
          letterSpacing: -1,
          textAlign: 'center',
          padding: '26px 34px',
          borderRadius: 28,
          boxShadow: '0 10px 40px rgba(42,38,34,0.22)',
          maxWidth: '100%',
        }}
      >
        <Highlighted text={block.text} highlight={block.highlight} color={BRAND.gold} />
      </div>
    </div>
  );
};
