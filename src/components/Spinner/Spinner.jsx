import React from "react"
import { PropagateLoader } from "react-spinners"

function Spinner() {
  return (
    <div className="h-screen min-w-full  flex items-center justify-center ">
      <PropagateLoader color="#4ADE80" />
    </div>
  )
}

export default Spinner
