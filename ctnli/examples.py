from .schemas import (
	CausalAttributionPremise,
	CausalAttributionHypothesis,
	CausalAttributionInstance,
	CompositionalGroundingPremise,
	CompositionalGroundingHypothesis,
	CompositionalGroundingInstance,
	DrugRegimen,
	PatientProfile,
	EpistemicVerificationPremise,
	EpistemicVerificationHypothesis,
	EpistemicVerificationInstance,
	RiskStatePremise,
	RiskStateHypothesis,
	RiskStateInstance,
	RiskEvent,
)


def example_causal_entailment() -> CausalAttributionInstance:
	premise = CausalAttributionPremise(
		observational_effect_present=True,
		effect_direction="improvement",
		control_group_present=True,
		randomization_present=True,
		confounders_ruled_out=True,
		sample_size=200,
		significant_result=True,
	)
	hyp = CausalAttributionHypothesis(claims_effective=True)
	return CausalAttributionInstance(premise=premise, hypothesis=hyp)


def example_causal_neutral_due_to_no_control() -> CausalAttributionInstance:
	premise = CausalAttributionPremise(
		observational_effect_present=True,
		effect_direction="improvement",
		control_group_present=False,
		randomization_present=False,
		confounders_ruled_out=False,
		sample_size=30,
		significant_result=None,
	)
	hyp = CausalAttributionHypothesis(claims_effective=True)
	return CausalAttributionInstance(premise=premise, hypothesis=hyp)


def example_compositional_contraindicated() -> CompositionalGroundingInstance:
	premise = CompositionalGroundingPremise(
		regimen=DrugRegimen(drug="metformin", dose=1000.0, units="mg", schedule="BID"),
		patient=PatientProfile(diagnoses=["type2_diabetes"], comorbidities=[], age_years=72, eGFR=25.0),
	)
	hyp = CompositionalGroundingHypothesis(configuration_is_medically_valid=True)
	return CompositionalGroundingInstance(premise=premise, hypothesis=hyp)


def example_compositional_valid() -> CompositionalGroundingInstance:
	premise = CompositionalGroundingPremise(
		regimen=DrugRegimen(drug="metformin", dose=1500.0, units="mg", schedule="BID"),
		patient=PatientProfile(diagnoses=["type2_diabetes"], comorbidities=[], age_years=55, eGFR=80.0),
	)
	hyp = CompositionalGroundingHypothesis(configuration_is_medically_valid=True)
	return CompositionalGroundingInstance(premise=premise, hypothesis=hyp)


def example_epistemic_supports_hypothesis() -> EpistemicVerificationInstance:
	prem = EpistemicVerificationPremise(
		evidence=dict(
			evidence=None  # placeholder, will be overridden below
		)
	)
	# Create fully typed Evidence
	from .schemas import Evidence
	evidence = Evidence(
		findings=["fever", "tachycardia", "positive_blood_culture"],
		objective_markers={"lactate": 3.5},
		asserted_diagnosis="influenza",
		asserting_agent="clinician",
	)
	prem = EpistemicVerificationPremise(evidence=evidence)
	hyp = EpistemicVerificationHypothesis(diagnosis="sepsis")
	return EpistemicVerificationInstance(premise=prem, hypothesis=hyp)


def example_epistemic_neutral() -> EpistemicVerificationInstance:
	from .schemas import Evidence
	evidence = Evidence(
		findings=["fever"],
		objective_markers={},
		asserted_diagnosis="influenza",
		asserting_agent="clinician",
	)
	prem = EpistemicVerificationPremise(evidence=evidence)
	hyp = EpistemicVerificationHypothesis(diagnosis="influenza")
	return EpistemicVerificationInstance(premise=prem, hypothesis=hyp)


def example_risk_state() -> RiskStateInstance:
	prem = RiskStatePremise(
		events=[
			RiskEvent(name="nausea", probability=0.6, severity="nausea"),
			RiskEvent(name="thrombosis", probability=0.05, severity="thrombosis"),
			RiskEvent(name="neutropenic_fever", probability=0.02, severity="neutropenic_fever"),
		]
	)
	hyp = RiskStateHypothesis(event_with_greater_risk="thrombosis")
	return RiskStateInstance(premise=prem, hypothesis=hyp)