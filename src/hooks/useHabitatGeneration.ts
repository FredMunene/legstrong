import { useState } from 'react';
import { supabase, Mission, Design, Component, ValidationResults } from '../lib/supabase';

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
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-habitat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(missionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate habitat');
      }

      const result = await response.json();

      const { data: missionData2, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', result.mission_id)
        .single();

      if (missionError) throw missionError;

      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('*')
        .eq('id', result.design_id)
        .single();

      if (designError) throw designError;

      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .eq('design_id', result.design_id);

      if (componentsError) throw componentsError;

      setMission(missionData2);
      setDesign(designData);
      setComponents(componentsData || []);
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
