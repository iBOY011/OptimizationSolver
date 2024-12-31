import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tutorialSteps = [
  {
    target: '[data-tutorial="objective"]',
    content: "Commencez par définir votre fonction objective. Choisissez si vous voulez maximiser ou minimiser, puis entrez les coefficients pour chaque variable.",
  },
  {
    target: '[data-tutorial="constraints"]',
    content: "Ensuite, ajoutez vos contraintes. Chaque contrainte est une inégalité ou une égalité qui limite les valeurs possibles des variables.",
  },
  {
    target: '[data-tutorial="method"]',
    content: "Choisissez la méthode de résolution. Le Simplex est la méthode standard, tandis que le Simplex à deux phases et Big-M sont utiles pour des problèmes plus complexes.",
  },
  {
    target: '[data-tutorial="solve"]',
    content: "Une fois votre problème défini, cliquez sur 'Résoudre' pour obtenir la solution optimale.",
  },
  {
    target: '[data-tutorial="results"]',
    content: "Examinez les résultats, y compris la solution optimale, la valeur de la fonction objective, et l'analyse de sensibilité.",
  },
]

export default function GuidedTutorial() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 right-4 z-50">
            <Button onClick={() => setCurrentStep(0)}>Démarrer le tutoriel</Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          <div className="space-y-2">
            <p>{tutorialSteps[currentStep].content}</p>
            <div className="flex justify-between">
              <Button onClick={prevStep} disabled={currentStep === 0}>Précédent</Button>
              <Button onClick={nextStep} disabled={currentStep === tutorialSteps.length - 1}>Suivant</Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

