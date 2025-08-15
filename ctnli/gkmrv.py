from typing import Tuple

from .schemas import (
	GKMRVProbe,
	CausalAttributionInstance,
	CompositionalGroundingInstance,
	EpistemicVerificationInstance,
	RiskStateInstance,
)
from . import kb


def probes_for_causal(instance: CausalAttributionInstance) -> Tuple[GKMRVProbe, GKMRVProbe]:
	p = instance.premise
	if not p.control_group_present:
		true = GKMRVProbe(
			statement="Results do not prove efficacy because there is no comparison/control group.",
			is_correct_application=True,
		)
		ctrl = GKMRVProbe(
			statement="Results prove efficacy despite the lack of a comparison group.",
			is_correct_application=False,
		)
		return true, ctrl
	# Default principle on randomization/confounding
	if not p.randomization_present and not p.confounders_ruled_out:
		true = GKMRVProbe(
			statement="Causal inference is invalid because confounders are not controlled or randomized.",
			is_correct_application=True,
		)
		ctrl = GKMRVProbe(
			statement="Confounding does not affect causal claims without randomization or controls.",
			is_correct_application=False,
		)
		return true, ctrl
	true = GKMRVProbe(
		statement="Randomization and a control group support causal interpretation of observed improvement.",
		is_correct_application=True,
	)
	ctrl = GKMRVProbe(
		statement="Observational outcomes alone are sufficient to prove causality.",
		is_correct_application=False,
	)
	return true, ctrl


def probes_for_compositional(instance: CompositionalGroundingInstance) -> Tuple[GKMRVProbe, GKMRVProbe]:
	reg = instance.premise.regimen
	pat = instance.premise.patient
	contraindications = set(kb.DRUG_CONTRAINDICATIONS.get(reg.drug, []))
	patient_flags = set(pat.diagnoses + pat.comorbidities)
	if pat.eGFR is not None and pat.eGFR < 30.0:
		patient_flags.add("severe_renal_impairment")

	if len(contraindications.intersection(patient_flags)) > 0:
		true = GKMRVProbe(
			statement=f"{reg.drug} is contraindicated for this patient profile (e.g., severe renal impairment).",
			is_correct_application=True,
		)
		ctrl = GKMRVProbe(
			statement=f"{reg.drug} has no contraindications in severe renal impairment and is completely safe.",
			is_correct_application=False,
		)
		return true, ctrl

	min_dose, max_dose = kb.SAFE_DOSE_MG_RANGE.get(reg.drug, (None, None))
	if min_dose is not None and reg.dose > max_dose:
		true = GKMRVProbe(
			statement=f"The dose {reg.dose} {reg.units} exceeds typical safe limits for {reg.drug}.",
			is_correct_application=True,
		)
		ctrl = GKMRVProbe(
			statement=f"The dose {reg.dose} {reg.units} is safe for {reg.drug} in all patients.",
			is_correct_application=False,
		)
		return true, ctrl

	true = GKMRVProbe(
		statement="The configuration matches standard safety constraints (dose, schedule, contraindications).",
		is_correct_application=True,
	)
	ctrl = GKMRVProbe(
		statement="Standard safety constraints do not apply to this configuration.",
		is_correct_application=False,
	)
	return true, ctrl


def probes_for_epistemic(instance: EpistemicVerificationInstance) -> Tuple[GKMRVProbe, GKMRVProbe]:
	e = instance.premise.evidence
	true = GKMRVProbe(
		statement="Reported diagnosis must be supported by objective evidence and coherent findings.",
		is_correct_application=True,
	)
	ctrl = GKMRVProbe(
		statement="A clinician assertion is sufficient regardless of contradictory evidence.",
		is_correct_application=False,
	)
	return true, ctrl


def probes_for_risk(instance: RiskStateInstance) -> Tuple[GKMRVProbe, GKMRVProbe]:
	true = GKMRVProbe(
		statement="Risk assessment should combine probability with severity of harm.",
		is_correct_application=True,
	)
	ctrl = GKMRVProbe(
		statement="Risk is determined only by frequency; severity should be ignored.",
		is_correct_application=False,
	)
	return true, ctrl