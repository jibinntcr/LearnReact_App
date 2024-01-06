import React from 'react'
import { Link } from 'react-router-dom'

function IntroParagraph() {
  return (
    <div className="w-full h-96 mb-10 sm:h-screen md:h-56 bg-green-400 relative">
    <div className="absolute inset-0 bg-cover bg-center z-0"  ></div>
    <div className="opacity-100  duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl text-white font-semibold">




      <p className="text-green-900 rounded-lg bg-opacity-50 px-4 py-2 m-2 sm:my-auto text-xl sm:text-2xl bg-white sm:mx-6">
      CDeC, a center dedicated to the creation of skill and job-oriented Massive Open Online Courses (MOOCs). These courses are designed to empower individuals with knowledge and skills that are not just theoretical but also practical and industry-relevant
<span className='font- font- italic text-base md:text-lg ml-2 '> <Link to={"/about"}>read more...</Link> </span>
      </p>

    </div>
  </div>
  )
}

export default IntroParagraph