from typing import Tuple

from .schemas import (
	Label,
	DissociationResult,
	CausalAttributionInstance,
	CompositionalGroundingInstance,
	EpistemicVerificationInstance,
	RiskStateInstance,
)
from .reasoners import (
	infer_causal_attribution,
	infer_compositional_grounding,
	infer_epistemic_verification,
	infer_risk_state,
)
from .gkmrv import (
	probes_for_causal,
	probes_for_compositional,
	probes_for_epistemic,
	probes_for_risk,
)


def evaluate_causal(instance: CausalAttributionInstance) -> Tuple[Label, bool, bool]:
	label = infer_causal_attribution(instance)
	p_true, p_ctrl = probes_for_causal(instance)
	# In this rule-based baseline, we assume GKMRV evaluation succeeds if probes are internally consistent
	return label, p_true.is_correct_application, not p_ctrl.is_correct_application


def evaluate_compositional(instance: CompositionalGroundingInstance) -> Tuple[Label, bool, bool]:
	label = infer_compositional_grounding(instance)
	p_true, p_ctrl = probes_for_compositional(instance)
	return label, p_true.is_correct_application, not p_ctrl.is_correct_application


def evaluate_epistemic(instance: EpistemicVerificationInstance) -> Tuple[Label, bool, bool]:
	label = infer_epistemic_verification(instance)
	p_true, p_ctrl = probes_for_epistemic(instance)
	return label, p_true.is_correct_application, not p_ctrl.is_correct_application


def evaluate_risk(instance: RiskStateInstance) -> Tuple[Label, bool, bool]:
	label = infer_risk_state(instance)
	p_true, p_ctrl = probes_for_risk(instance)
	return label, p_true.is_correct_application, not p_ctrl.is_correct_application


def dissociation_result_for(instance) -> DissociationResult:
	if isinstance(instance, CausalAttributionInstance):
		label, t, c = evaluate_causal(instance)
	elif isinstance(instance, CompositionalGroundingInstance):
		label, t, c = evaluate_compositional(instance)
	elif isinstance(instance, EpistemicVerificationInstance):
		label, t, c = evaluate_epistemic(instance)
	elif isinstance(instance, RiskStateInstance):
		label, t, c = evaluate_risk(instance)
	else:
		raise TypeError("Unsupported instance type for dissociation evaluation")
	return DissociationResult(main_label=label, gkmrv_true_correct=t, gkmrv_control_correct=c)