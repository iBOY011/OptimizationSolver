import React from 'react'
import CustomComponent from './CustomComponent'

const ParentComponent: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <CustomComponent ref={ref} />
  )
}

export default ParentComponent

