"""CTNLI: Clinical Trial Natural Language Inference utilities and GKMRV framework.

This package implements a rule-based baseline algorithm for the four CTNLI task families
and the Ground Knowledge and Meta-Level Reasoning Verification (GKMRV) probes described in
"The Knowledge-Reasoning Dissociation: Fundamental Limitations of LLMs in Clinical NLI" (arXiv:2508.10777).
"""

__all__ = [
	"schemas",
	"kb",
	"reasoners",
	"gkmrv",
	"evaluate",
	"examples",
]

__version__ = "0.1.0"