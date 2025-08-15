# CTNLI Baseline (Rule-based)

This repository includes a minimal rule-based baseline implementing the Clinical Trial NLI (CTNLI) task families and GKMRV probes inspired by arXiv:2508.10777.

## Run

Use Python 3.9+.

```
python -m ctnli.cli --examples
```

This prints labels for example instances and whether GKMRV probes suggest knowledge vs. reasoning success.
