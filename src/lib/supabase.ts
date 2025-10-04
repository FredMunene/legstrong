import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Mission = {
  id: string;
  user_id: string;
  location: string;
  destination: string;
  days: number;
  scientists: number;
  mission_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};

export type Design = {
  id: string;
  mission_id: string;
  component_spec: ComponentSpec;
  validation_results: ValidationResults;
  created_at: string;
};

export type Component = {
  id: string;
  design_id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  asset_url: string;
  thumbnail_url: string;
  status: 'generating' | 'ready' | 'failed';
  prompt_hash: string;
  created_at: string;
};

export type ComponentSpec = {
  components: Array<{
    name: string;
    type: string;
    quantity: number;
    parameters: Record<string, any>;
    attachments: string[];
  }>;
  adjacency: Record<string, string[]>;
  metadata: {
    total_volume: number;
    total_mass: number;
    power_requirement: number;
  };
};

export type ValidationResults = {
  passed: boolean;
  rules: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
  metrics: {
    volume_per_scientist: number;
    power_per_day: number;
    safety_score: number;
  };
};
