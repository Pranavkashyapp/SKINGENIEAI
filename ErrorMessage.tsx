import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '../store';

export function ErrorMessage() {
  const { error, setError } = useStore();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
      <AlertTriangle className="w-5 h-5" />
      <p>{error}</p>
      <button
        onClick={() => setError(null)}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
}