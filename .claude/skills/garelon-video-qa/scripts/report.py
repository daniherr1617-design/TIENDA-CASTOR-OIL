"""Verdict, recommendation and the short report (report.md + report.json)."""
from __future__ import annotations

from pathlib import Path

from common import SEVERITY_ORDER, fmt_range, write_json

DEFAULT_PARTS = ["pulsera", "medalla", "cruz", "cuentas_izquierda", "cuentas_derecha", "cierre"]
VISUAL_STATES = {"ok", "discrepancia", "dudoso", "no_visible"}


def visual_issues(visual: dict, required_parts: list[str]) -> tuple[list[dict], bool]:
    """Turn the human/Claude visual review into issues. Returns (issues, review_complete)."""
    issues = []
    piezas = visual.get("piezas", {})
    for name, v in piezas.items():
        estado = v.get("estado")
        if estado not in VISUAL_STATES:
            raise ValueError(f"Estado visual no válido para {name}: {estado}")
        ts = v.get("timestamps") or []
        base = {"category": "visual", "t_start": min(ts) if ts else None, "t_end": max(ts) if ts else None,
                "frames": [], "evidence": {"pieza": name, "nota": v.get("nota", "")}}
        if estado == "discrepancia":
            issues.append({**base, "severity": "CRITICA",
                           "message": f"{name}: DISCREPANCIA VISUAL confirmada en lámina. {v.get('nota', '')}".strip()})
        elif estado == "dudoso":
            issues.append({**base, "severity": "ALTA",
                           "message": f"{name}: dudoso en revisión visual. {v.get('nota', '')}".strip()})
        elif estado == "no_visible":
            issues.append({**base, "severity": "MEDIA",
                           "message": f"{name}: no se ve suficientemente para verificar. {v.get('nota', '')}".strip()})
    complete = all(p in piezas for p in required_parts)
    return issues, complete


def verdict(issues: list[dict], visual_done: bool) -> tuple[str, bool]:
    top = max((SEVERITY_ORDER[i["severity"]] for i in issues), default=-1)
    if top >= SEVERITY_ORDER["CRITICA"]:
        return "FAIL", False
    if top >= SEVERITY_ORDER["MEDIA"]:
        return "WARNING", not visual_done
    # Nothing flagged: PASS is only possible once the side-by-side sheet was reviewed.
    return ("PASS", False) if visual_done else ("WARNING", True)


def recommendation(issues: list[dict], stage: str, state: dict) -> tuple[str, list[str]]:
    cats = lambda *c: [i for i in issues if i["category"] in c]
    hints: list[str] = []
    visual_fail = [i for i in cats("visual") if i["severity"] == "CRITICA"]
    if visual_fail:
        ts = sorted({fmt_range(i["t_start"], i["t_end"]) for i in visual_fail})
        hints.append("Producto alterado en: " + ", ".join(ts) + ". No usar esos planos.")
        if stage == "post-upscale":
            hints.append("Si el original estaba bien, el upscale ha alterado el producto: repetir con preset más conservador "
                         "(ByteDance 'common' o Topaz) o usar el original.")
        return "REGENERAR / DESCARTAR PLANO", hints
    decode = [i for i in cats("anomalia") if "decodificación" in i["message"]]
    if decode:
        return "VOLVER A DESCARGAR / RE-EXPORTAR (archivo corrupto)", ["Descargar de nuevo el resultado; si persiste, repetir el trabajo."]
    product_sus = [i for i in cats("producto") if i["severity"] in ("ALTA", "MEDIA")]
    quality = [i for i in cats("comparacion") if i["severity"] in ("ALTA", "MEDIA")] + \
              [i for i in product_sus if "nitidez" in i["message"] or "misma posición" in i["message"]]
    if stage == "post-upscale" and quality:
        hints += ["Para material de IA probar ByteDance preset 'aigc'.",
                  "fps ≤ 30 (por encima duplica coste).",
                  "Si se pidió 2K/4K, reescalar en local a 1080×1920 con lanczos en vez de otro upscale."]
        return "REPETIR UPSCALE", hints
    if product_sus and not state.get("visual_done"):
        return "REVISAR LÁMINA antes de decidir", ["Hay sospechas de producto o piezas no verificables; revisar lamina_lado_a_lado.jpg."]
    tech = [i for i in cats("tecnico") if i["severity"] in ("CRITICA", "ALTA", "MEDIA")]
    if tech and stage != "pre":
        r = state["result_info"]
        hints.append(f"Re-exportar en local (sin créditos): escala a {state['target'][0]}×{state['target'][1]} si es 9:16, "
                     "H.264 yuv420p, bitrate ≥ 8 Mbps, fps constante.")
        if r.get("width", 0) < state["target"][0] and stage != "post-upscale":
            hints.append("La resolución es menor que el objetivo: valorar ByteDance/Higgsfield Upscale (con coste y aprobación).")
        return "RE-EXPORTAR (técnico)", hints
    if any(i["severity"] in ("ALTA", "MEDIA") for i in issues):
        return "REVISAR avisos antes de aprobar", hints
    if stage == "pre":
        return "LISTO para enviar a Higgsfield", hints
    return "APROBAR", hints


