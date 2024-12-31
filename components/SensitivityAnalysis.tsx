import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SensitivityAnalysisProps {
  sensitivityAnalysis: {
    objectiveCoefficients: { variable: number; range: [number, number] }[]
    rhsRanges: { constraint: number; range: [number, number] }[]
  } | null
}

export default function SensitivityAnalysis({ sensitivityAnalysis }: SensitivityAnalysisProps) {
  if (!sensitivityAnalysis) {
    return null
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
            {sensitivityAnalysis.objectiveCoefficients.map(({ variable, range }) => (
              <TableRow key={variable}>
                <TableCell>x{variable + 1}</TableCell>
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
            {sensitivityAnalysis.rhsRanges.map(({ constraint, range }) => (
              <TableRow key={constraint}>
                <TableCell>Contrainte {constraint + 1}</TableCell>
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

