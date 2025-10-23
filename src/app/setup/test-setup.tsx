'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestSetup() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testSetupStatus = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/setup/status');
      const data = await response.json();
      setResult(`Setup status: ${data.isSetupComplete ? 'Complete' : 'Not complete'}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Setup Test</h2>
      <Button onClick={testSetupStatus} disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Test Setup Status'}
      </Button>
      {result && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}