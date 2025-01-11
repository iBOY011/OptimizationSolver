import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VisualizationProps {
  problem: {
    objective: { type: string; coefficients: number[] }
    constraints: { coefficients: number[]; operator: string; rhs: number }[]
    variables: number
  }
  solution: {
    status: boolean
    variables: number[]
    objective_value: number
  } | null
}

const Visualization: React.FC<VisualizationProps> = ({ problem, solution }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (problem.variables !== 2) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const scale = Math.min((width - 2 * padding) / 10, (height - 2 * padding) / 10)

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(padding, padding)
    ctx.stroke()

    // Draw axis labels
    ctx.font = '12px Arial'
    ctx.fillText('0', padding - 10, height - padding + 15)
    for (let i = 1; i <= 10; i++) {
      ctx.fillText(i.toString(), padding + i * scale - 5, height - padding + 15)
      ctx.fillText(i.toString(), padding - 25, height - (padding + i * scale) + 5)
    }

    // Draw constraints
    problem.constraints.forEach((constraint, index) => {
      const [a, b] = constraint.coefficients
      const c = constraint.rhs

      if (b !== 0) {
        const x1 = 0
        const y1 = c / b
        const x2 = c / a
        const y2 = 0

        ctx.beginPath()
        ctx.moveTo(padding + x1 * scale, height - (padding + y1 * scale))
        ctx.lineTo(padding + x2 * scale, height - (padding + y2 * scale))
        ctx.strokeStyle = `hsl(${(index * 60) % 360}, 70%, 50%)`
        ctx.stroke()
      } else if (a !== 0) {
        const x = c / a

        ctx.beginPath()
        ctx.moveTo(padding + x * scale, height - padding)
        ctx.lineTo(padding + x * scale, padding)
        ctx.strokeStyle = `hsl(${(index * 60) % 360}, 70%, 50%)`
        ctx.stroke()
      }
    })

    // Draw solution point
    if (solution && solution.status) {
      const [x, y] = solution.variables
      ctx.beginPath()
      ctx.arc(padding + x * scale, height - (padding + y * scale), 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
    }
  }, [problem, solution])

  if (problem.variables !== 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visualisation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>La visualisation n'est disponible que pour les problèmes à deux variables.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualisation</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={400} height={400} className="border border-gray-300" />
      </CardContent>
    </Card>
  )
}

export default Visualization

