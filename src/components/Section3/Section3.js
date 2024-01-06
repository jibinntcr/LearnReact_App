import React from "react"



// paragraph with background image
function Section3({ imgUrl, text }) {

  return (

    <div className="w-full h-96 sm:h-screen bg-red-100 relative">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${imgUrl})` }} ></div>
      <div className="opacity-100  duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl text-white font-semibold">




        <p className="text-white rounded-lg bg-opacity-50 px-4 m-2 sm:my-auto  sm:text-2xl bg-slate-500 sm:mx-6">
          {text}
        </p>

      </div>
    </div>

  )
}

export default Section3
