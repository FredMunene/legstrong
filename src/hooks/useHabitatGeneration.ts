import { useState } from 'react';
import { Mission, Design, Component, ValidationResults } from '../lib/supabase';

type MissionFormData = {
  location: string;
  destination: string;
  days: number;
  scientists: number;
  mission_type: string;
};

export function useHabitatGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [design, setDesign] = useState<Design | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [validation, setValidation] = useState<ValidationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateHabitat = async (missionData: MissionFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are an expert space habitat designer. Generate a detailed component specification for a habitat mission with the following parameters:

Location: ${missionData.location}
Destination: ${missionData.destination}
Duration: ${missionData.days} days
Crew Size: ${missionData.scientists} scientists
Mission Type: ${missionData.mission_type}

Respond with ONLY a JSON object (no markdown, no explanations) with this exact structure:
{
  "components": [
    {
      "name": "Component Name",
      "type": "category (sleep/lifesupport/storage/medical/communication/galley/research/power)",
      "quantity": 1,
      "parameters": {
        "volume_m3": 10,
        "mass_kg": 500,
        "power_w": 100,
        "description": "Brief description"
      },
      "attachments": ["other_component_name"]
    }
  ],
  "adjacency": {
    "component_name": ["adjacent_component_1", "adjacent_component_2"]
  },
  "metadata": {
    "total_volume": 100,
    "total_mass": 5000,
    "power_requirement": 1000
  }
}

Design considerations:
- Each scientist needs ~15m³ personal space
- ECLSS (life support) is critical for any mission
- Medical facilities scale with crew size and duration
- Communication systems are essential
- Storage for ${missionData.days} days of supplies
- Power systems to support all components
- Adjacency should reflect logical connections (e.g., galley near storage, medical near sleep pods)

Generate 6-12 unique components appropriate for this mission.`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
          }),
        },
      );

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
      }

      const geminiData = await geminiResponse.json();
      const generatedText = geminiData.candidates[0].content.parts[0].text;
      
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Gemini response');
      }

      const componentSpec = JSON.parse(jsonMatch[0]);
      
      const result = {
        mission_id: 'test-mission',
        design_id: 'test-design',
        component_spec: componentSpec,
        validation_results: { 
          passed: true, 
          rules: [], 
          metrics: {
            volume_per_scientist: componentSpec.metadata.total_volume / missionData.scientists,
            power_per_day: componentSpec.metadata.power_requirement * 24,
            safety_score: 1.0
          }
        }
      };

      setMission({ id: result.mission_id, ...missionData, user_id: 'test', status: 'completed', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Mission);
      setDesign({ id: result.design_id, mission_id: result.mission_id, component_spec: result.component_spec, validation_results: result.validation_results, created_at: new Date().toISOString() } as Design);
      setComponents(result.component_spec.components.map((comp: any, i: number) => ({
        id: `comp-${i}`,
        design_id: result.design_id,
        name: comp.name,
        type: comp.type,
        parameters: comp.parameters,
        asset_url: '',
        thumbnail_url: '',
        status: 'ready' as const,
        prompt_hash: '',
        created_at: new Date().toISOString()
      })));
      setValidation(result.validation_results);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error generating habitat:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    mission,
    design,
    components,
    validation,
    error,
    generateHabitat,
  };
}
