'use server';

/**
 * @fileOverview AI-powered parking demand prediction flow.
 *
 * - predictParkingDemand - Predicts future parking demand.
 * - PredictParkingDemandInput - The input type for the predictParkingDemand function.
 * - PredictParkingDemandOutput - The return type for the predictParkingDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictParkingDemandInputSchema = z.object({
  parkingLotId: z.string().describe('The ID of the parking lot to predict demand for.'),
  timeframe: z.string().describe('The timeframe for the prediction (e.g., next hour, next day, next week).'),
  historicalData: z.string().describe('Historical parking data as a JSON string.'),
});
export type PredictParkingDemandInput = z.infer<typeof PredictParkingDemandInputSchema>;

const PredictParkingDemandOutputSchema = z.object({
  predictedDemand: z.number().describe('The predicted parking demand for the specified timeframe.'),
  confidenceLevel: z.number().describe('The confidence level of the prediction (0-1).'),
  explanation: z.string().describe('An explanation of the factors influencing the prediction.'),
});
export type PredictParkingDemandOutput = z.infer<typeof PredictParkingDemandOutputSchema>;

export async function predictParkingDemand(input: PredictParkingDemandInput): Promise<PredictParkingDemandOutput> {
  return predictParkingDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictParkingDemandPrompt',
  input: {schema: PredictParkingDemandInputSchema},
  output: {schema: PredictParkingDemandOutputSchema},
  prompt: `You are an AI assistant specializing in predicting parking demand.

  Analyze the provided historical parking data and predict the parking demand for the specified timeframe.
  Provide a confidence level for your prediction (0-1).
  Explain the factors that influenced your prediction.

  Parking Lot ID: {{{parkingLotId}}}
  Timeframe: {{{timeframe}}}
  Historical Data: {{{historicalData}}}

  Format your response as a JSON object with the following keys:
  - predictedDemand: The predicted parking demand for the specified timeframe.
  - confidenceLevel: The confidence level of the prediction (0-1).
  - explanation: An explanation of the factors influencing the prediction.`,
});

const predictParkingDemandFlow = ai.defineFlow(
  {
    name: 'predictParkingDemandFlow',
    inputSchema: PredictParkingDemandInputSchema,
    outputSchema: PredictParkingDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
