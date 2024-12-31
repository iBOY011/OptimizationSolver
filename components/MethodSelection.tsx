import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MethodSelectionProps {
  method: string
  onUpdate: (newMethod: string) => void
}

export default function MethodSelection({ method, onUpdate }: MethodSelectionProps) {
  return (
    <RadioGroup value={method} onValueChange={onUpdate}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="simplex" id="simplex" />
        <Label htmlFor="simplex">Simplex</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="two-phase" id="two-phase" />
        <Label htmlFor="two-phase">Simplex avec deux phases</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="big-m" id="big-m" />
        <Label htmlFor="big-m">Big-M</Label>
      </div>
    </RadioGroup>
  )
}

