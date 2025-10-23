'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictParkingDemand, PredictParkingDemandOutput } from '@/ai/flows/parking-demand-prediction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Bot, Zap, Loader2, BarChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  parkingLotId: z.string().min(1, 'Parking Lot ID is required.'),
  timeframe: z.string().min(1, 'Timeframe is required.'),
  historicalData: z.string().min(1, 'Historical data is required.'),
});

const exampleHistoricalData = JSON.stringify(
  [
    { "timestamp": "2023-10-26T08:00:00Z", "occupied": 50 },
    { "timestamp": "2023-10-26T09:00:00Z", "occupied": 65 },
    { "timestamp": "2023-10-26T10:00:00Z", "occupied": 80 },
    { "timestamp": "2023-10-26T11:00:00Z", "occupied": 95 },
    { "timestamp": "2023-10-26T12:00:00Z", "occupied": 110 },
    { "timestamp": "2023-10-26T13:00:00Z", "occupied": 105 },
    { "timestamp": "2023-10-26T14:00:00Z", "occupied": 90 },
  ], null, 2
);

export default function PredictDemandPage() {
  const [prediction, setPrediction] = useState<PredictParkingDemandOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parkingLotId: 'downtown-garage-1',
      timeframe: 'next 4 hours',
      historicalData: exampleHistoricalData,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictParkingDemand(values);
      setPrediction(result);
    } catch (e) {
      setError('Failed to generate prediction. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-headline">Parking Demand Prediction</h1>
      </div>
      <p className="text-muted-foreground max-w-3xl">
        Use our AI-powered tool to forecast parking demand based on historical data. This helps in optimizing slot availability and pricing.
      </p>

      <div className="grid gap-8 lg:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Input</CardTitle>
            <CardDescription>Provide the necessary information to generate a demand forecast.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="parkingLotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Lot ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., downtown-garage-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prediction Timeframe</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="next hour">Next Hour</SelectItem>
                          <SelectItem value="next 4 hours">Next 4 Hours</SelectItem>
                          <SelectItem value="next 24 hours">Next 24 Hours</SelectItem>
                          <SelectItem value="next week">Next Week</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="historicalData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste JSON data here..."
                          className="min-h-[200px] font-mono text-xs"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Provide a JSON array of historical occupancy data.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prediction...
                    </>
                  ) : (
                     <>
                      <Zap className="mr-2 h-4 w-4" />
                      Predict Demand
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            {isLoading && (
                 <Card className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
                    <p className="text-lg text-muted-foreground">Our AI is analyzing the data...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </Card>
            )}

            {error && (
                 <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

           {prediction ? (
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Bot className="w-7 h-7" /> AI Prediction Result
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-card/80">
                            <p className="text-sm text-muted-foreground">Predicted Demand</p>
                            <p className="text-4xl font-bold text-primary">{prediction.predictedDemand} <span className="text-lg font-medium text-muted-foreground">slots</span></p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/80">
                            <p className="text-sm text-muted-foreground">Confidence Level</p>
                            <p className="text-4xl font-bold text-accent">{(prediction.confidenceLevel * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Explanation</h3>
                        <div className="text-sm text-muted-foreground p-4 bg-card/80 rounded-md prose-sm max-w-none">
                            {prediction.explanation}
                        </div>
                    </div>
                </CardContent>
            </Card>
           ) : (
                !isLoading && !error && (
                    <Card className="flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed">
                        <div className="p-6 bg-muted rounded-full mb-4">
                            <BarChart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold">Your Prediction Awaits</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Fill out the form on the left to generate a parking demand forecast. The results will appear here.
                        </p>
                    </Card>
                )
           )}
        </div>
      </div>
    </main>
  );
}
