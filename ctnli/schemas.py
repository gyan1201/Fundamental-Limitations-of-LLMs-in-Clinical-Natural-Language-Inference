from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Tuple, Union


class Label(str, Enum):
	ENTAILMENT = "entailment"
	CONTRADICTION = "contradiction"
	NEUTRAL = "neutral"


class TaskFamily(str, Enum):
	CAUSAL_ATTRIBUTION = "causal_attribution"
	COMPOSITIONAL_GROUNDING = "compositional_grounding"
	EPISTEMIC_VERIFICATION = "epistemic_verification"
	RISK_STATE_ABSTRACTION = "risk_state_abstraction"


@dataclass(frozen=True)
class CausalAttributionPremise:
	observational_effect_present: bool
	effect_direction: Optional[str]  # "improvement", "worsening", or None
	control_group_present: bool
	randomization_present: bool
	confounders_ruled_out: bool
	sample_size: Optional[int] = None
	significant_result: Optional[bool] = None  # statistical significance if available


@dataclass(frozen=True)
class CausalAttributionHypothesis:
	claims_effective: bool  # True if hypothesis claims treatment effective


@dataclass(frozen=True)
class CausalAttributionInstance:
	premise: CausalAttributionPremise
	hypothesis: CausalAttributionHypothesis


@dataclass(frozen=True)
class DrugRegimen:
	drug: str
	dose: float
	units: str  # e.g., "mg", "mg/m2"
	schedule: str  # free text like "BID", "q3w", "daily"


@dataclass(frozen=True)
class PatientProfile:
	diagnoses: List[str]
	comorbidities: List[str]
	age_years: Optional[int] = None
	eGFR: Optional[float] = None  # kidney function marker


@dataclass(frozen=True)
class CompositionalGroundingPremise:
	regimen: DrugRegimen
	patient: PatientProfile


@dataclass(frozen=True)
class CompositionalGroundingHypothesis:
	configuration_is_medically_valid: bool


@dataclass(frozen=True)
class CompositionalGroundingInstance:
	premise: CompositionalGroundingPremise
	hypothesis: CompositionalGroundingHypothesis


@dataclass(frozen=True)
class Evidence:
	findings: List[str]  # e.g., ["fever", "tachycardia", "positive_blood_culture"]
	objective_markers: Dict[str, Union[float, str]]  # e.g., {"lactate": 4.2}
	asserted_diagnosis: Optional[str] = None  # who asserted what, if any
	asserting_agent: Optional[str] = None  # e.g., "clinician", "patient"


@dataclass(frozen=True)
class EpistemicVerificationPremise:
	evidence: Evidence


@dataclass(frozen=True)
class EpistemicVerificationHypothesis:
	diagnosis: str  # diagnosis that should be evaluated for support by evidence


@dataclass(frozen=True)
class EpistemicVerificationInstance:
	premise: EpistemicVerificationPremise
	hypothesis: EpistemicVerificationHypothesis


@dataclass(frozen=True)
class RiskEvent:
	name: str
	probability: float  # in [0,1]
	severity: str  # key into severity knowledge base


@dataclass(frozen=True)
class RiskStatePremise:
	events: List[RiskEvent]


@dataclass(frozen=True)
class RiskStateHypothesis:
	event_with_greater_risk: str  # predicted higher-risk event by label/name


@dataclass(frozen=True)
class RiskStateInstance:
	premise: RiskStatePremise
	hypothesis: RiskStateHypothesis


@dataclass(frozen=True)
class GKMRVProbe:
	statement: str
	is_correct_application: bool


@dataclass(frozen=True)
class DissociationResult:
	main_label: Label
	gkmrv_true_correct: bool
	gkmrv_control_correct: bool

	@property
	def has_knowledge(self) -> bool:
		return self.gkmrv_true_correct and self.gkmrv_control_correct

	@property
	def has_reasoning(self) -> bool:
		return self.main_label == Label.ENTAILMENT