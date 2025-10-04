import { FunctionalArea, FUNCTIONAL_AREAS } from '../types/functionalAreas';
import { BarChart3, Users, Ruler, Zap, AlertCircle, CheckCircle } from 'lucide-react';

type AreaPlacement = {
  id: string;
  areaId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  volume: number;
};

type QuantitativeAnalysisProps = {
  areas: AreaPlacement[];
  crewSize: number;
  habitatVolume: number;
  habitatArea: number;
};

export function QuantitativeAnalysis({ areas, crewSize, habitatVolume, habitatArea }: QuantitativeAnalysisProps) {
  const calculateMetrics = () => {
    const totalArea = areas.reduce((sum, area) => sum + area.area, 0);
    const totalVolume = areas.reduce((sum, area) => sum + area.volume, 0);
    
    const areaUtilization = (totalArea / habitatArea) * 100;
    const volumeUtilization = (totalVolume / habitatVolume) * 100;
    
    const areaPerPerson = totalArea / crewSize;
    const volumePerPerson = totalVolume / crewSize;
    
    // Calculate required vs actual for each area
    const areaAnalysis = areas.map(area => {
      const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === area.areaId);
      if (!functionalArea) return null;
      
      const requiredArea = functionalArea.minAreaPerPerson * crewSize;
      const requiredVolume = functionalArea.minVolumePerPerson * crewSize;
      
      return {
        name: functionalArea.name,
        category: functionalArea.category,
        actualArea: area.area,
        requiredArea,
        actualVolume: area.volume,
        requiredVolume,
        areaCompliance: (area.area / requiredArea) * 100,
        volumeCompliance: (area.volume / requiredVolume) * 100,
        priority: functionalArea.priority,
        icon: functionalArea.icon
      };
    }).filter(Boolean);

    return {
      totalArea,
      totalVolume,
      areaUtilization,
      volumeUtilization,
      areaPerPerson,
      volumePerPerson,
      areaAnalysis
    };
  };

  const metrics = calculateMetrics();

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 100) return 'text-green-600';
    if (compliance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceIcon = (compliance: number) => {
    if (compliance >= 100) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (compliance >= 80) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Quantitative Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Habitat Utilization</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Area Utilization</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700">
                  {metrics.areaUtilization.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">
                  {metrics.totalArea.toFixed(1)}m² / {habitatArea.toFixed(1)}m²
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Volume Utilization</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-700">
                  {metrics.volumeUtilization.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">
                  {metrics.totalVolume.toFixed(1)}m³ / {habitatVolume.toFixed(1)}m³
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Per Person</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-700">
                  {metrics.areaPerPerson.toFixed(1)}m²
                </div>
                <div className="text-xs text-gray-600">
                  {metrics.volumePerPerson.toFixed(1)}m³
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Area Compliance */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Area Compliance</h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {metrics.areaAnalysis.map((area, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{area.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{area.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      area.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      area.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {area.priority}
                    </span>
                  </div>
                  {getComplianceIcon(Math.min(area.areaCompliance, area.volumeCompliance))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600 mb-1">Area</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            area.areaCompliance >= 100 ? 'bg-green-500' :
                            area.areaCompliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(area.areaCompliance, 100)}%` }}
                        />
                      </div>
                      <span className={`font-medium ${getComplianceColor(area.areaCompliance)}`}>
                        {area.areaCompliance.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      {area.actualArea.toFixed(1)}m² / {area.requiredArea.toFixed(1)}m²
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-600 mb-1">Volume</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            area.volumeCompliance >= 100 ? 'bg-green-500' :
                            area.volumeCompliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(area.volumeCompliance, 100)}%` }}
                        />
                      </div>
                      <span className={`font-medium ${getComplianceColor(area.volumeCompliance)}`}>
                        {area.volumeCompliance.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      {area.actualVolume.toFixed(1)}m³ / {area.requiredVolume.toFixed(1)}m³
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Design Recommendations</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {metrics.areaUtilization > 90 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span>High area utilization - consider expanding habitat or reducing area requirements</span>
            </div>
          )}
          {metrics.areaPerPerson < 15 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Low area per person - may impact crew comfort and safety</span>
            </div>
          )}
          {metrics.areaAnalysis.some(area => area.areaCompliance < 80) && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Some areas are undersized - review critical systems first</span>
            </div>
          )}
          {metrics.areaUtilization < 70 && metrics.areaAnalysis.every(area => area.areaCompliance >= 100) && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Good utilization with adequate area compliance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
