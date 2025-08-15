import argparse

from . import examples
from .evaluate import dissociation_result_for


def run_examples() -> int:
	instances = [
		examples.example_causal_entailment(),
		examples.example_causal_neutral_due_to_no_control(),
		examples.example_compositional_contraindicated(),
		examples.example_compositional_valid(),
		examples.example_epistemic_supports_hypothesis(),
		examples.example_epistemic_neutral(),
		examples.example_risk_state(),
	]
	for idx, inst in enumerate(instances, start=1):
		res = dissociation_result_for(inst)
		print(f"Example {idx}: main_label={res.main_label.value}, has_knowledge={res.has_knowledge}, has_reasoning={res.has_reasoning}")
	return 0


def main() -> int:
	parser = argparse.ArgumentParser(description="CTNLI baseline runner")
	parser.add_argument("--examples", action="store_true", help="Run built-in examples")
	args = parser.parse_args()
	if args.examples:
		return run_examples()
	parser.print_help()
	return 0


if __name__ == "__main__":
	exit(main())