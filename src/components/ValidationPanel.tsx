import { CheckCircle2, XCircle, Activity, Zap, Gauge } from 'lucide-react';
import { ValidationResults } from '../lib/supabase';

type ValidationPanelProps = {
  validation: ValidationResults | null;
};

export function ValidationPanel({ validation }: ValidationPanelProps) {
  if (!validation) return null;

  return (
    <div className="w-full max-w-6xl mt-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Design Validation</h3>
          <div
            className={`px-4 py-2 rounded-full font-semibold ${
              validation.passed
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {validation.passed ? 'All Checks Passed' : 'Review Required'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Volume per Scientist</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {validation.metrics.volume_per_scientist.toFixed(1)} m³
            </p>
            <p className="text-xs text-gray-600 mt-1">Minimum: 15 m³</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Power per Day</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(validation.metrics.power_per_day / 1000).toFixed(1)} kWh
            </p>
            <p className="text-xs text-gray-600 mt-1">Daily consumption</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">Safety Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(validation.metrics.safety_score * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Compliance rating</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">Rule Checks</h4>
          {validation.rules.map((rule, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                rule.passed
                  ? 'border-green-200 bg-green-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              {rule.passed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{rule.name}</p>
                <p className="text-sm text-gray-600 mt-1">{rule.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
