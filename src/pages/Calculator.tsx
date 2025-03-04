
import React, { useState } from 'react';
import DosageForm from '../components/Calculator/DosageForm';
import { getCalculationHistory, clearCalculationHistory } from '../lib/calculatorUtils';
import { toast } from 'sonner';
import { History, Trash2 } from 'lucide-react';

const Calculator: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => getCalculationHistory());
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your calculation history?')) {
      clearCalculationHistory();
      setHistory([]);
      toast.success('Calculation history cleared');
    }
  };
  
  const refreshHistory = () => {
    setHistory(getCalculationHistory());
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Pediatric Drug Calculator</h2>
            <DosageForm />
          </div>
          
          <div className="mt-6 p-4 bg-nelson-50 rounded-lg border border-nelson-100">
            <h3 className="font-medium text-sm mb-2">Important Notes</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Always verify calculations before administering medications</li>
              <li>• Consider patient-specific factors not accounted for in this calculator</li>
              <li>• Refer to hospital protocols and drug references for complete information</li>
              <li>• This calculator is intended for healthcare professionals only</li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="glass-panel rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {showHistory ? 'Calculation History' : 'About the Calculator'}
              </h3>
              <button
                onClick={() => {
                  if (!showHistory) {
                    refreshHistory();
                  }
                  setShowHistory(!showHistory);
                }}
                className="text-nelson-600 hover:text-nelson-700 flex items-center text-sm"
              >
                {showHistory ? 'Hide History' : (
                  <>
                    <History className="h-4 w-4 mr-1" />
                    View History
                  </>
                )}
              </button>
            </div>
            
            {showHistory ? (
              <div>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm">No calculations yet</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {history.map((calc: any) => (
                        <div 
                          key={calc.id}
                          className={`p-3 rounded-lg text-sm ${
                            calc.isSafe ? 'bg-white' : 'bg-red-50'
                          } border ${
                            calc.isSafe ? 'border-gray-200' : 'border-red-200'
                          }`}
                        >
                          <div className="font-medium">{calc.medicationName}</div>
                          <div className="text-gray-600 text-xs">
                            {new Date(calc.date).toLocaleString()}
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                            <span className="text-gray-500">Weight:</span>
                            <span>{calc.weightKg} kg</span>
                            <span className="text-gray-500">Dose:</span>
                            <span>{calc.dosage} mg</span>
                            <span className="text-gray-500">Daily:</span>
                            <span>{calc.totalDailyDose} mg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="mt-4 flex items-center text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear History
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  This calculator provides weight-based dosing recommendations
                  for common pediatric medications based on established
                  guidelines and the Nelson Textbook of Pediatrics.
                </p>
                <p>
                  Features include:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Evidence-based dosage calculations</li>
                  <li>Safety alerts for potential dosing errors</li>
                  <li>Calculation history for reference</li>
                  <li>PDF export capability (in full version)</li>
                </ul>
                <p className="text-xs bg-yellow-50 p-2 rounded border border-yellow-100">
                  Disclaimer: This calculator is a clinical decision support
                  tool and does not replace professional judgment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
