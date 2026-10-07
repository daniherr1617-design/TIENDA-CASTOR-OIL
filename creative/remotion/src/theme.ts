import brand from '../../config/brand.json';
import zones from '../../config/safe-zones.json';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/600-italic.css';
import type {Platform} from './types';

export const BRAND = brand;
export const W = 1080;
export const H = 1920;

export type Zone = {top: number; bottom: number; left: number; right: number};
export const safeZone = (p: Platform = 'universal'): Zone =>
  (zones as unknown as Record<string, Zone>)[p];

export const SANS = `'Inter', sans-serif`;
export const SERIF = `'Lora', serif`;

// Normaliza para comparar palabras resaltadas sin tildes ni signos.
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '');
