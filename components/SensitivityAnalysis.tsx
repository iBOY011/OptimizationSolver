import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SensitivityAnalysisProps {
  solution: {
    status: boolean
    message: string
    objective_value: number
    variables: number[]
  } | null
}

export default function SensitivityAnalysis({ solution }: SensitivityAnalysisProps) {
  if (!solution || !solution.status) {
    return <div>Analyse de sensibilité non disponible.</div>
  }

  // Note: This is a placeholder. In a real implementation, you would need to
  // perform the sensitivity analysis or receive it from the backend.
  const sensitivityData = {
    objectiveCoefficients: solution.variables.map((_, index) => ({
      variable: index + 1,
      range: [Math.random() * 10, Math.random() * 10 + 10] as [number, number]
    })),
    rhsRanges: solution.variables.map((_, index) => ({
      constraint: index + 1,
      range: [Math.random() * 10, Math.random() * 10 + 10] as [number, number]
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analyse de sensibilité</h3>
      <div>
        <h4 className="text-md font-semibold">Coefficients de la fonction objective</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variable</TableHead>
              <TableHead>Borne inférieure</TableHead>
              <TableHead>Borne supérieure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensitivityData.objectiveCoefficients.map(({ variable, range }) => (
              <TableRow key={variable}>
                <TableCell>x{variable}</TableCell>
                <TableCell>{range[0].toFixed(2)}</TableCell>
                <TableCell>{range[1].toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h4 className="text-md font-semibold">Plages des termes constants (RHS)</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contrainte</TableHead>
              <TableHead>Borne inférieure</TableHead>
              <TableHead>Borne supérieure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensitivityData.rhsRanges.map(({ constraint, range }) => (
              <TableRow key={constraint}>
                <TableCell>Contrainte {constraint}</TableCell>
                <TableCell>{range[0].toFixed(2)}</TableCell>
                <TableCell>{range[1].toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

