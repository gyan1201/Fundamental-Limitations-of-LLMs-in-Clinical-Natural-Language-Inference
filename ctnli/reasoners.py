from typing import Optional

from .schemas import (
	Label,
	CausalAttributionInstance,
	CompositionalGroundingInstance,
	EpistemicVerificationInstance,
	RiskStateInstance,
)
from . import kb


def infer_causal_attribution(instance: CausalAttributionInstance) -> Label:
	p = instance.premise
	h = instance.hypothesis

	# If claim of effectiveness without adequate causal design, label as NEUTRAL
	adequate_design = p.control_group_present and (p.randomization_present or p.confounders_ruled_out)
	if h.claims_effective:
		if not adequate_design:
			return Label.NEUTRAL
			
		# With adequate design, check effect direction and significance
		if p.significant_result is False:
			return Label.CONTRADICTION
		if p.effect_direction == "improvement" and (p.significant_result or p.significant_result is None):
			return Label.ENTAILMENT
		if p.effect_direction == "worsening":
			return Label.CONTRADICTION
		return Label.NEUTRAL
	else:
		# Hypothesis claims NOT effective
		if not adequate_design:
			# Without adequate design, cannot conclude lack of efficacy either
			return Label.NEUTRAL
		if p.effect_direction == "improvement" and p.significant_result:
			return Label.CONTRADICTION
		return Label.ENTAILMENT


def infer_compositional_grounding(instance: CompositionalGroundingInstance) -> Label:
	reg = instance.premise.regimen
	pat = instance.premise.patient

	# Dose safety
	min_dose, max_dose = kb.SAFE_DOSE_MG_RANGE.get(reg.drug, (None, None))
	dose_safe = True
	if min_dose is not None and max_dose is not None:
		dose_safe = (reg.dose >= min_dose) and (reg.dose <= max_dose)

	# Contraindications
	contraindications = set(kb.DRUG_CONTRAINDICATIONS.get(reg.drug, []))
	patient_flags = set(pat.diagnoses + pat.comorbidities)
	# Map numeric eGFR to severe_renal_impairment if needed
	if pat.eGFR is not None and pat.eGFR < 30.0:
		patient_flags.add("severe_renal_impairment")
	contra_safe = len(contraindications.intersection(patient_flags)) == 0

	# Simple schedule sanity check
	schedule_known = kb.SCHEDULE_FLAGS.get(reg.schedule) is not None

	all_constraints_ok = dose_safe and contra_safe and schedule_known
	if instance.hypothesis.configuration_is_medically_valid:
		return Label.ENTAILMENT if all_constraints_ok else Label.CONTRADICTION
	return Label.CONTRADICTION if all_constraints_ok else Label.ENTAILMENT


def _score_diagnosis_support(diagnosis: str, instance: EpistemicVerificationInstance) -> float:
	signals = kb.DIAGNOSTIC_SIGNALS.get(diagnosis, [])
	present_findings = set(instance.premise.evidence.findings)
	signal_hits = len(set(signals).intersection(present_findings))
	marker_bonus = 0.0
	markers = instance.premise.evidence.objective_markers or {}
	# Simple example: high lactate supports sepsis
	lactate = markers.get("lactate")
	if lactate is not None and isinstance(lactate, (int, float)) and lactate > 2.0 and diagnosis == "sepsis":
		marker_bonus += 1.0
	return signal_hits + marker_bonus


def infer_epistemic_verification(instance: EpistemicVerificationInstance) -> Label:
	dx = instance.hypothesis.diagnosis
	asserted = instance.premise.evidence.asserted_diagnosis

	# Evaluate support for the hypothesis diagnosis vs asserted diagnosis if different
	score_h = _score_diagnosis_support(dx, instance)
	score_a = _score_diagnosis_support(asserted, instance) if asserted else 0.0

	# If hypothesis better supported than asserted or asserted is absent, entailment
	if score_h > score_a:
		return Label.ENTAILMENT
	if score_h < score_a:
		return Label.CONTRADICTION
	return Label.NEUTRAL


def infer_risk_state(instance: RiskStateInstance) -> Label:
	# Compute probability * severity_weight and compare
	best_event = None
	best_score = -1.0
	for ev in instance.premise.events:
		sev = kb.SEVERITY_WEIGHTS.get(ev.severity, 0.0)
		score = ev.probability * sev
		if score > best_score:
			best_score = score
			best_event = ev.name

	return Label.ENTAILMENT if best_event == instance.hypothesis.event_with_greater_risk else Label.CONTRADICTION