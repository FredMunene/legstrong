import { useState, useEffect } from 'react';
import { Box, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

type ComponentTileProps = {
  name: string;
  type: string;
  status: 'generating' | 'ready' | 'failed';
  quantity: number;
  onAnimationComplete?: () => void;
};

export function ComponentTile({ name, type, status, quantity, onAnimationComplete }: ComponentTileProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (status === 'generating') {
      const stages = [0, 1, 2, 3];
      let currentStage = 0;

      const interval = setInterval(() => {
        currentStage = (currentStage + 1) % stages.length;
        setAnimationStage(currentStage);
      }, 500);

      return () => clearInterval(interval);
    } else if (status === 'ready') {
      setAnimationStage(4);
      onAnimationComplete?.();
    }
  }, [status, onAnimationComplete]);

  const getStatusIcon = () => {
    switch (status) {
      case 'generating':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'ready':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'generating':
        return 'Generating...';
      case 'ready':
        return 'Ready';
      case 'failed':
        return 'Failed';
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-400 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
          <p className="text-xs text-gray-500 mt-1">{type}</p>
        </div>
        <div className="flex items-center gap-1">
          {quantity > 1 && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              ×{quantity}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-3">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20">
            {status === 'generating' && (
              <>
                <div
                  className={`absolute inset-0 border-4 border-blue-200 rounded-lg transition-all duration-500 ${
                    animationStage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                  style={{ transform: `rotate(${animationStage * 15}deg)` }}
                />
                <div
                  className={`absolute inset-2 border-4 border-blue-300 rounded-lg transition-all duration-500 ${
                    animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                  style={{ transform: `rotate(${-animationStage * 20}deg)` }}
                />
                <div
                  className={`absolute inset-4 border-4 border-blue-400 rounded-lg transition-all duration-500 ${
                    animationStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                  style={{ transform: `rotate(${animationStage * 25}deg)` }}
                />
              </>
            )}
            {status === 'ready' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="w-16 h-16 text-blue-600" />
              </div>
            )}
            {status === 'failed' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className="text-gray-600">{getStatusText()}</span>
      </div>
    </div>
  );
}
