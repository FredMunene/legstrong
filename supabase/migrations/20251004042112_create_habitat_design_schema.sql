/*
  # Habitat Design System Schema

  1. New Tables
    - `missions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `location` (text) - Current location
      - `destination` (text) - Target destination (e.g., Mars)
      - `days` (integer) - Mission duration
      - `scientists` (integer) - Number of scientists
      - `mission_type` (text) - Type of mission
      - `status` (text) - pending, processing, completed, failed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `designs`
      - `id` (uuid, primary key)
      - `mission_id` (uuid, references missions)
      - `component_spec` (jsonb) - Gemini-generated component specification
      - `validation_results` (jsonb) - Rule checks and metrics
      - `created_at` (timestamptz)
    
    - `components`
      - `id` (uuid, primary key)
      - `design_id` (uuid, references designs)
      - `name` (text) - Component name
      - `type` (text) - Component category
      - `parameters` (jsonb) - Component parameters
      - `asset_url` (text) - URL to 3D asset (GLTF/GLB)
      - `thumbnail_url` (text) - Preview thumbnail
      - `status` (text) - generating, ready, failed
      - `prompt_hash` (text) - For caching identical components
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own missions and designs
    - Components inherit access through design relationship
*/

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location text NOT NULL DEFAULT '',
  destination text NOT NULL DEFAULT '',
  days integer NOT NULL DEFAULT 0,
  scientists integer NOT NULL DEFAULT 0,
  mission_type text NOT NULL DEFAULT 'exploration',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create designs table
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
  component_spec jsonb DEFAULT '{}'::jsonb,
  validation_results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create components table
CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT '',
  parameters jsonb DEFAULT '{}'::jsonb,
  asset_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  status text NOT NULL DEFAULT 'generating',
  prompt_hash text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_designs_mission_id ON designs(mission_id);
CREATE INDEX IF NOT EXISTS idx_components_design_id ON components(design_id);
CREATE INDEX IF NOT EXISTS idx_components_prompt_hash ON components(prompt_hash);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- RLS Policies for missions
CREATE POLICY "Users can view own missions"
  ON missions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own missions"
  ON missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON missions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own missions"
  ON missions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for designs
CREATE POLICY "Users can view own designs"
  ON designs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = designs.mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create designs for own missions"
  ON designs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own designs"
  ON designs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = designs.mission_id
      AND missions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own designs"
  ON designs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = designs.mission_id
      AND missions.user_id = auth.uid()
    )
  );

-- RLS Policies for components
CREATE POLICY "Users can view components of own designs"
  ON components FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designs
      JOIN missions ON missions.id = designs.mission_id
      WHERE designs.id = components.design_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create components for own designs"
  ON components FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM designs
      JOIN missions ON missions.id = designs.mission_id
      WHERE designs.id = design_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update components of own designs"
  ON components FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designs
      JOIN missions ON missions.id = designs.mission_id
      WHERE designs.id = components.design_id
      AND missions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM designs
      JOIN missions ON missions.id = designs.mission_id
      WHERE designs.id = design_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete components of own designs"
  ON components FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designs
      JOIN missions ON missions.id = designs.mission_id
      WHERE designs.id = components.design_id
      AND missions.user_id = auth.uid()
    )
  );