import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import type {Segment} from '../types';

const enterStyle = (enter: Segment['enter'], f: number): React.CSSProperties => {
  switch (enter) {
    case 'fade':
      return {opacity: interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'})};
    case 'punch':
      return {transform: `scale(${interpolate(f, [0, 9], [1.14, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})})`};
    case 'slide-up':
      return {transform: `translateY(${interpolate(f, [0, 9], [260, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})}px)`};
    default:
      return {};
  }
};

export const MediaSegment: React.FC<{seg: Segment; background: string}> = ({seg, background}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const [z0, z1] = seg.zoom ?? [1, 1];
  const scale = interpolate(f, [0, durationInFrames], [z0, z1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const origin = `${(seg.focusX ?? 0.5) * 100}% ${(seg.focusY ?? 0.5) * 100}%`;
  const media: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: seg.fit ?? 'cover',
    objectPosition: origin,
    transform: `scale(${scale})`,
    transformOrigin: origin,
  };
  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <AbsoluteFill style={{...enterStyle(seg.enter, f), ...(seg.band ? {top: seg.band.top, bottom: seg.band.bottom, height: 'auto'} : {})}}>
        {seg.type === 'video' ? (
          <OffthreadVideo
            src={staticFile(seg.src)}
            trimBefore={Math.round(seg.from * fps)}
            trimAfter={Math.round(seg.to * fps)}
            volume={seg.volume ?? 1}
            style={media}
          />
        ) : (
          <Img src={staticFile(seg.src)} style={media} />
        )}
      </AbsoluteFill>
      {seg.enter === 'flash' && (
        <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 6], [0.85, 0], {extrapolateRight: 'clamp'})}} />
      )}
    </AbsoluteFill>
  );
};
