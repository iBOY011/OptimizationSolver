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

export function useSolver() {
  const [solution, setSolution] = useState<Solution | null>(null)
  const [steps, setSteps] = useState<string[]>([])
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState<SensitivityAnalysis | null>(null)

  const solve = (problem: Problem): void => {
    let result: Solution
    let solutionSteps: string[] = []
    let sensitivity: SensitivityAnalysis

    switch (problem.method) {
      case 'simplex':
        [result, solutionSteps, sensitivity] = solveSimplex(problem)
        break
      case 'two-phase':
        [result, solutionSteps, sensitivity] = solveTwoPhase(problem)
        break
      case 'big-m':
        [result, solutionSteps, sensitivity] = solveBigM(problem)
        break
      default:
        throw new Error('Méthode de résolution non reconnue')
    }

    setSolution(result)
    setSteps(solutionSteps)
    setSensitivityAnalysis(sensitivity)
  }

  return { solution, steps, sensitivityAnalysis, solve }
}

function solveSimplex(problem: Problem): [Solution, string[], SensitivityAnalysis] {
  const { objective, constraints, variables } = problem
  const steps: string[] = ['Démarrage de la méthode du Simplex']

  // Create the initial tableau
  const tableau: number[][] = []

  // Add the objective function row
  tableau.push([...objective.coefficients.map(c => objective.type === 'max' ? -c : c), 0])

  // Add constraint rows
  constraints.forEach(constraint => {
    const row = [...constraint.coefficients, constraint.rhs]
    if (constraint.operator === '<=') {
      row.push(1) // Add slack variable
    } else if (constraint.operator === '>=') {
      row.push(-1) // Add surplus variable
    }
    tableau.push(row)
  })

  steps.push('Tableau initial créé')

  let iterations = 0
  const maxIterations = 1000 // To avoid infinite loops

  while (iterations < maxIterations) {
    const pivotColumn = findPivotColumn(tableau[0].slice(0, -1))
    if (pivotColumn === -1) break // Optimal solution found

    const pivotRow = findPivotRow(tableau, pivotColumn)
    if (pivotRow === -1) {
      steps.push('Problème non borné détecté')
      return [{ optimal: false, variables: [], objectiveValue: 0, iterations }, steps, { objectiveCoefficients: [], rhsRanges: [] }]
    }

    performPivot(tableau, pivotRow, pivotColumn)
    iterations++
    steps.push(`Itération ${iterations}: Pivot effectué à la ligne ${pivotRow + 1}, colonne ${pivotColumn + 1}`)
  }

  if (iterations === maxIterations) {
    steps.push('Nombre maximum d\'itérations atteint')
    return [{ optimal: false, variables: [], objectiveValue: 0, iterations }, steps, { objectiveCoefficients: [], rhsRanges: [] }]
  }

  const solution: Solution = {
    optimal: true,
    variables: tableau[0].slice(-variables - 1, -1).map(v => -v),
    objectiveValue: objective.type === 'max' ? -tableau[0][tableau[0].length - 1] : tableau[0][tableau[0].length - 1],
    iterations,
  }

  steps.push('Solution optimale trouvée')

  const sensitivity = performSensitivityAnalysis(tableau, problem)

  return [solution, steps, sensitivity]
}

function solveTwoPhase(problem: Problem): [Solution, string[], SensitivityAnalysis] {
  // Implementation of Two-Phase Simplex method
  // This is a placeholder and should be implemented properly
  return solveSimplex(problem)
}

function solveBigM(problem: Problem): [Solution, string[], SensitivityAnalysis] {
  const { objective, constraints, variables } = problem
  const steps: string[] = ['Démarrage de la méthode Big-M']

  // Add artificial variables for each constraint
  const artificialVariables = constraints.length
  const totalVariables = variables + artificialVariables

  // Create the initial tableau
  const tableau: number[][] = []

  // Add the objective function row
  const objectiveRow = [...objective.coefficients, 0]
  for (let i = 0; i < artificialVariables; i++) {
    objectiveRow.push(objective.type === 'max' ? -M : M)
  }
  tableau.push(objectiveRow)

  // Add constraint rows
  constraints.forEach((constraint, index) => {
    const row = [...constraint.coefficients, constraint.rhs]
    for (let i = 0; i < artificialVariables; i++) {
      row.push(i === index ? 1 : 0)
    }
    tableau.push(row)
  })

  steps.push('Tableau initial créé avec les variables artificielles')

  let iterations = 0
  const maxIterations = 1000 // To avoid infinite loops

  while (iterations < maxIterations) {
    const pivotColumn = findPivotColumn(tableau[0].slice(0, totalVariables))
    if (pivotColumn === -1) break // Optimal solution found

    const pivotRow = findPivotRow(tableau, pivotColumn)
    if (pivotRow === -1) {
      steps.push('Problème non borné détecté')
      return [{ optimal: false, variables: [], objectiveValue: 0, iterations }, steps, { objectiveCoefficients: [], rhsRanges: [] }]
    }

    performPivot(tableau, pivotRow, pivotColumn)
    iterations++
    steps.push(`Itération ${iterations}: Pivot effectué à la ligne ${pivotRow + 1}, colonne ${pivotColumn + 1}`)
  }

  if (iterations === maxIterations) {
    steps.push('Nombre maximum d\'itérations atteint')
    return [{ optimal: false, variables: [], objectiveValue: 0, iterations }, steps, { objectiveCoefficients: [], rhsRanges: [] }]
  }

  const solution: Solution = {
    optimal: true,
    variables: tableau[0].slice(variables, totalVariables).map(v => -v),
    objectiveValue: objective.type === 'max' ? -tableau[0][totalVariables] : tableau[0][totalVariables],
    iterations,
  }

  steps.push('Solution optimale trouvée')

  const sensitivity = performSensitivityAnalysis(tableau, problem)

  return [solution, steps, sensitivity]
}

function findPivotColumn(row: number[]): number {
  const minValue = Math.min(...row)
  return minValue < 0 ? row.indexOf(minValue) : -1
}

function findPivotRow(tableau: number[][], pivotColumn: number): number {
  let minRatio = Infinity
  let pivotRow = -1

  for (let i = 1; i < tableau.length; i++) {
    const ratio = tableau[i][tableau[i].length - 1] / tableau[i][pivotColumn]
    if (ratio > 0 && ratio < minRatio) {
      minRatio = ratio
      pivotRow = i
    }
  }

  return pivotRow
}

function performPivot(tableau: number[][], pivotRow: number, pivotColumn: number): void {
  const pivotValue = tableau[pivotRow][pivotColumn]

  // Normalize the pivot row
  for (let j = 0; j < tableau[pivotRow].length; j++) {
    tableau[pivotRow][j] /= pivotValue
  }

  // Update other rows
  for (let i = 0; i < tableau.length; i++) {
    if (i !== pivotRow) {
      const factor = tableau[i][pivotColumn]
      for (let j = 0; j < tableau[i].length; j++) {
        tableau[i][j] -= factor * tableau[pivotRow][j]
      }
    }
  }
}

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

