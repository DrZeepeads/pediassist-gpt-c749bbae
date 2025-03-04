// Weight-based dosing calculator utility functions

export interface Medication {
  id: string;
  name: string;
  category: string;
  doseRange: {
    min: number;
    max: number;
  };
  unit: string;
  frequency: string;
  notes?: string;
  maxDose?: number;
  contraindications?: string[];
}

// Sample medication database
export const medications: Medication[] = [
  {
    id: "acetaminophen",
    name: "Acetaminophen (Tylenol)",
    category: "Analgesic/Antipyretic",
    doseRange: {
      min: 10,
      max: 15
    },
    unit: "mg/kg/dose",
    frequency: "Every 4-6 hours",
    maxDose: 4000,
    notes: "Do not exceed 5 doses in 24 hours"
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen (Motrin, Advil)",
    category: "NSAID",
    doseRange: {
      min: 5,
      max: 10
    },
    unit: "mg/kg/dose",
    frequency: "Every 6-8 hours",
    maxDose: 2400,
    notes: "Take with food to reduce GI upset"
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "Antibiotic",
    doseRange: {
      min: 40,
      max: 90
    },
    unit: "mg/kg/day",
    frequency: "Divided every 8-12 hours",
    notes: "For most respiratory infections"
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    category: "Antibiotic",
    doseRange: {
      min: 10,
      max: 12
    },
    unit: "mg/kg/day",
    frequency: "Once daily",
    maxDose: 500,
    notes: "Day 1, then 5mg/kg/day for 4 more days"
  },
  {
    id: "prednisone",
    name: "Prednisone",
    category: "Corticosteroid",
    doseRange: {
      min: 1,
      max: 2
    },
    unit: "mg/kg/day",
    frequency: "Once or twice daily",
    notes: "Short courses preferred when possible"
  },
  {
    id: "albuterol",
    name: "Albuterol",
    category: "Bronchodilator",
    doseRange: {
      min: 0.1,
      max: 0.15
    },
    unit: "mg/kg/dose",
    frequency: "Every 4-6 hours as needed",
    maxDose: 5,
    notes: "Nebulized solution"
  }
];

// Calculate dosage based on weight and medication
export const calculateDosage = (
  medicationId: string,
  weightKg: number,
  useLowerRange: boolean = false
): {
  dosage: number;
  totalDailyDose: number;
  isSafe: boolean;
  alerts: string[];
} => {
  if (weightKg <= 0) {
    return {
      dosage: 0,
      totalDailyDose: 0,
      isSafe: false,
      alerts: ["Invalid weight. Weight must be greater than 0 kg."]
    };
  }

  const medication = medications.find(med => med.id === medicationId);
  
  if (!medication) {
    return {
      dosage: 0,
      totalDailyDose: 0,
      isSafe: false,
      alerts: ["Medication not found."]
    };
  }

  // Determine which end of the range to use
  const dosePerKg = useLowerRange ? medication.doseRange.min : medication.doseRange.max;
  
  // Calculate the dose
  let dosage = dosePerKg * weightKg;
  
  // Calculate daily dose based on frequency
  let dosesPerDay = 1;
  if (medication.frequency.includes("4-6")) {
    dosesPerDay = 4; // Using conservative estimate
  } else if (medication.frequency.includes("6-8")) {
    dosesPerDay = 3; // Using conservative estimate
  } else if (medication.frequency.includes("8-12")) {
    dosesPerDay = 2; // Using conservative estimate
  } else if (medication.frequency.includes("12")) {
    dosesPerDay = 2;
  } else if (medication.frequency.includes("8")) {
    dosesPerDay = 3;
  } else if (medication.frequency.includes("6")) {
    dosesPerDay = 4;
  }
  
  // If the dose is per day already, adjust the dosage calculation
  if (medication.unit.includes("/day")) {
    dosage = dosage / dosesPerDay;
  }
  
  const totalDailyDose = medication.unit.includes("/day") ? dosePerKg * weightKg : dosage * dosesPerDay;
  
  // Safety checks
  const alerts: string[] = [];
  let isSafe = true;
  
  // Check max dose
  if (medication.maxDose && dosage > medication.maxDose) {
    alerts.push(`Calculated dose exceeds maximum single dose of ${medication.maxDose}${medication.unit.split('/')[0]}.`);
    isSafe = false;
  }
  
  // Additional safety alerts based on weight
  if (weightKg < 3) {
    alerts.push("Caution: Extremely low weight. Consider neonatal dosing guidelines.");
    isSafe = false;
  }
  
  return {
    dosage: Math.round(dosage * 10) / 10, // Round to 1 decimal place
    totalDailyDose: Math.round(totalDailyDose * 10) / 10,
    isSafe,
    alerts
  };
};

// Function to save calculation to history
export const saveCalculation = (
  medicationId: string,
  medicationName: string,
  weightKg: number,
  dosage: number,
  totalDailyDose: number,
  isSafe: boolean,
  notes?: string
) => {
  const history = JSON.parse(localStorage.getItem('nelson-calc-history') || '[]');
  
  const calculation = {
    id: Date.now(),
    date: new Date().toISOString(),
    medicationId,
    medicationName,
    weightKg,
    dosage,
    totalDailyDose,
    isSafe,
    notes: notes || ''
  };
  
  history.unshift(calculation); // Add to beginning of array
  
  // Keep only the last 50 calculations
  const trimmedHistory = history.slice(0, 50);
  
  localStorage.setItem('nelson-calc-history', JSON.stringify(trimmedHistory));
  
  return calculation;
};

// Function to get calculation history
export const getCalculationHistory = () => {
  return JSON.parse(localStorage.getItem('nelson-calc-history') || '[]');
};

// Function to clear calculation history
export const clearCalculationHistory = () => {
  localStorage.removeItem('nelson-calc-history');
};
