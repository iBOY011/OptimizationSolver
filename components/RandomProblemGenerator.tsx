import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface Problem {
  objective: { type: string; coefficients: number[] };
  constraints: { coefficients: number[]; operator: string; rhs: number }[];
  method: string;
  variables: number;
}

interface RandomProblemGeneratorProps {
  onGenerate: (problem: Problem) => void;
}

export default function RandomProblemGenerator({ onGenerate }: RandomProblemGeneratorProps) {
  const [variables, setVariables] = useState(2)
  const [constraints, setConstraints] = useState(2)
  const [difficulty, setDifficulty] = useState(1)

  const generateRandomProblem = () => {
    const problem: Problem = {
      objective: {
        type: Math.random() > 0.5 ? 'max' : 'min',
        coefficients: Array.from({ length: variables }, () => Math.floor(Math.random() * 10) + 1),
      },
      constraints: Array.from({ length: constraints }, () => ({
        coefficients: Array.from({ length: variables }, () => Math.floor(Math.random() * 10) + 1),
        operator: ['<=', '>=', '='][Math.floor(Math.random() * 3)],
        rhs: Math.floor(Math.random() * 50) + 1,
      })),
      method: ['simplex', 'two-phase', 'big-m'][Math.floor(Math.random() * 3)],
      variables,
    }

    onGenerate(problem)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Générateur de problèmes aléatoires</h3>
      <div className="space-y-2">
        <Label>Nombre de variables: {variables}</Label>
        <Slider
          min={2}
          max={5}
          step={1}
          value={[variables]}
          onValueChange={(value) => setVariables(value[0])}
        />
      </div>
      <div className="space-y-2">
        <Label>Nombre de contraintes: {constraints}</Label>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[constraints]}
          onValueChange={(value) => setConstraints(value[0])}
        />
      </div>
      <div className="space-y-2">
        <Label>Difficulté: {difficulty}</Label>
        <Slider
          min={1}
          max={3}
          step={1}
          value={[difficulty]}
          onValueChange={(value) => setDifficulty(value[0])}
        />
      </div>
      <Button onClick={generateRandomProblem}>Générer un problème aléatoire</Button>
    </div>
  )
}

