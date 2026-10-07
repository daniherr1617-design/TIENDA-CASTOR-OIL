import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

// En el contenedor cloud ya hay un Chromium headless: se usa en lugar de descargar otro.
// Fuera de aquí, Remotion descarga el suyo automáticamente.
const candidates = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
];
const browser = candidates.find((p) => p && existsSync(p));
if (browser) Config.setBrowserExecutable(browser);

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
// Sin esto Remotion entrega yuvj420p (rango completo), que algunas plataformas interpretan con colores lavados.
Config.setColorSpace('bt709');
Config.setCrf(18);
Config.setOverwriteOutput(true);
