import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface MissionRequest {
  location: string;
  destination: string;
  days: number;
  scientists: number;
  mission_type: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const missionData: MissionRequest = await req.json();

    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        location: missionData.location,
        destination: missionData.destination,
        days: missionData.days,
        scientists: missionData.scientists,
        mission_type: missionData.mission_type,
        status: 'processing',
      })
      .select()
      .single();

    if (missionError || !mission) {
      throw new Error('Failed to create mission');
    }

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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
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

    const validationResults = validateDesign(componentSpec, missionData);

    const { data: design, error: designError } = await supabase
      .from('designs')
      .insert({
        mission_id: mission.id,
        component_spec: componentSpec,
        validation_results: validationResults,
      })
      .select()
      .single();

    if (designError || !design) {
      throw new Error('Failed to create design');
    }

    const componentInserts = [];
    for (const comp of componentSpec.components) {
      for (let i = 0; i < comp.quantity; i++) {
        componentInserts.push({
          design_id: design.id,
          name: comp.name,
          type: comp.type,
          parameters: comp.parameters,
          status: 'ready',
          asset_url: '',
          thumbnail_url: '',
          prompt_hash: '',
        });
      }
    }

    const { error: componentsError } = await supabase
      .from('components')
      .insert(componentInserts);

    if (componentsError) {
      throw new Error('Failed to create components');
    }

    await supabase
      .from('missions')
      .update({ status: 'completed' })
      .eq('id', mission.id);

    return new Response(
      JSON.stringify({
        mission_id: mission.id,
        design_id: design.id,
        component_spec: componentSpec,
        validation_results: validationResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function validateDesign(spec: any, mission: MissionRequest) {
  const rules = [];

  const volumePerScientist = spec.metadata.total_volume / mission.scientists;
  rules.push({
    name: 'Minimum Volume Per Scientist',
    passed: volumePerScientist >= 15,
    message: volumePerScientist >= 15
      ? `${volumePerScientist.toFixed(1)}m³ per scientist (adequate)`
      : `${volumePerScientist.toFixed(1)}m³ per scientist (insufficient, min 15m³)`,
  });

  const hasLifeSupport = spec.components.some((c: any) => c.type === 'lifesupport');
  rules.push({
    name: 'Life Support System',
    passed: hasLifeSupport,
    message: hasLifeSupport ? 'ECLSS present' : 'Missing life support system',
  });

  const hasMedical = spec.components.some((c: any) => c.type === 'medical');
  rules.push({
    name: 'Medical Facilities',
    passed: hasMedical,
    message: hasMedical ? 'Medical facilities present' : 'Missing medical facilities',
  });

  const hasCommunication = spec.components.some((c: any) => c.type === 'communication');
  rules.push({
    name: 'Communication Systems',
    passed: hasCommunication,
    message: hasCommunication ? 'Communication systems present' : 'Missing communication systems',
  });

  const powerPerDay = spec.metadata.power_requirement * 24;
  const safetyScore = rules.filter((r) => r.passed).length / rules.length;

  return {
    passed: rules.every((r) => r.passed),
    rules,
    metrics: {
      volume_per_scientist: volumePerScientist,
      power_per_day: powerPerDay,
      safety_score: safetyScore,
    },
  };
}
