// Contrato de props de un anuncio. Los tiempos van en SEGUNDOS sobre la línea
// de tiempo FINAL del anuncio (salvo from/to de un clip, que son del vídeo fuente).

export type Enter = 'cut' | 'fade' | 'punch' | 'slide-up' | 'flash';
export type Platform = 'universal' | 'meta' | 'tiktok';

type MediaBase = {
  src: string; // relativo a creative/media
  fit?: 'cover' | 'contain';
  focusX?: number; // 0-1, punto que se mantiene al recortar o hacer zoom
  focusY?: number;
  zoom?: [number, number]; // escala al inicio y al final del segmento
  enter?: Enter;
  band?: {top: number; bottom: number}; // limita el medio a una franja vertical (px), p. ej. cierre con CTA debajo
};

export type VideoSegment = MediaBase & {
  type: 'video';
  from: number; // segundo de inicio en el vídeo fuente
  to: number; // segundo final en el vídeo fuente
  volume?: number;
};

export type ImageSegment = MediaBase & {
  type: 'image';
  duration: number;
};

export type Segment = VideoSegment | ImageSegment;

export type Word = {text: string; start: number; end: number};

export type TextBlock = {
  text: string;
  highlight?: string[];
  start: number;
  end: number;
  position?: 'top' | 'center' | 'bottom';
};

export type AdProps = {
  id: string;
  platform?: Platform;
  showSafeZones?: boolean;
  debugLabel?: string; // p. ej. «PRUEBA»: se pinta en una esquina para que no se confunda con un final
  background?: string;
  segments: Segment[];
  hook?: TextBlock;
  captions?: {words: Word[]; highlight?: string[]; maxWords?: number};
  overlays?: TextBlock[];
  punches?: {at: number; scale?: number; duration?: number}[];
  cta?: {text: string; sub?: string; start: number; end?: number};
  music?: {src: string; volume?: number; fadeOutSeconds?: number};
  sfx?: {src: string; at: number; volume?: number}[];
};

export const segmentSeconds = (s: Segment) =>
  s.type === 'video' ? Math.max(0, s.to - s.from) : s.duration;
