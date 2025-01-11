import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Visualization from './Visualization'

interface ResultsProps {
  problem: {
    objective: { type: string; coefficients: number[] }
    constraints: { coefficients: number[]; operator: string; rhs: number }[]
    method: string
    variables: number
  }
  solution: {
    status: boolean
    message: string
    objective_value: number
    variables: number[]
  } | null
  isLoading: boolean
  error: string | null
}

export default function Results({ problem, solution, isLoading, error }: ResultsProps) {
  if (isLoading) {
    return <div>Résolution en cours...</div>
  }

  if (error) {
    return <div>Erreur : {error}</div>
  }

  if (!solution) {
    return <div>Aucune solution disponible. Veuillez résoudre le problème.</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Résultats</h3>
      {solution.status ? (
        <>
          <p>{solution.message}</p>
          <p>Valeur de la fonction objective : {solution.objective_value.toFixed(2)}</p>
          <h4 className="text-md font-semibold mt-2">Valeurs des variables :</h4>
          <ul>
            {solution.variables.map((value, index) => (
              <li key={index}>
                x{index + 1} = {value.toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>{solution.message}</p>
      )}
      
      <Visualization problem={problem} solution={solution} />

      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>Voir les détails de la résolution</AccordionTrigger>
          <AccordionContent>
            <p>Méthode utilisée : {problem.method}</p>
            <p>Nombre de variables : {problem.variables}</p>
            <p>Nombre de contraintes : {problem.constraints.length}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

