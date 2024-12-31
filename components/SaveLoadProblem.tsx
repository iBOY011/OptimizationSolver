import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface SaveLoadProblemProps {
  problem: any
  onLoad: (problem: any) => void
}

export default function SaveLoadProblem({ problem, onLoad }: SaveLoadProblemProps) {
  const [problemName, setProblemName] = useState('')

  const saveProblem = () => {
    if (!problemName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour le problème.",
        variant: "destructive",
      })
      return
    }

    const savedProblems = JSON.parse(localStorage.getItem('savedProblems') || '{}')
    savedProblems[problemName] = problem
    localStorage.setItem('savedProblems', JSON.stringify(savedProblems))

    toast({
      title: "Problème sauvegardé",
      description: `Le problème "${problemName}" a été sauvegardé avec succès.`,
    })
  }

  const loadProblem = () => {
    const savedProblems = JSON.parse(localStorage.getItem('savedProblems') || '{}')
    if (savedProblems[problemName]) {
      onLoad(savedProblems[problemName])
      toast({
        title: "Problème chargé",
        description: `Le problème "${problemName}" a été chargé avec succès.`,
      })
    } else {
      toast({
        title: "Erreur",
        description: `Aucun problème trouvé avec le nom "${problemName}".`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sauvegarder / Charger un problème</h3>
      <div className="flex items-center space-x-2">
        <Label htmlFor="problem-name">Nom du problème:</Label>
        <Input
          id="problem-name"
          value={problemName}
          onChange={(e) => setProblemName(e.target.value)}
          placeholder="Entrez le nom du problème"
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={saveProblem}>Sauvegarder</Button>
        <Button onClick={loadProblem}>Charger</Button>
      </div>
    </div>
  )
}

