"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import ObjectiveFunction from './ObjectiveFunction'
import Constraints from './Constraints'
import MethodSelection from './MethodSelection'
import Results from './Results'
import HelpSection from './HelpSection'
import RandomProblemGenerator from './RandomProblemGenerator'
import SensitivityAnalysis from './SensitivityAnalysis'
import SaveLoadProblem from './SaveLoadProblem'
import GuidedTutorial from './GuidedTutorial'
import { useSolver } from '../hooks/useSolver'

interface Problem {
  objective: { type: string; coefficients: number[] };
  constraints: { coefficients: number[]; operator: string; rhs: number }[];
  method: string;
  variables: number;
}

export default function OptimizationSolver() {
  const [activeTab, setActiveTab] = useState('objective')
  const [problem, setProblem] = useState<Problem>({
    objective: { type: 'maximize', coefficients: [3, 2] },
    constraints: [
      { coefficients: [1, 1], operator: '<=', rhs: 4 },
      { coefficients: [2, 1], operator: '<=', rhs: 5 }
    ],
    method: 'simplex',
    variables: 2,
  })
  const { solve, isLoading, error, solution } = useSolver()

  const validateProblem = (): boolean => {
    if (problem.objective.coefficients.length !== problem.variables) {
      toast({
        title: "Erreur de validation",
        description: "Le nombre de coefficients dans la fonction objective ne correspond pas au nombre de variables.",
        variant: "destructive",
      })
      return false
    }

    if (problem.constraints.length === 0) {
      toast({
        title: "Erreur de validation",
        description: "Au moins une contrainte est requise.",
        variant: "destructive",
      })
      return false
    }

    for (const constraint of problem.constraints) {
      if (constraint.coefficients.length !== problem.variables) {
        toast({
          title: "Erreur de validation",
          description: "Le nombre de coefficients dans une contrainte ne correspond pas au nombre de variables.",
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSolve = () => {
    alert("Bouton cliqué");
    console.log("Bouton cliqué - test");
    
    if (validateProblem()) {
      console.log("Problème validé, données envoyées:", {
        method: problem.method,
        goal: problem.objective.type,
        objective: problem.objective.coefficients,
        constraints: problem.constraints,
        bounds: Array(problem.variables).fill([0, null])
      });

      solve(
        problem.method as 'simplex' | 'two_phase' | 'big_m',
        problem.objective.type as 'minimize' | 'maximize',
        problem.objective.coefficients,
        problem.constraints,
        Array(problem.variables).fill([0, null]) as [number, number][]
      )
      setActiveTab('results')
    }
  }

  const handleRandomProblem = (randomProblem: Problem) => {
    setProblem(randomProblem)
    toast({
      title: "Problème aléatoire généré",
      description: "Un nouveau problème a été généré. Vous pouvez maintenant le résoudre ou le modifier.",
    })
  }

  const handleLoadProblem = (loadedProblem: Problem) => {
    setProblem(loadedProblem)
    toast({
      title: "Problème chargé",
      description: "Le problème a été chargé avec succès. Vous pouvez maintenant le résoudre ou le modifier.",
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Solveur d'Optimisation Mathématique</CardTitle>
        <CardDescription>Définissez et résolvez des problèmes d'optimisation linéaire</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="objective" data-tutorial="objective">Objectif</TabsTrigger>
            <TabsTrigger value="constraints" data-tutorial="constraints">Contraintes</TabsTrigger>
            <TabsTrigger value="method" data-tutorial="method">Méthode</TabsTrigger>
            <TabsTrigger value="results" data-tutorial="results">Résultats</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensibilité</TabsTrigger>
            <TabsTrigger value="random">Aléatoire</TabsTrigger>
            <TabsTrigger value="help">Aide</TabsTrigger>
          </TabsList>
          <TabsContent value="objective">
            <ObjectiveFunction 
              objective={problem.objective} 
              variables={problem.variables}
              onUpdate={(newObjective) => setProblem({...problem, objective: newObjective})}
            />
          </TabsContent>
          <TabsContent value="constraints">
            <Constraints 
              constraints={problem.constraints}
              variables={problem.variables}
              onUpdate={(newConstraints) => setProblem({...problem, constraints: newConstraints})}
            />
          </TabsContent>
          <TabsContent value="method">
            <MethodSelection 
              method={problem.method}
              onUpdate={(newMethod) => setProblem({...problem, method: newMethod})}
            />
          </TabsContent>
          <TabsContent value="results">
            <Results problem={problem} solution={solution} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="sensitivity">
            <SensitivityAnalysis solution={solution} />
          </TabsContent>
          <TabsContent value="random">
            <RandomProblemGenerator onGenerate={handleRandomProblem} />
          </TabsContent>
          <TabsContent value="help">
            <HelpSection />
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex justify-between">
          <SaveLoadProblem problem={problem} onLoad={handleLoadProblem} />
          <Button onClick={handleSolve} data-tutorial="solve">Résoudre</Button>
        </div>
      </CardContent>
      <GuidedTutorial />
    </Card>
  )
}

