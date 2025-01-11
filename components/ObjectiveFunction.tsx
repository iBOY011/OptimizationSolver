import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ObjectiveFunctionProps {
  objective: { type: string; coefficients: number[] }
  variables: number
  onUpdate: (newObjective: { type: string; coefficients: number[] }) => void
}

export default function ObjectiveFunction({ objective, variables, onUpdate }: ObjectiveFunctionProps) {
  const handleTypeChange = (newType: string) => {
    onUpdate({ ...objective, type: newType })
  }

  const handleCoefficientChange = (index: number, value: string) => {
    const newCoefficients = [...objective.coefficients]
    newCoefficients[index] = parseFloat(value) || 0
    onUpdate({ ...objective, coefficients: newCoefficients })
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={objective.type} onValueChange={handleTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="maximize" id="maximize" />
          <Label htmlFor="maximize">Maximiser</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minimize" id="minimize" />
          <Label htmlFor="minimize">Minimiser</Label>
        </div>
      </RadioGroup>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: variables }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="number"
              value={objective.coefficients[index] || ''}
              onChange={(e) => handleCoefficientChange(index, e.target.value)}
              placeholder={`x${index + 1}`}
            />
            <Label>{`x${index + 1}`}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

