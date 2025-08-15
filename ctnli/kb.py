from typing import Dict, List, Tuple

# Minimal pharmacologic safety knowledge for demonstration
SAFE_DOSE_MG_RANGE: Dict[str, Tuple[float, float]] = {
	"metformin": (500.0, 2000.0),
	"cisplatin": (10.0, 100.0),
}

DRUG_CONTRAINDICATIONS: Dict[str, List[str]] = {
	"metformin": ["severe_renal_impairment"],
	"cisplatin": ["pregnancy"],
}

SCHEDULE_FLAGS: Dict[str, str] = {
	"BID": "twice_daily",
	"TID": "three_times_daily",
	"daily": "daily",
	"q3w": "every_3_weeks",
}

# Simplified mappings from clinical findings to diagnostic plausibility signals
DIAGNOSTIC_SIGNALS: Dict[str, List[str]] = {
	"sepsis": ["fever", "tachycardia", "hypotension", "positive_blood_culture"],
	"influenza": ["fever", "cough", "myalgia"],
	"pulmonary_embolism": ["tachycardia", "pleuritic_chest_pain", "dyspnea"],
}

OBJECTIVE_MARKER_THRESHOLDS = {
	"lactate": (2.0, "high"),  # >2 elevated
	"wbc": (12000.0, "high"),
	"egfr": (30.0, "low_critical"),  # <30 severe renal impairment
}

# Risk severity weights (arbitrary units for demo)
SEVERITY_WEIGHTS: Dict[str, float] = {
	"thrombosis": 0.9,
	"neutropenic_fever": 0.95,
	"nausea": 0.1,
	"rash": 0.2,
	"renal_failure": 0.98,
}

# General clinical research principles
PRINCIPLES = {
	"need_control_group": "Causal claims require a suitable control or comparison group",
	"randomization_controls_confounding": "Randomization helps eliminate confounding",
	"observational_data_not_proof": "Observational outcomes alone are insufficient to establish causality",
}


def is_severe_renal_impairment(egfr: float) -> bool:
	return egfr is not None and egfr < 30.0