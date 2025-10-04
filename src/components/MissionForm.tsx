import { useState } from 'react';
import { Rocket, MapPin, Calendar, Users, Package, Clock, Target } from 'lucide-react';

type MissionFormData = {
  location: string;
  destination: string;
  days: number;
  scientists: number;
  mission_type: string;
  launch_vehicle: string;
  mission_phase: string;
  crew_size: number;
  mission_duration: number;
};

type MissionFormProps = {
  onSubmit: (data: MissionFormData) => void;
  isLoading: boolean;
};

export function MissionForm({ onSubmit, isLoading }: MissionFormProps) {
  const [formData, setFormData] = useState<MissionFormData>({
    location: 'Earth',
    destination: 'Mars',
    days: 3,
    scientists: 2,
    mission_type: 'exploration',
    launch_vehicle: 'SLS',
    mission_phase: 'surface',
    crew_size: 4,
    mission_duration: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof MissionFormData>(
    field: K,
    value: MissionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Mission Parameters</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Current Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Earth"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Rocket className="w-4 h-4" />
              Destination
            </label>
            <select
              value={formData.destination}
              onChange={(e) => updateField('destination', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Mars">Mars</option>
              <option value="Moon">Moon</option>
              <option value="Europa">Europa</option>
              <option value="Titan">Titan</option>
              <option value="ISS">International Space Station</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Mission Duration (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.days}
                onChange={(e) => updateField('days', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                Crew Size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.crew_size}
                onChange={(e) => updateField('crew_size', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4" />
                Launch Vehicle
              </label>
              <select
                value={formData.launch_vehicle}
                onChange={(e) => updateField('launch_vehicle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="SLS">Space Launch System (SLS)</option>
                <option value="Falcon Heavy">Falcon Heavy</option>
                <option value="Starship">Starship</option>
                <option value="Vulcan">Vulcan Centaur</option>
                <option value="New Glenn">New Glenn</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4" />
                Mission Phase
              </label>
              <select
                value={formData.mission_phase}
                onChange={(e) => updateField('mission_phase', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="surface">Surface Operations</option>
                <option value="transit">Transit</option>
                <option value="orbital">Orbital</option>
                <option value="mixed">Mixed Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mission Type
            </label>
            <select
              value={formData.mission_type}
              onChange={(e) => updateField('mission_type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="exploration">Exploration</option>
              <option value="research">Research</option>
              <option value="construction">Construction</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating Habitat...' : 'Generate Habitat Design'}
        </button>
      </div>
    </form>
  );
}