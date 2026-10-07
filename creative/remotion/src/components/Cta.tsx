import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, H, SANS, SERIF, W, Zone} from '../theme';

// CTA dentro de la zona segura, justo encima del margen inferior de la plataforma.
export const Cta: React.FC<{text: string; sub?: string; zone: Zone}> = ({text, sub, zone}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f, fps, config: {damping: 11, stiffness: 160}});
  const pulse = 1 + 0.025 * Math.sin((f / fps) * Math.PI * 2 * 1.2) * Math.min(1, f / 20);
  return (
    <div
      style={{
        position: 'absolute',
        left: zone.left,
        width: W - zone.left - zone.right,
        bottom: zone.bottom + 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        transform: `translateY(${(1 - pop) * 120}px)`,
        opacity: Math.min(1, pop * 1.4),
        maxHeight: H * 0.3,
      }}
    >
      <div
        style={{
          background: BRAND.gold,
          color: BRAND.white,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 62,
          padding: '28px 56px',
          borderRadius: 999,
          boxShadow: '0 12px 36px rgba(42,38,34,0.35)',
          transform: `scale(${pulse})`,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 44,
            color: BRAND.charcoal,
            background: 'rgba(250,247,242,0.92)',
            padding: '10px 28px',
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
