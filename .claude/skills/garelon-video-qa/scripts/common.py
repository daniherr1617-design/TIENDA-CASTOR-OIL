"""Shared helpers for garelon-video-qa.

Local-only by design: this package never opens network connections and never
writes outside the run directory it is given. Input videos and reference images
are opened read-only.
"""
from __future__ import annotations

import json
import subprocess
from dataclasses import asdict, dataclass, field
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
THRESHOLDS_PATH = SKILL_DIR / "assets" / "thresholds.json"

SEVERITY_ORDER = {"CRITICA": 3, "ALTA": 2, "MEDIA": 1, "BAJA": 0}


@dataclass
class Issue:
    severity: str            # CRITICA | ALTA | MEDIA | BAJA
    category: str            # tecnico | anomalia | comparacion | producto | visual
    message: str
    t_start: float | None = None
    t_end: float | None = None
    frames: list[int] = field(default_factory=list)
    evidence: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)


def load_thresholds() -> dict:
    with open(THRESHOLDS_PATH, encoding="utf-8") as f:
        return json.load(f)


def run(cmd: list[str], timeout: int = 900) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def fmt_ts(t: float | None) -> str:
    if t is None:
        return "global"
    m, s = divmod(max(t, 0.0), 60)
    return f"{int(m):02d}:{s:05.2f}"


def fmt_range(a: float | None, b: float | None) -> str:
    if a is None:
        return "global"
    if b is None or abs(b - a) < 0.01:
        return fmt_ts(a)
    return f"{fmt_ts(a)}–{fmt_ts(b)}"


def group_runs(items: list[tuple[int, float]], max_gap_frames: int = 2) -> list[list[tuple[int, float]]]:
    """Group (frame, time) pairs into consecutive runs."""
    runs: list[list[tuple[int, float]]] = []
    for it in sorted(items):
        if runs and it[0] - runs[-1][-1][0] <= max_gap_frames:
            runs[-1].append(it)
        else:
            runs.append([it])
    return runs


def write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
