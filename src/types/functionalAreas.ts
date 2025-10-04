export type FunctionalArea = {
  id: string;
  name: string;
  category: 'life_support' | 'crew_support' | 'operations' | 'maintenance' | 'science' | 'storage';
  minAreaPerPerson: number; // m² per person
  minVolumePerPerson: number; // m³ per person
  priority: 'critical' | 'high' | 'medium' | 'low';
  noiseLevel: 'quiet' | 'moderate' | 'loud';
  privacy: 'private' | 'semi_private' | 'public';
  adjacency: {
    preferred: string[];
    avoided: string[];
  };
  description: string;
  icon: string;
};

export const FUNCTIONAL_AREAS: FunctionalArea[] = [
  // Life Support Systems
  {
    id: 'eclss',
    name: 'Environmental Control & Life Support',
    category: 'life_support',
    minAreaPerPerson: 2.0,
    minVolumePerPerson: 8.0,
    priority: 'critical',
    noiseLevel: 'moderate',
    privacy: 'public',
    adjacency: {
      preferred: ['power', 'storage'],
      avoided: ['sleep', 'medical']
    },
    description: 'Air revitalization, water recovery, and waste management systems',
    icon: '🌬️'
  },
  {
    id: 'waste_management',
    name: 'Waste Management',
    category: 'life_support',
    minAreaPerPerson: 1.5,
    minVolumePerPerson: 6.0,
    priority: 'critical',
    noiseLevel: 'moderate',
    privacy: 'private',
    adjacency: {
      preferred: ['eclss', 'hygiene'],
      avoided: ['galley', 'sleep']
    },
    description: 'Waste collection, processing, and disposal systems',
    icon: '♻️'
  },

  // Crew Support
  {
    id: 'sleep',
    name: 'Sleep Quarters',
    category: 'crew_support',
    minAreaPerPerson: 4.0,
    minVolumePerPerson: 12.0,
    priority: 'critical',
    noiseLevel: 'quiet',
    privacy: 'private',
    adjacency: {
      preferred: ['hygiene', 'storage'],
      avoided: ['galley', 'exercise', 'eclss', 'waste_management']
    },
    description: 'Individual crew sleep and personal space',
    icon: '🛏️'
  },
  {
    id: 'hygiene',
    name: 'Hygiene & Personal Care',
    category: 'crew_support',
    minAreaPerPerson: 2.5,
    minVolumePerPerson: 10.0,
    priority: 'high',
    noiseLevel: 'moderate',
    privacy: 'private',
    adjacency: {
      preferred: ['sleep', 'waste_management'],
      avoided: ['galley', 'exercise']
    },
    description: 'Bathing, grooming, and personal hygiene facilities',
    icon: '🚿'
  },
  {
    id: 'exercise',
    name: 'Exercise & Recreation',
    category: 'crew_support',
    minAreaPerPerson: 3.0,
    minVolumePerPerson: 15.0,
    priority: 'high',
    noiseLevel: 'loud',
    privacy: 'public',
    adjacency: {
      preferred: ['storage', 'galley'],
      avoided: ['sleep', 'medical', 'science']
    },
    description: 'Physical exercise equipment and recreational space',
    icon: '🏃'
  },

  // Operations
  {
    id: 'galley',
    name: 'Food Preparation & Dining',
    category: 'operations',
    minAreaPerPerson: 2.0,
    minVolumePerPerson: 8.0,
    priority: 'high',
    noiseLevel: 'moderate',
    privacy: 'public',
    adjacency: {
      preferred: ['storage', 'exercise'],
      avoided: ['sleep', 'waste_management', 'hygiene']
    },
    description: 'Food storage, preparation, and dining facilities',
    icon: '🍽️'
  },
  {
    id: 'communication',
    name: 'Communication Center',
    category: 'operations',
    minAreaPerPerson: 1.5,
    minVolumePerPerson: 6.0,
    priority: 'critical',
    noiseLevel: 'quiet',
    privacy: 'semi_private',
    adjacency: {
      preferred: ['control', 'power'],
      avoided: ['exercise', 'waste_management']
    },
    description: 'Mission control and communication equipment',
    icon: '📡'
  },
  {
    id: 'control',
    name: 'Mission Control',
    category: 'operations',
    minAreaPerPerson: 2.5,
    minVolumePerPerson: 10.0,
    priority: 'critical',
    noiseLevel: 'quiet',
    privacy: 'semi_private',
    adjacency: {
      preferred: ['communication', 'science'],
      avoided: ['exercise', 'sleep']
    },
    description: 'Primary mission operations and monitoring',
    icon: '🎛️'
  },

  // Maintenance
  {
    id: 'maintenance',
    name: 'Maintenance & Repair',
    category: 'maintenance',
    minAreaPerPerson: 3.0,
    minVolumePerPerson: 12.0,
    priority: 'high',
    noiseLevel: 'loud',
    privacy: 'public',
    adjacency: {
      preferred: ['storage', 'power'],
      avoided: ['sleep', 'medical', 'science']
    },
    description: 'Equipment maintenance and repair facilities',
    icon: '🔧'
  },
  {
    id: 'power',
    name: 'Power Systems',
    category: 'maintenance',
    minAreaPerPerson: 1.0,
    minVolumePerPerson: 4.0,
    priority: 'critical',
    noiseLevel: 'moderate',
    privacy: 'public',
    adjacency: {
      preferred: ['eclss', 'communication', 'maintenance'],
      avoided: ['sleep', 'medical']
    },
    description: 'Electrical power generation and distribution',
    icon: '⚡'
  },

  // Science
  {
    id: 'science',
    name: 'Science Laboratory',
    category: 'science',
    minAreaPerPerson: 4.0,
    minVolumePerPerson: 16.0,
    priority: 'high',
    noiseLevel: 'quiet',
    privacy: 'semi_private',
    adjacency: {
      preferred: ['control', 'storage'],
      avoided: ['exercise', 'maintenance', 'waste_management']
    },
    description: 'Research and scientific investigation facilities',
    icon: '🔬'
  },
  {
    id: 'medical',
    name: 'Medical Bay',
    category: 'science',
    minAreaPerPerson: 2.0,
    minVolumePerPerson: 8.0,
    priority: 'high',
    noiseLevel: 'quiet',
    privacy: 'private',
    adjacency: {
      preferred: ['sleep', 'storage'],
      avoided: ['exercise', 'galley', 'waste_management']
    },
    description: 'Medical care and emergency treatment facilities',
    icon: '🏥'
  },

  // Storage
  {
    id: 'storage',
    name: 'General Storage',
    category: 'storage',
    minAreaPerPerson: 2.0,
    minVolumePerPerson: 8.0,
    priority: 'medium',
    noiseLevel: 'quiet',
    privacy: 'public',
    adjacency: {
      preferred: ['galley', 'maintenance', 'eclss'],
      avoided: ['sleep', 'medical']
    },
    description: 'General equipment and supply storage',
    icon: '📦'
  },
  {
    id: 'food_storage',
    name: 'Food Storage',
    category: 'storage',
    minAreaPerPerson: 1.5,
    minVolumePerPerson: 6.0,
    priority: 'high',
    noiseLevel: 'quiet',
    privacy: 'public',
    adjacency: {
      preferred: ['galley', 'storage'],
      avoided: ['waste_management', 'hygiene']
    },
    description: 'Food and consumable supplies storage',
    icon: '🥫'
  }
];

export type LayoutConstraint = {
  type: 'area' | 'volume' | 'adjacency' | 'noise' | 'privacy';
  areaId: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
};

export function validateLayout(areas: { id: string; area: number; volume: number; position: { x: number; y: number } }[], crewSize: number): LayoutConstraint[] {
  const constraints: LayoutConstraint[] = [];
  
  areas.forEach(area => {
    const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === area.id);
    if (!functionalArea) return;

    // Check area constraints
    const requiredArea = functionalArea.minAreaPerPerson * crewSize;
    if (area.area < requiredArea) {
      constraints.push({
        type: 'area',
        areaId: area.id,
        message: `${functionalArea.name} is too small. Required: ${requiredArea.toFixed(1)}m², Current: ${area.area.toFixed(1)}m²`,
        severity: 'error'
      });
    }

    // Check volume constraints
    const requiredVolume = functionalArea.minVolumePerPerson * crewSize;
    if (area.volume < requiredVolume) {
      constraints.push({
        type: 'volume',
        areaId: area.id,
        message: `${functionalArea.name} volume is insufficient. Required: ${requiredVolume.toFixed(1)}m³, Current: ${area.volume.toFixed(1)}m³`,
        severity: 'error'
      });
    }
  });

  return constraints;
}
