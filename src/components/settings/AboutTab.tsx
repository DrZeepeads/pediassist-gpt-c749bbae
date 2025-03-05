
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const AboutTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Nelson-GPT</CardTitle>
          <CardDescription>Information about this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Version</h3>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">
              Nelson-GPT is an AI-powered pediatric information assistant based on the Nelson Textbook of Pediatrics.
              It provides evidence-based information on pediatric conditions, treatments, and guidelines.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Source</h3>
            <p className="text-sm text-muted-foreground">
              The information provided is sourced from the Nelson Textbook of Pediatrics, a comprehensive reference for pediatric medicine.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This application is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
              Always seek the advice of your physician or other qualified health provider with any questions you may have.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Contact</h3>
            <p className="text-sm text-muted-foreground">
              For support or feedback, please contact us at support@nelson-gpt.com
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Acknowledgements</h3>
            <p className="text-sm text-muted-foreground">
              We would like to thank the authors and publishers of the Nelson Textbook of Pediatrics for their invaluable contribution to pediatric medicine.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
