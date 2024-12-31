import React, { useEffect, useRef } from 'react'

interface VisualizationProps {
  problem: {
    objective: { type: string; coefficients: number[] }
    constraints: { coefficients: number[]; operator: string; rhs: number }[]
    variables: number
  }
  solution: { variables: number[]; objectiveValue: number } | null
}

export default function Visualization({ problem, solution }: VisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (problem.variables !== 2) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw constraints
    problem.constraints.forEach((constraint, index) => {
      const [a, b] = constraint.coefficients
      const c = constraint.rhs

      if (b !== 0) {
        const y1 = c / b
        const y2 = (c - a * canvas.width) / b

        ctx.beginPath()
        ctx.moveTo(0, canvas.height - y1)
        ctx.lineTo(canvas.width, canvas.height - y2)
        ctx.strokeStyle = `hsl(${(index * 60) % 360}, 70%, 50%)`
        ctx.stroke()
      } else if (a !== 0) {
        const x = c / a

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = `hsl(${(index * 60) % 360}, 70%, 50%)`
        ctx.stroke()
      }
    })

    // Draw solution point
    if (solution) {
      const [x, y] = solution.variables
      ctx.beginPath()
      ctx.arc(x * 10, canvas.height - y * 10, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
    }
  }, [problem, solution])

  if (problem.variables !== 2) {
    return <div>La visualisation n'est disponible que pour les problèmes à deux variables.</div>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Visualisation</h3>
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  )
}

