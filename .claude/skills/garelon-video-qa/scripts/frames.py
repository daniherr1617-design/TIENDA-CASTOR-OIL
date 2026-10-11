"""Frame reading, representative-frame selection and image sheets (contact sheet, side-by-side)."""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from common import fmt_ts


def read_frame(path: str, t: float):
    """BGR frame at time t (seconds) or None."""
    cap = cv2.VideoCapture(path)
    try:
        cap.set(cv2.CAP_PROP_POS_MSEC, max(t, 0) * 1000.0)
        ok, frame = cap.read()
        return frame if ok else None
    finally:
        cap.release()


def select_timestamps(duration: float, scene_cuts: list[float], extra: list[float], th: dict) -> list[float]:
    """Start, 1 s, 3 s (hook), middle, end, one frame per scene, plus flagged moments."""
    f = th["frames"]
    end = max(duration - 0.05, 0)
    base = [0.0, 1.0, 3.0, duration / 2, end]
    scenes = [min(c + 0.15, end) for c in scene_cuts]
    cand = [t for t in base + scenes + list(extra) if 0 <= t <= end]
    out: list[float] = []
    for t in sorted(cand, key=lambda x: (x not in extra, x)):   # flagged moments first
        if all(abs(t - o) >= f["dedupe_s"] for o in out):
            out.append(t)
        if len(out) >= f["max_representative"]:
            break
    return sorted(out)


_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/arial.ttf",
]
_UNICODE_OK = any(Path(p).exists() for p in _FONT_CANDIDATES)


def _font(size: int):
    for p in _FONT_CANDIDATES:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _txt(s: str) -> str:
    """The bundled fallback font lacks accents and Greek letters: degrade to ASCII."""
    if _UNICODE_OK:
        return s
    import unicodedata
    s = s.replace("Δ", "d")
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()


def _to_pil(bgr) -> Image.Image:
    return Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))


def _fit(img: Image.Image, w: int, h: int) -> Image.Image:
    img = img.copy()
    img.thumbnail((w, h))
    canvas = Image.new("RGB", (w, h), (24, 24, 24))
    canvas.paste(img, ((w - img.width) // 2, (h - img.height) // 2))
    return canvas


def contact_sheet(video: str, timestamps: list[float], out: Path, th: dict, title: str) -> Path | None:
    tw = th["frames"]["thumb_width"]
    thumbs = []
    for t in timestamps:
        fr = read_frame(video, t)
        if fr is None:
            continue
        im = _to_pil(fr)
        im.thumbnail((tw, tw * 2))
        thumbs.append((t, im))
    if not thumbs:
        return None
    th_h = max(im.height for _, im in thumbs)
    cols = min(4, len(thumbs))
    rows = (len(thumbs) + cols - 1) // cols
    pad, label_h, head = 8, 22, 34
    W = cols * (tw + pad) + pad
    H = head + rows * (th_h + label_h + pad) + pad
    sheet = Image.new("RGB", (W, H), (16, 16, 16))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 8), _txt(title), fill=(235, 235, 235), font=_font(18))
    for i, (t, im) in enumerate(thumbs):
        r, c = divmod(i, cols)
        x = pad + c * (tw + pad)
        y = head + r * (th_h + label_h + pad)
        sheet.paste(im, (x, y))
        d.text((x, y + th_h + 3), _txt(fmt_ts(t)), fill=(255, 210, 90), font=_font(16))
    sheet.save(out, quality=88)
    return out


def side_by_side_rows(rows: list[dict], out: Path, title: str, cell: int = 300) -> Path | None:
    """rows: [{"label": str, "cells": [(caption, bgr_or_pil_or_None), ...], "note": str}]"""
    if not rows:
        return None
    ncols = max(len(r["cells"]) for r in rows)
    pad, cap_h, label_w, head = 10, 40, 150, 40
    W = label_w + ncols * (cell + pad) + pad
    row_h = cell + cap_h + pad
    H = head + len(rows) * row_h + pad
    sheet = Image.new("RGB", (W, H), (16, 16, 16))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 10), _txt(title), fill=(235, 235, 235), font=_font(18))
    for i, row in enumerate(rows):
        y = head + i * row_h
        d.text((pad, y + 6), _txt(row["label"]), fill=(255, 210, 90), font=_font(17))
        if row.get("note"):
            for j, line in enumerate(_wrap(row["note"], 18)[:8]):
                d.text((pad, y + 32 + j * 16), _txt(line), fill=(200, 200, 200), font=_font(13))
        for j, (caption, img) in enumerate(row["cells"]):
            x = label_w + j * (cell + pad)
            if img is None:
                box = Image.new("RGB", (cell, cell), (40, 20, 20))
                ImageDraw.Draw(box).text((10, cell // 2 - 8), _txt("no localizado"), fill=(255, 120, 120), font=_font(16))
            else:
                pil = img if isinstance(img, Image.Image) else _to_pil(img)
                box = _fit(pil, cell, cell)
            sheet.paste(box, (x, y))
            for k, line in enumerate(_wrap(caption, 40)[:2]):
                d.text((x, y + cell + 3 + k * 16), _txt(line), fill=(220, 220, 220), font=_font(14))
    sheet.save(out, quality=90)
    return out


def _wrap(text: str, width: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


def save_frame(video: str, t: float, out: Path) -> Path | None:
    fr = read_frame(video, t)
    if fr is None:
        return None
    cv2.imwrite(str(out), fr, [cv2.IMWRITE_JPEG_QUALITY, 92])
    return out


def resize_to(img, w: int, h: int):
    return cv2.resize(img, (w, h), interpolation=cv2.INTER_CUBIC)


def blank(w: int = 10, h: int = 10):
    return np.zeros((h, w, 3), np.uint8)
