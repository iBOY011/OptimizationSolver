import { useState } from 'react'

interface Problem {
  objective: { type: string; coefficients: number[] }
  constraints: { coefficients: number[]; operator: string; rhs: number }[]
  method: string
  variables: number
}

interface Solution {
  optimal: boolean
  variables: number[]
  objectiveValue: number
  iterations: number
}

interface SensitivityAnalysis {
  objectiveCoefficients: { variable: number; range: [number, number] }[]
  rhsRanges: { constraint: number; range: [number, number] }[]
}

const M = 1000000 // A large value for the Big-M method


///////////////////////////////////////////////////////////////


interface Constraint {
  coefficients: number[];
  rhs: number;
}

interface Bounds {
  [key: string]: [number, number];
}

interface SolverResponse {
  status: string;
  solution: any; // À adapter selon la structure de la réponse du backend
  error?: string;
}

const useSolver = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<any>(null);

  const solve = async (
    method: 'simplex' | 'two_phase' | 'big_m',
    goal: 'minimize' | 'maximize',
    objective: number[],
    constraints: Constraint[],
    bounds: Bounds
  ) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    const requestData = {
      method,
      goal,
      objective,
      constraints,
      bounds,
    };

    try {
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: SolverResponse = await response.json();

      if (response.ok) {
        setSolution(data.solution);
      } else {
        setError(data.error || 'Une erreur inconnue est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion avec le serveur');
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

export default useSolver;


function performSensitivityAnalysis(tableau: number[][], problem: Problem): SensitivityAnalysis {
  const { variables, constraints } = problem
  const objectiveCoefficients: { variable: number; range: [number, number] }[] = []
  const rhsRanges: { constraint: number; range: [number, number] }[] = []

  // Analyze objective coefficients
  for (let i = 0; i < variables; i++) {
    const column = tableau.map(row => row[i])
    const currentCoeff = -tableau[0][i]
    let lowerBound = -Infinity
    let upperBound = Infinity

    for (let j = 1; j < tableau.length; j++) {
      if (column[j] !== 0) {
        const ratio = tableau[j][tableau[j].length - 1] / column[j]
        if (column[j] > 0) {
          upperBound = Math.min(upperBound, currentCoeff + ratio)
        } else {
          lowerBound = Math.max(lowerBound, currentCoeff + ratio)
        }
      }
    }

    objectiveCoefficients.push({ variable: i, range: [lowerBound, upperBound] })
  }

  // Analyze right-hand side ranges
  for (let i = 0; i < constraints.length; i++) {
    const row = tableau[i + 1]
    const currentRHS = row[row.length - 1]
    let lowerBound = currentRHS
    let upperBound = currentRHS

    for (let j = 0; j < variables; j++) {
      if (row[j] !== 0) {
        const ratio = -tableau[0][j] / row[j]
        if (row[j] > 0) {
          upperBound += ratio
        } else {
          lowerBound += ratio
        }
      }
    }

    rhsRanges.push({ constraint: i, range: [lowerBound, upperBound] })
  }

  return { objectiveCoefficients, rhsRanges }
}

