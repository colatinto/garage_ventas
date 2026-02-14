from collections import defaultdict

stats = defaultdict(lambda: {"found": 0, "parsed_ok": 0, "parsed_err": 0, "samples": []})

def register_found(bar, subject):
    s = stats[bar]
    s["found"] += 1
    if len(s["samples"]) < 3:
        s["samples"].append((subject or "")[:120])

def register_parsed(bar, ok: bool):
    s = stats[bar]
    if ok:
        s["parsed_ok"] += 1
    else:
        s["parsed_err"] += 1

def dump_stats(title="STATS"):
    print(f"=== {title} ===")
    for bar, s in sorted(stats.items(), key=lambda x: str(x[0])):
        print(f"{bar}: found={s['found']} ok={s['parsed_ok']} err={s['parsed_err']} samples={s['samples']}")



