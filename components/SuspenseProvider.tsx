import React, { Suspense } from 'react'

interface FallbackSuspendProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

const FallbackSuspend = ({ children, fallback }: FallbackSuspendProps) => {
  return (
    <Suspense fallback={fallback}>
        {children}
    </Suspense>
  )
}

export default FallbackSuspend