import { Component } from '../lib/supabase';
import { ComponentTile } from './ComponentTile';

type AssemblyViewProps = {
  components: Component[];
  isGenerating: boolean;
};

export function AssemblyView({ components, isGenerating }: AssemblyViewProps) {
  if (components.length === 0 && !isGenerating) {
    return null;
  }

  const componentCounts = components.reduce((acc, comp) => {
    const key = `${comp.name}-${comp.type}`;
    if (!acc[key]) {
      acc[key] = { component: comp, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { component: Component; count: number }>);

  const uniqueComponents = Object.values(componentCounts);

  return (
    <div className="w-full max-w-6xl mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Habitat Assembly</h3>
          <p className="text-sm text-gray-600">
            {isGenerating
              ? 'Conceptualizing components...'
              : `${components.length} component${components.length !== 1 ? 's' : ''} generated`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {uniqueComponents.map(({ component, count }) => (
            <ComponentTile
              key={component.id}
              name={component.name}
              type={component.type}
              status={component.status}
              quantity={count}
            />
          ))}
        </div>

        {isGenerating && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              AI is designing your habitat components based on mission requirements...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
