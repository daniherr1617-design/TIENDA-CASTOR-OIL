#!/usr/bin/env python3
"""Synthetic fixtures for testing garelon-video-qa without real videos or credits.

Draws a fake "bracelet" (textured beads in 3 colours, medal, cross, clasp) on an
ivory reference image, renders short vertical videos with it and derives
variants with ffmpeg: good upscale, bad upscale, altered product, corrupted file.

usage: make_fixtures.py OUT_DIR
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

RNG = np.random.default_rng(7)
BEAD_COLORS = [(40, 40, 200), (230, 230, 230), (60, 150, 40)]   # BGR
GOLD = (60, 175, 215)


def textured(img, mask, color, seed):
    rng = np.random.default_rng(seed)
    noise = rng.integers(-55, 55, img.shape[:2]).astype(np.int16)
    noise = cv2.GaussianBlur(noise.astype(np.float32), (3, 3), 0)
    for c in range(3):
        ch = img[..., c].astype(np.float32)
        ch[mask] = np.clip(color[c] + noise[mask], 0, 255)
        img[..., c] = ch.astype(np.uint8)


def draw_product(bead_colors=BEAD_COLORS, medal="oval"):
    W, H = 1200, 900
    img = np.full((H, W, 3), (215, 230, 240), np.uint8)
    parts = {}
    # beads along an arc
    cx, cy, R = 600, 470, 380
    for k, ang in enumerate(np.linspace(np.pi * 1.08, np.pi * 1.92, 17)):
        x, y = int(cx + R * np.cos(ang)), int(cy + R * np.sin(ang) * 0.75)
        m = np.zeros((H, W), np.uint8)
        cv2.circle(m, (x, y), 24, 255, -1)
        textured(img, m > 0, bead_colors[k % 3], 100 + k)
    parts["cuentas"] = [200, 160, 800, 190]
    # medal
    m = np.zeros((H, W), np.uint8)
    if medal == "oval":
        cv2.ellipse(m, (600, 640), (80, 110), 0, 0, 360, 255, -1)
    else:
        cv2.rectangle(m, (520, 540), (680, 740), 255, -1)
    textured(img, m > 0, GOLD, 300)
    cv2.putText(img, "M", (560, 670), cv2.FONT_HERSHEY_SIMPLEX, 2.2, (30, 80, 110), 6)
    parts["medalla"] = [500, 510, 200, 260]
    # cross (integrated on the chain)
    m = np.zeros((H, W), np.uint8)
    cv2.rectangle(m, (930, 300), (960, 420), 255, -1)
    cv2.rectangle(m, (895, 335), (995, 365), 255, -1)
    textured(img, m > 0, GOLD, 400)
    parts["cruz"] = [870, 280, 150, 160]
    # clasp: three rings
    for i in range(3):
        cv2.circle(img, (230 + i * 38, 380), 16, GOLD, 6)
    parts["cierre"] = [195, 345, 150, 70]
    return img, parts


def render_video(product, out, size=(720, 1280), secs=6, fps=30, path_shift=0.0, scale=0.55):
    W, H = size
    tmp = str(out) + ".raw.mp4"
    vw = cv2.VideoWriter(tmp, cv2.VideoWriter_fourcc(*"mp4v"), fps, (W, H))
    bg = RNG.integers(60, 120, (H, W, 3)).astype(np.uint8)
    bg = cv2.GaussianBlur(bg, (31, 31), 0)
    for i in range(secs * fps):
        p = i / (secs * fps)
        s = scale * (1 + 0.15 * p) * W / 720
        ph = cv2.resize(product, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        frame = bg.copy()
        x = int((W - ph.shape[1]) / 2 + (40 * np.sin(2 * np.pi * (p + path_shift))) * W / 720)
        y = int(H * 0.30 + 60 * p * H / 1280)
        x0, y0 = max(x, 0), max(y, 0)
        x1, y1 = min(x + ph.shape[1], W), min(y + ph.shape[0], H)
        frame[y0:y1, x0:x1] = ph[y0 - y:y1 - y, x0 - x:x1 - x]
        vw.write(frame)
    vw.release()
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-crf", "18", str(out)], check=True)
    Path(tmp).unlink()


def ff(args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def main(out_dir):
    out = Path(out_dir)
    (out / "refs").mkdir(parents=True, exist_ok=True)
    ref, parts = draw_product()
    cv2.imwrite(str(out / "refs" / "ref_principal.png"), ref)
    refs = {"product": "SINTÉTICO de prueba", "parts": [
        {"name": n, "image": "ref_principal.png", "bbox": b, "critical": True} for n, b in parts.items()]}
    (out / "refs" / "refs.json").write_text(json.dumps(refs, indent=2, ensure_ascii=False))

    render_video(ref, out / "original_720.mp4")
    ff(["-i", str(out / "original_720.mp4"), "-vf", "scale=1080:1920:flags=lanczos",
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-b:v", "0", str(out / "upscale_good.mp4")])
    ff(["-i", str(out / "original_720.mp4"), "-vf", "scale=540:960,gblur=sigma=2.5,scale=1080:1920",
        "-c:v", "libx264", "-crf", "38", "-pix_fmt", "yuv420p", str(out / "upscale_bad.mp4")])
    altered, _ = draw_product(bead_colors=[(200, 60, 40), (40, 200, 230), (150, 40, 150)], medal="square")
    render_video(altered, out / "generation_altered.mp4", size=(1080, 1920), path_shift=0.3)
    render_video(ref, out / "generation_ok.mp4", size=(1080, 1920), path_shift=0.3)
    # freeze 1 s in the middle
    ff(["-i", str(out / "upscale_good.mp4"), "-vf",
        "select='lt(n,75)+gte(n,105)',setpts=N/30/TB,tpad=stop_mode=clone:stop_duration=0",
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", str(out / "tmp_cut.mp4")])
    ff(["-i", str(out / "upscale_good.mp4"), "-vf",
        "trim=start_frame=0:end_frame=75,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=1",
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", str(out / "frozen.mp4")])
    (out / "tmp_cut.mp4").unlink()
    data = bytearray((out / "upscale_good.mp4").read_bytes())
    mid = len(data) // 2
    data[mid:mid + 40000] = bytes(RNG.integers(0, 255, 40000, dtype=np.uint8))
    (out / "corrupted.mp4").write_bytes(bytes(data))
    print("fixtures en", out)


if __name__ == "__main__":
    main(sys.argv[1])
