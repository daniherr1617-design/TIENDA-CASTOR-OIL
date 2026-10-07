import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from './components/Captions';
import {Cta} from './components/Cta';
import {MediaSegment} from './components/MediaSegment';
import {SafeZoneOverlay} from './components/SafeZoneOverlay';
import {TextCard} from './components/TextCard';
import {BRAND, SANS, safeZone} from './theme';
import {AdProps, segmentSeconds} from './types';

export const totalSeconds = (p: AdProps) => p.segments.reduce((a, s) => a + segmentSeconds(s), 0);

// Zoom "golpe" sobre toda la capa de imagen en momentos concretos (énfasis).
const usePunch = (punches: AdProps['punches'], fps: number) => {
  const f = useCurrentFrame();
  return (punches ?? []).reduce((acc, p) => {
    const start = Math.round(p.at * fps);
    if (f < start) return acc;
    const dur = Math.round((p.duration ?? 0.5) * fps);
    const s = spring({frame: f - start, fps, config: {damping: 9, stiffness: 200}, durationInFrames: dur});
    const back = interpolate(f, [start + dur, start + dur + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return acc * (1 + ((p.scale ?? 1.12) - 1) * s * back);
  }, 1);
};

export const AdVertical: React.FC<AdProps> = (props) => {
  const {fps, durationInFrames} = useVideoConfig();
  const zone = safeZone(props.platform);
  const bg = props.background ?? BRAND.ivory;
  const punch = usePunch(props.punches, fps);
  const sec = (s: number) => Math.round(s * fps);

  let cursor = 0;
  const layout = props.segments.map((seg) => {
    const from = cursor;
    const dur = Math.max(1, sec(segmentSeconds(seg)));
    cursor += dur;
    return {seg, from, dur};
  });

  return (
    <AbsoluteFill style={{background: bg}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>
        {layout.map(({seg, from, dur}, i) => (
          <Sequence key={i} from={from} durationInFrames={dur} name={`seg${i + 1}`}>
            <MediaSegment seg={seg} background={bg} />
          </Sequence>
        ))}
      </AbsoluteFill>

      {props.captions && props.captions.words.length > 0 && (
        <Captions words={props.captions.words} highlight={props.captions.highlight} maxWords={props.captions.maxWords} zone={zone} />
      )}

      {(props.overlays ?? []).map((o, i) => (
        <Sequence key={`o${i}`} from={sec(o.start)} durationInFrames={Math.max(1, sec(o.end - o.start))} name={`overlay${i + 1}`}>
          <TextCard block={o} zone={zone} size={64} />
        </Sequence>
      ))}

      {props.hook && (
        <Sequence from={sec(props.hook.start)} durationInFrames={Math.max(1, sec(props.hook.end - props.hook.start))} name="hook">
          <TextCard block={props.hook} zone={zone} />
        </Sequence>
      )}

      {props.cta && (
        <Sequence from={sec(props.cta.start)} durationInFrames={props.cta.end ? sec(props.cta.end - props.cta.start) : durationInFrames} name="cta">
          <Cta text={props.cta.text} sub={props.cta.sub} zone={zone} />
        </Sequence>
      )}

      {props.music && (
        <Audio
          src={staticFile(props.music.src)}
          loop
          volume={(f) => {
            const fade = sec(props.music?.fadeOutSeconds ?? 1);
            return (props.music?.volume ?? 0.3) * interpolate(f, [durationInFrames - fade, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          }}
        />
      )}
      {(props.sfx ?? []).map((s, i) => (
        <Sequence key={`sfx${i}`} from={sec(s.at)} name={`sfx${i + 1}`}>
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.6} />
        </Sequence>
      ))}

      {props.showSafeZones && <SafeZoneOverlay zone={zone} />}
      {props.debugLabel && (
        <div style={{position: 'absolute', top: 24, left: 24, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#fff', background: 'rgba(200,20,50,0.85)', padding: '6px 16px', borderRadius: 10}}>
          {props.debugLabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
