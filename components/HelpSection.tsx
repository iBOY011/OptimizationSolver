import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="simplex">
        <AccordionTrigger>Méthode du Simplex</AccordionTrigger>
        <AccordionContent>
          La méthode du Simplex est un algorithme itératif pour résoudre des problèmes d'optimisation linéaire. 
          Elle commence par trouver une solution de base réalisable, puis améliore progressivement cette solution 
          jusqu'à atteindre l'optimum ou déterminer que le problème est non borné.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two-phase">
        <AccordionTrigger>Méthode du Simplex à deux phases</AccordionTrigger>
        <AccordionContent>
          La méthode du Simplex à deux phases est utilisée lorsqu'une solution de base réalisable initiale n'est pas 
          immédiatement disponible. La première phase trouve une solution de base réalisable en résolvant un problème 
          auxiliaire, tandis que la deuxième phase utilise cette solution pour résoudre le problème original.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="big-m">
        <AccordionTrigger>Méthode Big-M</AccordionTrigger>
        <AccordionContent>
          La méthode Big-M est une variante de la méthode du Simplex qui traite les contraintes d'égalité et les 
          contraintes d'inégalité "supérieur ou égal" en introduisant des variables artificielles avec un coût très 
          élevé (M) dans la fonction objective. Cela permet de trouver rapidement une solution de base réalisable.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

