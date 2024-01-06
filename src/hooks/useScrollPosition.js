import React, { useEffect, useState } from "react"

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollPosition(window.scrollY)
    })
    // console.log(scrollPosition)
    return () => {
      window.removeEventListener("scroll", () => {
        setScrollPosition(window.scrollY)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return scrollPosition
}

export default useScrollPosition
