import { useState } from 'react'

interface Constraint {
  coefficients: number[];
  operator: string;
  rhs: number;
}

interface SolverResponse {
  status: boolean;
  message: string;
  objective_value: number;
  variables: number[];
}

export const useSolver = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolverResponse | null>(null);

  const solve = async (
    method: 'simplex' | 'two_phase' | 'big_m',
    goal: 'minimize' | 'maximize',
    objective: number[],
    constraints: Constraint[],
    bounds: [number, number][]
  ) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          goal,
          objective,
          constraints,
          bounds,
        }),
      });

      const data: SolverResponse = await response.json();

      if (response.ok) {
        setSolution(data);
      } else {
        setError(data.message || 'Une erreur inconnue est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion avec le serveur');
      console.error('Error:', err);  // Add this line for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return {
    solve,
    isLoading,
    error,
    solution,
  };
};

