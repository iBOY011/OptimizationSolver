import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MethodSelectionProps {
  method: string
  onUpdate: (newMethod: string) => void
}

export default function MethodSelection({ method, onUpdate }: MethodSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sélection de la méthode</h3>
      <RadioGroup value={method} onValueChange={onUpdate}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="simplex" id="simplex" />
          <Label htmlFor="simplex">Simplex</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="two_phase" id="two_phase" />
          <Label htmlFor="two_phase">Simplex à deux phases</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="big_m" id="big_m" />
          <Label htmlFor="big_m">Méthode Big-M</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

