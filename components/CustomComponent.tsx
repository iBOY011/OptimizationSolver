import React from 'react'

interface CustomComponentProps {
  // Add any props your component needs
  ref?: React.Ref<HTMLDivElement>  // Add this line
}

const CustomComponent: React.FC<CustomComponentProps> = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      {/* Your component content */}
    </div>
  )
})

CustomComponent.displayName = 'CustomComponent'

export default CustomComponent

