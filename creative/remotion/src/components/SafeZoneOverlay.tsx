import React from 'react';
import {AbsoluteFill} from 'remotion';
import {H, W, Zone} from '../theme';

// Solo para revisión: sombrea lo que tapa la interfaz de la plataforma.
export const SafeZoneOverlay: React.FC<{zone: Zone}> = ({zone}) => {
  const shade = 'rgba(220,30,60,0.28)';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: zone.top, background: shade}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: zone.bottom, background: shade}} />
      <div style={{position: 'absolute', left: 0, top: zone.top, width: zone.left, height: H - zone.top - zone.bottom, background: shade}} />
      <div style={{position: 'absolute', right: 0, top: zone.top, width: zone.right, height: H - zone.top - zone.bottom, background: shade}} />
      <div style={{position: 'absolute', left: zone.left, top: zone.top, width: W - zone.left - zone.right, height: H - zone.top - zone.bottom, outline: '4px dashed rgba(220,30,60,0.9)'}} />
    </AbsoluteFill>
  );
};
