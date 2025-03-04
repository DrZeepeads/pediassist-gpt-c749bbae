
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calculator, BarChart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nelson-GPT
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your professional pediatric medical assistant powered by the
              Nelson Textbook of Pediatrics
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Link
              to="/chat"
              className="glass-panel rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group"
            >
              <div className="h-12 w-12 rounded-lg bg-nelson-100 flex items-center justify-center mb-4 group-hover:bg-nelson-200 transition-colors">
                <MessageSquare className="h-6 w-6 text-nelson-600" />
              </div>
              <h2 className="text-xl font-medium mb-2">AI Assistant</h2>
              <p className="text-gray-600">
                Get evidence-based answers to your pediatric questions based on the Nelson Textbook of Pediatrics.
              </p>
            </Link>
            
            <Link
              to="/calculator"
              className="glass-panel rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group"
            >
              <div className="h-12 w-12 rounded-lg bg-nelson-100 flex items-center justify-center mb-4 group-hover:bg-nelson-200 transition-colors">
                <Calculator className="h-6 w-6 text-nelson-600" />
              </div>
              <h2 className="text-xl font-medium mb-2">Drug Calculator</h2>
              <p className="text-gray-600">
                Calculate weight-based medication dosages for pediatric patients with safety alerts.
              </p>
            </Link>
            
            <Link
              to="/charts"
              className="glass-panel rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group"
            >
              <div className="h-12 w-12 rounded-lg bg-nelson-100 flex items-center justify-center mb-4 group-hover:bg-nelson-200 transition-colors">
                <BarChart className="h-6 w-6 text-nelson-600" />
              </div>
              <h2 className="text-xl font-medium mb-2">Growth Charts</h2>
              <p className="text-gray-600">
                Track and analyze pediatric growth using standard WHO and CDC percentile charts.
              </p>
            </Link>
          </div>
          
          <div className="mt-16 p-6 glass-panel rounded-xl">
            <h2 className="text-xl font-medium mb-4">About Nelson-GPT</h2>
            <p className="text-gray-600 mb-4">
              Nelson-GPT is a Progressive Web App designed for healthcare professionals 
              working in pediatrics. It provides evidence-based information sourced 
              exclusively from the Nelson Textbook of Pediatrics, the gold standard 
              reference in pediatric medicine.
            </p>
            <div className="bg-nelson-50 p-4 rounded-lg border border-nelson-100">
              <p className="text-sm text-gray-700">
                <strong>Medical Disclaimer:</strong> This application is intended for use 
                by healthcare professionals only. Always use clinical judgment and refer 
                to official guidelines when making medical decisions. This tool is not a 
                substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-6 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Nelson-GPT. All rights reserved.</p>
          <p className="mt-1">For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
