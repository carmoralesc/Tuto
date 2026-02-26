import React from 'react';
import Card from '../../../components/ui/Card';

interface WizardStepProps {
  title: string;
  children: React.ReactNode;
}

const WizardStep = React.memo<WizardStepProps>(({ title, children }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      {children}
    </Card>
  );
});

WizardStep.displayName = 'WizardStep';
export default WizardStep;
