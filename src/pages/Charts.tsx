
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Charts: React.FC = () => {
  // Sample data for charts
  const weightData = [
    { age: 0, p3: 2.9, p50: 3.3, p97: 3.9, patient: 3.2 },
    { age: 1, p3: 3.9, p50: 4.5, p97: 5.1, patient: 4.3 },
    { age: 2, p3: 4.9, p50: 5.6, p97: 6.3, patient: 5.4 },
    { age: 3, p3: 5.7, p50: 6.4, p97: 7.2, patient: 6.1 },
    { age: 4, p3: 6.2, p50: 7.0, p97: 7.8, patient: 6.8 },
    { age: 5, p3: 6.7, p50: 7.5, p97: 8.4, patient: 7.3 },
    { age: 6, p3: 7.1, p50: 7.9, p97: 8.9, patient: 7.7 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
      <div className="glass-panel rounded-xl p-6 mb-6">
        <h2 className="text-xl font-medium mb-6">Growth Charts</h2>
        
        <div className="text-center mb-6">
          <p className="text-gray-600">
            This is a preview of the Growth Charts feature. 
            Full functionality will be available in the complete version.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Weight-for-Age: Boys 0-6 months (WHO)</h3>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={weightData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="age" 
                label={{ 
                  value: 'Age (months)', 
                  position: 'insideBottomRight', 
                  offset: -10 
                }} 
              />
              <YAxis 
                label={{ 
                  value: 'Weight (kg)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }} 
              />
              <Tooltip formatter={(value) => [`${value} kg`]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="p3" 
                stroke="#94a3b8" 
                name="3rd percentile" 
                strokeWidth={1} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="p50" 
                stroke="#64748b" 
                name="50th percentile" 
                strokeWidth={1} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="p97" 
                stroke="#94a3b8" 
                name="97th percentile" 
                strokeWidth={1} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="patient" 
                stroke="#16a34a" 
                name="Patient" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button 
              className="nelson-button-outline text-sm py-1"
              disabled
            >
              Switch to CDC Chart
            </button>
            <button 
              className="nelson-button-outline text-sm py-1"
              disabled
            >
              Show BMI Chart
            </button>
            <button 
              className="nelson-button-outline text-sm py-1"
              disabled
            >
              Show Height Chart
            </button>
            <button 
              className="nelson-button-outline text-sm py-1"
              disabled
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-nelson-50 rounded-lg border border-nelson-100">
        <h3 className="font-medium text-sm mb-2">About Growth Charts</h3>
        <p className="text-sm text-gray-700 mb-3">
          The complete version will include:
        </p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• WHO standard charts (0-5 years)</li>
          <li>• CDC charts (2-20 years)</li>
          <li>• Weight, height, and BMI tracking</li>
          <li>• Interactive zoom and analysis</li>
          <li>• Data entry and patient tracking</li>
          <li>• Export and print functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default Charts;
