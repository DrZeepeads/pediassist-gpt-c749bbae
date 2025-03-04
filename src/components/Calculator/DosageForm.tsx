
import React, { useState, useEffect } from 'react';
import { 
  calculateDosage, 
  medications, 
  saveCalculation,
  Medication 
} from '../../lib/calculatorUtils';
import { toast } from 'sonner';

const DosageForm: React.FC = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [selectedMedication, setSelectedMedication] = useState<string>('acetaminophen');
  const [useLowerRange, setUseLowerRange] = useState<boolean>(false);
  const [result, setResult] = useState<{
    medication: Medication | null;
    dosage: number;
    totalDailyDose: number;
    isSafe: boolean;
    alerts: string[];
  }>({
    medication: null,
    dosage: 0,
    totalDailyDose: 0,
    isSafe: true,
    alerts: []
  });
  const [showResult, setShowResult] = useState<boolean>(false);

  // Reset result when inputs change
  useEffect(() => {
    if (showResult) setShowResult(false);
  }, [weight, selectedMedication, useLowerRange]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (weight === '' || weight <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    const medication = medications.find(med => med.id === selectedMedication) || null;
    
    if (!medication) {
      toast.error('Please select a valid medication');
      return;
    }
    
    const calculationResult = calculateDosage(
      selectedMedication,
      Number(weight),
      useLowerRange
    );
    
    setResult({
      medication,
      ...calculationResult
    });
    
    setShowResult(true);
    
    // Save to history
    if (calculationResult.dosage > 0) {
      saveCalculation(
        selectedMedication,
        medication.name,
        Number(weight),
        calculationResult.dosage,
        calculationResult.totalDailyDose,
        calculationResult.isSafe
      );
      
      toast.success('Calculation saved to history');
    }
  };
  
  const handleExport = () => {
    if (!result.medication) return;
    
    // In a real app, we would generate a PDF with a library like jsPDF
    // For now, just show a message
    toast.info('Export functionality will be available in the full version');
  };

  return (
    <div>
      <form onSubmit={handleCalculate} className="space-y-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Patient Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            className="nelson-input w-full"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
            placeholder="Enter weight in kilograms"
            required
          />
        </div>
        
        <div>
          <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1">
            Medication
          </label>
          <select
            id="medication"
            className="nelson-input w-full"
            value={selectedMedication}
            onChange={(e) => setSelectedMedication(e.target.value)}
          >
            {medications.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name} ({med.category})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id="doseRange"
            type="checkbox"
            checked={useLowerRange}
            onChange={() => setUseLowerRange(!useLowerRange)}
            className="h-4 w-4 text-nelson-600 focus:ring-nelson-500 border-gray-300 rounded"
          />
          <label htmlFor="doseRange" className="text-sm text-gray-700">
            Use lower end of dosing range
          </label>
        </div>
        
        <button type="submit" className="nelson-button w-full">
          Calculate Dosage
        </button>
      </form>
      
      {showResult && result.medication && (
        <div className={`mt-8 p-4 rounded-lg border ${result.isSafe ? 'border-nelson-200 bg-nelson-50' : 'border-red-200 bg-red-50'}`}>
          <h3 className="font-medium text-lg mb-3">Calculation Results</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-600">Medication:</div>
              <div className="text-sm font-medium">{result.medication.name}</div>
              
              <div className="text-sm text-gray-600">Patient Weight:</div>
              <div className="text-sm font-medium">{weight} kg</div>
              
              <div className="text-sm text-gray-600">Single Dose:</div>
              <div className="text-sm font-medium">
                {result.dosage} {result.medication.unit.split('/')[0]}
              </div>
              
              <div className="text-sm text-gray-600">Daily Dose:</div>
              <div className="text-sm font-medium">
                {result.totalDailyDose} {result.medication.unit.includes('/day') 
                  ? result.medication.unit.split('/')[0] 
                  : result.medication.unit.split('/')[0] + '/day'}
              </div>
              
              <div className="text-sm text-gray-600">Frequency:</div>
              <div className="text-sm font-medium">{result.medication.frequency}</div>
            </div>
            
            {result.medication.notes && (
              <div className="mt-2 text-sm bg-white p-2 rounded border border-gray-200">
                <span className="font-medium">Notes:</span> {result.medication.notes}
              </div>
            )}
            
            {result.alerts.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600">Alerts:</p>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {result.alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-2 flex space-x-2">
              <button 
                onClick={handleCalculate} 
                className="nelson-button flex-1"
              >
                Recalculate
              </button>
              <button 
                onClick={handleExport} 
                className="nelson-button-outline flex-1"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DosageForm;
