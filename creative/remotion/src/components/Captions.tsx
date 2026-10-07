import React, {useMemo} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, H, SANS, W, Zone, norm} from '../theme';
import type {Word} from '../types';

type Chunk = {words: Word[]; start: number; end: number};

// Agrupa palabras en bloques cortos: corta por número de palabras, puntuación o pausas.
// La puntuación final (.,;:) solo marca el corte: no se pinta.
export const chunkWords = (words: Word[], maxWords = 3): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : 99;
    if (cur.length >= maxWords || /[.,!?;:]$/.test(w.text) || gap > 0.35 || !next) {
      chunks.push({words: cur, start: cur[0].start, end: Math.max(w.end, next ? Math.min(next.start, w.end + 0.25) : w.end + 0.3)});
      cur = [];
    }
  });
  return chunks;
};

// Subtítulos dinámicos: bloque de 1-3 palabras, la palabra que suena en dorado claro.
export const Captions: React.FC<{words: Word[]; highlight?: string[]; maxWords?: number; zone: Zone}> = ({words, highlight = [], maxWords, zone}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const chunks = useMemo(() => chunkWords(words, maxWords), [words, maxWords]);
  const keys = useMemo(() => new Set(highlight.map(norm)), [highlight]);
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const pop = spring({frame: f - Math.round(chunk.start * fps), fps, config: {damping: 12, stiffness: 220}});
  return (
    <div
      style={{
        position: 'absolute',
        left: zone.left,
        width: W - zone.left - zone.right,
        bottom: zone.bottom + 40,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${0.85 + 0.15 * pop})`,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.1,
          textAlign: 'center',
          textTransform: 'uppercase',
          color: BRAND.white,
          WebkitTextStroke: `14px ${BRAND.charcoal}`,
          paintOrder: 'stroke fill',
          textShadow: '0 6px 24px rgba(0,0,0,0.35)',
          maxHeight: H * 0.2,
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start && t < w.end;
          const key = keys.has(norm(w.text));
          return (
            <span key={i} style={{color: active || key ? BRAND.goldLight : BRAND.white}}>
              {w.text.replace(/[.,;:]+$/, '')}
              {i < chunk.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
