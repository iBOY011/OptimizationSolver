import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Visualization from './Visualization'

interface ResultsProps {
  problem: {
    objective: { type: string; coefficients: number[] }
    constraints: { coefficients: number[]; operator: string; rhs: number }[]
    method: string
    variables: number
  }
  solution: {
    optimal: boolean
    variables: number[]
    objectiveValue: number
    iterations: number
  } | null
  steps: string[]
}

export default function Results({ problem, solution, steps }: ResultsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showStepByStep, setShowStepByStep] = useState(false)

  if (!solution) {
    return <div>Aucune solution disponible. Veuillez résoudre le problème.</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Résultats</h3>
      {solution.optimal ? (
        <>
          <p>Solution optimale trouvée en {solution.iterations} itérations.</p>
          <p>Valeur de la fonction objective : {solution.objectiveValue.toFixed(2)}</p>
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
        <p>Aucune solution optimale trouvée. Le problème pourrait être non borné ou infaisable.</p>
      )}
      
      <Visualization problem={problem} solution={solution} />

      <div className="flex justify-between items-center">
        <Button onClick={() => setShowStepByStep(!showStepByStep)}>
          {showStepByStep ? 'Masquer' : 'Afficher'} le mode pas à pas
        </Button>
        {showStepByStep && (
          <div>
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>

      {showStepByStep && (
        <div>
          <h4 className="text-md font-semibold">Étape {currentStep + 1} / {steps.length}</h4>
          <p>{steps[currentStep]}</p>
        </div>
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="steps">
          <AccordionTrigger>Voir toutes les étapes de résolution</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

