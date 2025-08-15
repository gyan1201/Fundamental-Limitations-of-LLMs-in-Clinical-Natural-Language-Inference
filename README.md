# CTNLI Baseline (Rule-based)

This repository includes a minimal rule-based baseline implementing the Clinical Trial NLI (CTNLI) task families and GKMRV probes inspired by arXiv:2508.10777.

## Mind Map

```mermaid
mindmap
  root((CTNLI Baseline))
    Problem
      "Knowledge vs Reasoning Dissociation"
      "Clinical NLI benchmark (CTNLI)"
    Tasks
      "Causal Attribution"
      "Compositional Grounding"
      "Epistemic Verification"
      "Risk State Abstraction"
    Algorithm
      "Rule-based reasoners per task"
      "Safety/diagnostic knowledge base"
      "Risk = probability × severity"
      "Causal validity requires controls/randomization"
    GKMRV
      "Generate paired probes"
      "True: correct application"
      "Control: incorrect application"
      "Assess knowledge possession"
    Evaluation
      "Main label: entailment/contradiction/neutral"
      "GKMRV correctness (true + control)"
      "Dissociation result: has_knowledge vs has_reasoning"
    Code
      "ctnli/schemas.py (data models)"
      "ctnli/kb.py (principles, thresholds)"
      "ctnli/reasoners.py (inference)"
      "ctnli/gkmrv.py (probes)"
      "ctnli/evaluate.py (glue)"
      "ctnli/cli.py (runner)"
```

ASCII fallback

```
CTNLI Baseline
├─ Problem
│  ├─ Knowledge vs Reasoning Dissociation
│  └─ Clinical NLI benchmark (CTNLI)
├─ Tasks
│  ├─ Causal Attribution
│  ├─ Compositional Grounding
│  ├─ Epistemic Verification
│  └─ Risk State Abstraction
├─ Algorithm
│  ├─ Rule-based reasoners per task
│  ├─ Safety/diagnostic knowledge base
│  ├─ Risk = probability × severity
│  └─ Causal validity requires controls/randomization
├─ GKMRV
│  ├─ Generate paired probes
│  ├─ True: correct application
│  ├─ Control: incorrect application
│  └─ Assess knowledge possession
├─ Evaluation
│  ├─ Main label (E/C/N)
│  ├─ GKMRV correctness
│  └─ Dissociation: has_knowledge vs has_reasoning
└─ Code
   ├─ ctnli/schemas.py
   ├─ ctnli/kb.py
   ├─ ctnli/reasoners.py
   ├─ ctnli/gkmrv.py
   ├─ ctnli/evaluate.py
   └─ ctnli/cli.py
```

## Run

Use Python 3.9+.

```
python -m ctnli.cli --examples
```

This prints labels for example instances and whether GKMRV probes suggest knowledge vs. reasoning success.