def build(state: dict, run_dir: Path) -> dict:
    issues = sorted(state["issues"], key=lambda i: (-SEVERITY_ORDER[i["severity"]], i["t_start"] or 0))
    v, provisional = verdict(issues, state.get("visual_done", False))
    rec, hints = recommendation(issues, state["stage"], state)
    state.update(verdict=v, provisional=provisional, recommendation=rec, hints=hints, issues=issues)

    r = state["result_info"]
    lines = [
        f"# garelon-video-qa · {state['name']} · {state['stage']} · **{v}**" + (" (provisional)" if provisional else ""),
        "",
        f"**Recomendación:** {rec}",
    ]
    lines += [f"- {h}" for h in hints]
    if provisional:
        lines += ["", "> Veredicto provisional: falta la revisión visual de `lamina_lado_a_lado.jpg` "
                      "(`qa.py finalize`). Sin ella nunca hay PASS."]
    lines += ["", f"Vídeo: `{r.get('path')}` · {r.get('width')}×{r.get('height')} · {r.get('fps')} fps"
                  f"{' (VFR)' if r.get('vfr') else ''} · {r.get('duration_s')} s · {r.get('codec')} {r.get('pix_fmt')} · "
                  f"{(r.get('bitrate_kbps') or 0)/1000:.1f} Mbps"]
    if state.get("original_info"):
        o = state["original_info"]
        lines.append(f"Original: `{o.get('path')}` · {o.get('width')}×{o.get('height')} · {o.get('fps')} fps · {o.get('duration_s')} s")
    cmp_ = state.get("compare_summary") or {}
    if cmp_.get("ssim_media") is not None:
        lines.append(f"SSIM medio {cmp_['ssim_media']} (mín {cmp_['ssim_min']}) · PSNR medio {cmp_['psnr_media']} dB "
                     "· señal, no decide fidelidad")
    lines += ["", "## Problemas", ""]
    if issues:
        lines += ["| # | Gravedad | Cuándo | Frames | Problema |", "|---|---|---|---|---|"]
        for n, i in enumerate(issues, 1):
            fr = ", ".join(f"f{x}" for x in i["frames"][:6]) + ("…" if len(i["frames"]) > 6 else "")
            lines.append(f"| {n} | {i['severity']} | {fmt_range(i['t_start'], i['t_end'])} | {fr or '—'} | {i['message']} |")
    else:
        lines.append("Sin problemas detectados.")
    ps = state.get("product_summary")
    lines += ["", "## Producto", ""]
    if ps:
        vis = state.get("visual") or {}
        for name, s in ps.items():
            vstate = (vis.get("piezas", {}).get(name) or {}).get("estado", "sin revisar")
            if s.get("modo"):
                lines.append(f"- **{name}**: {s['modo']} · revisión visual: **{vstate}**")
                continue
            extra = []
            if "ssim_ref_mediana" in s:
                extra.append(f"SSIM pieza {s['ssim_ref_mediana']}")
                extra.append(f"ΔE {s['deltaE_ref_mediana']}")
            if s.get("ssim_vs_original_min") is not None:
                extra.append(f"vs original mín {s['ssim_vs_original_min']}")
            lines.append(f"- **{name}**: visible {s['frames_localizada']}/{s['frames_muestreados']} · "
                         + " · ".join(extra) + f" · revisión visual: **{vstate}**")
    else:
        lines.append("Sin referencias de producto: fidelidad NO verificada (WARNING).")
    lines += ["", "## Archivos", "",
              "- `lamina_lado_a_lado.jpg`: revisión humana obligatoria",
              "- `contact_sheet.jpg`: frames representativos con timestamp",
              "- `frames/`: frames citados",
              "- `report.json`: datos completos"]
    (run_dir / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    public = {k: v for k, v in state.items() if not k.startswith("_")}
    write_json(run_dir / "report.json", public)
    return public
