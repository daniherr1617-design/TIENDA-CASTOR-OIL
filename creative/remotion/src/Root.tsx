import React from 'react';
import {Composition} from 'remotion';
import {AdVertical, totalSeconds} from './AdVertical';
import type {AdProps} from './types';

const FPS = 30;

// Remotion mezcla estas props con las del anuncio: aquí no puede haber flags visuales
// (zonas seguras, etiquetas) o acabarían en todos los renders.
const defaultProps: AdProps = {
  id: 'DEMO',
  segments: [{type: 'image', src: 'demo.png', duration: 3}],
  hook: {text: 'Hook de ejemplo', highlight: ['Hook'], start: 0, end: 2.5},
};

export const Root: React.FC = () => (
  <Composition
    id="AdVertical"
    component={AdVertical}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={FPS * 3}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round(totalSeconds(props) * FPS))})}
  />
);
