import React from 'react'
import { ThirdPartyComponent } from 'third-party-library'

interface ThirdPartyComponentWrapperProps {
  // Add any props the third-party component needs
  ref?: React.Ref<unknown>  // Add this line
}

const ThirdPartyComponentWrapper: React.FC<ThirdPartyComponentWrapperProps> = React.forwardRef((props, ref) => {
  return <ThirdPartyComponent {...props} ref={ref} />
})

ThirdPartyComponentWrapper.displayName = 'ThirdPartyComponentWrapper'

export default ThirdPartyComponentWrapper

