import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConstraintsProps {
  constraints: { coefficients: number[]; operator: string; rhs: number }[]
  variables: number
  onUpdate: (newConstraints: { coefficients: number[]; operator: string; rhs: number }[]) => void
}

export default function Constraints({ constraints, variables, onUpdate }: ConstraintsProps) {
  const addConstraint = () => {
    const newConstraint = {
      coefficients: Array(variables).fill(0),
      operator: '<=',
      rhs: 0,
    }
    onUpdate([...constraints, newConstraint])
  }

  const updateConstraint = (index: number, field: string, value: string | number) => {
    const newConstraints = [...constraints]
    if (field === 'operator') {
      newConstraints[index].operator = value as string
    } else if (field === 'rhs') {
      newConstraints[index].rhs = parseFloat(value as string) || 0
    } else {
      const coeffIndex = parseInt(field)
      newConstraints[index].coefficients[coeffIndex] = parseFloat(value as string) || 0
    }
    onUpdate(newConstraints)
  }

  const removeConstraint = (index: number) => {
    const newConstraints = constraints.filter((_, i) => i !== index)
    onUpdate(newConstraints)
  }

  return (
    <div className="space-y-4">
      {constraints.map((constraint, index) => (
        <div key={index} className="flex items-center space-x-2">
          {constraint.coefficients.map((coeff, coeffIndex) => (
            <React.Fragment key={coeffIndex}>
              <Input
                type="number"
                value={coeff}
                onChange={(e) => updateConstraint(index, coeffIndex.toString(), e.target.value)}
                className="w-20"
              />
              <span>{`x${coeffIndex + 1}`}</span>
              {coeffIndex < constraint.coefficients.length - 1 && <span>+</span>}
            </React.Fragment>
          ))}
          <Select
            value={constraint.operator}
            onValueChange={(value) => updateConstraint(index, 'operator', value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<=">≤</SelectItem>
              <SelectItem value=">=">≥</SelectItem>
              <SelectItem value="=">=</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={constraint.rhs}
            onChange={(e) => updateConstraint(index, 'rhs', e.target.value)}
            className="w-20"
          />
          <Button variant="destructive" onClick={() => removeConstraint(index)}>
            Supprimer
          </Button>
        </div>
      ))}
      <Button onClick={addConstraint}>Ajouter une contrainte</Button>
    </div>
  )
}

