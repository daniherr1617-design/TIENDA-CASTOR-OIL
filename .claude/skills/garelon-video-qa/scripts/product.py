"""Product fidelity signals for the GARELON bracelet parts.

Each part (pulsera, medalla, cruz, cuentas, cierre...) is a crop of an approved
reference image declared in refs.json. For every sampled frame the part is
located (AKAZE features + homography, multi-scale template matching as fallback)
and compared with its reference crop:

  * structural SSIM of the perspective-normalised crop (signal)
  * colour distance (ΔE76 between dominant Lab colours) (signal)
  * relative scale between parts of the same reference image (proportions)
  * in aligned stages, crop-vs-original SSIM and sharpness at the same position

None of these numbers decides fidelity alone. Anything suspicious becomes a
WARNING pointing at the side-by-side sheet; FAIL on product only comes from the
visual review recorded with `qa.py finalize`.
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

from common import Issue
from frames import read_frame


# ---------- references ----------

def load_refs(refs_path: str) -> dict:
    p = Path(refs_path)
    data = json.loads(p.read_text(encoding="utf-8"))
    base = p.parent
    parts = []
    for part in data.get("parts", []):
        img = cv2.imread(str(base / part["image"]), cv2.IMREAD_COLOR)
        if img is None:
            raise FileNotFoundError(f"Referencia no encontrada: {base / part['image']}")
        x, y, w, h = part["bbox"]
        crop = img[y:y + h, x:x + w].copy()
        if crop.size == 0:
            raise ValueError(f"bbox vacío para {part['name']}")
        parts.append({**part, "crop": crop})
    return {"product": data.get("product", ""), "parts": parts, "base": str(base)}


# ---------- metrics ----------

def ssim_gray(a, b) -> float:
    """Classic single-scale SSIM on grayscale images of equal size."""
    a = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY).astype(np.float64)
    b = cv2.cvtColor(b, cv2.COLOR_BGR2GRAY).astype(np.float64)
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    k = (11, 11)
    mu_a, mu_b = cv2.GaussianBlur(a, k, 1.5), cv2.GaussianBlur(b, k, 1.5)
    s_aa = cv2.GaussianBlur(a * a, k, 1.5) - mu_a ** 2
    s_bb = cv2.GaussianBlur(b * b, k, 1.5) - mu_b ** 2
    s_ab = cv2.GaussianBlur(a * b, k, 1.5) - mu_a * mu_b
    m = ((2 * mu_a * mu_b + c1) * (2 * s_ab + c2)) / ((mu_a ** 2 + mu_b ** 2 + c1) * (s_aa + s_bb + c2))
    return float(m.mean())


def dominant_lab(img, k: int = 3) -> tuple[np.ndarray, np.ndarray]:
    lab = cv2.cvtColor(img.astype(np.float32) / 255.0, cv2.COLOR_BGR2Lab).reshape(-1, 3)
    if len(lab) > 6000:
        lab = lab[np.random.default_rng(0).choice(len(lab), 6000, replace=False)]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, labels, centers = cv2.kmeans(lab.astype(np.float32), k, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    w = np.bincount(labels.ravel(), minlength=k) / len(labels)
    return centers, w


def delta_e(ref, img) -> float:
    """Weighted ΔE76 between dominant colours (greedy matching)."""
    cr, wr = dominant_lab(ref)
    ci, _ = dominant_lab(img)
    used, total = set(), 0.0
    for idx in np.argsort(-wr):
        d = [np.linalg.norm(cr[idx] - ci[j]) if j not in used else 1e9 for j in range(len(ci))]
        j = int(np.argmin(d))
        used.add(j)
        total += wr[idx] * d[j]
    return float(total)


def sharpness(img) -> float:
    return float(cv2.Laplacian(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var())


# ---------- localisation ----------

_akaze = cv2.AKAZE_create()
_matcher = cv2.BFMatcher(cv2.NORM_HAMMING)


def _quad_ok(quad: np.ndarray, frame_shape) -> bool:
    if not cv2.isContourConvex(quad.astype(np.float32).reshape(-1, 1, 2)):
        return False
    area = cv2.contourArea(quad.astype(np.float32))
    fa = frame_shape[0] * frame_shape[1]
    return 0.0003 * fa < area < 0.95 * fa


def locate(tpl, frame, th: dict) -> dict:
    p = th["product"]
    tg = cv2.cvtColor(tpl, cv2.COLOR_BGR2GRAY)
    fg = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    h, w = tg.shape
    corners = np.float32([[0, 0], [w, 0], [w, h], [0, h]]).reshape(-1, 1, 2)
    kt, dt = _akaze.detectAndCompute(tg, None)
    kf, df = _akaze.detectAndCompute(fg, None)
    if dt is not None and df is not None and len(kt) >= 4 and len(kf) >= 4:
        good = []
        for pair in _matcher.knnMatch(dt, df, k=2):
            if len(pair) == 2 and pair[0].distance < p["lowe_ratio"] * pair[1].distance:
                good.append(pair[0])
        if len(good) >= p["min_inliers"]:
            src = np.float32([kt[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
            dst = np.float32([kf[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
            H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
            inl = int(mask.sum()) if mask is not None else 0
            if H is not None and inl >= p["min_inliers"]:
                quad = cv2.perspectiveTransform(corners, H).reshape(4, 2)
                if _quad_ok(quad, frame.shape):
                    return {"found": True, "method": "features", "H": H, "quad": quad,
                            "score": round(inl / len(good), 3), "inliers": inl,
                            "scale": float(np.sqrt(cv2.contourArea(quad.astype(np.float32)) / (w * h)))}
    # Fallback: multi-scale template matching (no rotation)
    best = (-1.0, None, None)
    s = 0.2
    while s <= 2.5:
        tw, thh = int(w * s), int(h * s)
        if 12 <= tw < fg.shape[1] and 12 <= thh < fg.shape[0]:
            r = cv2.matchTemplate(fg, cv2.resize(tg, (tw, thh)), cv2.TM_CCOEFF_NORMED)
            _, mx, _, loc = cv2.minMaxLoc(r)
            if mx > best[0]:
                best = (mx, loc, s)
        s *= 1.12
    if best[1] is not None and best[0] >= p["template_fallback_ncc"]:
        (x, y), sc = best[1], best[2]
        quad = np.float32([[x, y], [x + w * sc, y], [x + w * sc, y + h * sc], [x, y + h * sc]])
        H = cv2.getPerspectiveTransform(corners.reshape(4, 2), quad)
        return {"found": True, "method": "template", "H": H, "quad": quad,
                "score": round(float(best[0]), 3), "scale": float(sc)}
    return {"found": False}


def normalise(frame, loc: dict, tpl_shape):
    """Warp the located region back into the reference crop geometry."""
    h, w = tpl_shape[:2]
    return cv2.warpPerspective(frame, np.linalg.inv(loc["H"]), (w, h))


def bbox_crop(img, quad: np.ndarray, margin: float = 0.08):
    x0, y0 = quad.min(axis=0)
    x1, y1 = quad.max(axis=0)
    mx, my = (x1 - x0) * margin, (y1 - y0) * margin
    x0, y0 = int(max(x0 - mx, 0)), int(max(y0 - my, 0))
    x1, y1 = int(min(x1 + mx, img.shape[1])), int(min(y1 + my, img.shape[0]))
    return img[y0:y1, x0:x1].copy(), (x0, y0, x1, y1)


# ---------- analysis ----------

def analyze(result: str, timestamps: list[float], refs: dict, th: dict, stage: str,
            original: str | None = None, rinfo: dict | None = None, oinfo: dict | None = None):
    p = th["product"]
    aligned = stage in ("post-upscale", "post-edit") and original is not None
    issues: list[Issue] = []
    per_part: dict[str, dict] = {}
    ts = timestamps[: p["sample_frames_max"]]
    frames_r = {t: read_frame(result, t) for t in ts}
    frames_o = {t: read_frame(original, t) for t in ts} if aligned else {}

    for part in refs["parts"]:
        name, tpl = part["name"], part["crop"]
        if not part.get("auto", True):
            # Non-rigid or tiny parts (chain, beads, clasp) cannot be located reliably with classic CV:
            # they are judged only in the visual review.
            per_part[name] = {"critical": part.get("critical", True), "obs": [], "tpl": tpl,
                              "image": part["image"], "auto": False}
            continue
        obs = []
        for t in ts:
            fr = frames_r.get(t)
            if fr is None:
                continue
            o: dict = {"t": round(t, 3)}
            loc = locate(tpl, fr, th)
            o["found"] = loc["found"]
            if loc["found"]:
                norm = normalise(fr, loc, tpl.shape)
                o.update(method=loc["method"], score=loc["score"], scale=round(loc["scale"], 4),
                         ssim_ref=round(ssim_gray(tpl, norm), 3), deltaE_ref=round(delta_e(tpl, norm), 2))
                o["_crop"], _ = bbox_crop(fr, loc["quad"])
                o["_norm"] = norm
            if aligned and frames_o.get(t) is not None:
                fo = frames_o[t]
                lo = locate(tpl, fo, th)
                if lo["found"]:
                    sx, sy = fr.shape[1] / fo.shape[1], fr.shape[0] / fo.shape[0]
                    quad_r = lo["quad"] * np.array([sx, sy])
                    crop_o, _ = bbox_crop(fo, lo["quad"])
                    crop_r, _ = bbox_crop(fr, quad_r)
                    if crop_o.size and crop_r.size:
                        crop_o_up = cv2.resize(crop_o, (crop_r.shape[1], crop_r.shape[0]), interpolation=cv2.INTER_CUBIC)
                        so = sharpness(crop_o_up)
                        o.update(ssim_vs_original=round(ssim_gray(crop_o_up, crop_r), 3),
                                 deltaE_vs_original=round(delta_e(crop_o_up, crop_r), 2),
                                 sharp_ratio=round(sharpness(crop_r) / so, 3) if so > 1e-6 else None)
                        o["_crop_orig"] = crop_o
                        o["_crop_same_pos"] = crop_r
                        o["found_in_original"] = True
                else:
                    o["found_in_original"] = False
            obs.append(o)
        per_part[name] = {"critical": part.get("critical", True), "obs": obs, "tpl": tpl,
                          "image": part["image"], "auto": True}

    # Proportions: relative scale of parts that come from the same reference image
    for t in ts:
        groups: dict[str, list[tuple[str, float]]] = {}
        for name, d in per_part.items():
            o = next((x for x in d["obs"] if x["t"] == round(t, 3) and x.get("found")), None)
            if o and o.get("method") == "features":
                groups.setdefault(d["image"], []).append((name, o["scale"]))
        for img, lst in groups.items():
            if len(lst) < 2:
                continue
            med = float(np.median([s for _, s in lst]))
            for name, s in lst:
                dev = abs(s / med - 1)
                if dev > p["relative_scale_tolerance"]:
                    o = next(x for x in per_part[name]["obs"] if x["t"] == round(t, 3))
                    o["proportion_dev"] = round(dev, 3)

    # Issues per part
    summary = {}
    for name, d in per_part.items():
        if not d.get("auto", True):
            summary[name] = {"modo": "solo revisión visual"}
            continue
        obs = d["obs"]
        found = [o for o in obs if o.get("found")]
        frac = len(found) / len(obs) if obs else 0.0
        s = {"visible_frac": round(frac, 2), "frames_muestreados": len(obs), "frames_localizada": len(found)}
        if found:
            s["ssim_ref_mediana"] = round(float(np.median([o["ssim_ref"] for o in found])), 3)
            s["deltaE_ref_mediana"] = round(float(np.median([o["deltaE_ref"] for o in found])), 2)
            s["metodos"] = sorted({o["method"] for o in found})
        al = [o for o in obs if "ssim_vs_original" in o]
        if al:
            s["ssim_vs_original_min"] = min(o["ssim_vs_original"] for o in al)
            s["sharp_ratio_min"] = min((o["sharp_ratio"] for o in al if o.get("sharp_ratio")), default=None)
        summary[name] = s
        crit = d["critical"]
        missing_t = [o["t"] for o in obs if not o.get("found")]
        if not found:
            issues.append(Issue("MEDIA", "producto",
                                f"{name}: no localizada automáticamente en ningún frame muestreado → verificar en lámina",
                                evidence={"pieza": name, "tipo": "visibilidad"}))
        elif frac < p["min_visible_fraction"]:
            issues.append(Issue("MEDIA", "producto",
                                f"{name}: visible solo en {len(found)}/{len(obs)} frames muestreados → verificación parcial",
                                t_start=min(missing_t), t_end=max(missing_t), evidence={"pieza": name, "sin_localizar": missing_t, "ts": missing_t, "tipo": "visibilidad"}))
        # Signals: only relevant for non-aligned stages (generation/edit). Upscale uses vs-original.
        if stage in ("post-generate", "post-edit", "pre"):
            low = [o for o in found if o["ssim_ref"] < p["ssim_part_warn"]]
            col = [o for o in found if o["deltaE_ref"] > p["deltaE_warn"]]
            if low:
                issues.append(Issue("ALTA", "producto",
                                    f"{name}: estructura poco parecida a la referencia en {len(low)} frames "
                                    f"(SSIM pieza {min(o['ssim_ref'] for o in low):.2f}) → SOSPECHA, revisar lámina",
                                    t_start=low[0]["t"], t_end=low[-1]["t"], evidence={"pieza": name, "tipo": "sospecha", "ts": [o["t"] for o in low]}))
            if col:
                issues.append(Issue("ALTA", "producto",
                                    f"{name}: color distinto de la referencia en {len(col)} frames "
                                    f"(ΔE hasta {max(o['deltaE_ref'] for o in col):.1f}) → SOSPECHA, revisar lámina",
                                    t_start=col[0]["t"], t_end=col[-1]["t"], evidence={"pieza": name, "tipo": "sospecha", "ts": [o["t"] for o in col]}))
        prop = [o for o in found if "proportion_dev" in o]
        if prop:
            issues.append(Issue("ALTA", "producto",
                                f"{name}: proporción respecto a las otras piezas desviada hasta "
                                f"{max(o['proportion_dev'] for o in prop)*100:.0f}% → SOSPECHA, revisar lámina",
                                t_start=prop[0]["t"], t_end=prop[-1]["t"], evidence={"pieza": name, "tipo": "sospecha", "ts": [o["t"] for o in prop]}))
        if al:
            ap = th["product"]["aligned_part_ssim_warn"]
            bad = [o for o in al if o["ssim_vs_original"] < ap]
            if bad:
                issues.append(Issue("ALTA" if stage == "post-upscale" else "MEDIA", "producto",
                                    f"{name}: diferencia con el original en la misma posición "
                                    f"(SSIM {min(o['ssim_vs_original'] for o in bad):.2f} < {ap}) → revisar detalle en lámina",
                                    t_start=bad[0]["t"], t_end=bad[-1]["t"], evidence={"pieza": name, "tipo": "sospecha", "ts": [o["t"] for o in bad]}))
            sharp_lim = th["compare_aligned"]["sharpness_loss_ratio_warn"]
            soft = [o for o in al if o.get("sharp_ratio") and o["sharp_ratio"] < sharp_lim]
            if soft:
                issues.append(Issue("MEDIA", "producto",
                                    f"{name}: pérdida de nitidez frente al original (ratio {min(o['sharp_ratio'] for o in soft):.2f})",
                                    t_start=soft[0]["t"], t_end=soft[-1]["t"], evidence={"pieza": name, "tipo": "sospecha", "ts": [o["t"] for o in soft]}))
    return issues, summary, per_part


def lamina_rows(per_part: dict, aligned: bool) -> list[dict]:
    """Rows for the side-by-side sheet: reference | (original) | result best | result worst."""
    rows = []
    for name, d in per_part.items():
        if not d.get("auto", True):
            rows.append({"label": name.upper(), "cells": [("REFERENCIA aprobada", d["tpl"])],
                         "note": "solo revisión visual: comparar con frames de abajo y frames/"})
            continue
        found = [o for o in d["obs"] if o.get("found")]
        cells = [("REFERENCIA aprobada", d["tpl"])]
        if aligned:
            al = [o for o in d["obs"] if "_crop_orig" in o]
            worst = min(al, key=lambda o: o["ssim_vs_original"]) if al else None
            cells.append((f"ORIGINAL {worst['t']:.2f}s" if worst else "ORIGINAL: no localizado",
                          worst["_crop_orig"] if worst else None))
            cells.append((f"RESULTADO misma posición {worst['t']:.2f}s · SSIM {worst['ssim_vs_original']}"
                           if worst else "RESULTADO: —", worst["_crop_same_pos"] if worst else None))
        if found:
            best = max(found, key=lambda o: o["ssim_ref"])
            worst_r = min(found, key=lambda o: o["ssim_ref"])
            cells.append((f"RESULTADO mejor {best['t']:.2f}s · ΔE {best['deltaE_ref']}", best["_crop"]))
            if worst_r is not best:
                cells.append((f"RESULTADO peor {worst_r['t']:.2f}s · ΔE {worst_r['deltaE_ref']}", worst_r["_crop"]))
        else:
            cells.append(("RESULTADO", None))
        vis = f"visible {len(found)}/{len(d['obs'])} frames"
        rows.append({"label": name.upper(), "cells": cells, "note": vis + (" · CRÍTICA" if d["critical"] else "")})
    return rows
