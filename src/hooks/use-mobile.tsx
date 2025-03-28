
import React, { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on initial load
    checkIsMobile()
    
    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the appropriate event listener method based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkIsMobile)
    } else {
      // @ts-ignore - For older browsers
      window.addEventListener('resize', checkIsMobile)
    }
    
    // Clean up the event listener
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkIsMobile)
      } else {
        // @ts-ignore - For older browsers
        window.removeEventListener('resize', checkIsMobile)
      }
    }
  }, [])

  return isMobile
}
